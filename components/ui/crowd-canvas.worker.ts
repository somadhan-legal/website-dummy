import type { CrowdRenderFrame, CrowdSpriteRect, CrowdWorkerMessage, CrowdWorkerReply } from "./crowd-canvas.protocol";

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<CrowdWorkerMessage>) => void) | null;
  postMessage: (message: CrowdWorkerReply) => void;
  close: () => void;
};

let canvas: OffscreenCanvas | null = null;
let context: OffscreenCanvasRenderingContext2D | null = null;
let image: ImageBitmap | null = null;
let rects: CrowdSpriteRect[] = [];
const sprites = new Map<number, { canvas: OffscreenCanvas; direction: number }>();

const releaseSprites = () => {
  for (const sprite of sprites.values()) {
    sprite.canvas.width = 0;
    sprite.canvas.height = 0;
  }
  sprites.clear();
};

const dispose = () => {
  releaseSprites();
  image?.close();
  image = null;
  if (canvas) {
    canvas.width = 0;
    canvas.height = 0;
  }
  canvas = null;
  context = null;
  rects = [];
};

const fail = () => {
  dispose();
  workerScope.postMessage({ type: "error" });
  workerScope.close();
};

const spriteFor = (index: number, direction: number) => {
  const existing = sprites.get(index);
  if (existing?.direction === direction) return existing.canvas;
  if (existing) {
    existing.canvas.width = 0;
    existing.canvas.height = 0;
    sprites.delete(index);
  }
  const rect = rects[index];
  const sprite = new OffscreenCanvas(Math.ceil(rect[2]), Math.ceil(rect[3]));
  const spriteContext = sprite.getContext("2d");
  if (!spriteContext || !image) return null;
  if (direction === -1) {
    spriteContext.translate(sprite.width, 0);
    spriteContext.scale(-1, 1);
  }
  spriteContext.drawImage(image, ...rect, 0, 0, sprite.width, sprite.height);
  // Only the current orientation is retained, bounded by the original atlas size.
  sprites.set(index, { canvas: sprite, direction });
  return sprite;
};

const drawFrame = (frame: CrowdRenderFrame) => {
  if (!canvas || !context || !image) throw new Error("Crowd renderer is not initialized");
  if (canvas.width !== frame.width) canvas.width = frame.width;
  if (canvas.height !== frame.height) canvas.height = frame.height;
  if (!frame.cacheSprites && sprites.size) releaseSprites();
  context.resetTransform();
  context.clearRect(0, 0, canvas.width, canvas.height);
  const { positions, pixelRatio } = frame;
  for (let offset = 0; offset < positions.length; offset += 6) {
    const index = positions[offset];
    const x = positions[offset + 1];
    const y = positions[offset + 2];
    const width = positions[offset + 3];
    const height = positions[offset + 4];
    const direction = positions[offset + 5];
    const sprite = frame.cacheSprites ? spriteFor(index, direction) : null;
    if (sprite) {
      const left = direction === 1 ? x : x - width;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, left * pixelRatio, y * pixelRatio);
      context.drawImage(sprite, 0, 0, width, height);
    } else {
      context.setTransform(pixelRatio * direction, 0, 0, pixelRatio, x * pixelRatio, y * pixelRatio);
      context.drawImage(image, ...rects[index], 0, 0, width, height);
    }
  }
  context.resetTransform();
  workerScope.postMessage({ type: "drawn", sequence: frame.sequence });
};

workerScope.onmessage = ({ data }) => {
  try {
    if (data.type === "init") {
      dispose();
      canvas = data.canvas;
      image = data.image;
      rects = data.rects;
      context = canvas.getContext("2d");
      if (!context) throw new Error("Worker 2D canvas is unavailable");
      canvas.addEventListener("contextlost", fail, { once: true });
      workerScope.postMessage({ type: "initialized" });
    } else if (data.type === "frame") {
      drawFrame(data);
    } else {
      dispose();
      workerScope.close();
    }
  } catch {
    fail();
  }
};

try {
  const probe = new OffscreenCanvas(1, 1);
  if (!probe.getContext("2d")) throw new Error("Worker 2D canvas is unavailable");
  probe.width = 0;
  probe.height = 0;
  workerScope.postMessage({ type: "ready" });
} catch {
  fail();
}
