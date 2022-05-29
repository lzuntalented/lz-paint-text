import { Mode } from './constants';
import { PaintText } from './index'
import { Animation } from './plugin'

const fontSize = 48
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const painter = new PaintText(canvas, '/fonts/gu.TTF', { fps: 1, fontSize });
const width = canvas.width;
const height = canvas.height;

const item = {
  author: '许文通',
  title: '端阳采撷',
  list: [
    '玉粽袭香千舸竞',
    '艾叶黄酒可驱邪',
    '骑父稚子香囊佩',
    '粉俏媳妇把景撷',
  ]
}

painter.checkReady().then(() => {
  const wordSpace = fontSize * 1.2;
  const start = {
    x: width - wordSpace * 2.5,
    y: wordSpace
  }
  const config = {
    stroke: '#1d1314',
    mode: Mode.default,
    animation: Animation.circle
  }

  item.author.split('').forEach((it, i) => {
    painter.addText((it), {
      x: start.x + (wordSpace * 0.8),
      y: (height - (wordSpace * item.title.length)) / 2 + (item.title.length - 1) * wordSpace + wordSpace * i
    }, {...config, fontSize: 32});
  })

  item.title.split('').forEach((it, i) => {
    painter.addText((it), {
      x: start.x + (wordSpace * 1.5),
      y: (height - (wordSpace * item.title.length)) / 2 + wordSpace * i
    }, config);
  })

  item.list.forEach((item, j) => {
    item.split('').forEach((it, i) => {
      painter.addText((it), {
        x: start.x - (wordSpace * (j + 1)),
        y: wordSpace * (i + (j % 2)) + start.y
      }, config);
    })
  })
  // painter.addText(`相`, {
  //   x: 40,
  //   y: 150
  // },
  //   {
  //     stroke: 'green',
  //     mode: Mode.default,
  //     animation: 1
  //   });
    console.log(painter.drawQueue)
  painter.render();
})