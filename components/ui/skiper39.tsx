"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = (array: unknown[]) => randomRange(0, array.length) | 0;
    const removeFromArray = <T,>(array: T[], index: number) => array.splice(index, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = <T,>(array: T[]) => array[randomIndex(array)];

    const resetPeep = ({ stage, peep }: { stage: { width: number; height: number }; peep: Peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = (100 - 250 * gsap.parseEase("power2.in")(Math.random())) * spriteScale;
      const startY = stage.height - peep.height + offsetY;
      const startX = direction === 1 ? -peep.width : stage.width + peep.width;
      const endX = direction === 1 ? stage.width : 0;

      peep.scaleX = direction;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: Peep; props: { startY: number; endX: number } }) => {
      const xDuration = 10;
      const yDuration = 0.25;
      const timeline = gsap.timeline();

      timeline.timeScale(randomRange(0.5, 1.5));
      timeline.to(peep, { duration: xDuration, x: props.endX, ease: "none" }, 0);
      timeline.to(
        peep,
        { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: props.startY - 10 * spriteScale },
        0,
      );

      return timeline;
    };

    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: gsap.core.Timeline | null;
      setRect: (rect: number[]) => void;
      render: (context: CanvasRenderingContext2D) => void;
    };

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (nextRect) => {
          peep.rect = nextRect;
          peep.width = nextRect[2] * spriteScale;
          peep.height = nextRect[3] * spriteScale;
        },
        render: (context) => {
          context.save();
          context.translate(peep.x, peep.y);
          context.scale(peep.scaleX, 1);
          context.drawImage(
            peep.image,
            peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3],
            0, 0, peep.width, peep.height,
          );
          context.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    const image = document.createElement("img");
    const stage = { width: 0, height: 0 };
    let spriteScale = 1;
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    let disposed = false;

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      if (!peep) return;

      const walk = normalWalk({ peep, props: resetPeep({ peep, stage }) });
      walk.eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((first, second) => first.anchorY - second.anchorY);
    };

    const initCrowd = () => {
      const crowdLimit = stage.width < 640 ? 24 : stage.width < 1024 ? 48 : availablePeeps.length;
      while (availablePeeps.length && crowd.length < crowdLimit) {
        addPeepToCrowd();
        crowd[crowd.length - 1]?.walk?.progress(Math.random());
      }
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      crowd.forEach((peep) => peep.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      spriteScale = stage.width < 640 ? 0.38 : stage.width < 1024 ? 0.65 : 1;
      canvas.width = stage.width * window.devicePixelRatio;
      canvas.height = stage.height * window.devicePixelRatio;

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      allPeeps.forEach((peep) => peep.setRect(peep.rect));
      availablePeeps.push(...allPeeps);
      initCrowd();
    };

    const init = () => {
      if (disposed) return;
      const rectWidth = image.naturalWidth / rows;
      const rectHeight = image.naturalHeight / cols;

      for (let index = 0; index < rows * cols; index += 1) {
        allPeeps.push(
          createPeep({
            image,
            rect: [
              (index % rows) * rectWidth,
              ((index / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }

      resize();
      gsap.ticker.add(render);
    };

    image.onload = init;
    image.src = src;
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      image.onload = null;
      image.onerror = null;
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
    };
  }, [cols, rows, src]);

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
