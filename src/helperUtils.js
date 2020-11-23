const WINNING_MOVES = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 4, 6],
  [2, 5, 8],
  [3, 4, 5],
  [6, 7, 8],
];

export const hasWinner = (board) => {
  return WINNING_MOVES.some(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]
  );
};

export const hasMoves = (board) => {
  return board.some((squareValue) => squareValue === null);
};
