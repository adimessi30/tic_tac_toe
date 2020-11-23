import React, { useDebugValue, useEffect, useState } from "react";
import Square from "./Square";
import { hasWinner, hasMoves } from "./helperUtils";
import "./Board.css";

function Board() {
  // Wrapper function on useState to allow hook identification
  const useStateWithLabel = (initialValue, name) => {
    const [value, setValue] = useState(initialValue);
    useDebugValue(`${name}: ${value}`);
    return [value, setValue];
  };

  // Toggled states
  const [clickedSquare, setClickedSquare] = useStateWithLabel(
    null,
    "clickedSquare"
  );
  const [isXNext, setIsXNext] = useStateWithLabel(true, "isXNext");
  const [jumpToMoveIndex, setJumpToMoveIndex] = useStateWithLabel(
    null,
    "jumpToMoveIndex"
  );
  const [shouldResetBoard, setShouldResetBoard] = useStateWithLabel(
    false,
    "shouldResetBoard"
  );
  const [winner, setWinner] = useStateWithLabel(null, "winner");

  // Storage states
  const [winCount, setWinCount] = useStateWithLabel([0, 0], "winCount");
  const [board, setBoard] = useStateWithLabel(Array(9).fill(null), "board");
  const [moveHistory, setMoveHistory] = useStateWithLabel([], "moveHistory");

  // Square click tracking
  useEffect(() => {
    if (!winner && clickedSquare !== null && board[clickedSquare] === null) {
      const squareValue = isXNext ? "X" : "O";
      const updatedBoard = board.map((boardSquareValue, boardSquareIndex) =>
        boardSquareIndex === clickedSquare ? squareValue : boardSquareValue
      );
      setBoard(updatedBoard);
      setMoveHistory((prevMoveHistory) => [
        ...prevMoveHistory,
        [isXNext, updatedBoard],
      ]);
      setIsXNext(!isXNext);
    }
    setClickedSquare(null);
  }, [
    board,
    clickedSquare,
    isXNext,
    winner,
    setClickedSquare,
    setBoard,
    setMoveHistory,
    setIsXNext,
  ]);

  // Winner tracking
  useEffect(() => {
    if (!winner && hasWinner(board)) {
      const squareValue = moveHistory[moveHistory.length - 1][0] ? "X" : "O";
      setWinner(squareValue);
      setWinCount((prevWinCount) =>
        moveHistory[moveHistory.length - 1][0]
          ? [prevWinCount[0] + 1, prevWinCount[1]]
          : [prevWinCount[0], prevWinCount[1] + 1]
      );
      setMoveHistory((prevMoveHistory) =>
        [...prevMoveHistory].slice(0, moveHistory.length - 1)
      );
    }
  }, [board, winner, moveHistory, setWinner, setWinCount, setMoveHistory]);

  // Jump to move handler
  useEffect(() => {
    if (
      jumpToMoveIndex &&
      jumpToMoveIndex < moveHistory.length - 1 &&
      moveHistory[jumpToMoveIndex]
    ) {
      setIsXNext(!moveHistory[jumpToMoveIndex][0]);
      setBoard(moveHistory[jumpToMoveIndex][1]);
      setMoveHistory((prevMoveHistory) =>
        [...prevMoveHistory].slice(0, jumpToMoveIndex + 1)
      );
      setWinner(null);
    }
    setJumpToMoveIndex(null);
  }, [
    jumpToMoveIndex,
    moveHistory,
    setBoard,
    setIsXNext,
    setMoveHistory,
    setWinner,
    setJumpToMoveIndex,
  ]);

  // Reset board handler
  useEffect(() => {
    if (shouldResetBoard && moveHistory.length > 0) {
      setMoveHistory([]);
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
    }
    setShouldResetBoard(false);
  }, [
    shouldResetBoard,
    moveHistory,
    setShouldResetBoard,
    setMoveHistory,
    setBoard,
    setIsXNext,
    setWinner,
  ]);

  return (
    <div className="board">
      <div className="board__notify">
        {winner ? (
          <div className="board__notify__winnerFlash">
            Player {winner} has won the game!!!
          </div>
        ) : !hasMoves(board) ? (
          <div className="board__notify_tie">Game is tied !!!</div>
        ) : (
          <div className="board__notify__playerTurn">
            It is Player {isXNext ? "X" : "O"}'s turn !!
          </div>
        )}
      </div>
      <div className="board__scores">
        <div className="board__scores__left">
          <b>Player X:</b> {winCount[0]}
        </div>
        <div className="board__scores__right">
          <b>Player O:</b> {winCount[1]}
        </div>
      </div>
      <div className="board__center" style={boardStyle}>
        {board.map((squareValue, squareIndex) => (
          <Square
            key={`Square#${squareIndex}`}
            squareIndex={squareIndex}
            squareValue={squareValue}
            onSquareClick={() => setClickedSquare(squareIndex)}
          />
        ))}
      </div>
      <div className="board__controls">
        <button onClick={() => setShouldResetBoard(true)}>Reset Game</button>
        <ul>
          {moveHistory.map((_moveSnapshot, moveIndex) => (
            <button
              className="jumpToMove"
              onClick={() => setJumpToMoveIndex(moveIndex)}
              key={`Move#${moveIndex}`}
              type="button"
            >
              Move #{moveIndex + 1}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}

const boardStyle = {
  border: "4px solid darkblue",
  borderRadius: "10px",
  width: "250px",
  height: "250px",
  margin: "0 auto",
  display: "grid",
  gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
};

export default Board;
