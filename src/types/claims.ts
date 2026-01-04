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
