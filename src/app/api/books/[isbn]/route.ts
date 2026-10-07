import { NextResponse } from "next/server";
import { getBookByISBN } from "@/lib/books";
import { cleanIsbn, isValidIsbn } from "@/lib/isbn";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn: rawIsbn } = await params;
  const isbn = cleanIsbn(rawIsbn);

  if (!isValidIsbn(isbn)) {
    return NextResponse.json({ error: "Invalid ISBN." }, { status: 400 });
  }

  try {
    const book = await getBookByISBN(isbn);

    if (!book) {
      return NextResponse.json(
        { error: "No matching book was found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ book });
  } catch {
    return NextResponse.json(
      { error: "Book lookup is temporarily unavailable." },
      { status: 502 },
    );
  }
}
