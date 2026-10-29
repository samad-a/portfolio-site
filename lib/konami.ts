// ↑ ↑ ↓ ↓ ← → ← → B A, as `KeyboardEvent.key` values.
export const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

// The event the page fires when someone enters the code.
export const konamiEvent = "konami";

// How many keys of the code have been entered after pressing `key`, given
// `progress` keys before it. A wrong key starts over, but still counts if it
// begins the code. Reaching the full length means the code is done.
export function konamiProgress(progress: number, key: string) {
  const pressed = key.length === 1 ? key.toLowerCase() : key;
  if (pressed === konamiCode[progress]) return progress + 1;
  // Several ups in a row: stay ready for the downs.
  if (pressed === "ArrowUp" && progress === 2) return 2;
  return pressed === konamiCode[0] ? 1 : 0;
}
