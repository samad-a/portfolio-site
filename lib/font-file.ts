// The first four bytes of the font files the preview image renderer can read:
// TrueType, OpenType with CFF outlines, the old Apple TrueType tag and WOFF.
const signatures = ["\x00\x01\x00\x00", "OTTO", "true", "wOFF"];

// Whether a download is really a font file, rather than an error page or an
// empty body. The renderer crashes on anything else, failing the whole build.
export function isFontFile(data: ArrayBuffer) {
  if (data.byteLength < 4) return false;
  const start = String.fromCharCode(...new Uint8Array(data, 0, 4));
  return signatures.includes(start);
}
