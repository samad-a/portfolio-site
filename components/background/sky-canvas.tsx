"use client";

import { useEffect, useRef } from "react";
import {
  celestialProgress,
  moonPosition,
  type Point,
  sunPosition,
  sunsetAmount,
} from "@/lib/background/celestial";
import {
  bobOffset,
  type Floater,
  floaterScale,
  isOffScreen,
  spawnFloater,
  type Viewport,
} from "@/lib/background/floaters";
import {
  nightAmount,
  type SkyLayout,
  skyBackground,
  skyGradient,
  skyLayout,
} from "@/lib/background/sky";
import { spriteImage } from "@/lib/background/sprite-image";
import { scenery, sceneryPosition } from "@/lib/background/scenery";
import { makeStars, type Star, starOpacity } from "@/lib/background/stars";
import { konamiEvent } from "@/lib/konami";
import { type SpriteName, sprites } from "@/lib/sprites";

// Faint, so text near the scenery or under a passing coin stays easy to read.
const spriteOpacity = 0.55;
const moonOpacity = 0.6;

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
      skyLate: themeColour("sky-late"),
      blush: themeColour("blush"),
      sunset: themeColour("sunset"),
      mauve: themeColour("mauve"),
      duskLight: themeColour("dusk-light"),
      dusk: themeColour("dusk"),
      duskDeep: themeColour("dusk-deep"),
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
    // Only the Konami code's coins drift across the sky now. They leave once
    // they're off screen.
    let floaters: Floater[] = [];
    // The scenery, placed in page pixels for the current screen width.
    let placed: { sprite: SpriteName; x: number; y: number; night: boolean }[] =
      [];
    let stars: Star[] = [];
    let frameId = 0;
    let lastTime: number | undefined;
    // With reduced motion, nothing moves: the sky is drawn as a still picture
    // and only redrawn when the page scrolls or resizes.
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let still = motionQuery.matches;

    function resize() {
      // One canvas pixel per CSS pixel, scaled up by the browser without
      // smoothing. Everything drawn is chunky pixels or flat colour, so it
      // looks the same as drawing at the screen's full density, for as little
      // as a quarter of the work on phones.
      viewport.width = innerWidth;
      viewport.height = innerHeight;
      canvas!.width = viewport.width;
      canvas!.height = viewport.height;
      context!.imageSmoothingEnabled = false;
      measure();
      if (still) redraw();
    }

    // Whether the middle of the screen is on the night sky, which decides
    // which sky the Konami coins fade with.
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
      placeScenery();
      // The browser positions the body's background against the whole page,
      // so this lines up with the canvas as it scrolls.
      document.body.style.backgroundImage = skyBackground(layout, colours);
      document.body.style.backgroundRepeat = "no-repeat";
    }

    // Works out where each piece of scenery goes beside its section.
    function placeScenery() {
      const scale = floaterScale(viewport);
      placed = scenery.flatMap((item) => {
        const element = document.getElementById(item.section);
        if (!element) return [];
        const box = element.getBoundingClientRect();
        const image = imageOf(item.sprite);
        const position = sceneryPosition(
          item,
          { top: box.top + scrollY, height: box.height },
          { width: image.width * scale, height: image.height * scale },
          viewport.width,
        );
        if (!position) return [];
        return [{ sprite: item.sprite, ...position, night: !!item.night }];
      });
    }

    // Draws a sprite at a point on screen, fading it out over the other kind
    // of sky to its own.
    function drawFaded(
      sprite: SpriteName,
      x: number,
      y: number,
      night: boolean,
    ) {
      const amount = nightAmount(scrollY + y, layout);
      const opacity = spriteOpacity * (night ? amount : 1 - amount);
      if (opacity < 0.02) return;
      const image = imageOf(sprite);
      const scale = floaterScale(viewport);
      context!.globalAlpha = opacity;
      context!.drawImage(
        image,
        Math.round(x),
        Math.round(y),
        image.width * scale,
        image.height * scale,
      );
    }

    function drawStars(seconds: number) {
      context!.fillStyle = starColour;
      for (const star of stars) {
        const y = star.y - scrollY;
        if (y < -star.size || y > viewport.height) continue;
        const opacity = starOpacity(
          star,
          seconds,
          nightAmount(star.y, layout),
          !still,
        );
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

    // Centred on the point, a size up from the scenery, so they read as far
    // bigger things.
    function drawSprite(name: SpriteName, { x, y }: Point, opacity: number) {
      if (opacity <= 0) return;
      const image = imageOf(name);
      const scale = floaterScale(viewport) + 1;
      context!.globalAlpha = opacity;
      const width = image.width * scale;
      const height = image.height * scale;
      context!.drawImage(
        image,
        Math.round(x - width / 2),
        Math.round(y - height / 2),
        width,
        height,
      );
    }

    // The sun and moon follow the scroll. With reduced motion they stay put
    // on the page instead: the sun at the top and the moon at the bottom, so
    // they scroll past like everything else.
    function drawSunAndMoon() {
      const lastScroll =
        document.documentElement.scrollHeight - viewport.height;
      const progress = still
        ? { sun: 0, moon: layout ? 1 : 0 }
        : celestialProgress(
            scrollY + viewport.height / 2,
            layout,
            viewport.height / 2,
            lastScroll + viewport.height / 2,
          );

      const sun = sunPosition(progress.sun, viewport);
      if (still) sun.y -= scrollY;
      const red = sunsetAmount(progress.sun);
      drawSprite("sunset", sun, red);
      drawSprite("sun", sun, 1 - red);

      const moon = moonPosition(progress.moon, viewport);
      if (still) moon.y += lastScroll - scrollY;
      // Dimmed like the scenery, since on phones it rises behind the
      // contact section's light text.
      drawSprite("moon", moon, progress.moon > 0 ? moonOpacity : 0);
    }

    function frame(time: number) {
      // Capped so a long pause (a background tab, say) doesn't jump everything.
      const seconds = still
        ? 0
        : Math.min((time - (lastTime ?? time)) / 1000, 0.1);
      lastTime = time;

      drawSky();
      drawStars(time / 1000);
      drawSunAndMoon();

      for (const { sprite, x, y, night } of placed) {
        if (y - scrollY > viewport.height || y - scrollY < -100) continue;
        drawFaded(sprite, x, y - scrollY, night);
      }

      floaters = floaters.filter((floater) => {
        floater.x += floater.speed * seconds;
        if (isOffScreen(floater, viewport)) return false;
        drawFaded(
          floater.sprite,
          floater.x,
          floater.y + (still ? 0 : bobOffset(floater, time / 1000)),
          floater.night,
        );
        return true;
      });

      if (!still) frameId = requestAnimationFrame(frame);
    }

    // Draws one frame soon, replacing any already waiting.
    function redraw() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(frame);
    }

    // The Konami code's reward: a burst of fast coins that fly off the screen.
    // With reduced motion, only the message shows.
    function onKonami() {
      if (still) return;
      const night = isNight();
      for (let i = 0; i < 30; i++) {
        const coin = spawnFloater(Math.random, viewport, night, true);
        floaters.push({
          ...coin,
          sprite: "coin",
          speed: Math.sign(coin.speed) * (90 + Math.random() * 150),
        });
      }
    }

    function onScroll() {
      if (still) redraw();
    }

    function onMotionChange() {
      still = motionQuery.matches;
      lastTime = undefined;
      redraw();
    }

    // Stops drawing while the tab is hidden, and picks up where it left off.
    function onVisibilityChange() {
      cancelAnimationFrame(frameId);
      if (document.hidden) return;
      lastTime = undefined;
      redraw();
    }

    resize();
    addEventListener("resize", resize);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener(konamiEvent, onKonami);
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    // Images, fonts and the window size all move the contact section.
    const pageObserver = new ResizeObserver(measure);
    pageObserver.observe(document.body);
    frameId = requestAnimationFrame(frame);
    // Lets the night section hand its background over to the canvas.
    document.documentElement.dataset.sky = "canvas";

    return () => {
      cancelAnimationFrame(frameId);
      removeEventListener("resize", resize);
      removeEventListener("scroll", onScroll);
      removeEventListener(konamiEvent, onKonami);
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      pageObserver.disconnect();
      delete document.documentElement.dataset.sky;
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 size-full [image-rendering:pixelated]"
    />
  );
}
