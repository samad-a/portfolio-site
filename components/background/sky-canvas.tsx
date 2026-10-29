"use client";

import { useEffect, useRef } from "react";

// Dense phone screens would otherwise draw up to 9 canvas pixels per CSS pixel.
const maxPixelRatio = 2;

function themeColour(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();
}

// A canvas fixed behind the whole page, redrawn every frame. It paints the sky
// itself, so it sits above the body's background but below everything else.
export function SkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const sky = themeColour("sky");
    let width = 0;
    let height = 0;
    let frameId = 0;

    function resize() {
      const ratio = Math.min(devicePixelRatio || 1, maxPixelRatio);
      width = innerWidth;
      height = innerHeight;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      context!.imageSmoothingEnabled = false;
    }

    function frame() {
      context!.fillStyle = sky;
      context!.fillRect(0, 0, width, height);
      frameId = requestAnimationFrame(frame);
    }

    resize();
    addEventListener("resize", resize);
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full"
    />
  );
}
