// A comfortable reading pace for prose with some code in it.
const wordsPerMinute = 200;

// Whole minutes to read a post's MDX, never less than one.
export function readingMinutes(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
