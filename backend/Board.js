import Square from './square';

export default class Board {
    constructor() {
        this.grid = [];
        this.build_grid();
        this._lost = false;
        this.num_unopened_squares = 480;
        this._won = (this.num_unopened_squares <= 99);
        this.edge_squares = new Map(); // keys are ids, values are Squares
    }

    build_grid() {
        for(let i=0; i<16; i++) {
            this.grid.push([]);
            for(let j=0; j<30; j++) {
                this.grid[i].push(new Square(i*100 + j));
            }
        }
    }

    solve_edges() {
        let solvable = true;
        while(solvable) {
            
        }
    }

    reveal_squares(pos) {
        let curr_square = this.grid[pos[0]][pos[1]];
        if(this.edge_squares.has(curr_square.id)) {
            this.edge_squares.delete(curr_square.id);
        }
        if(curr_square.surr_bombs > 0 || curr_square.revealed || curr_square.bomb) {
            curr_square.revealed = true;
            if(curr_square.bomb == true) {
                this._lost = true;
                return;
            }
            this.surr_squares(pos).forEach((square) => {
                if(!square.revealed && !square.flagged) {
                    this.edge_squares.set(square.id, square);
                }
            })
            return;
        }
        this.surr_squares(pos).forEach((square) => {
            curr_square.revealed = true;
            this.reveal_squares(square.pos);
        });

    }
    // no bomb allowed at pos or 8 surrounding squares
    set_bombs(pos) {
        for(let i=0; i<99; i++) {
            let row = Math.random() * 16 | 0;
            let col = Math.random() * 30 | 0;
            let surr = false;
            this.surr_squares_pos_only(pos).forEach((surr_pos) => {
                if(row == surr_pos[0] && col == surr_pos[1]) {
                    surr = true;
                }
            });
            if(this.grid[row][col].bomb || (row == pos[0] && col == pos[1]) || surr) {
                i--;
            }
            else {
                this.grid[row][col].bomb = true;
            }
        }
        this.find_surr_bomb_vals();
    }

    find_surr_bomb_vals() {
        const DIRS_8 = [[0,1],[1,1],[1,0],[0,-1],[-1,1],[1,-1],[-1,0],[-1,-1]];
        for(let i=0; i<16; i++) {
            for(let j=0; j<30; j++) {
                let num_surr_bombs = 0;
                this.surr_squares([i, j]).forEach( (square) => {
                    if(square.bomb) {
                        num_surr_bombs++;
                    }
                })
                this.grid[i][j].surr_bombs = num_surr_bombs;
            }
        }
    }
    //returns array of valid surrounding squares around a pos
    surr_squares(pos) {
        const DIRS = [[0,1],[1,1],[1,0],[0,-1],[-1,1],[1,-1],[-1,0],[-1,-1]];
        let squares = [];
        DIRS.forEach( (dir) => {
            let new_row = pos[0] + dir[0];
            let new_col = pos[1] + dir[1];
            if(new_row >= 0 && new_row < 16 && new_col >= 0 && new_col < 30) {
                squares.push(this.grid[new_row][new_col]);
            }
        })
        return squares;
    }

    //returns array of valid surrounding square positions around a pos
    surr_squares_pos_only(pos) {
        const DIRS = [[0,1],[1,1],[1,0],[0,-1],[-1,1],[1,-1],[-1,0],[-1,-1]];
        let squares = [];
        DIRS.forEach( (dir) => {
            let new_row = pos[0] + dir[0];
            let new_col = pos[1] + dir[1];
            if(new_row >= 0 && new_row < 16 && new_col >= 0 && new_col < 30) {
                squares.push([new_row, new_col]);
            }
        })
        return squares;
    }

    get lost() {
        return this._lost;
    }

    get won() {
        return this._won;
    }
}