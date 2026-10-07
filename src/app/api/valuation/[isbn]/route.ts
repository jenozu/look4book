import { NextResponse } from "next/server";
import {
  AmazonConfigurationError,
  getAmazonBookAnalytics,
} from "@/lib/amazon";
import {
  EbayConfigurationError,
  searchEbayByIsbn,
} from "@/lib/ebay";
import { cleanIsbn, toIsbn13 } from "@/lib/isbn";
import type { MarketplaceResult } from "@/lib/marketplace-types";

type SourceName = "amazon" | "ebay";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn: rawIsbn } = await params;
  const isbn13 = toIsbn13(cleanIsbn(rawIsbn));

  if (!isbn13) {
    return NextResponse.json({ error: "Invalid ISBN." }, { status: 400 });
  }

  const results: MarketplaceResult[] = [];
  const setupRequired: SourceName[] = [];
  const errors: Array<{ source: SourceName; message: string }> = [];

  const [amazon, ebay] = await Promise.allSettled([
    getAmazonBookAnalytics(isbn13),
    searchEbayByIsbn(isbn13),
  ]);

  if (amazon.status === "fulfilled") {
    if (amazon.value) results.push(amazon.value);
  } else if (amazon.reason instanceof AmazonConfigurationError) {
    setupRequired.push("amazon");
  } else {
    errors.push({
      source: "amazon",
      message: "Amazon pricing is temporarily unavailable.",
    });
  }

  if (ebay.status === "fulfilled") {
    if (ebay.value) results.push(ebay.value);
  } else if (ebay.reason instanceof EbayConfigurationError) {
    setupRequired.push("ebay");
  } else {
    errors.push({
      source: "ebay",
      message: "eBay pricing is temporarily unavailable.",
    });
  }

  return NextResponse.json({
    isbn: isbn13,
    results,
    setupRequired,
    errors,
  });
}
