export default class Blink {
  constructor(ctx = null, redraw = function () {}) {
    this.ctx = ctx;
    this.isShowing = false;
    this.timer = null;
    this.timestamp = 0;
    this.height = 25;
    this.isStopped = true;
    this.style = "#ececec";
    this.redraw = redraw;
  }
  setHeight(height = 25) {
    this.height = height;
    return this;
  }
  draw(pos = { x: 0, y: 0 }) {
    let offset = 0;
    if (this.isShowing) {
      return this;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x + offset, pos.y);
    this.ctx.lineTo(pos.x + offset, pos.y + this.height);
    this.ctx.closePath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.style;
    this.ctx.stroke();
    return this;
  }
  setShow(pos = { x: 0, y: 0 }, show = true) {
    this.isShowing = !show;
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    this.isStopped = false;
    this.draw(pos);
  }
  getIsStopped() {
    return this.isStopped;
  }
  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.isShowing = true;
    this.isStopped = true;
    return this.isStopped;
  }
  update() {
    if (this.getIsStopped()) {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      let timestamp = Date.now();
      if (timestamp - this.timestamp >= 600) {
        this.timestamp = Date.now();
        this.isShowing = !this.isShowing;
        this.redraw();
      }
    }, 600);
    return this;
  }
}
