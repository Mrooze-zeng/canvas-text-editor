import Blink from "./blink";
import Word from "./word";
import Words from "./words";

export default class Editor {
  constructor({
    canvas = null,
    padding = 25,
    placeholder = "Please enter some text...",
  } = {}) {
    canvas && this.setCanvas(canvas);
    this.currentPosition = {
      x: padding,
      y: padding,
    };
    this.blink = null;
    this.padding = padding;
    this.placeholder = placeholder;
  }
  setCanvas(canvas) {
    if (canvas) {
      this.canvas = canvas;
      this.ctx = canvas?.getContext("2d");
      this.setCanvasRatio(canvas);
      this.words = new Words(this.ctx, this.width, this.padding);
      this.blink = new Blink(this.ctx, this.draw.bind(this));
      this.drawPlaceholder();
    }
  }
  setCanvasRatio(canvas) {
    this.width = canvas.width || 0;
    this.height = canvas.height || 0;
    this.ratio = this.getPixelRatio();
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = canvas.width * this.ratio;
    canvas.height = canvas.height * this.ratio;
    this.ctx.scale(this.ratio, this.ratio);
  }
  getPixelRatio() {
    var backingStore =
      this.ctx?.backingStorePixelRatio ||
      this.ctx?.webkitBackingStorePixelRatio ||
      this.ctx?.mozBackingStorePixelRatio ||
      this.ctx?.msBackingStorePixelRatio ||
      this.ctx?.oBackingStorePixelRatio ||
      this.ctx?.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
  getPosition(target, event) {
    let rect = target.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  setPositionFromEvent(event) {
    this.currentPosition = this.getPosition(event.target, event);
    return this.currentPosition;
  }
  setCursorTo(event) {
    const position = this.getPosition(event.target, event);

    const [index, word] = this.words.getCurrentWordFromPosition(position);

    if (index > -1) {
      this.setPosition({
        x: word.position.x + word.metrics.width,
        y: word.position.y,
      });
    }
  }
  setPosition(position = { x: 0, y: 0 }) {
    this.currentPosition = { ...position };
    return this.currentPosition;
  }
  movePosition({ x = 0, y = 0 }) {
    this.currentPosition = {
      x: Math.ceil(this.currentPosition.x + x),
      y: Math.ceil(this.currentPosition.y + y),
    };
  }
  textInput(text = "") {
    let word = new Word({
      text,
      position: { ...this.currentPosition },
      ctx: this.ctx,
    });
    let [i] = this.words.getCurrentWord();
    this.words.add(i + 1, word);
    this.setPosition({
      x: word.position.x + word.metrics.width,
      y: word.position.y,
    });
    this.draw();
  }
  deleteText() {
    let current = this.words.currentWord(this.currentPosition);
    if (!current) return;
    this.setPosition({
      x: current.position.x,
      y: current.position.y,
    });
    this.words.pop();
    this.draw();
  }
  drawText() {
    this.words.forEach((word) => {
      this.ctx.fillStyle = "black";
      this.ctx.font = word.fontText;
      this.ctx.fillText(word.text, word.position.x, word.position.y);
    });
  }
  setBlinkShow(show = true) {
    this.blink.setShow(this.currentPosition, show);
    return this;
  }
  setBlinkStop(stop = true) {
    this.blink.stop(stop);
    return this;
  }
  drawPlaceholder() {
    const isNotBlinking = this.blink.getIsStopped();
    if (isNotBlinking && this.words.size() === 0) {
      let placeholder = new Word({
        text: this.placeholder,
        position: { ...this.currentPosition },
        ctx: this.ctx,
      });
      this.ctx.fillStyle = "#ececec";
      this.ctx.font = placeholder.fontText;
      this.ctx.fillText(
        placeholder.text,
        placeholder.position.x,
        placeholder.position.y,
      );
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawPlaceholder();
    this.drawText();
    this.blink.setHeight(48).draw(this.currentPosition).update();
  }
}
