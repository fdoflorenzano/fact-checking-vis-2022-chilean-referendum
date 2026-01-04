import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import type { ExtendedClaim, RawClaim } from "./types";

dotenv.config({ path: [".env"] });

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

const prompt = `
A continuación te entregaré un artículo que verifica una afirmación que circula en redes sociales.
Por favor resume el artículo, extrae la fecha de la afirmación que se analiza, la fuente de donde la afirmación originalmente se compartió, y los autores del artículo.
Por favor retorna todo en formato JSON, con los atributos 'resumen', 'fecha', 'fuente' y 'autores'.
En el caso de la fecha, de no poder detectarla explícitamente, marcarla como null, y de poder detectarla, escribirla en formato YYYY.MM.DD.
En el caso de la la fuente, de ser una red social, especificar cual y el usuario autor.
`;

async function analyzeClaim(claim: RawClaim): Promise<{
  summary?: string;
  date?: string;
  authors?: string[];
  source?: string;
}> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt} \n\n ${claim.articleBody}`,
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

async function loadClaimPages() {
  const claims: RawClaim[] = JSON.parse(
    fs.readFileSync("data/claims.json", "utf-8")
  );
  return claims;
}

const claims = await loadClaimPages();
const extendedClaims: ExtendedClaim[] = [];

for (let index = 0; index < claims.length; index++) {
  const claim = claims[index];
  console.log(`Extending (${index + 1}/${claims.length}) ${claim.claim}...`);
  const newData = await analyzeClaim(claim);
  console.log();

  extendedClaims.push({ ...claim, ...newData });
}

fs.writeFileSync(
  "data/extended-claims.json",
  JSON.stringify(extendedClaims, null, 4)
);
