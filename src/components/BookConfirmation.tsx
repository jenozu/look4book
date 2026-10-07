"use client";

import { useEffect, useState } from "react";
import ResaleCheck from "@/components/ResaleCheck";
import type { BookMetadata } from "@/lib/book-types";
import { formatIsbn } from "@/lib/isbn";

type LookupState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "found"; book: BookMetadata };

export default function BookConfirmation({
  isbn,
  onScanAgain,
}: {
  isbn: string;
  onScanAgain: () => void;
}) {
  const [lookup, setLookup] = useState<LookupState>({ status: "loading" });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLookup({ status: "loading" });

      try {
        const response = await fetch(`/api/books/${encodeURIComponent(isbn)}`);
        const payload = (await response.json()) as {
          book?: BookMetadata;
          error?: string;
        };

        if (!active) return;

        if (!response.ok || !payload.book) {
          setLookup({
            status: "error",
            message: payload.error ?? "Could not identify this book.",
          });
          return;
        }

        setLookup({ status: "found", book: payload.book });
      } catch {
        if (active) {
          setLookup({
            status: "error",
            message: "Could not identify this book. Check your connection.",
          });
        }
      }
    }

    void loadBook();
    return () => {
      active = false;
    };
  }, [isbn]);

  if (lookup.status === "loading") {
    return (
      <main className="app-shell">
        <section className="brand-block">
          <p className="eyebrow">BOOK IDENTIFICATION</p>
          <h1>Look4Book</h1>
        </section>

        <section className="scanner-card lookup-card" aria-live="polite">
          <span className="step-chip">STEP 2</span>
          <h2>Finding your book…</h2>
          <p className="scanner-message">{formatIsbn(isbn)}</p>
          <div className="lookup-loader" aria-hidden="true" />
        </section>
      </main>
    );
  }

  if (lookup.status === "error") {
    return (
      <main className="app-shell">
        <section className="brand-block">
          <p className="eyebrow">BOOK IDENTIFICATION</p>
          <h1>Look4Book</h1>
        </section>

        <section className="scanner-card lookup-card" aria-live="polite">
          <span className="step-chip">STEP 2</span>
          <h2>Book not found</h2>
          <p className="scanner-message error-text">{lookup.message}</p>
          <p className="isbn-display">{formatIsbn(isbn)}</p>
          <button className="button button-primary" type="button" onClick={onScanAgain}>
            SCAN AGAIN
          </button>
        </section>
      </main>
    );
  }

  const { book } = lookup;

  return (
    <main className="app-shell">
      <section className="brand-block">
        <p className="eyebrow">BOOK IDENTIFICATION</p>
        <h1>Look4Book</h1>
        <p className="brand-copy">
          Confirm that this matches the physical book in your hand.
        </p>
      </section>

      <section className="book-card">
        <div className="book-cover-wrap">
          {book.coverUrl ? (
            // A plain img keeps external cover handling simple for the MVP.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="book-cover" src={book.coverUrl} alt="" />
          ) : (
            <div className="book-cover-placeholder" aria-hidden="true">
              BOOK
            </div>
          )}
        </div>

        <div className="book-info">
          <span className="step-chip">STEP 2</span>
          <h2>{book.title}</h2>

          {book.authors.length > 0 && (
            <p className="book-author">{book.authors.join(", ")}</p>
          )}

          <dl className="book-meta">
            <div>
              <dt>ISBN</dt>
              <dd>{formatIsbn(book.isbn)}</dd>
            </div>
            {book.publishers.length > 0 && (
              <div>
                <dt>Publisher</dt>
                <dd>{book.publishers.join(", ")}</dd>
              </div>
            )}
            {book.publishDate && (
              <div>
                <dt>Published</dt>
                <dd>{book.publishDate}</dd>
              </div>
            )}
            {book.pageCount && (
              <div>
                <dt>Pages</dt>
                <dd>{book.pageCount}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {!confirmed ? (
        <section className="confirmation-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={() => setConfirmed(true)}
          >
            CORRECT BOOK
          </button>
          <button className="button button-secondary full-width" type="button" onClick={onScanAgain}>
            SCAN AGAIN
          </button>
        </section>
      ) : (
        <ResaleCheck isbn={book.isbn} onScanAnother={onScanAgain} />
      )}

      <p className="data-note">Book metadata provided by Open Library.</p>
    </main>
  );
}
