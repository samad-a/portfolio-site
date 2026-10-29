"use client";

import { useEffect, useRef } from "react";
import {
  bobOffset,
  type Floater,
  floaterCount,
  floaterScale,
  isOffScreen,
  spawnFloater,
  type Viewport,
} from "@/lib/background/floaters";
import {
  nightAmount,
  type SkyLayout,
  skyGradient,
  skyLayout,
} from "@/lib/background/sky";
import { spriteImage } from "@/lib/background/sprite-image";
import { makeStars, type Star, starOpacity } from "@/lib/background/stars";
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
// The sky is a gradient fixed to the page, so scrolling down to the contact
// section takes it from day through dusk to night.
export function SkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const colours = {
      skyTop: themeColour("sky-top"),
      sky: themeColour("sky"),
      dusk: themeColour("dusk"),
      night: themeColour("night"),
    };
    const starColour = themeColour("moon");
    const images = new Map<SpriteName, HTMLCanvasElement>();
    const imageOf = (name: SpriteName) => {
      if (!images.has(name)) images.set(name, spriteImage(sprites[name]));
      return images.get(name)!;
    };

    const viewport: Viewport = { width: 0, height: 0 };
    let layout: SkyLayout | undefined;
    let floaters: Floater[] = [];
    let stars: Star[] = [];
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
      measure();

      const count = floaterCount(viewport);
      while (floaters.length < count) {
        floaters.push(spawnFloater(Math.random, viewport, isNight(), true));
      }
      floaters = floaters.slice(0, count);
    }

    // Whether the middle of the screen is on the night sky, which decides
    // what kind of floater spawns next.
    function isNight() {
      return nightAmount(scrollY + viewport.height / 2, layout) > 0.5;
    }

    // Finds the contact section, where night falls, and fills the night sky
    // below it with stars. Pages without one stay day.
    function measure() {
      const contact = document.getElementById("contact");
      layout = contact
        ? skyLayout(contact.getBoundingClientRect().top + scrollY)
        : undefined;
      stars = layout
        ? makeStars(
            Math.random,
            viewport.width,
            layout.dayEnd,
            document.documentElement.scrollHeight,
          )
        : [];
    }

    function drawStars(seconds: number) {
      context!.fillStyle = starColour;
      for (const star of stars) {
        const y = star.y - scrollY;
        if (y < -star.size || y > viewport.height) continue;
        const opacity = starOpacity(star, seconds, nightAmount(star.y, layout));
        if (opacity <= 0) continue;
        context!.globalAlpha = opacity;
        context!.fillRect(star.x, y, star.size, star.size);
      }
    }

    function drawSky() {
      const { end, stops } = skyGradient(layout, colours);
      const gradient = context!.createLinearGradient(
        0,
        -scrollY,
        0,
        end - scrollY,
      );
      for (const [offset, colour] of stops)
        gradient.addColorStop(offset, colour);
      context!.globalAlpha = 1;
      context!.fillStyle = gradient;
      context!.fillRect(0, 0, viewport.width, viewport.height);
    }

    function frame(time: number) {
      // Capped so a long pause (a background tab, say) doesn't jump everything.
      const seconds = Math.min((time - (lastTime ?? time)) / 1000, 0.1);
      lastTime = time;

      drawSky();
      drawStars(time / 1000);

      const scale = floaterScale(viewport);
      floaters = floaters.map((floater) => {
        floater.x += floater.speed * seconds;
        if (isOffScreen(floater, viewport)) {
          return spawnFloater(Math.random, viewport, isNight(), false);
        }
        // Each kind fades out as it drifts over the other kind of sky.
        const night = nightAmount(scrollY + floater.y, layout);
        const opacity = floaterOpacity * (floater.night ? night : 1 - night);
        if (opacity < 0.02) return floater;
        context!.globalAlpha = opacity;
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
    // Images, fonts and the window size all move the contact section.
    const pageObserver = new ResizeObserver(measure);
    pageObserver.observe(document.body);
    frameId = requestAnimationFrame(frame);
    // Lets the night section hand its background over to the canvas.
    document.documentElement.dataset.sky = "canvas";

    return () => {
      cancelAnimationFrame(frameId);
      removeEventListener("resize", resize);
      pageObserver.disconnect();
      delete document.documentElement.dataset.sky;
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
