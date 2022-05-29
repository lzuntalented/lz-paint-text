import { Point } from "./type";

export default function AnimationCircle(ctx: CanvasRenderingContext2D, point: Point) {
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
  ctx.stroke();
}