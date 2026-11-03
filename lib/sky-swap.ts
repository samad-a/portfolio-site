// Whether the visitor has swapped the sky, so the page starts at night and
// ends in the morning. Clicking the sun or moon swaps it, and this browser
// remembers. It's kept as `data-sky-swap` on <html>, which a script in the
// page's head sets before anything is drawn, so a swapped page never flashes
// day first. CSS swaps the text colours on the sky from the same attribute.

export const skySwapKey = "sky-swapped";

// Run in the head before the page paints. Written out as a string, as it's
// inlined into the HTML rather than bundled.
export const skySwapScript = `try{if(localStorage.getItem("${skySwapKey}")==="1")document.documentElement.dataset.skySwap=""}catch(e){}`;

const listeners = new Set<() => void>();

export function subscribeSkySwap(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isSkySwapped() {
  return document.documentElement.dataset.skySwap !== undefined;
}

export function toggleSkySwap() {
  const swapped = !isSkySwapped();
  if (swapped) document.documentElement.dataset.skySwap = "";
  else delete document.documentElement.dataset.skySwap;
  try {
    localStorage.setItem(skySwapKey, swapped ? "1" : "0");
  } catch {
    // Storage is blocked; the sky still swaps until the page reloads.
  }
  listeners.forEach((listener) => listener());
}
