"use client";

import React, { useEffect, useRef, useState } from "react";
import type { gsap as Gsap } from "gsap";
import { useAnimationActivity } from "../../hooks/useAnimationActivity";

interface CrowdCanvasProps {
  src: string;
  /** A half-resolution version of the same sprite sheet. */
  mobileSrc?: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, mobileSrc, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" && !window.matchMedia("(min-width: 640px)").matches,
  );
  const useMobileSprite = Boolean(mobileSrc && isMobileViewport);
  const spriteSrc = mobileSrc && isMobileViewport ? mobileSrc : src;
  const { isActive, prefersReducedMotion } = useAnimationActivity(canvasRef);
  const activityRef = useRef({ isActive, prefersReducedMotion });
  const updateAnimationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mobileSrc) return;
    const desktopViewport = window.matchMedia("(min-width: 640px)");
    const updateViewport = () => setIsMobileViewport(!desktopViewport.matches);
    updateViewport();
    desktopViewport.addEventListener("change", updateViewport);
    return () => desktopViewport.removeEventListener("change", updateViewport);
  }, [mobileSrc]);

  useEffect(() => {
    activityRef.current = { isActive, prefersReducedMotion };
    updateAnimationRef.current?.();
  }, [isActive, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type WalkProps = { startX: number; startY: number; endX: number };
    type Peep = {
      rect: [number, number, number, number];
      width: number;
      height: number;
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      initialProgress: number;
      props: WalkProps;
      walk: ReturnType<typeof Gsap.timeline> | null;
      sprite: HTMLCanvasElement | null;
      spriteDirection: number;
    };

    const image = document.createElement("img");
    const stage = { width: 0, height: 0 };
    const crowd: Peep[] = [];
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const frameInterval = 1000 / 30;
    // The mobile texture is half-resolution; keep all crowd coordinates in CSS pixels.
    let sourceResolutionScale = useMobileSprite ? 2 : 1;
    let spriteScale = 1;
    let pixelRatio = 1;
    let disposed = false;
    let imageReady = false;
    let gsap: typeof Gsap | null = null;
    let importPending = false;
    let tickerAttached = false;
    let lastFrame = 0;
    let idleTask: number | null = null;
    let paintFrame: number | null = null;
    let resizeFrame: number | null = null;
    let spriteCacheTask: number | null = null;
    let spriteCacheFrame: number | null = null;
    const pendingSprites = new Set<Peep>();

    const canAnimate = () => {
      const activity = activityRef.current;
      return imageReady && activity.isActive && !activity.prefersReducedMotion && !disposed;
    };

    const canCacheSprites = () => spriteScale * sourceResolutionScale * pixelRatio === 1;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const peep of crowd) {
        if (canCacheSprites() && peep.sprite && peep.spriteDirection === peep.scaleX) {
          const left = peep.scaleX === 1 ? peep.x : peep.x - peep.width;
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, left * pixelRatio, peep.y * pixelRatio);
          ctx.drawImage(peep.sprite, 0, 0, peep.width, peep.height);
        } else {
          ctx.setTransform(pixelRatio * peep.scaleX, 0, 0, pixelRatio, peep.x * pixelRatio, peep.y * pixelRatio);
          ctx.drawImage(image, ...peep.rect, 0, 0, peep.width, peep.height);
        }
      }
      ctx.resetTransform();
    };

    const releaseSprite = (peep: Peep) => {
      if (!peep.sprite) return;
      peep.sprite.width = 0;
      peep.sprite.height = 0;
      peep.sprite = null;
    };

    const cacheSprite = (peep: Peep) => {
      if (peep.sprite && peep.spriteDirection === peep.scaleX) return;
      releaseSprite(peep);
      const sprite = document.createElement("canvas");
      sprite.width = Math.ceil(peep.rect[2]);
      sprite.height = Math.ceil(peep.rect[3]);
      const spriteContext = sprite.getContext("2d");
      if (!spriteContext) return;
      if (peep.scaleX === -1) {
        spriteContext.translate(sprite.width, 0);
        spriteContext.scale(-1, 1);
      }
      spriteContext.drawImage(image, ...peep.rect, 0, 0, sprite.width, sprite.height);
      peep.sprite = sprite;
      peep.spriteDirection = peep.scaleX;
    };

    const cancelSpriteCache = () => {
      if (spriteCacheTask !== null) window.cancelIdleCallback(spriteCacheTask);
      if (spriteCacheFrame !== null) cancelAnimationFrame(spriteCacheFrame);
      spriteCacheTask = null;
      spriteCacheFrame = null;
    };

    const scheduleSpriteCache = () => {
      if (!canAnimate() || !canCacheSprites() || !pendingSprites.size || spriteCacheTask !== null || spriteCacheFrame !== null) return;
      const buildSprites = (deadline?: IdleDeadline) => {
        spriteCacheTask = null;
        spriteCacheFrame = null;
        if (!canAnimate() || !canCacheSprites()) return;
        const start = performance.now();
        // Bake the flip for the native-size fast path; scaled drawing keeps the atlas's original filtering.
        while (pendingSprites.size && performance.now() - start < 4 && (!deadline || deadline.timeRemaining() > 0)) {
          const peep = pendingSprites.values().next().value!;
          pendingSprites.delete(peep);
          cacheSprite(peep);
        }
        scheduleSpriteCache();
      };
      if ("requestIdleCallback" in window) {
        spriteCacheTask = window.requestIdleCallback(buildSprites);
      } else {
        spriteCacheFrame = requestAnimationFrame(() => buildSprites());
      }
    };

    const renderFrame = () => {
      const now = performance.now();
      if (now - lastFrame < frameInterval) return;
      lastFrame = now - ((now - lastFrame) % frameInterval);
      render();
    };

    const resetPeep = (peep: Peep, initialProgress: number) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = (100 - 250 * Math.random() ** 3) * spriteScale;
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : 0;
      peep.scaleX = direction;
      if (peep.spriteDirection !== direction) releaseSprite(peep);
      peep.anchorY = startY;
      peep.initialProgress = initialProgress;
      peep.props = { startX, startY, endX };
      peep.x = startX + (endX - startX) * Math.min(peep.initialProgress * 1.025, 1);
      peep.y = startY;
    };

    const addPeepToCrowd = (initialProgress = 0) => {
      const index = Math.floor(Math.random() * availablePeeps.length);
      const peep = availablePeeps.splice(index, 1)[0];
      if (!peep) return;
      resetPeep(peep, initialProgress);
      crowd.push(peep);
      crowd.sort((first, second) => first.anchorY - second.anchorY);
      if (canCacheSprites() && !peep.sprite) pendingSprites.add(peep);
      scheduleSpriteCache();
      if (gsap) startWalk(peep);
    };

    const startWalk = (peep: Peep) => {
      if (!gsap) return;
      const timeline = gsap.timeline({ paused: true });
      const { startX, startY, endX } = peep.props;
      peep.x = startX;
      peep.y = startY;
      timeline.timeScale(0.5 + Math.random());
      timeline.to(peep, { duration: 10, x: endX, ease: "none" }, 0);
      timeline.to(peep, {
        duration: 0.25,
        repeat: 40,
        yoyo: true,
        y: startY - 10 * spriteScale,
      }, 0);
      timeline.eventCallback("onComplete", () => {
        if (disposed) return;
        const index = crowd.indexOf(peep);
        if (index !== -1) crowd.splice(index, 1);
        peep.walk = null;
        availablePeeps.push(peep);
        addPeepToCrowd();
      });
      peep.walk = timeline;
      timeline.progress(peep.initialProgress);
      if (canAnimate()) timeline.play();
    };

    const cancelScheduledStart = () => {
      if (paintFrame !== null) cancelAnimationFrame(paintFrame);
      paintFrame = null;
      if (idleTask !== null) window.cancelIdleCallback(idleTask);
      idleTask = null;
    };

    const loadAnimation = async () => {
      if (!canAnimate() || gsap || importPending) return;
      importPending = true;
      try {
        const animation = await import("gsap");
        if (disposed) return;
        gsap = animation.gsap;
        updateAnimation();
      } catch {
        // The first frame remains visible if the optional animation cannot load.
      } finally {
        importPending = false;
      }
    };

    const scheduleAnimation = () => {
      if (paintFrame !== null || idleTask !== null || importPending) return;
      // Let the static crowd paint before requesting the optional animation code.
      paintFrame = requestAnimationFrame(() => {
        paintFrame = null;
        if (!canAnimate()) return;
        if ("requestIdleCallback" in window) {
          idleTask = window.requestIdleCallback(() => {
            idleTask = null;
            void loadAnimation();
          });
        } else {
          paintFrame = requestAnimationFrame(() => {
            paintFrame = null;
            void loadAnimation();
          });
        }
      });
    };

    const updateAnimation = () => {
      if (disposed) return;
      if (!canAnimate()) {
        cancelScheduledStart();
        cancelSpriteCache();
        crowd.forEach((peep) => peep.walk?.pause());
        if (tickerAttached && gsap) {
          gsap.ticker.remove(renderFrame);
          tickerAttached = false;
        }
        return;
      }
      scheduleSpriteCache();
      if (!gsap) {
        scheduleAnimation();
        return;
      }
      crowd.forEach((peep) => {
        if (!peep.walk) startWalk(peep);
        else peep.walk.resume();
      });
      if (!tickerAttached) {
        lastFrame = performance.now();
        gsap.ticker.add(renderFrame);
        tickerAttached = true;
      }
    };

    const resize = () => {
      if (disposed || !imageReady) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      spriteScale = stage.width < 640 ? 0.38 : stage.width < 1024 ? 0.65 : 1;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(stage.width * pixelRatio);
      canvas.height = Math.round(stage.height * pixelRatio);

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      pendingSprites.clear();
      for (const peep of allPeeps) {
        if (!canCacheSprites()) releaseSprite(peep);
        peep.width = peep.rect[2] * spriteScale * sourceResolutionScale;
        peep.height = peep.rect[3] * spriteScale * sourceResolutionScale;
        peep.walk = null;
      }
      availablePeeps.push(...allPeeps);
      const crowdLimit = stage.width < 640 ? 24 : stage.width < 1024 ? 48 : allPeeps.length;
      while (availablePeeps.length && crowd.length < crowdLimit) addPeepToCrowd(Math.random());
      render();
      updateAnimation();
    };

    const scheduleResize = () => {
      if (resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        resize();
      });
    };

    image.onload = () => {
      if (disposed) return;
      imageReady = true;
      const rectWidth = image.naturalWidth / rows;
      const rectHeight = image.naturalHeight / cols;
      for (let index = 0; index < rows * cols; index += 1) {
        allPeeps.push({
          rect: [(index % rows) * rectWidth, Math.floor(index / rows) * rectHeight, rectWidth, rectHeight],
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          initialProgress: 0,
          props: { startX: 0, startY: 0, endX: 0 },
          walk: null,
          sprite: null,
          spriteDirection: 0,
        });
      }
      resize();
    };
    image.onerror = () => {
      if (disposed || sourceResolutionScale === 1) return;
      sourceResolutionScale = 1;
      image.src = src;
    };
    image.decoding = "async";
    image.src = spriteSrc;
    updateAnimationRef.current = updateAnimation;
    window.addEventListener("resize", scheduleResize);

    return () => {
      disposed = true;
      updateAnimationRef.current = null;
      image.onload = null;
      image.onerror = null;
      image.removeAttribute("src");
      cancelScheduledStart();
      cancelSpriteCache();
      pendingSprites.clear();
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", scheduleResize);
      if (tickerAttached && gsap) gsap.ticker.remove(renderFrame);
      crowd.forEach((peep) => peep.walk?.kill());
      allPeeps.forEach(releaseSprite);
    };
  }, [cols, rows, src, spriteSrc, useMobileSprite]);

  return <canvas ref={canvasRef} className="absolute bottom-0 h-[90vh] w-full" aria-hidden="true" />;
};

const Skiper39 = () => (
  <div className="relative h-full w-full bg-white text-black">
    <CrowdCanvas
      src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"
      rows={15}
      cols={7}
    />
  </div>
);

export { CrowdCanvas, Skiper39 };
export default Skiper39;
