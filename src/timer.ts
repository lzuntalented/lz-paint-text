/**
 * 定时器
 */
 export class Timer {
  private updateCallback: null | Function;
  private fps: number;
  private timeHandler: number | NodeJS.Timeout;

  constructor(fps = 1000 / 60, updateCallback: null | Function) {
      this.fps = fps;
      this.updateCallback = updateCallback;
      this.timeHandler = 0;
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
      this.timeHandler && clearTimeout(this.timeHandler as NodeJS.Timeout);
  }

  update(num: number) {
      if (this.updateCallback) {
          return this.updateCallback(num);
      }
  }

  destroy() {
      this.stopTimer();
  }
}