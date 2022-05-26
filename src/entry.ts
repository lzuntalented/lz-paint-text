import { Mode } from './constants';
import { PaintText } from './index'

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const painter = new PaintText(canvas, '/fonts/minicaiyun.TTF', { fps: 10, fontSize: 48 });

painter.checkReady().then(() => {
  painter.addText(`却`, {
    x: 40,
    y: 50
  },
    {
      stroke: 'green',
      mode: Mode.default,
      animation: 1
    });
  painter.addText(`相`, {
    x: 40,
    y: 150
  },
    {
      stroke: 'green',
      mode: Mode.default,
      animation: 1
    });
    console.log(painter.drawQueue)
  painter.render();
})