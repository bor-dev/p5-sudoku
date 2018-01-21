class Cell
{
    constructor(x, y, w, h, idx)
    {
        this.value = 0;
        this.candidates = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

        this.mouse_over = false;

        this.col_highlight = false;
        this.row_highlight = false;
        this.region_highlight = false;

        this.initial = false;

        this.solving = false;

        this.idx = idx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.picker = null;
        this.picker_showing = false;
    }

    /**
     * Draws this cell, called every frame.
     * @param p5 {p5}
     */
    draw(p5)
    {
        // Draw the cells
        p5.strokeWeight(1);
        p5.stroke(0);

        if (this.initial) {
            p5.fill(200);
        } else {
            p5.fill(255);
        }

        if (!this.initial) {
            if (this.mouse_over) {
                p5.fill('hsb(160, 100%, 50%)');
            } else if (this.col_highlight || this.row_highlight) {
                p5.fill('hsb(160, 100%, 75%)');
            } else if (this.region_highlight) {
                p5.fill('hsb(190, 100%, 75%)');
            }
            if (this.solving) {
                p5.fill('red');
            }
        }

        p5.rect(
            this.x,
            this.y,
            this.w,
            this.h
        );

        // Number in the middle
        if (this.value > 0) {
            p5.strokeWeight(0);
            p5.textSize(32);
            p5.fill(0);
            p5.text(
                this.value,
                this.x + 18,
                this.y + 11,
                this.w,
                this.h
            );
        }

        // draw candidates
        //this.drawCandidates(p5);
    }

    /**
     * Draws the candidates for this cell, called every frame.
     * @param p5 {p5}
     */
    drawCandidates(p5)
    {
        let count = 0;
        for (let c of this.candidates) {
            p5.strokeWeight(0);
            p5.textSize(10);
            p5.fill(90);
            p5.text(
                c,
                this.x + 8,
                this.y + 15 + count
            );
            count += 15;
        }
    }

    pickerVisible()
    {
        return this.picker !== null && this.picker.showing;
    }

    showPicker(x, y, board)
    {
        if (this.picker === null) {
            this.picker = new Picker(x, y, board, this);
        }
        this.picker.showing  = true;
    }

    hidePicker()
    {
        if (this.picker !== null) {
            this.picker.showing = false;
        }
    }

    /**
     * Sets the cell to a specific value.
     * @param value {Integer}
     */
    setValue(value)
    {
        this.value = value;
    }

    /**
     * @returns {Integer[]}
     */
    getCandidates()
    {
        return this.candidates;
    }

    /**
     * @param candidate {Integer|Integer[]}
     */
    addCandidate(candidate)
    {
        if (Array.isArray(candidate)) {
            for (let i = 0; i < candidate.length; i++) {
                this.addCandidate(candidate[i]);
            }
        } else {
            if (this.candidates.indexOf(candidate) === -1) {
                this.candidates.push(candidate);
                this.candidates.sort(Cell.sortCandidates);
            }
        }
        return this;
    }

    /**
     * @param candidate {Integer|Integer[]}
     */
    removeCandidate(candidate)
    {
        if (Array.isArray(candidate)) {
            for (let i = 0; i < candidate.length; i++) {
                this.removeCandidate(candidate[i]);
            }
        } else {
            let idx = this.candidates.indexOf(candidate);
            if (idx > -1) {
                this.candidates.splice(idx, 1);
            }
        }
        return this;
    }

    static sortCandidates(a, b)
    {
        return a - b;
    }

    /**
     * Determines if the given x, y coordinates is within this cell
     * @param x {Integer} in pixels
     * @param y {Integer} in pixels
     */
    isInCell(x, y)
    {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h
    }

    /**
     * @returns {boolean}
     */
    isEmpty()
    {
        return this.value < 1;
    }
}