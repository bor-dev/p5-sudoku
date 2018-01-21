
class Solver
{
    constructor(board)
    {
        this.board = board;

        // called on each step
        this.step = function() {};
    }

    /**
     * Attempts to solve the whole board
     * @returns {Boolean}
     */
    solveBoard()
    {
        return this.solve(0, 0);
    }

    /**
     * Backtracking recursive algorithm
     * @param row {Integer}
     * @param col {Integer}
     * @returns {Boolean}
     */
    solve (row, col)
    {
        // see: https://gist.github.com/vincentg/1301765

        if (row === this.board.rows) {
            row = 0;
            if (++col === this.board.cols) {
                return true;
            }
        }

        let working_cell;

        try {
            working_cell = this.board.getCell(row, col);
        } catch (e) {
            console.log(e);
            return false;
        }

        working_cell.solving = true;
        this.step(row, col);

        if (!working_cell.isEmpty()) {
            return this.solve(row + 1, col);
        }

        // For all values
        for (let val = 1; val <= 9; val++) {

            if (this.isMoveOK(row, col, val)) {

                working_cell.setValue(val);
                this.board.updateCandidates(working_cell);

                if (this.solve(row + 1, col)) {
                    return true;
                }
            }
        }

        // Reset the cell to EMPTY to do recursive backtrack and try again
        this.board.getCell(row, col).setValue(0);
        this.board.updateCandidates(cell);
        return false;
    }

    /**
     * Is the move specified by the parameters legal?
     * @param row {Integer}
     * @param col {Integer}
     * @param val {Integer}
     * @returns {boolean}
     */
    isMoveOK(row, col, val)
    {
        let ok = ! (
            Solver.cellArrayContainsValue(val, this.board.getRow(row, col))
            || Solver.cellArrayContainsValue(val, this.board.getColumn(row, col))
            || Solver.cellArrayContainsValue(val, this.board.getRegion(row, col))
        );
        console.log('Move', row, col, val, ok);
        return ok;
    }

    /**
     *
     * @param val {Integer}
     * @param array Cell[]
     */
    static cellArrayContainsValue(val, array)
    {
        let result = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].value === val) {
                result = true;
                break;
            }
        }
        return result;
    }
}