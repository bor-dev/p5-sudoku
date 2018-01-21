class Board
{
    constructor(width, height, rows, cols)
    {
        this.cells = [];

        this.width = width;
        this.height = height;
        this.rows = rows;
        this.cols = cols;

        this.cell_width = Math.floor(this.width / this.cols);
        this.cell_height = Math.floor(this.height / this.rows);
        this.region_size = 3;

        // build the cells
        for (let r_idx = 0; r_idx < this.rows; r_idx++) {
            for (let c_idx = 0; c_idx < this.cols; c_idx++) {
                let idx = r_idx * this.cols + c_idx;
                this.cells[idx] = new Cell(
                    this.cell_width * c_idx,
                    this.cell_height * r_idx,
                    this.cell_width,
                    this.cell_height,
                    idx
                );
            }
        }
    }

    /**
     * Load a board with the passed in string
     * @param data {String}
     */
    load(data)
    {
        let count = 0;
        let chars = data.split('');

        for (let cell of this.cells) {
            let new_value = parseInt(chars[count], 10);
            if (new_value > 0) {
                cell.setValue(new_value);
                cell.initial = true;
                this.updateCandidates(cell);
            } else {
                cell.value = 0;
                cell.initial = false;
            }
            count++;
        }
    }

    /**
     * Draws the board, called every frame.
     * @param p5 {p5}
     */
    draw(p5)
    {
        p5.fill(0);
        p5.stroke(0);

        // draw cells
        for (let cell of this.cells) {
            cell.draw(p5);
        }

        // Larger box around whole board
        p5.noFill();
        p5.strokeWeight(3);
        p5.rect(
            1,
            1,
            this.cell_width * this.rows,
            this.cell_height * this.cols
        );

        // Larger lines dividing every 3 columns and rows
        for (let c_box = 0; c_box < this.cols; c_box += 3) {
            for (let r_box = 0; r_box < this.cols; r_box += 3) {
                p5.rect(
                    this.cell_width * c_box,
                    this.cell_height * r_box,
                    this.cell_width * 3,
                    this.cell_height * 3
                );
            }
        }
    }

    /**
     * Update candidates for all cells on the relevant row, column and region.
     * If any cell ends up with a single candidate, that is set as the value and all candidates are updated again.
     * @param cell {Cell}
     */
    updateCandidates(cell)
    {
        let row_idx = this.getRowIdx(cell.idx);
        let col_idx = this.getColIdx(cell.idx);

        if (cell.value > 0) {
            // a value has been set, so clear all candidates in this cell.
            cell.candidates = [];
        }

        // row
        for (let c of this.getRow(row_idx)) {
            c.removeCandidate(cell.value);
            // If there is a single candidate, set that and update the candidates again
            if (c.candidates.length === 1) {
                c.setValue(c.candidates[0]);
                this.updateCandidates(c);
            }
        }

        // column
        for (let c of this.getColumn(col_idx)) {
            c.removeCandidate(cell.value);
            // If there is a single candidate, set that and update the candidates again
            if (c.candidates.length === 1) {
                c.setValue(c.candidates[0]);
                this.updateCandidates(c);
            }
        }

        // region
        for (let c of this.getRegion(row_idx, col_idx)) {
            c.removeCandidate(cell.value);
            // If there is a single candidate, set that and update the candidates again
            if (c.candidates.length === 1) {
                c.setValue(c.candidates[0]);
                this.updateCandidates(c);
            }
        }
    }

    /**
     * Highlight the cell at x,y as well as the corresponding row and column
     * @param x {Integer}
     * @param y {Integer}
     */
    highlight(x, y)
    {
        // first, reset  all highlighting
        for (let cell of this.cells) {
            cell.mouse_over = false;
            cell.row_highlight = false;
            cell.col_highlight = false;
            cell.region_highlight = false;
        }

        // highlight the cells we want
        for (let cell_idx = 0; cell_idx < this.cells.length; cell_idx++) {

            let cell = this.cells[cell_idx];

            if (cell.isInCell(x, y)) {

                cell.mouse_over = true;

                // highlight the row
                for (let row_cell of this.getRow(this.getRowIdx(cell_idx))) {
                    row_cell.row_highlight = true;
                }

                // highlight the column
                for (let col_cell of this.getColumn(this.getColIdx(cell_idx))) {
                    col_cell.col_highlight = true;
                }

                // highlight the region
                for (let region_cell of this.getRegion(this.getRowIdx(cell_idx), this.getColIdx(cell_idx))) {
                    region_cell.region_highlight = true;
                }
            }
        }
    }

    /**
     * Gets cell at specified row / col
     * @param row_idx {Integer}
     * @param col_idx {Integer}
     * @throws {Error}
     * @returns Cell
     */
    getCell(row_idx, col_idx)
    {
        let idx = row_idx * this.cols + col_idx;
        if (this.cells[idx]) {
            return this.cells[idx];
        }
        throw new Error('Tried to access cell out of range, row: ' + row_idx + ' col: ' + col_idx);
    }

    /**
     * Gets the 3x3 region which row_idx, col_idx falls in.
     * @param row_idx {Integer}
     * @param col_idx {Integer}
     * @returns Cell[]
     */
    getRegion(row_idx, col_idx)
    {
        let cells = [];
        let start_row = row_idx - (row_idx % this.region_size);
        let start_col = col_idx - (col_idx % this.region_size);
        let count = 0;

        // region size is 3 cols / rows from start_col_idx / start_row_idx
        for (let r = start_row; r < this.region_size + start_row; r++) {
            for (let c = start_col; c < this.region_size + start_col; c++) {
                cells[count++] = this.getCell(r, c);
            }
        }

        return cells;
    }

    /**
     * Gets the index of a column based on the passed in cell index.
     * @param cell_idx {Integer}
     * @returns {Integer}
     */
    getColIdx(cell_idx)
    {
        return Math.floor(cell_idx % this.cols);
    }

    /**
     * Gets the index of a row based on the passed in cell index.
     * @param cell_idx {Integer}
     * @returns {Integer}
     */
    getRowIdx(cell_idx)
    {
        return Math.floor(cell_idx / this.cols);
    }

    /**
     * Given a cell, will return an array of the other cells on the column.
     * @param col_index {Integer}
     * @return Cell[]
     */
    getColumn(col_index)
    {
        let cells = [];
        for (let i = 0; i < this.rows; i++) {
            cells[i] = this.cells[i * this.cols + col_index];
        }
        return cells;
    }

    /**
     * Given a cell, will return an array of the other cells on the row.
     * @param row_index {Integer}
     * @return Cell[]
     */
    getRow(row_index)
    {
        let cells = [];
        for (let i = 0; i < this.cols; i++) {
            cells[i] = this.cells[row_index * this.cols + i];
        }
        return cells;
    }
}

/*

// Pseudo code for swapping rows and columns

int [] original = {1, 2, 3, 4, 5, 6, 7, 8, 9};
int [] transpose = new int[original.Length];
int columns = 3;
int rows = original.Length/columns;
for (int i = 0; i < columns; i++)
{
    for (int j = 0; j < rows; j++)
    {
        transpose[i * rows + j] = original[j * columns + i];
    }
}
 */