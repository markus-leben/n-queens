// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // start with no filled row
      var filledRow = false;
      // go through cells
      for (let cell of this.get(rowIndex)) {
        // if the cell has something
        if (cell !== 0) {
          // if we've already got a filled row
          if (filledRow !== false) {
            // yes theres a conflict
            return true;
          } else { // if we don't have a filled row
            // now we do
            filledRow = true;
          }
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // go through the row indeces
      for (let rowIndex of _.range(this.get('n'))) {
        // if row conflict on that index
        if (this.hasRowConflictAt(rowIndex)) {
          // return true
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // start with no filled column
      var filledColumn = false;
      // for each row in the array
      for (let row of this.rows()) { // look familiar?
        // if the cell at row, colIndex is filled
        if (row[colIndex] !== 0) {
          // if we've already got a filled col
          if (filledColumn !== false) {
            // there's a conflict
            return true;
          } else { // if we don't already have a filled col
            // now we do
            filledColumn = true;
          }
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // go through the col indeces
      for (let colIndex of _.range(this.get('n'))) {
        // if col conflict on that index
        if (this.hasColConflictAt(colIndex)) {
          // return true
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // note to self: a specific diagonal doesn't necessarily exist
      // start with now filled diag
      var filledDiag = false;
      // for a given row
      for (let thisRow of _.range(this.get('n'))) {
        let thisColumn = majorDiagonalColumnIndexAtFirstRow + thisRow; // when we increment the row, we increment the column

        // if this cell is in bounds
        if (this._isInBounds(thisRow, thisColumn)) {
          // if this cell isn't zero
          if (this.get(thisRow)[thisColumn] !== 0) {
            // if we've already hit a filled diag
            if (filledDiag !== false) {
              // return true
              return true;
            } else { // otherwise
              // we've now hit a filled diag
              filledDiag = true;
            }
          }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      // total number of diagonals is equal to twice the size of the board minus one (i.e. a board of size 3 has 5 diagonals)
      // so an array of the indeces looks like this:  [-2, -1, 0, 1, 2]
      var diagonalArray = _.range(-1 * (this.get('n') - 1), this.get('n'));

      // loop through those indeces
      for (let startingColumnIndex of diagonalArray) {
        // if this has a major diagonal conflict with that starting index, return true
        if (this.hasMajorDiagonalConflictAt(startingColumnIndex)) {
          return true;
        }
      }
      // for each diagonal
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left <--- nah dude definitely go from bottom left to top right
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstCol) {
      // start with now filled diag
      var filledDiag = false;
      // assign thisColumn for clarity
      var thisColumn = minorDiagonalColumnIndexAtFirstCol;
      // for a given row
      for (let thisRow of _.range(this.get('n')).reverse()) { // will look like [3,2,1,0]
        // if this cell is in bounds
        if (this._isInBounds(thisRow, thisColumn)) {
          // if this cell isn't zero
          if (this.get(thisRow)[thisColumn] !== 0) {
            // if we've already hit a filled diag
            if (filledDiag !== false) {
              // return true
              return true;
            } else { // otherwise
              // now we've hit a filled diag
              filledDiag = true;
            }
          }
        }
        // increment thisColumn after everything is done
        thisColumn++;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      // total number of diagonals is equal to twice the size of the board minus one (i.e. a board of size 3 has 5 diagonals)
      // so an array of the indeces looks like this:  [-2, -1, 0, 1, 2]
      var diagonalArray = _.range(-1 * (this.get('n') - 1), this.get('n'));

      for (let startingColumnIndex of diagonalArray) {
        // if this has a major diagonal conflict with that starting index, return true
        if (this.hasMinorDiagonalConflictAt(startingColumnIndex)) {
          return true;
        }
      }
      // for each diagonal
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
