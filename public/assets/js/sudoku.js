"use strict";

let p, sudoku;

(function() {

    // Initial
    // var board = '090000006' +
    //             '000960485' +
    //             '000581000' +
    //             '004000000' +
    //             '517200900' +
    //             '602000370' +
    //             '100804020' +
    //             '706000810' +
    //             '300090000';

    // "Very hard" puzzle
    var board = '860020000' +
                '000700059' +
                '000000000' +
                '000060800' +
                '040000000' +
                '005300007' +
                '000000000' +
                '020000600' +
                '007509000';

    window.onload = function() {

        p = new p5(function(p) {

            sudoku = new Sudoku(p);

            p.setup = function ()
            {
                sudoku.setup();
                sudoku.load(board);
            };

            p.draw = function ()
            {
                sudoku.draw();
            };

            p.mouseMoved = function()
            {
                sudoku.mouseMoved(p.mouseX, p.mouseY);
            };

            p.mouseClicked = function()
            {
                sudoku.mouseClicked(p.mouseX, p.mouseY);
            };

        });
    };
})();

class Sudoku {

    constructor(p5)
    {
        this.p5 = p5;
        this.cols = 9;
        this.rows = 9;

        this.canvas = null;
        this.board = null;

        this.solver = null;
    }

    /**
     * Sets-up the canvas and board
     */
    setup()
    {
        this.canvas = this.p5.createCanvas(500, 500);
        this.board = new Board(this.canvas.width, this.canvas.height, this.cols, this.rows);
    }

    /**
     * Draws everything needed for the game, called every frame.
     */
    draw()
    {
        this.board.draw(this.p5);
    }

    /**
     * Loads Sudokue data from passed data.
     * @param data {String}
     */
    load(data)
    {
        this.board.load(data);
    }

    /**
     * Handles the mouse moved event from p5.
     * @param x {Integer} mouse x pos in pixels
     * @param y {Integer} mouse y pos in pixels
     */
    mouseMoved(x, y)
    {
        this.board.highlight(x, y);
    }

    mouseClicked(x, y)
    {
        this.togglePicker(x, y);
    }

    /**
     * Shows a number picker at x, y position
     * @param x {Integer}
     * @param y {Integer}
     */
    togglePicker(x, y)
    {
        // @todo cope with a mouse click inside the picker

        this.hidePickers();

        // find the cell to show the picker for and call them cell method
        for (let cell of this.board.cells) {
            if (cell.isInCell(x, y) && !cell.initial) {
                if (!cell.pickerVisible()) {
                    cell.showPicker(x, y, this.board);
                }
                break;
            }
        }
    }

    /**
     * Hide all number pickers
     */
    hidePickers()
    {
        for (let cell of this.board.cells) {
            if (cell.picker !== null) {
                cell.picker.showing = false;
            }
        }
    }

    /**
     * @todo
     */
    solve()
    {
        if (!window.Worker) {
            throw new Error('You must use a browser that supports WebWorkers.');
        }

        console.log('Solve via worker...');

        this.solver = new Worker('assets/js/solver-worker.js');

        // This receives messages from the worker...
        this.solver.onmessage = function (e) {

            let message = e.data;

            switch (message.action) {
                case 'highlightCell' :
                    for (let c_idx = 0; c_idx < this.board.cells.length; c_idx++) {
                        this.board.cells[c_idx].solving = false;
                    }
                    this.board.getCell(data.row_idx, data.col_idx).solving = true;
                    break;
            }

        };

        // start solving
        this.solver.postMessage({
            action: 'solve',
            data: this.board
        });
    }
}