import React from "react";

const Controls = ({ onStart, onStop, onPause }) => {
  return (
    <div>
      <button onClick={onStart}>Start Recording</button>
      <button onClick={onPause}>Pause Recording</button>
      <button onClick={onStop}>Stop Recording</button>
    </div>
  );
};

export default Controls;
