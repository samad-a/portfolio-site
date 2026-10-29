"use client";

import { useEffect, useRef } from "react";
import {
  bobOffset,
  daySprites,
  type Floater,
  floaterCount,
  floaterScale,
  isOffScreen,
  spawnFloater,
  type Viewport,
} from "@/lib/background/floaters";
import { spriteImage } from "@/lib/background/sprite-image";
import { type SpriteName, sprites } from "@/lib/sprites";

// Dense phone screens would otherwise draw up to 9 canvas pixels per CSS pixel.
const maxPixelRatio = 2;

// Faint, so text that a floater drifts behind stays easy to read.
const floaterOpacity = 0.55;

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
    const images = new Map<SpriteName, HTMLCanvasElement>();
    const imageOf = (name: SpriteName) => {
      if (!images.has(name)) images.set(name, spriteImage(sprites[name]));
      return images.get(name)!;
    };

    const viewport: Viewport = { width: 0, height: 0 };
    let floaters: Floater[] = [];
    let frameId = 0;
    let lastTime: number | undefined;

    function resize() {
      const ratio = Math.min(devicePixelRatio || 1, maxPixelRatio);
      viewport.width = innerWidth;
      viewport.height = innerHeight;
      canvas!.width = Math.round(viewport.width * ratio);
      canvas!.height = Math.round(viewport.height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      context!.imageSmoothingEnabled = false;

      const count = floaterCount(viewport);
      while (floaters.length < count) {
        floaters.push(spawnFloater(Math.random, viewport, daySprites, true));
      }
      floaters = floaters.slice(0, count);
    }

    function frame(time: number) {
      // Capped so a long pause (a background tab, say) doesn't jump everything.
      const seconds = Math.min((time - (lastTime ?? time)) / 1000, 0.1);
      lastTime = time;

      context!.globalAlpha = 1;
      context!.fillStyle = sky;
      context!.fillRect(0, 0, viewport.width, viewport.height);

      const scale = floaterScale(viewport);
      context!.globalAlpha = floaterOpacity;
      floaters = floaters.map((floater) => {
        floater.x += floater.speed * seconds;
        if (isOffScreen(floater, viewport)) {
          return spawnFloater(Math.random, viewport, daySprites, false);
        }
        const image = imageOf(floater.sprite);
        context!.drawImage(
          image,
          Math.round(floater.x),
          Math.round(floater.y + bobOffset(floater, time / 1000)),
          image.width * scale,
          image.height * scale,
        );
        return floater;
      });

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
