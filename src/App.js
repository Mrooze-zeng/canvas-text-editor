import { useEffect, useRef } from "react";
import "./App.css";
import Editor from "./editor";

function App() {
  const ref = useRef();

  const editor = new Editor({});

  useEffect(() => {
    editor.setCanvas(ref.current);
  });

  const handleKeyDown = function (e) {
    if (e.keyCode === 8) {
      editor.deleteText();
    } else {
      editor.textInput(e.key);
    }
  };

  const handleFocus = function (e) {
    editor.setBlinkShow().draw();
  };

  const handleBlur = function (e) {
    editor.setBlinkStop().draw();
  };

  const handleClick = function (e) {
    editor.setCursorTo(e);
  };

  return (
    <div>
      <canvas
        ref={ref}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        tabIndex={1}
        width={800}
        height={600}
        style={{ outline: "none" }}
      ></canvas>
    </div>
  );
}

export default App;
