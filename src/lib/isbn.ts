const ISBN_10_PATTERN = /^\d{9}[\dX]$/;
const ISBN_13_PATTERN = /^\d{13}$/;

export function cleanIsbn(value: string): string {
  return value.toUpperCase().replace(/[^0-9X]/g, "");
}

export function isValidIsbn10(value: string): boolean {
  const isbn = cleanIsbn(value);
  if (!ISBN_10_PATTERN.test(isbn)) return false;

  const sum = isbn.split("").reduce((total, char, index) => {
    const digit = char === "X" ? 10 : Number(char);
    return total + digit * (10 - index);
  }, 0);

  return sum % 11 === 0;
}

export function isValidIsbn13(value: string): boolean {
  const isbn = cleanIsbn(value);
  if (!ISBN_13_PATTERN.test(isbn)) return false;
  if (!isbn.startsWith("978") && !isbn.startsWith("979")) return false;

  const expectedCheckDigit =
    (10 -
      (isbn
        .slice(0, 12)
        .split("")
        .reduce(
          (sum, char, index) =>
            sum + Number(char) * (index % 2 === 0 ? 1 : 3),
          0,
        ) %
        10)) %
    10;

  return expectedCheckDigit === Number(isbn[12]);
}

export function isValidIsbn(value: string): boolean {
  const isbn = cleanIsbn(value);
  return isbn.length === 10 ? isValidIsbn10(isbn) : isValidIsbn13(isbn);
}

export function formatIsbn(value: string): string {
  const isbn = cleanIsbn(value);
  if (isbn.length === 13) {
    return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 7)}-${isbn.slice(7, 12)}-${isbn.slice(12)}`;
  }
  return isbn;
}


export function toIsbn13(value: string): string | null {
  const isbn = cleanIsbn(value);

  if (isbn.length === 13) {
    return isValidIsbn13(isbn) ? isbn : null;
  }

  if (!isValidIsbn10(isbn)) return null;

  const base = `978${isbn.slice(0, 9)}`;
  const sum = base
    .split("")
    .reduce(
      (total, char, index) =>
        total + Number(char) * (index % 2 === 0 ? 1 : 3),
      0,
    );
  const checkDigit = (10 - (sum % 10)) % 10;

  return `${base}${checkDigit}`;
}
