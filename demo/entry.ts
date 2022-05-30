import { Mode } from '../src/constants';
import { PaintText } from '../src/index'
import { Animation } from '../src/plugin'
const isProd = process.env.NODE_ENV === 'production'

const fontSize = 48
const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const painter = new PaintText(canvas, `${isProd ? '//www.lzuntalented.cn/img/paint/' : './fonts/'}gu.ttf`, { fps: 1, fontSize });
const width = canvas.width;
const height = canvas.height;

const itemPools = [
  {
    author: '许文通',
    title: '端阳采撷',
    list: [
      '玉粽袭香千舸竞',
      '艾叶黄酒可驱邪',
      '骑父稚子香囊佩',
      '粉俏媳妇把景撷',
    ]
  },
  {
    author: '文秀',
    title: '端午',
    list: [
      '节分端午自谁言',
      '万古传闻为屈原',
      '堪笑楚江空渺渺',
      '不能洗得直臣冤',
    ]
  },
  {
    author: '张耒',
    title: '和端午',
    list: [
      '竞渡深悲千载冤',
      '忠魂一去讵能还',
      '国亡身殒今何有',
      '只留离骚在世间',
    ]
  },
  {
    author: '贝琼',
    title: '已酉端午',
    list: [
      '风雨端阳生晦冥',
      '汨罗无处吊英灵',
      '海榴花发应相笑',
      '无酒渊明亦独醒',
    ]
  },
  {
    author: '陆游',
    title: '乙卯重五诗',
    list: [
      '重五山村好，榴花忽已繁',
      '粽包分两髻，艾束著危冠',
      '旧俗方储药，羸躯亦点丹',
      '日斜吾事毕，一笑向杯盘',
    ]
  }
]

function main(idx = 0) {
  const item = itemPools[idx]

  painter.destory();
  painter.checkReady().then(() => {
    const wordSpace = fontSize * 1.2;
    const start = {
      x: width - wordSpace * 2.5,
      y: (height - wordSpace * item.list[0].length) / 2
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

    painter.render();
  })
}

main();

const button = document.querySelector('#button') as HTMLDivElement;
if (button) {
  button.onclick = () => {
    const idx = Math.floor(Math.random() * itemPools.length)
    main(idx) 
  }
}