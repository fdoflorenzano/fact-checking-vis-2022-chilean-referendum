export type BaseFact = {
  fact: string;
  verification: string;
  verificationRaw: string;
  url: string;
  categoryRaw: string;
};

export type RawFact = BaseFact & {
  categoryRaw: string;
  articleTitle: string;
  articleSubtitle: string;
  articleBody: string;
};

export type ExtendedFact = RawFact & {
  date?: string;
  source?: string;
  authors?: string[];
  summary?: string;
};
