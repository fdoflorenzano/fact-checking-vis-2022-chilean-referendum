import * as cheerio from "cheerio";
import fs from "fs";
import type { BaseFact, RawFact } from "./types";

const verificationMap: Record<string, string> = {
  Verdadero: "true",
  Impreciso: "inaccurate",
  Engañoso: "misleading",
  "Se puso creativ@": "creative",
  Falso: "false",
};

const URL = "https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/";

async function parsePage(url: string) {
  // Fetch the page to scrape
  const res = await fetch(url);
  // Grab raw HTML
  const html = await res.text();
  // Parse
  return cheerio.load(html);
}

async function getFacts() {
  const $ = await parsePage(URL);

  const facts: BaseFact[] = [];

  // Get each fact
  $(".card > a").each((_i, el) => {
    // Get raw data points
    const url = ($(el).attr()?.["href"] ?? "").trim();
    const fact = $(el).find(".big-quote").text().trim();
    const verificationRaw = $(el).find(".label").text().trim();
    const verification = verificationMap[verificationRaw] ?? "?";
    const categoryRaw = $(el).find(".attribution").text().trim();

    // Add to the array
    facts.push({ fact, url, verification, verificationRaw, categoryRaw });
  });

  console.log(`Found ${facts.length} facts listed.\n`);

  const factPages: RawFact[] = [];

  for (let index = 0; index < facts.length; index++) {
    const fact = facts[index];
    const { url } = fact;
    console.log(`Scraping (${index + 1}/${facts.length}) ${url}...`);
    const article$ = await parsePage(url);

    const title = article$("h1").text().trim();
    const articleWrapper = article$("article");
    const subtitle = article$(articleWrapper).find("h2").text().trim();
    const article = article$(articleWrapper)
      .find(".gp-entry-content")
      .text()
      .trim()
      .replaceAll("\t", "");

    factPages.push({
      ...fact,
      articleTitle: title,
      articleSubtitle: subtitle,
      articleBody: article,
    });
  }
  console.log();

  for (const verificationValue of Object.values(verificationMap)) {
    const filtered = factPages.filter(
      (f) => f.verification === verificationValue
    );
    console.log(
      `Found ${filtered.length} facts assigned as '${verificationValue}'.`
    );
  }

  return factPages;
}

const facts = await getFacts();

fs.writeFileSync("data/facts.json", JSON.stringify(facts, null, 4));
