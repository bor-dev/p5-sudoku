
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
    }

    draw(p5)
    {
        // box around picker
        p5.fill(255);
        p5.strokeWeight(1);
        p5.stroke(0);
        p5.rect(this.x, this.y, this.w, this.h);


        // box around each text box
        for (let c_box = 0; c_box < this.size; c_box++) {
            for (let r_box = 0; r_box < this.size; r_box++) {

                p5.fill(255);
                p5.strokeWeight(1);
                p5.rect(
                    this.x + this.cell_width * c_box,
                    this.y + this.cell_height * r_box,
                    this.w / this.size,
                    this.h / this.size
                );

                p5.fill(0);
                p5.strokeWeight(0);
                p5.textSize(25);
                p5.text(
                    this.cell.candidates[c_box + r_box], // @todo this is broken!
                    this.x + this.cell_width * c_box,
                    this.y + this.cell_height * r_box,
                    this.w / this.size,
                    this.h / this.size
                );
            }
        }
    }
}