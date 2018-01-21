
// Get the classes we need...
importScripts('solver.js', 'board.js', 'cell.js');

let board, solver;

class SolverWorker
{
    static onMessage(e)
    {
        let message = e.data;

        console.log('Worker got message', message);

        let action = message.action;
        let data = message.data;

        switch (action) {
            case 'solve' :
                board = SolverWorker.instantiateBoard(data);
                solver = new Solver(board);
                solver.step = function(row, col) { // called every time the solver moves on a step
                    SolverWorker.postMessage('highlightCell', {
                        row_idx: row,
                        col_idx: col
                    });
                };
                solver.solveBoard();
                break;
        }
    }

    /**
     * @param data {Board} (An unserialized object that has the same properties as Board)
     * @returns {Board}
     */
    static instantiateBoard(data)
    {
        let board = new Board(data.width, data.height, data.rows, data.cols);

        for (let c = 0; c < data.cells.length; c++) {

            let cell = new Cell(
                data.cells[c].x,
                data.cells[c].y,
                data.cells[c].w,
                data.cells[c].h,
                c
            );

            // Should only need the below properties
            cell.setValue(data.cells[c].value);
            board.updateCandidates(cell);
            cell.initial = data.cells[c].initial;

            board.cells.push(cell);

        }

        board.cell_width = data.cell_width;
        board.cell_height = data.cell_height;
        board.region_size = data.region_size;

        return board;
    }

    static postMessage(action, data)
    {
        postMessage({
            action: action,
            data: data
        });
    }
}

// As we are in a worker, hook into the onmessage function that is in the global scope.
onmessage = SolverWorker.onMessage;