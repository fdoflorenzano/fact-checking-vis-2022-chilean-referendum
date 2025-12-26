import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import type { ExtendedFact, RawFact } from "./types";

dotenv.config({ path: [".env"] });

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const prompt = `
A continuación te entregaré un artículo que verifica una afirmación que circula en redes sociales.
Por favor resume el artículo, extrae la fecha de la afirmación que se analiza, la fuente de donde la afirmación originalmente se compartió, y los autores del artículo.
Por favor retorna todo en formato JSON, con los atributos 'resumen', 'fecha', 'fuente' y 'autores'.
En el caso de la fecha, de no poder detectarla explicitamente, marcarla como null, y de poder detectarla, escribirla en formato YYYY.MM.DD.
En el caso de la la fuente, de ser una red social, especificar cual y el usuario autor.
`;

async function analyzeFact(fact: RawFact): Promise<{
  summary?: string;
  date?: string;
  authors?: string[];
  source?: string;
}> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt} \n\n ${fact.articleBody}`,
  });
  const rawResponse = response.text ?? "";
  const formatted = rawResponse.match(/```json([\S\s]*)```/g)?.[0];

  try {
    const data = JSON.parse(formatted?.slice(7, formatted?.length - 3) ?? "");
    return {
      summary: data?.resumen,
      date: data?.fecha,
      authors: data?.autores,
      source: data?.fuente,
    };
  } catch {
    console.log("ERROR PARSING");
    return {};
  }
}

async function loadFactPages() {
  const facts: RawFact[] = JSON.parse(
    fs.readFileSync("data/facts.json", "utf-8")
  );
  return facts;
}

const facts = await loadFactPages();
const extendedFacts: ExtendedFact[] = [];

for (let index = 0; index < facts.length; index++) {
  const fact = facts[index];
  console.log(`Analyzing (${index + 1}/${facts.length}) ${fact.fact}...`);
  const newData = await analyzeFact(fact);
  console.log();

  extendedFacts.push({ ...fact, ...newData });
}

fs.writeFileSync(
  "data/extended-facts.json",
  JSON.stringify(extendedFacts, null, 4)
);
