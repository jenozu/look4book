import type { BookMetadata } from "@/lib/book-types";

type OpenLibraryBook = {
  title?: string;
  authors?: Array<{ name?: string }>;
  publishers?: Array<{ name?: string }>;
  publish_date?: string;
  number_of_pages?: number;
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
};

export async function getBookByISBN(isbn: string): Promise<BookMetadata | null> {
  const key = `ISBN:${isbn}`;
  const url = new URL("https://openlibrary.org/api/books");
  url.searchParams.set("bibkeys", key);
  url.searchParams.set("jscmd", "data");
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Look4Book/0.1 (personal book-resale lookup)",
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Open Library request failed with ${response.status}`);
  }

  const payload = (await response.json()) as Record<string, OpenLibraryBook>;
  const result = payload[key];

  if (!result?.title) return null;

  return {
    isbn,
    title: result.title,
    authors:
      result.authors?.map((author) => author.name).filter(Boolean) as string[] ??
      [],
    publishers:
      result.publishers
        ?.map((publisher) => publisher.name)
        .filter(Boolean) as string[] ?? [],
    publishDate: result.publish_date,
    pageCount: result.number_of_pages,
    coverUrl: result.cover?.large ?? result.cover?.medium ?? result.cover?.small,
    source: "openlibrary",
  };
}
