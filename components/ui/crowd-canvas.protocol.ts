export type CrowdSpriteRect = [number, number, number, number];

export interface CrowdRenderFrame {
  type: "frame";
  sequence: number;
  width: number;
  height: number;
  pixelRatio: number;
  cacheSprites: boolean;
  // Each peep uses six values: sprite index, x, y, width, height, direction.
  positions: Float64Array;
}

export type CrowdWorkerMessage =
  | { type: "init"; canvas: OffscreenCanvas; image: ImageBitmap; rects: CrowdSpriteRect[] }
  | CrowdRenderFrame
  | { type: "dispose" };

export type CrowdWorkerReply =
  | { type: "ready" }
  | { type: "initialized" }
  | { type: "drawn"; sequence: number }
  | { type: "error" };
