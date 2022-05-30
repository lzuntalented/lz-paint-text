import opentype from 'opentype.js'
import { Mode, Animation } from './constants'
import { animates } from './plugin'
import { PaintPlugin } from './plugin/type'
import {Timer} from './timer'

interface Point {
  x: number
  y: number
}

interface PaintTextConfig {
  mode: number
  stroke: string
  fill: string
  afterDrawPath?: () => void
  fps: number
  fontSize: number
  animation?: number
}

interface PaintTextConfigDrawQueue extends PaintTextConfig {
  point: Point
  index: number
  cmd: opentype.PathCommand[]
}

export class PaintText {
  config: PaintTextConfig = {
    mode: 0,
    stroke: 'red',
    fill: 'blue',
    // afterDrawPath: null,
    fps: 1000 / 60,
    fontSize: 72
  }

  ttf: string
  font: opentype.Font | undefined
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  offCanvas: HTMLCanvasElement | undefined
  offContext: CanvasRenderingContext2D | undefined
  offDataURL?: ImageData

  drawQueue = [] as PaintTextConfigDrawQueue[]
  
  animations = {} as {
    [k: number]: PaintPlugin
  }

  renderHandler: Timer | undefined

  constructor(canvas: HTMLCanvasElement, ttfPath: string, config: Partial<PaintTextConfig>) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d') as CanvasRenderingContext2D
      this.ttf = ttfPath;

      // this.drawHandlers = [];
      // this.drawQueue = [];
      this.changeTTF(this.ttf);
      this.config = {...this.config, ...config}
  }

  changeTTF(path: string) {
    opentype.load(path, (err, font) => {
      if (!err) {
        this.font = font;
      }
    });
  }

  async checkReady(timeout = 10) {
    return new Promise((res, rej) => {
      if (this.font) res(1);
      (new Timer(this.config.fps, (i: number) => {
        if (this.config.fps * i > timeout * 1000) {
          rej()
          return;
        } else {
          if (this.font) {
            res(1)
          }
        }
      })).startTimer();
    })
  }

  addText(text: string, point: Point, config: Partial<PaintTextConfig>) {
      if (!this.font) {
          console.error('请先加载文件')
          return ;
      }
      
      const defaultConfig = {
          point,
          index: 0,
          ...this.config,
          ...config
      };
      const {fontSize, mode} = defaultConfig
      if (mode === Mode.single) {
          const list = this.font.getPaths(text, point.x, point.y, fontSize);
          list.forEach(it => {
              this.drawQueue.push({cmd: it.commands, ...defaultConfig});
          });
      } else if (mode === Mode.default || mode === Mode.defaultSplit) {
          const list = this.font.getPath(text, point.x, point.y, fontSize);
          if (mode === Mode.default) {
              this.drawQueue.push({cmd: list.commands, ...defaultConfig});
          } else {
              const commands = list.commands;
              this.cmdToGroup(commands).forEach(it => {
                  this.drawQueue.push({cmd: it, ...defaultConfig});
              });
          }            
      }
  }

  cmdToGroup(list: opentype.PathCommand[]) {
      const result = [] as opentype.PathCommand[][];
      let tmp = [] as opentype.PathCommand[];
      list.forEach(cmd => {
          if (cmd.type === 'Z') {
              tmp.push(cmd);
              result.push(tmp);
              tmp = [];
          } else {
              tmp.push(cmd);
          }
      });
      return result;
  }

  render() {
    if (!this.font) {
      console.error('请先加载文件')
      return ;
    }

    this.saveLastCanvasImage();
    const handler = new Timer(this.config.fps, this.update.bind(this));
    this.renderHandler = handler;
    handler.startTimer();
  }

  // 保存绘制之前canvas图像
  saveLastCanvasImage() {
      if (!this.offCanvas) {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d') as CanvasRenderingContext2D;
        offCanvas.width = this.canvas.width;
        offCanvas.height = this.canvas.height;

        this.offCanvas = offCanvas;
        this.offContext = offCtx;
      }

      const width = this.offCanvas.width;
      const height = this.offCanvas.height;

      const dataURL = this.context.getImageData(0, 0, width, height);
      this.offContext?.putImageData(dataURL, 0, 0);
      this.offDataURL = dataURL;
  }

  // 恢复到未绘制之前图像
  restoreCanvasImage() {
    if (this.offCanvas && this.offDataURL) { 
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.putImageData(this.offDataURL, 0, 0);
    }
  }

  /**
   * 更新
   * @param {Number} idx 
   */
  update(idx: number) {
      this.restoreCanvasImage();
      this.drawQueue.forEach(it => {
          const index = it.index;
          const drawCmd = it.cmd;
          if (index >= drawCmd.length) {
              it.index -= 1;
              this.drawAnimate(it);
              return false;
          }
          this.drawAnimate(it);
          it.index += 1;
      })
  }

  /**
   * 绘制每一个路径
   * @param {Object} item 
   */
  drawAnimate(item: PaintTextConfigDrawQueue) {
      const list = item.cmd;
      const idx = item.index;
      const ctx = this.context;

      ctx.strokeStyle = item.stroke;
      ctx.beginPath();
      for (let i = 0; i <= idx; i += 1) {
          const cmd = list[i];
          if (cmd.type === 'M') {
              ctx.moveTo(cmd.x, cmd.y);
          } else if (cmd.type === 'L') {
              ctx.lineTo(cmd.x, cmd.y);
          } else if (cmd.type === 'C') {
              ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          } else if (cmd.type === 'Q') {
              ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
          } else if (cmd.type === 'Z') {
              ctx.closePath();
          }
      }
      ctx.stroke();

      if (idx >= 0) {
        const it = list[idx];
        if (it.type !== 'Z') {
          const func = animates[item.animation as number];
          if (func) {
            func(ctx, {x: it.x, y: it.y})
          }
        }
      }
  }  

  destory() {
    this.renderHandler?.destroy();
    this.drawQueue = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.offContext?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.offDataURL = undefined;
  }  
}