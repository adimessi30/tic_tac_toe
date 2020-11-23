import React from "react";

function Square({ squareIndex, squareValue, onSquareClick }) {
  return (
    <button style={squareStyle} onClick={() => onSquareClick(squareIndex)}>
      {squareValue}
    </button>
  );
}

const squareStyle = {
  fontSize: "50px",
};

export default Square;
