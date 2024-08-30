import React from "react";

const Controls = ({ onStart, onStop, onPause }) => {
  return (
    <div className="my-2 flex justify-center">
      <button
        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onStart}
      >
        Start Recording
      </button>
      <button
        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onPause}
      >
        Pause Recording
      </button>
      <button
        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={onStop}
      >
        Stop Recording
      </button>
    </div>
  );
};

export default Controls;
