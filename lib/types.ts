// lib/types.ts

export type ResultLevel = "JHS" | "SHS";

export type ExtractedResult = {
  subject: string;
  grade: string;
};

export type ExtractResultsResponse = {
  level: ResultLevel;
  results: ExtractedResult[];
};
