import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import type { SpringOptions } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0, damping: 28, stiffness: 180 },
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);
  const left = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const top = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    setParentElement(spotlightRef.current?.parentElement ?? null);
  }, []);

  const updatePosition = useCallback((event: PointerEvent) => {
    if (!parentElement || event.pointerType === "touch") return;
    const bounds = parentElement.getBoundingClientRect();
    mouseX.set(event.clientX - bounds.left);
    mouseY.set(event.clientY - bounds.top);
  }, [mouseX, mouseY, parentElement]);

  useEffect(() => {
    if (!parentElement) return;
    const handleEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        updatePosition(event);
        setIsHovered(true);
      }
    };
    const handleLeave = () => setIsHovered(false);
    parentElement.addEventListener("pointermove", updatePosition);
    parentElement.addEventListener("pointerenter", handleEnter);
    parentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      parentElement.removeEventListener("pointermove", updatePosition);
      parentElement.removeEventListener("pointerenter", handleEnter);
      parentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [parentElement, updatePosition]);

  return (
    <motion.div
      ref={spotlightRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-[1] rounded-full blur-2xl transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        left,
        top,
        background: "radial-gradient(circle at center, rgba(93,184,186,.48) 0%, rgba(93,184,186,.24) 35%, transparent 75%)",
      }}
    />
  );
}
