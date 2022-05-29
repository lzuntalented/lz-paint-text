import { Point } from "./type";

export default function AnimationCircle(ctx: CanvasRenderingContext2D, point: Point) {
  const {x, y} = point
  const paintTopLine = 20;
  const paintBodyLine = 50;

  const topA = {
      x: x + paintTopLine * Math.cos(Math.PI / 3),
      y: y - paintTopLine * Math.sin(Math.PI / 3)
  };
  const TopB = {
      x: x + paintTopLine * Math.sin(Math.PI / 3),
      y: y - paintTopLine * Math.cos(Math.PI / 3)
  };
  const bodyA = {
      x: topA.x + paintBodyLine * Math.cos(Math.PI / 4),
      y: topA.y - paintBodyLine * Math.cos(Math.PI / 4)
  }
  const bodyB = {
      x: TopB.x + paintBodyLine * Math.cos(Math.PI / 4),
      y: TopB.y - paintBodyLine * Math.cos(Math.PI / 4)
  }
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(topA.x, topA.y);
  ctx.lineTo(TopB.x, TopB.y);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(topA.x, topA.y);
  ctx.lineTo(TopB.x, TopB.y);
  ctx.lineTo(bodyB.x, bodyB.y);
  ctx.lineTo(bodyA.x, bodyA.y);
  ctx.closePath();
  ctx.stroke();
}