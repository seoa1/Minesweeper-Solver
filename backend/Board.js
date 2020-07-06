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
                to_delete.push(edge_square);
            }
            
            // check if any obvious square clears
            if(num_surr_flags == edge_square.surr_bombs) {
                unrev_squares.forEach( unrev => {
                    to_reveal.push(unrev);
                })
                to_delete.push(edge_square);
            }
            // check if any obvious bomb flags
            if(unrev_squares.length == edge_square.surr_bombs - num_surr_flags) {
                unrev_squares.forEach( unrev => {
                    unrev.flagged = true;
                })
                to_delete.push(edge_square);
            }
            // check for 2/1 and 1/1 pattern
            // TODO: refactor into separate functions
            if(edge_square.surr_bombs - num_surr_flags == 1) {
                const DIRS_COL = [[0,1],[0,-1]];
                const DIRS_ROW = [[1,0],[-1,0]];
                let sq_pos = edge_square.pos;
                DIRS_COL.forEach( dir => {
                    let new_pos = [sq_pos[0], sq_pos[1] + dir[1]];
                    
                    if(this.is_valid_pos(new_pos) && this.sq_at_pos(new_pos).revealed) {
                        let new_num_surr_flags = 0;
                        this.surr_squares(new_pos).forEach(sq => {
                            if(sq.flagged) {
                                new_num_surr_flags++;
                            }
                        })
                        // 2/1 pattern
                        if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 2) {
                            let forward_2 = [sq_pos[0], sq_pos[1] + (dir[1] * 2)];
                            if(this.is_valid_pos(forward_2) && (this.sq_at_pos(forward_2).revealed || this.sq_at_pos(forward_2).flagged)) {
                                let forward_2_up_1 = [sq_pos[0] + 1, sq_pos[1] + (dir[1] * 2)];
                                let forward_2_down_1 = [sq_pos[0] - 1, sq_pos[1] + (dir[1] * 2)];
                                if(this.is_valid_pos(forward_2_up_1) && (this.sq_at_pos(forward_2_up_1).revealed)) {
                                    if(this.is_valid_pos(forward_2_down_1)) {
                                        this.sq_at_pos(forward_2_down_1).flagged = true;
                                    }
                                }
                                if(this.is_valid_pos(forward_2_down_1) && (this.sq_at_pos(forward_2_down_1).revealed)) {
                                    if(this.is_valid_pos(forward_2_up_1)) {
                                        this.sq_at_pos(forward_2_up_1).flagged = true;
                                    }
                                }
                                
                                const BEHIND_POS = [
                                    [sq_pos[0], sq_pos[1] - dir[1]], 
                                    [sq_pos[0] + 1, sq_pos[1] - dir[1]], 
                                    [sq_pos[0] - 1, sq_pos[1] - dir[1]]
                                ];
                                BEHIND_POS.forEach(pos => {
                                    if(this.is_valid_pos(pos) && !this.sq_at_pos(pos).revealed && !this.sq_at_pos(pos).flagged) {
                                        to_reveal.push(this.sq_at_pos(pos));
                                    }
                                })
                                
                            }
                        }
                        //1/1 pattern
                        // else if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 1) {
                        //     let back_1_up_1 = [sq_pos[0] + 1, sq_pos[1] - dir[1]];
                        //     let back_1_down_1 = [sq_pos[0] - 1, sq_pos[1] - dir[1]];
                        //     // check up direction
                        //     if(!this.is_valid_pos(back_1_up_1) || this.sq_at_pos(back_1_up_1).revealed) {
                        //         let forward_2_up_1 = [sq_pos[0] + 1, sq_pos[1] + (dir[1] * 2)];
                        //         if(this.is_valid_pos(forward_2_up_1) && !this.sq_at_pos(forward_2_up_1).flagged) {
                        //             to_reveal.push(this.sq_at_pos(forward_2_up_1));
                        //         }
                        //     }
                        //     // check down direction
                        //     if(!this.is_valid_pos(back_1_down_1) || this.sq_at_pos(back_1_down_1).revealed) {
                        //         let forward_2_down_1 = [sq_pos[0] - 1, sq_pos[1] + (dir[1] * 2)];
                        //         if(this.is_valid_pos(forward_2_down_1) && !this.sq_at_pos(forward_2_down_1).flagged) {
                        //             to_reveal.push(this.sq_at_pos(forward_2_down_1));
                        //         }
                        //     }
                        // }
                    }
                });
                DIRS_ROW.forEach( dir => {
                    let new_pos = [sq_pos[0] + dir[0], sq_pos[1]];
                    
                    if(this.is_valid_pos(new_pos) && this.sq_at_pos(new_pos).revealed) {
                        let new_num_surr_flags = 0;
                        this.surr_squares(new_pos).forEach(sq => {
                            if(sq.flagged) {
                                new_num_surr_flags++;
                            }
                        })
                        // 2/1 pattern
                        if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 2) {
                            let forward_2 = [sq_pos[0] + (dir[0] * 2), sq_pos[1]];
                            if(this.is_valid_pos(forward_2) && this.sq_at_pos(forward_2).revealed) {
                                let forward_2_up_1 = [sq_pos[0] + (dir[0] * 2), sq_pos[1] + 1];
                                let forward_2_down_1 = [sq_pos[0] + (dir[0] * 2), sq_pos[1] - 1];
                                if(this.is_valid_pos(forward_2_up_1) && this.sq_at_pos(forward_2_up_1).revealed) {
                                    if(this.is_valid_pos(forward_2_down_1)) {
                                        this.sq_at_pos(forward_2_down_1).flagged = true;
                                    }
                                }
                                if(this.is_valid_pos(forward_2_down_1) && this.sq_at_pos(forward_2_down_1).revealed) {
                                    if(this.is_valid_pos(forward_2_up_1)) {
                                        this.sq_at_pos(forward_2_up_1).flagged = true;
                                    }
                                }
                                const BEHIND_POS = [
                                    [sq_pos[0] - dir[0], sq_pos[1]], 
                                    [sq_pos[0] - dir[0], sq_pos[1] + 1], 
                                    [sq_pos[0] - dir[0], sq_pos[1] - 1]
                                ];
                                BEHIND_POS.forEach(pos => {
                                    if(this.is_valid_pos(pos) && !this.sq_at_pos(pos).revealed && !this.sq_at_pos(pos).flagged) {
                                        to_reveal.push(this.sq_at_pos(pos));
                                    }
                                })
                                
                            }
                        }
                        //1/1 pattern
                        // else if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 1) {
                        //     let back_1_up_1 = [sq_pos[0] + 1, sq_pos[1] - dir[1]];
                        //     let back_1_down_1 = [sq_pos[0] - 1, sq_pos[1] - dir[1]];
                        //     // check up direction
                        //     if(!this.is_valid_pos(back_1_up_1) || this.sq_at_pos(back_1_up_1).revealed) {
                        //         let forward_2_up_1 = [sq_pos[0] + 1, sq_pos[1] + (dir[1] * 2)];
                        //         if(this.is_valid_pos(forward_2_up_1)) {
                        //             to_reveal.push(this.sq_at_pos(forward_2_up_1));
                        //         }
                        //     }
                        //     // check down direction
                        //     else if(!this.is_valid_pos(back_1_down_1) || this.sq_at_pos(back_1_down_1).revealed) {
                        //         let forward_2_down_1 = [sq_pos[0] - 1, sq_pos[1] + (dir[1] * 2)];
                        //         if(this.is_valid_pos(forward_2_down_1)) {
                        //             to_reveal.push(this.sq_at_pos(forward_2_down_1));
                        //         }
                        //     }
                        // }
                    }
                });
            }
        })
        if(to_reveal.length == 0 && to_delete.length == 0 ) {
            return false;
        }
        to_reveal.forEach( rev_sq => this.reveal_squares(rev_sq.pos) );
        to_delete.forEach( del_sq => this.edge_squares.delete(del_sq.id) );
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