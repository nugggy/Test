"use client";

function escapeCsvField(value: string | number): string {
  let text = String(value);
  // Guard against CSV/formula injection when the file is opened in a
  // spreadsheet app: a field starting with = + - @ can be interpreted as a
  // formula, so prefix it with a leading apostrophe to force plain text.
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }
  if (/[",\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCsvField).join(",")
  );
  // Leading BOM so Excel opens UTF-8 CSVs (e.g. non-Latin names) correctly.
  const csv = "﻿" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
