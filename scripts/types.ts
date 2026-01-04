export type BaseClaim = {
  claim: string;
  verification: string;
  verificationRaw: string;
  url: string;
  categoryRaw: string;
};

export type RawClaim = BaseClaim & {
  categoryRaw: string;
  articleTitle: string;
  articleSubtitle: string;
  articleBody: string;
};

export type ExtendedClaim = RawClaim & {
  date?: string;
  source?: string;
  authors?: string[];
  summary?: string;
};

type Source =
  | {
      platform: string;
      author?: string;
    }
  | {
      medium: string;
      organization?: string;
      show?: string;
    };

export type VerifiedClaim = RawClaim & {
  date: string | null;
  source: Source;
  authors?: string[];
  summary?: string;
  preference: string;
};

export type Claim = {
  index: number;
  claim: string;
  verification: string;
  verificationRaw: string;
  url: string;
  categoryRaw: string;
  articleResult: string;
  date: string | null;
  source: Source;
  preference: string;
};
