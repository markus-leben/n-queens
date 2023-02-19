/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  // make a blank board
  var solution = new Board({'n': n });
  // for each diagonal coord along the length of the board ([0,0], [1,1], ...)
  for (let index in _.range(n)) {
    // set that equal to 1
    solution.get(index)[index] = 1;
  }
  solution = solution.rows();
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  if (n < 1) {
    console.log('Are there zero solutions for a zero size board? What about a negative board?');
    return 0;
  }

  // on a
  var solutionCount = 1;
  // for each of your n rook placements
  for (let move of _.range(n, 1)) {
    // you have n options of where to place it
    solutionCount = solutionCount * move;

  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n, board = new Board({'n': n }), lastMove = [], moveCount = 0) {
  // debugger;
  if (moveCount === n) {
    var solution = board.rows();
    if (moveCount === 0) {
      console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
    }
    return solution;
  }
  // storage variable for move options
  var moveOptions = [];

  // your options are moves along the top half of the left side if you don't have a previous move
  // debugger;
  if (lastMove.length === 0) {
    for (let row of _.range(0, Math.ceil(n / 2))) { // round up for making the range, so n=5 would be [0,1,2]
      moveOptions.push([row, 0]);
    }
  } else { // if you have a previous move, check your in bounds options
    for (let longChange of [-2, 2]) { // the long move
      for (let shortChange of [-1, 1]) { // the short move
        var newRow = lastMove[0] + longChange; //this move is long row + short column
        var newCol = lastMove[1] + shortChange;
        if (board._isInBounds(newRow, newCol) && board.get(newRow)[newCol] === 0) { // if the move is legal and emtpy
          moveOptions.push([newRow, newCol]); // add it to your options
        }
        var newRow = lastMove[0] + shortChange; //this move is short row + long column
        var newCol = lastMove[1] + longChange;
        if (board._isInBounds(newRow, newCol) && board.get(newRow)[newCol] === 0) {
          moveOptions.push([newRow, newCol]);
        }
      }
    }
  }

  for (let currentMove of moveOptions) { // go through the move options
    if (n === 6) {
      debugger;
    }
    board.get(currentMove[0])[currentMove[1]] = 1; // set the board to this move
    if (!(board.hasAnyQueensConflicts())) { // if no conflicts
      var thisSolution = findNQueensSolution(n, board, currentMove, moveCount + 1); // find an n queens solution with the current board, this move as the previous move, and a move count 1 higher.
      if (thisSolution !== false) { // if that solution worked, return
        var solution = board.rows();
        if (moveCount === 0) {
          console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
        }
        return solution;
      } else { // otherwise undo this move
        board.get(currentMove[0])[currentMove[1]] = 0;
      }
    } else {
      board.get(currentMove[0])[currentMove[1]] = 0; // reset the board if there was a conflict
    }
  }



  return false;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;

  var board = new Board({'n': n});

  var findSolution = function(row) {
    if (row === n ) {
      solutionCount++;
      return;
    }

    for (let col in _.range(0, n)) {
      board.togglePiece(row, col);
      if ( !board.hasAnyQueensConflicts()) {
        findSolution(row + 1);
      }
      board.togglePiece(row, col);
    }
  };
  findSolution(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
