function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }

  return dp[a.length][b.length];
}

/**
 * A typo-tolerant version of `haystack.includes(needle)`: every word in the
 * search query must either appear directly in the haystack, or be close
 * enough (by edit distance) to some word in it - so small misspellings like
 * "commnication" or "shedule" still find the right tool.
 */
export function fuzzyIncludes(haystack: string, needle: string): boolean {
  const hay = haystack.toLowerCase();
  const query = needle.toLowerCase().trim();
  if (!query) return true;
  if (hay.includes(query)) return true;

  const hayWords = hay.split(/[\s,/-]+/).filter(Boolean);
  const queryWords = query.split(/[\s,/-]+/).filter(Boolean);

  return queryWords.every((qWord) => {
    if (hay.includes(qWord)) return true;
    if (qWord.length < 3) return false; // too short to fuzzy-match reliably
    const maxDistance = qWord.length <= 5 ? 1 : 2;
    return hayWords.some((hWord) => levenshtein(qWord, hWord) <= maxDistance);
  });
}
