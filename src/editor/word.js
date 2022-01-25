export default class Word {
  constructor({
    text = "",
    fontText = "48px serif",
    ctx = null,
    position = { x: 0, y: 0 },
  } = {}) {
    this.id = Date.now();
    this.ctx = ctx;
    this.text = text;
    this.font = fontText;
    this.metrics = this.measureText(text, fontText);
    this.position = position;
  }
  setPosition(position = { x: 0, y: 0 }) {
    this.position = { ...position };
    return this.position;
  }
  measureText(text = "", fontText = "48px serif") {
    let metrics = {};

    this.ctx.font = fontText;
    this.ctx.textBaseline = "top";
    metrics.width = this.ctx.measureText(text).width;

    let textSpan = document.createElement("span");
    textSpan.innerHTML = text;
    textSpan.style.font = fontText;

    let block = document.createElement("div");
    block.style.display = "inline-block";
    block.style.width = "1px";
    block.style.height = "0px";

    let div = document.createElement("div");
    div.appendChild(textSpan);
    div.appendChild(block);

    let body = document.body;
    body.appendChild(div);

    metrics.ascent = -1;
    metrics.descent = -1;
    metrics.height = -1;

    try {
      block.style["vertical-align"] = "baseline";
      metrics.ascent = block.offsetTop - textSpan.offsetTop;
      block.style["vertical-align"] = "bottom";
      metrics.height = block.offsetTop - textSpan.offsetTop;
      metrics.descent = metrics.height - metrics.ascent;
    } finally {
      document.body.removeChild(div);
    }

    return metrics;
  }
}
