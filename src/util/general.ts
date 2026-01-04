import type { Claim } from "../types/claims";

export const getSource = (claim: Claim): string => {
  if ("medium" in claim.source) return claim.source.medium;
  if ("platform" in claim.source) return claim.source.platform;
  return "";
};
