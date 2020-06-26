import Square from './square';

export default class Board {
    constructor() {
        this.grid = [];
        this.build_grid();
    }

    build_grid() {
        for(let i=0; i<16; i++) {
            this.grid.push([]);
            for(let j=0; j<30; j++) {
                this.grid[i].push(new Square(i*100 + j));
            }
        }
    }

    reveal_squares(pos) {
        const DIRS_8 = [[0,1],[1,1],[1,0],[0,-1],[-1,1],[1,-1],[-1,0],[-1,-1]];
        let curr_square = this.grid[pos[0]][pos[1]];
        if(curr_square.surr_bombs > 0 || curr_square.revealed) {
            curr_square.revealed = true;
            return;
        }
        this.surr_squares(pos, DIRS_8).forEach((square) => {
            curr_square.revealed = true;
            this.reveal_squares(square.pos);
        });

    }

    set_bombs() {
        for(let i=0; i<99; i++) {
            let row = Math.random() * 16 | 0;
            let col = Math.random() * 30 | 0;
            if(this.grid[row][col].bomb) {
                i--;
            }
            else {
                this.grid[row][col].bomb = true;
            }
        }
    }

    // no bomb allowed at pos
    set_bombs(pos) {
        for(let i=0; i<99; i++) {
            let row = Math.random() * 16 | 0;
            let col = Math.random() * 30 | 0;
            if(this.grid[row][col].bomb || [row, col] == pos) {
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
                this.surr_squares([i, j], DIRS_8).forEach( (square) => {
                    if(square.bomb) {
                        num_surr_bombs++;
                    }
                })
                this.grid[i][j].surr_bombs = num_surr_bombs;
            }
        }
    }
    //returns array of valid surrounding squares around a pos
    surr_squares(pos, dirs) {
        
        let squares = [];
        dirs.forEach( (dir) => {
            let new_row = pos[0] + dir[0];
            let new_col = pos[1] + dir[1];
            if(new_row >= 0 && new_row < 16 && new_col >= 0 && new_col < 30) {
                squares.push(this.grid[new_row][new_col]);
            }
        })
        return squares;
    }
}