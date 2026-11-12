"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  celestialProgress,
  moonPosition,
  overlapsAny,
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
import { isSkySwapped, subscribeSkySwap, toggleSkySwap } from "@/lib/sky-swap";
import { type SpriteName, sprites } from "@/lib/sprites";

// Faint, so text near the scenery or under a passing coin stays easy to read.
const spriteOpacity = 0.55;
// The moon, and the sun when it rises from the bottom, where they can pass
// behind text.
const dimmedOpacity = 0.6;
// Behind light text the moon is fainter still: white at this strength on the
// night sky keeps 4.5:1 with the text. On phones it's always this faint, as
// the text there fills the screen's width.
const faintMoonOpacity = 0.3;
const phoneWidth = 768;
// The gap kept between the sun and the end of a phone's heading, and between
// the sun and the screen's edge.
const sunGap = 16;

// The sun or moon, where it was last drawn on screen, so it can be clicked.
type Body = {
  name: "sun" | "moon";
  x: number;
  y: number;
  size: number;
  opacity: number;
};

// Clicks on these, on words, or inside anything with a background land on the
// page rather than on the sky behind it.
const notSky =
  "a,button,input,textarea,select,label,summary,img,svg,video,[role=dialog]";

// Whether a point is on a line of text. A heading's box can stretch across
// the page past its words, so it's the words themselves that are checked.
function isOnText(x: number, y: number) {
  const node =
    document.caretPositionFromPoint?.(x, y)?.offsetNode ??
    document.caretRangeFromPoint?.(x, y)?.startContainer;
  if (node?.nodeType !== Node.TEXT_NODE) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  return [...range.getClientRects()].some(
    (line) =>
      x >= line.left && x <= line.right && y >= line.top && y <= line.bottom,
  );
}

function isOpenSky({ target, clientX, clientY }: MouseEvent) {
  if (!(target instanceof Element) || target.closest(notSky)) return false;
  if (isOnText(clientX, clientY)) return false;
  for (
    let element: Element | null = target;
    element && element !== document.body;
    element = element.parentElement
  ) {
    const style = getComputedStyle(element);
    const clear =
      style.backgroundColor === "transparent" ||
      style.backgroundColor === "rgba(0, 0, 0, 0)";
    if (style.backgroundImage !== "none" || !clear) return false;
  }
  return true;
}

