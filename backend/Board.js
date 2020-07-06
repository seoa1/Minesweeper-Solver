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

    get_num_edges() {
        return this.edge_squares.size;
    }

    build_grid() {
        for(let i=0; i<16; i++) {
            this.grid.push([]);
            for(let j=0; j<30; j++) {
                this.grid[i].push(new Square(i*100 + j));
            }
        }
    }

    is_valid_pos(pos) {
        return (pos[0] >= 0 && pos[0] < 16 && pos[1] >= 0 && pos[1] < 30);
    }

    sq_at_pos(pos) {
        return this.grid[pos[0]][pos[1]];
    }

    check_for_11(square) {

    }

    two_one_pattern(sq_pos, dir) {
        let to_reveal = [];
        let forward_2;
        let forward_2_down_1;
        let forward_2_up_1;
        let col = (dir[0] === 0);
        if(col) {
            forward_2 = [sq_pos[0], sq_pos[1] + (dir[1] * 2)];
            forward_2_up_1 = [sq_pos[0] + 1, sq_pos[1] + (dir[1] * 2)];
            forward_2_down_1 = [sq_pos[0] - 1, sq_pos[1] + (dir[1] * 2)];
        }
        else{
            forward_2 = [sq_pos[0] + (dir[0] * 2), sq_pos[1]];
            forward_2_up_1 = [sq_pos[0] + (dir[0] * 2), sq_pos[1] + 1];
            forward_2_down_1 = [sq_pos[0] + (dir[0] * 2), sq_pos[1] - 1];
        }
        if(this.is_valid_pos(forward_2) && (this.sq_at_pos(forward_2).revealed || this.sq_at_pos(forward_2).flagged)) {
            
            if(this.is_valid_pos(forward_2_up_1) && (this.sq_at_pos(forward_2_up_1).revealed)) {
                if(this.is_valid_pos(forward_2_down_1) && !this.sq_at_pos(forward_2_down_1).flagged) {
                    this.sq_at_pos(forward_2_down_1).flagged = true;
                }
            }
            if(this.is_valid_pos(forward_2_down_1) && (this.sq_at_pos(forward_2_down_1).revealed)) {
                if(this.is_valid_pos(forward_2_up_1) && !this.sq_at_pos(forward_2_up_1).flagged) {
                    this.sq_at_pos(forward_2_up_1).flagged = true;
                }
            }
            let check = (!this.is_valid_pos(forward_2_up_1) || this.sq_at_pos(forward_2_up_1).revealed || this.sq_at_pos(forward_2_up_1).flagged) 
                && (!this.is_valid_pos(forward_2_down_1) || this.sq_at_pos(forward_2_down_1).revealed || this.sq_at_pos(forward_2_down_1).flagged);
            if(check) {
                let behind_pos;
                if(col) {
                    behind_pos = [
                        [sq_pos[0], sq_pos[1] - dir[1]], 
                        [sq_pos[0] + 1, sq_pos[1] - dir[1]], 
                        [sq_pos[0] - 1, sq_pos[1] - dir[1]]
                    ];
                }
                else {
                    behind_pos = [
                        [sq_pos[0] - dir[0], sq_pos[1]], 
                        [sq_pos[0] - dir[0], sq_pos[1] + 1], 
                        [sq_pos[0] - dir[0], sq_pos[1] - 1]
                    ];
                }
                behind_pos.forEach(pos => {
                    if(this.is_valid_pos(pos) && !this.sq_at_pos(pos).revealed && !this.sq_at_pos(pos).flagged) {
                        to_reveal.push(this.sq_at_pos(pos));
                    }
                })
            }
        }
        return to_reveal;
    }

    one_one_pattern(sq_pos, dir) {
        let back_1_up_1;
        let back_1_down_1;
        let back_1;
        let forward_2;
        let forward_2_up_1;
        let forward_2_down_1;
        let down_1;
        let up_1;
        let forward_1_up_1;
        let forward_1_down_1;
        let col = (dir[0] === 0);
        let to_reveal = [];

        if(col) {
            back_1_up_1 = [sq_pos[0] + 1, sq_pos[1] - dir[1]];
            back_1_down_1 = [sq_pos[0] - 1, sq_pos[1] - dir[1]];
            back_1 = [sq_pos[0], sq_pos[1] - dir[1]];
            forward_2 = [sq_pos[0], sq_pos[1] + (dir[1] * 2)];
            forward_2_up_1 = [sq_pos[0] + 1, sq_pos[1] + (dir[1] * 2)];
            forward_2_down_1 = [sq_pos[0] - 1, sq_pos[1] + (dir[1] * 2)];
            down_1 = [sq_pos[0] - 1, sq_pos[1]];
            up_1 = [sq_pos[0] + 1, sq_pos[1]];
            forward_1_up_1 = [sq_pos[0] + 1, sq_pos[1] + dir[1]];
            forward_1_down_1 = [sq_pos[0] - 1, sq_pos[1] + dir[1]];
        }
        else {
            back_1_up_1 = [sq_pos[0] - dir[0], sq_pos[1] + 1];
            back_1_down_1 = [sq_pos[0] - dir[0], sq_pos[1] - 1];
            back_1 = [sq_pos[0] - dir[0], sq_pos[1]];
            forward_2 = [sq_pos[0] + (dir[0] * 2), sq_pos[1]];
            forward_2_up_1 = [sq_pos[0] + (dir[0] * 2), sq_pos[1] + 1];
            forward_2_down_1 = [sq_pos[0] + (dir[0] * 2), sq_pos[1] - 1];
            down_1 = [sq_pos[0], sq_pos[1] - 1];
            up_1 = [sq_pos[0], sq_pos[1] + 1];
            forward_1_up_1 = [sq_pos[0] + dir[0], sq_pos[1] + 1];
            forward_1_down_1 = [sq_pos[0] + dir[0], sq_pos[1] - 1];
        }

        let check_forw_back = (!this.is_valid_pos(back_1) || this.sq_at_pos(back_1).revealed) 
            && (!this.is_valid_pos(forward_2) || this.sq_at_pos(forward_2).revealed);

        // check up direction
        if(check_forw_back && (!this.is_valid_pos(back_1_up_1) || this.sq_at_pos(back_1_up_1).revealed || this.sq_at_pos(back_1_up_1).flagged)) {
            let below = [back_1_down_1, down_1, forward_1_down_1, forward_2_down_1];
            let check = true;
            below.forEach(pos => {
                if(!(!this.is_valid_pos(pos) || this.sq_at_pos(pos).revealed)) {
                    check = false;
                }
            })
            if(check && this.is_valid_pos(forward_2_up_1) && !this.sq_at_pos(forward_2_up_1).flagged && !this.sq_at_pos(forward_2_up_1).revealed) {
                to_reveal.push(this.sq_at_pos(forward_2_up_1));
                
            }
            
        }
        // check down direction
        if(check_forw_back && (!this.is_valid_pos(back_1_down_1) || this.sq_at_pos(back_1_down_1).revealed || this.sq_at_pos(back_1_down_1).flagged)) {
            let above = [back_1_up_1, up_1, forward_1_up_1, forward_2_up_1];
            let check = true;
            above.forEach(pos => {
                if(!(!this.is_valid_pos(pos) || this.sq_at_pos(pos).revealed)) {
                    check = false;
                }
            })
            if(check && this.is_valid_pos(forward_2_down_1) && !this.sq_at_pos(forward_2_down_1).flagged && !this.sq_at_pos(forward_2_down_1).revealed) {
                to_reveal.push(this.sq_at_pos(forward_2_down_1));
                
            }
        }
        return to_reveal;
    }

    check_edges() {
        let to_delete = [];
        let to_reveal = [];
        this.edge_squares.forEach( (edge_square, key) => {
            let unrev_squares = [];
            let num_surr_flags = 0;
            this.surr_squares(edge_square.pos).forEach( surr_square => {
                if(!surr_square.revealed && !surr_square.flagged) {
                    unrev_squares.push(surr_square);
                }
                if(surr_square.flagged) {
                    num_surr_flags++;
                }
            })

            if(unrev_squares.length == 0) {
                to_delete.push(key);
            }
            
            // check if any obvious square clears
            if(num_surr_flags == edge_square.surr_bombs) {
                unrev_squares.forEach( unrev => {
                    to_reveal.push(unrev);
                })
                to_delete.push(key);
            }
            // check if any obvious bomb flags
            if(unrev_squares.length == edge_square.surr_bombs - num_surr_flags) {
                unrev_squares.forEach( unrev => {
                    unrev.flagged = true;
                })
                to_delete.push(key);
            }
            // check for 2/1 and 1/1 pattern
            // http://www.minesweeper.info/wiki/Strategy
            if(edge_square.surr_bombs - num_surr_flags == 1) {
                const DIRS = [[0,1],[0,-1],[1,0],[-1,0]];
                let sq_pos = edge_square.pos;
                DIRS.forEach( dir => {

                    let new_pos = [sq_pos[0] + dir[0], sq_pos[1] + dir[1]];                    
                    if(this.is_valid_pos(new_pos) && this.sq_at_pos(new_pos).revealed) {
                        let new_num_surr_flags = 0;
                        this.surr_squares(new_pos).forEach(sq => {
                            if(sq.flagged) {
                                new_num_surr_flags++;
                            }
                        })
                        // 2/1 pattern
                        if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 2) {
                            to_reveal = to_reveal.concat(this.two_one_pattern(sq_pos, dir));

                        }
                        
                        //1/1 pattern
                        else if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 1) {
                            to_reveal = to_reveal.concat(this.one_one_pattern(sq_pos, dir));
                        }
                    }
                });
                
            }
        })
        if(to_reveal.length == 0 && to_delete.length == 0 ) {
            return false;
        }
        to_reveal.forEach( rev_sq => {
            if(!rev_sq.flagged) {
                this.reveal_squares(rev_sq.pos) 
            }
        });
        to_delete.forEach( key => this.edge_squares.delete(key) );
        return true;
    }

    reveal_squares(pos) {
        let curr_square = this.grid[pos[0]][pos[1]];

        if(curr_square.surr_bombs > 0 || curr_square.revealed || curr_square.bomb) {
            if(curr_square.surr_bombs > 0 && !curr_square.revealed) {
                this.edge_squares.set(curr_square.id, curr_square);
            }
            curr_square.revealed = true;
            if(curr_square.bomb == true) {
                this._lost = true;
            }
            
            return;
        }
        this.surr_squares(pos).forEach((square) => {
            curr_square.revealed = true;
            this.reveal_squares(square.pos);
        });

    }

    set_bombs_test_grid() {
        let test_pos = [[1,2],[3,2],[4,2],[4,1]];
        while(test_pos.length > 0) {
            this.sq_at_pos(test_pos.pop()).bomb = true;
        }
        this.find_surr_bomb_vals();
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