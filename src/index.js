const Mode = {
    default: 0, // 默认所有文字一起画
    single: 1, // 单字符绘制
    singleSplit: 2, // 拆分单字符
    defaultSplit: 3
}
/**
 * 定时器
 */
class LzTimer {
    constructor(fps = 1000 / 60, updateCallback = null) {
        this.fps = fps;
        this.updateCallback = updateCallback;
    }

    startTimer(index = 1) {
        this.stopTimer();
        this.timeHandler = setTimeout(() => {
            const tag = this.update(index);
            if (tag !== false) {
                this.startTimer(index + 1);
            }
        }, this.fps);
    }

    stopTimer() {
        this.timeHandler && clearTimeout(this.timeHandler);
    }

    update() {
        return this.updateCallback();
    }

    destroy() {
        this.stopTimer();
    }
}

class LzPaintText {
    constructor(ctx, ttfPath, config = {}) {
        this.context = ctx;
        this.ttf = ttfPath;

        this.font = null;
        this.drawHandlers = [];
        this.drawQueue = [];


        this.changeTTF(this.ttf);

        this._default = {
            mode: 0,
            stroke: 'red',
            fill: 'blue',
            afterDrawPath: null,
            fps: 1000 / 60,
            fontSize: 72
        }
        this._default = Object.assign(this._default, config);
    }

    checkReady() {
        new LzTimer(this._default.fps, () => {
            if (this.font) {
                return false;
            }
        });
    }

    // draw(text, point, config) {
    //     if (!this.font) {
    //         const time = new LzTimer(this._default.fps, () => {
    //             if (this.font) {
    //                 this.draw(text, point, config);
    //                 return false;
    //             }
    //         });
    //         time.startTimer();
    //         return ;
    //     }

    //     const list = this.font.getPath(text, point.x, point.y, this._default.fontSize);
        
    //     const index = this.drawHandlers.length;
    //     // const handler = new LzTimer(this._default.fps, this.update.bind(this, index));
    //     this.drawHandlers.push({
    //         timer: handler,
    //         drawCmd: list.commands,
    //         drawIndex: 0,
    //         point,
    //         config
    //     });
    //     handler.startTimer();
    // }

    addText(text, point, config = {}) {
        if (!this.font) {
            const time = new LzTimer(this._default.fps, () => {
                if (this.font) {
                    this.addText(text, point, config);
                    return false;
                }
            });
            time.startTimer();
            return ;
        }
        
        const fontSize = config.fontSize || this._default.fontSize;
        const list = this.font.getPath(text, point.x, point.y, fontSize);
        const mode = config.mode || this._default.mode;
        
        this.drawQueue.push({
            cmd: list.commands,
            point,
            config,
            index: 0,
            stroke: config.stroke || this._default.stroke
        });
    }

    changeTTF(path) {
        opentype.load(path, (err, font) => {
            this.font = font;
        });
    }

    render() {
        if (!this.font) {
            const time = new LzTimer(this._default.fps, () => {
                if (this.font) {
                    this.render();
                    return false;
                }
            });
            time.startTimer();
            return ;
        }

        this.saveLastCanvasImage();
        const handler = new LzTimer(this._default.fps, this.update.bind(this));
        handler.startTimer();
    }

    saveLastCanvasImage() {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
        const width = canvas.width;
        const height = canvas.height;

        const dataURL = ctx.getImageData(0, 0, width, height);
        offCtx.putImageData(dataURL, 0, 0);
        this.dataURL = dataURL;
    }

    restoreCanvasImage() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(this.dataURL, 0, 0);
    }

    update(idx) {
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

    drawAnimate(item) {
        const list = item.cmd;
        const idx = item.index;

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
            var it = list[idx];
            
            if (it.type !== 'Z') {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.arc(it.x, it.y, 3, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }     
}

// export default LzPaintText;

const ctx = canvas.getContext('2d');
const painter = new LzPaintText(ctx, 'fonts/minicaiyun.TTF');
painter.addText('绘画', {
    x: 40, 
    y: 150
},
{
    stroke: 'green'
});
painter.addText('Hello Word', {
    x: 40, 
    y: 250
})
painter.render();