// The boxes around each line of words straight on the sky (not inside a
// panel), in page pixels, so the moon can fade behind them.
function skyTextBoxes() {
  const range = document.createRange();
  return [...document.querySelectorAll("main h1, main h2, main p")]
    .filter((element) => !element.closest(".pixel-outline"))
    .flatMap((element) => {
      range.selectNodeContents(element);
      return [...range.getClientRects()].map((line) => ({
        left: line.left,
        right: line.right,
        top: line.top + scrollY,
        bottom: line.bottom + scrollY,
      }));
    });
}

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const swapped = useSyncExternalStore(
    subscribeSkySwap,
    isSkySwapped,
    () => false,
  );

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
    const sunRayColour = themeColour("gold");
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
    // On phones, where the sun starts: beside the page's heading, in page
    // pixels. Left out when the heading is too wide to leave room.
    let sunStart: Point | undefined;
    let textBoxes: ReturnType<typeof skyTextBoxes> = [];
    // The moon's strength now, easing towards a fainter one behind text.
    let moonOpacity: number | undefined;
    // Seconds since the last frame.
    let delta = 0;
    let frameId = 0;
    let lastTime: number | undefined;
    // With reduced motion, nothing moves: the sky is drawn as a still picture
    // and only redrawn when the page scrolls or resizes.
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let still = motionQuery.matches;
    // Whether the page starts at night, as the visitor last chose.
    let swapped = isSkySwapped();
    // The sun and moon on screen, most in view first, and which one the
    // pointer is on.
    let bodies: Body[] = [];
    let hovered: Body["name"] | undefined;
    let focused = false;
    const button = buttonRef.current;

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
      return nightAmount(scrollY + viewport.height / 2, layout, swapped) > 0.5;
    }

    // Finds the contact section, where night falls, and fills the night sky
    // below it with stars. Pages without one stay day.
    function measure() {
      const contact = document.getElementById("contact");
      layout = contact
        ? skyLayout(contact.getBoundingClientRect().top + scrollY)
        : undefined;
      // Stars fill whichever part of the page is night.
      const pageHeight = document.documentElement.scrollHeight;
      if (swapped)
        stars = makeStars(
          Math.random,
          viewport.width,
          0,
          layout ? layout.contactTop : pageHeight,
        );
      else
        stars = layout
          ? makeStars(Math.random, viewport.width, layout.dayEnd, pageHeight)
          : [];
      placeScenery();
      sunStart = placeSun();
      textBoxes = skyTextBoxes();
      // The browser positions the body's background against the whole page,
      // so this lines up with the canvas as it scrolls.
      document.body.style.backgroundImage = skyBackground(
        layout,
        colours,
        swapped,
      );
      document.body.style.backgroundRepeat = "no-repeat";
    }

    // On a phone the intro sits under the heading, right where the sun's arc
    // starts, so the sun starts to the right of the heading's first line.
    function placeSun(): Point | undefined {
      const heading = document.querySelector("main h1");
      if (viewport.width >= phoneWidth || !heading) return undefined;
      const range = document.createRange();
      range.selectNodeContents(heading);
      const line = range.getClientRects()[0];
      if (!line) return undefined;
      const size = imageOf("sun").width * (floaterScale(viewport) + 1);
      const x = viewport.width - sunGap - size / 2;
      if (line.right + sunGap > x - size / 2) return undefined;
      return { x, y: line.top + scrollY + line.height / 2 };
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
      const amount = nightAmount(scrollY + y, layout, swapped);
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
          nightAmount(star.y, layout, swapped),
          !still,
        );
        if (opacity <= 0) continue;
        context!.globalAlpha = opacity;
        context!.fillRect(star.x, y, star.size, star.size);
      }
    }

    function drawSky() {
      const { end, stops } = skyGradient(layout, colours, swapped);
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

    // Pointed at or tabbed to, the sun shines with a ring of rays that pulse
    // out and back, and the moon glows in soft rings of moonlight.
    function drawHighlight(body: Body, seconds: number) {
      const pulse = still ? 0 : Math.round((Math.sin(seconds * 5) + 1) * 2);
      const pixel = Math.max(3, Math.round(body.size / 12));
      if (body.name === "sun") {
        context!.globalAlpha = body.opacity;
        context!.fillStyle = sunRayColour;
        const reach = body.size * 0.62 + pulse * 2;
        for (let ray = 0; ray < 8; ray++) {
          const angle = (ray * Math.PI) / 4;
          for (let step = 0; step < 3; step++) {
            const distance = reach + step * pixel;
            context!.fillRect(
              Math.round(body.x + Math.cos(angle) * distance - pixel / 2),
              Math.round(body.y + Math.sin(angle) * distance - pixel / 2),
              pixel,
              pixel,
            );
          }
        }
        return;
      }
      context!.fillStyle = starColour;
      context!.globalAlpha = 0.14;
      for (let ring = 1; ring <= 3; ring++) {
        context!.beginPath();
        context!.arc(
          body.x,
          body.y,
          body.size / 2 + ring * pixel * 2 + pulse,
          0,
          Math.PI * 2,
        );
        context!.fill();
      }
    }

    // Draws the sun or moon, and remembers where, for clicks. `sunset` is
    // how red the sun is.
    function drawBody(
      name: Body["name"],
      point: Point,
      opacity: number,
      seconds: number,
      sunset = 0,
    ) {
      if (opacity <= 0) return;
      const size = imageOf(name).width * (floaterScale(viewport) + 1);
      const body: Body = { name, ...point, size, opacity };
      bodies.push(body);
      if (hovered === name) drawHighlight(body, seconds);
      if (name === "moon") return drawSprite("moon", point, opacity);
      drawSprite("sunset", point, opacity * sunset);
      drawSprite("sun", point, opacity * (1 - sunset));
    }

    // How much of a sun or moon is on screen, from 0 to 1.
    function onScreen({ x, y, size }: Point & { size: number }) {
      const half = size / 2;
      const across = Math.min(viewport.width, x + half) - Math.max(0, x - half);
      const down = Math.min(viewport.height, y + half) - Math.max(0, y - half);
      return (Math.max(0, across) * Math.max(0, down)) / (size * size);
    }

    // The sun and moon follow the scroll. With reduced motion they stay put
    // on the page instead: the sun at the top and the moon at the bottom, so
    // they scroll past like everything else. With the sky swapped, the moon
    // takes the sun's path down from the top, and the sun rises on the
    // moon's, red at first.
    function drawSunAndMoon(seconds: number) {
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

      const high = sunPosition(progress.sun, viewport, sunStart);
      if (still) high.y -= scrollY;
      const low = moonPosition(progress.moon, viewport);
      if (still) low.y += lastScroll - scrollY;
      const lowShows = progress.moon > 0;

      // The keyboard's focus lights up whichever is most in view.
      if (focused) {
        const size = imageOf("sun").width * (floaterScale(viewport) + 1);
        const highFirst =
          onScreen({ ...high, size }) >=
          (lowShows ? onScreen({ ...low, size }) : 0);
        hovered = highFirst !== swapped ? "sun" : "moon";
      }

      bodies = [];
      // The moon fades a little more while it's behind words on the sky.
      const moon = swapped ? high : low;
      const size = imageOf("moon").width * (floaterScale(viewport) + 1);
      const behindText = overlapsAny(
        { x: moon.x, y: moon.y + scrollY },
        size,
        textBoxes,
      );
      const target =
        viewport.width < phoneWidth || behindText
          ? faintMoonOpacity
          : dimmedOpacity;
      moonOpacity =
        still || moonOpacity === undefined
          ? target
          : moonOpacity + (target - moonOpacity) * Math.min(1, delta * 6);
      // Whichever rises from the bottom is dimmed like the scenery, since it
      // passes behind the contact text.
      if (swapped) {
        drawBody("moon", high, moonOpacity, seconds);
        const sunrise = 1 - Math.min(1, progress.moon / 0.5);
        drawBody("sun", low, lowShows ? dimmedOpacity : 0, seconds, sunrise);
      } else {
        drawBody("sun", high, 1, seconds, sunsetAmount(progress.sun));
        drawBody("moon", low, lowShows ? moonOpacity : 0, seconds);
      }
    }

    // The sun or moon at a point on screen, with a little room around it.
    function bodyAt(x: number, y: number) {
      return bodies.find(
        (body) =>
          body.opacity > 0.1 &&
          Math.abs(x - body.x) <= body.size / 2 + 8 &&
          Math.abs(y - body.y) <= body.size / 2 + 8,
      );
    }

    function frame(time: number) {
      // Capped so a long pause (a background tab, say) doesn't jump everything.
      const seconds = still
        ? 0
        : Math.min((time - (lastTime ?? time)) / 1000, 0.1);
      lastTime = time;
      delta = seconds;

      drawSky();
      drawStars(time / 1000);
      drawSunAndMoon(time / 1000);

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

    // Pointing at the sun or moon, where the sky shows through, makes it
    // shine and turns the pointer into a hand. Only mice point; a tap swaps.
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || focused) return;
      const body = bodyAt(event.clientX, event.clientY);
      const over = body && isOpenSky(event) ? body.name : undefined;
      if (over === hovered) return;
      hovered = over;
      document.documentElement.style.cursor = over ? "pointer" : "";
      if (still) redraw();
    }

    function onClick(event: MouseEvent) {
      if (bodyAt(event.clientX, event.clientY) && isOpenSky(event))
        toggleSkySwap();
    }

    function onFocusChange() {
      focused = !!button?.matches(":focus-visible");
      if (!focused) hovered = undefined;
      redraw();
    }

    function onSwap() {
      swapped = isSkySwapped();
      measure();
      redraw();
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
    addEventListener("pointermove", onPointerMove, { passive: true });
    addEventListener("click", onClick);
    button?.addEventListener("focus", onFocusChange);
    button?.addEventListener("blur", onFocusChange);
    const unsubscribe = subscribeSkySwap(onSwap);
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
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("click", onClick);
      button?.removeEventListener("focus", onFocusChange);
      button?.removeEventListener("blur", onFocusChange);
      unsubscribe();
      document.documentElement.style.cursor = "";
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
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 size-full [image-rendering:pixelated]"
      />
      {/*
        The sun and moon are painted on the canvas, so they can't be tabbed
        to. This does the same job for the keyboard: hidden until focused,
        when it shows in the corner and the sun or moon in view shines.
      */}
      <button
        ref={buttonRef}
        type="button"
        aria-pressed={swapped}
        onClick={toggleSkySwap}
        className="sr-only z-50 cursor-pointer bg-gold px-4 py-2 font-label text-ink focus:not-sr-only focus:fixed focus:top-4 focus:right-4"
      >
        swap day and night
      </button>
    </>
  );
}
