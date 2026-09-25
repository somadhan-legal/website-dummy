import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type ImageItem = {
  src: string;
  alt: string;
  fullScreen?: boolean;
};

type PhoneCarouselProps = {
  images: ImageItem[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

type Direction = -1 | 1;

export function PhoneCarousel({
  images,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: PhoneCarouselProps) {
  const requestedIndex = controlledIndex ?? 0;
  const activeIndex = ((requestedIndex % images.length) + images.length) % images.length;
  const direction: Direction = 1;
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  if (!images.length) return null;
  const sideDistance = isMobile ? 138 : 250;
  const motionTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 82, damping: 22, mass: 0.9 };

  const sideItems = [-1, 1].map((offset) => ({
    offset,
    image: images[(activeIndex + offset + images.length) % images.length],
  }));

  const phoneClass =
    "absolute bottom-0 overflow-hidden rounded-t-[2.6rem] border-[6px] border-b-0 border-[#292a2c] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.16)]";

  return (
    <div className="mx-auto w-full max-w-[900px] px-2 sm:px-6">
      <div className="relative flex h-[min(68svh,580px)] items-end justify-center sm:h-[min(78svh,700px)]">
        {sideItems.map(({ offset, image }) => (
          <motion.div
            key={image.src}
            initial={{ x: offset * sideDistance * 0.72, opacity: 0, scale: 0.82, rotateY: offset * -8 }}
            animate={{ x: offset * sideDistance, opacity: 0.36, scale: 0.84, rotateY: offset * -5 }}
            transition={motionTransition}
            className={`${phoneClass} z-10 h-[min(56svh,470px)] w-auto aspect-[0.462] grayscale sm:h-[min(64svh,580px)]`}
            aria-hidden="true"
          >
            <PhoneScreen image={image} />
          </motion.div>
        ))}

        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={images[activeIndex].src}
            custom={direction}
            variants={{
              enter: (dir: Direction) => ({ x: dir * sideDistance * 0.78, opacity: 0.35, scale: 0.88, rotateY: dir * -7 }),
              center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
              exit: (dir: Direction) => ({ x: dir * -sideDistance * 1.5, opacity: 0, scale: 0.82, rotateY: dir * 8 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={motionTransition}
            style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
            className={`${phoneClass} z-20 h-[min(68svh,580px)] w-auto aspect-[0.462] sm:h-[min(78svh,700px)]`}
          >
            <PhoneScreen image={images[activeIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PhoneScreen({ image }: { image: ImageItem }) {
  if (image.fullScreen) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        draggable={false}
        className="h-full w-full select-none bg-white object-contain object-top"
      />
    );
  }

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between bg-white px-8 text-[11px] font-semibold text-slate-900 sm:h-16 sm:px-12 sm:text-sm">
        <span>9:41</span>
        <span className="absolute left-1/2 top-2 h-7 w-[92px] -translate-x-1/2 rounded-full bg-[#292a2c] sm:top-2.5 sm:h-9 sm:w-[120px]" />
        <span className="flex items-center gap-1 text-[10px]">▮▮▮ ▰</span>
      </div>
      <img
        src={image.src}
        alt={image.alt}
        draggable={false}
        className="mt-14 h-[calc(100%-3.5rem)] w-full select-none object-cover object-top sm:mt-16 sm:h-[calc(100%-4rem)]"
      />
    </>
  );
}
