
class Picker
{
    constructor(x, y, board, cell)
    {
        this.w = 150;
        this.h = 150;
        this.size = 3; // 3x3

        this.cell_width = Math.floor(this.w / this.size);
        this.cell_height = Math.floor(this.h / this.size);

        this.x = x;
        this.y = y;
        this.board = board;
        this.cell = cell;

        this.showing = false;

        // build the picker array
        let candidate_value = 0;
        this.picker_cells = [];

        for (let r = 0; r < this.size; r++) {

            this.picker_cells[r] = [];

            for (let c = 0; c < this.size; c++) {

                candidate_value++;

                this.picker_cells[r][c] = {
                    value: candidate_value,
                    highlighted: false
                };
            }
        }
    }

    /**
     * Determines if the passed in (mouse) position is within the picker
     * @param {Integer} x
     * @param {Integer} y
     * @returns {boolean}
     */
    mouseInPicker(x, y)
    {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
    }

    /**
     * Handle a moucse click inside a picker
     * @param {Integer} x
     * @param {Integer} y
     */
    handleClick(x, y)
    {
        let picker_cell = this.getPickerCellAt(x, y);
        if (picker_cell) {
            this.cell.setValue(picker_cell.value);
            this.showing = false;
            this.board.updateCandidates(this.cell);
        }
    }

    /**
     * Get the picker cell (or null) at the passed in x, y coordinates
     * @param {Integer} x
     * @param {Integer} y
     */
    getPickerCellAt(x, y)
    {
        let tmp_x = 0;
        let tmp_y = 0;

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {

                tmp_x = this.picker_cells[r][c].x;
                tmp_y = this.picker_cells[r][c].y;

                if (x > tmp_x && x < tmp_x + this.cell_width && y > tmp_y && y < tmp_y + this.cell_height) {
                    return this.picker_cells[r][c];
                }
            }
        }

        return null;
    }

    /**
     * Clear highlight from all cells
     */
    clearCellHighlight()
    {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                this.picker_cells[r][c].highlighted = false;
            }
        }
    }

    /**
     * Draws the picker
     * @param {p5} p5
     */
    draw(p5)
    {
        // limit x so picker does not appear off the canvas
        if (this.x + this.w > this.board.width) {
            this.x = this.board.width - this.w - 5;
        }

        // limit y so picker does not appear off the canvas
        if (this.y + this.h > this.board.height) {
            this.y = this.board.height - this.h - 5;
        }

        // box around picker
        p5.fill(255);
        p5.strokeWeight(1);
        p5.stroke(0);
        p5.rect(this.x, this.y, this.w, this.h);

        let picker_cell = {};

        // box around each text box
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {

                picker_cell = this.picker_cells[r][c];

                // Update the cell x / y
                picker_cell.x = Math.floor(this.x + (this.cell_width * c));
                picker_cell.y = Math.floor(this.y + (this.cell_height * r));

                if (picker_cell.highlighted) {
                    p5.fill(0, 200, 0);
                } else {
                    p5.fill(255);
                }

                if (picker_cell.value === this.cell.value) {
                    p5.fill(255, 255, 0);
                }

                p5.strokeWeight(1);
                p5.rect(
                    picker_cell.x,
                    picker_cell.y,
                    this.cell_width,
                    this.cell_height
                );

                if (this.cell.isValueCandidate(picker_cell.value)) {
                    p5.fill(0);
                } else {
                    p5.fill(200);
                }

                p5.strokeWeight(0);
                p5.textSize(25);
                p5.text(
                    picker_cell.value,
                    picker_cell.x + 18,
                    picker_cell.y + 13,
                    this.cell_width,
                    this.cell_height
                );
            }
        }
    }
}