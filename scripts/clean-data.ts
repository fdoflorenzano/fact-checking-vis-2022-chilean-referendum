import fs from "fs";
import type { VerifiedClaim, Claim } from "./types";

function cleanClaim(claim: VerifiedClaim, index: number): Claim {
  return {
    index,
    claim: claim.claim,
    verification: claim.verification,
    verificationRaw: claim.verificationRaw,
    url: claim.url,
    categoryRaw: claim.categoryRaw,
    articleResult: claim.articleSubtitle,
    date: claim.date,
    source: claim.source,
    preference: claim.preference,
  };
}

async function loadVerifiedClaims() {
  const claims: VerifiedClaim[] = JSON.parse(
    fs.readFileSync("data/extended-claims-verified.json", "utf-8")
  );
  return claims;
}

const verifiedClaims = await loadVerifiedClaims();
const cleanedClaims: Claim[] = [];

for (let index = 0; index < verifiedClaims.length; index++) {
  const claim = verifiedClaims[index];
  console.log(
    `Cleaning (${index + 1}/${verifiedClaims.length}) ${claim.claim}...`
  );
  const cleaned = await cleanClaim(claim, index);
  console.log();

  cleanedClaims.push(cleaned);
}

fs.writeFileSync(
  "data/cleaned-claims.json",
  JSON.stringify(cleanedClaims, null, 4)
);
