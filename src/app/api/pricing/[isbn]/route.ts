import { NextResponse } from "next/server";
import { searchEbayByIsbn, EbayConfigurationError } from "@/lib/ebay";
import { cleanIsbn, toIsbn13 } from "@/lib/isbn";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn: rawIsbn } = await params;
  const isbn = cleanIsbn(rawIsbn);
  const isbn13 = toIsbn13(isbn);

  if (!isbn13) {
    return NextResponse.json({ error: "Invalid ISBN." }, { status: 400 });
  }

  try {
    const result = await searchEbayByIsbn(isbn13);

    if (!result) {
      return NextResponse.json(
        { error: "No usable eBay listings were found for this ISBN." },
        { status: 404 },
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof EbayConfigurationError) {
      return NextResponse.json(
        {
          error: "eBay pricing is not connected yet.",
          setupRequired: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "eBay pricing is temporarily unavailable." },
      { status: 502 },
    );
  }
}
