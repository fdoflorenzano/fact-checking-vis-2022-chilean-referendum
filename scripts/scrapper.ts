import * as cheerio from "cheerio";
import fs from "fs";
import type { BaseClaim, RawClaim } from "./types";

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

async function getClaims() {
  const $ = await parsePage(URL);

  const claims: BaseClaim[] = [];

  // Get each claim
  $(".card > a").each((_i, el) => {
    // Get raw data points
    const url = ($(el).attr()?.["href"] ?? "").trim();
    const claim = $(el).find(".big-quote").text().trim();
    const verificationRaw = $(el).find(".label").text().trim();
    const verification = verificationMap[verificationRaw] ?? "?";
    const categoryRaw = $(el).find(".attribution").text().trim();

    // Add to the array
    claims.push({
      claim,
      url,
      verification,
      verificationRaw,
      categoryRaw,
    });
  });

  console.log(`Found ${claims.length} claims listed.\n`);

  const claimPages: RawClaim[] = [];

  for (let index = 0; index < claims.length; index++) {
    const claim = claims[index];
    const { url } = claim;
    console.log(`Scraping (${index + 1}/${claims.length}) ${url}...`);
    const article$ = await parsePage(url);

    const title = article$("h1").text().trim();
    const articleWrapper = article$("article");
    const subtitle = article$(articleWrapper).find("h2").text().trim();
    const article = article$(articleWrapper)
      .find(".gp-entry-content")
      .text()
      .trim()
      .replaceAll("\t", "");

    claimPages.push({
      ...claim,
      articleTitle: title,
      articleSubtitle: subtitle,
      articleBody: article,
    });
  }
  console.log();

  for (const verificationValue of Object.values(verificationMap)) {
    const filtered = claimPages.filter(
      (f) => f.verification === verificationValue
    );
    console.log(
      `Found ${filtered.length} claims assigned as '${verificationValue}'.`
    );
  }

  return claimPages;
}

const claims = await getClaims();

fs.writeFileSync("data/claims.json", JSON.stringify(claims, null, 4));
