import { NextResponse } from "next/server";
import { searchEbayByIsbn, EbayConfigurationError } from "@/lib/ebay";
import { cleanIsbn, isValidIsbn13 } from "@/lib/isbn";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn: rawIsbn } = await params;
  const isbn = cleanIsbn(rawIsbn);

  if (!isValidIsbn13(isbn)) {
    return NextResponse.json(
      { error: "Pricing currently requires a valid ISBN-13." },
      { status: 400 },
    );
  }

  try {
    const result = await searchEbayByIsbn(isbn);

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
