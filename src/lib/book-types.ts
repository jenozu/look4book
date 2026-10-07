export type BookMetadata = {
  isbn: string;
  title: string;
  authors: string[];
  publishers: string[];
  publishDate?: string;
  pageCount?: number;
  coverUrl?: string;
  source: "openlibrary";
};
