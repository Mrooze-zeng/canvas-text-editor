export default class Words {
  constructor(ctx = null, width = 0, padding = 0) {
    this.words = [];
    this.ctx = ctx;
    this.width = width;
    this.padding = padding;
  }
  add(index = 0, word = {}) {
    this.currentWordId = word.id;
    this.words.splice(index, 0, word);
    // this.words.push(word);
    console.log(this.words);
    this.words = this.resetPosition();
    return this;
  }
  resetPosition() {
    let words = [...this.words];
    let result = words.reduce(
      (prev, word, i) => {
        word.position.x = prev.width;
        word.position.y = prev.height;
        prev.width += word.metrics.width;
        if (prev.width > this.width - 2 * this.padding) {
          prev.height += word.metrics.height;
          prev.width = this.padding;
        }
        prev.words.push(word);
        return prev;
      },
      {
        words: [],
        width: this.padding,
        height: this.padding,
      },
    );
    return result.words;
  }
  currentWord(position = { x: 0, y: 0 }) {
    //todo:
    return this.words[this.words.length - 1];
  }
  getCurrentWord() {
    return [
      this.words.findIndex((word) => {
        return word.id === this.currentWordId;
      }),
      this.words.find((word) => {
        return word.id === this.currentWordId;
      }),
    ];
  }
  getPrevWord() {
    let index = this.words.findIndex((word) => {
      return word.id === this.currentWordId;
    });
    if (index !== -1) {
      index -= 1;
      this.currentWordId = this.words[index].id;
    }
  }
  getCurrentWordFromPosition(position = { x: 0, y: 0 }) {
    let currentWord = this.words.find((word) => {
      return (
        word.position.x <= position.x &&
        word.position.x + word.metrics.width >= position.x &&
        word.position.y <= position.y &&
        word.position.y + word.metrics.height >= position.y
      );
    });
    this.currentWordId = currentWord?.id;
    this.getPrevWord();
    return this.getCurrentWord();
  }
  size() {
    return this.words.length;
  }
  pop() {
    this.words.pop();
    return this.words;
  }
  last() {
    return this.words[this.words.length - 1] || {};
  }
  forEach(fn = function () {}) {
    this.words.forEach(fn);
  }
}
