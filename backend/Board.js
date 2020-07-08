import Square from './square';

export default class Board {
    constructor() {
        this.grid = [];
        this.build_grid();
        this._lost = false;
        this.num_unopened_squares = 480;
        this.edge_squares = new Map(); // keys are ids, values are Squares
        this.flags = 0;
        this.standard_prob = 21;
        this.to_reveal = [];
        this.to_flag = [];
    }

    num_flags() {
        return this.flags;
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

    add_flag() {
        this.flags++;
    }

    remove_flag() {
        this.flags--;
    }

    two_one_pattern(sq_pos, dir) {
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
                    this.to_flag.push(this.sq_at_pos(forward_2_down_1));
                    this.sq_at_pos(forward_2_down_1).bomb_prob = 100;
                }
            }
            if(this.is_valid_pos(forward_2_down_1) && (this.sq_at_pos(forward_2_down_1).revealed)) {
                if(this.is_valid_pos(forward_2_up_1) && !this.sq_at_pos(forward_2_up_1).flagged) {
                    this.to_flag.push(this.sq_at_pos(forward_2_up_1));
                    this.sq_at_pos(forward_2_up_1).bomb_prob = 100;

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
                        this.to_reveal.push(this.sq_at_pos(pos));
                        this.sq_at_pos(pos).bomb_prob = 0;
                    }
                })
            }
        }
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

        let check_forw_back = (!this.is_valid_pos(back_1) || this.sq_at_pos(back_1).revealed || this.sq_at_pos(back_1).flagged) 
            && (!this.is_valid_pos(forward_2) || this.sq_at_pos(forward_2).revealed || this.sq_at_pos(forward_2).flagged);

        // check up direction
        if(check_forw_back && (!this.is_valid_pos(back_1_up_1) || this.sq_at_pos(back_1_up_1).revealed || this.sq_at_pos(back_1_up_1).flagged)) {
            let below = [back_1_down_1, down_1, forward_1_down_1, forward_2_down_1];
            let check = true;
            below.forEach(pos => {
                if(!(!this.is_valid_pos(pos) || this.sq_at_pos(pos).revealed || this.sq_at_pos(pos).flagged)) {
                    check = false;
                }
            })
            if(check && this.is_valid_pos(forward_2_up_1) && !this.sq_at_pos(forward_2_up_1).flagged && !this.sq_at_pos(forward_2_up_1).revealed) {
                this.to_reveal.push(this.sq_at_pos(forward_2_up_1));
                this.sq_at_pos(forward_2_up_1).bomb_prob = 0;
            }
            
        }
        // check down direction
        if(check_forw_back && (!this.is_valid_pos(back_1_down_1) || this.sq_at_pos(back_1_down_1).revealed || this.sq_at_pos(back_1_down_1).flagged)) {
            let above = [back_1_up_1, up_1, forward_1_up_1, forward_2_up_1];
            let check = true;
            above.forEach(pos => {
                if(!(!this.is_valid_pos(pos) || this.sq_at_pos(pos).revealed || this.sq_at_pos(pos).flagged)) {
                    check = false;
                }
            })
            if(check && this.is_valid_pos(forward_2_down_1) && !this.sq_at_pos(forward_2_down_1).flagged && !this.sq_at_pos(forward_2_down_1).revealed) {
                this.to_reveal.push(this.sq_at_pos(forward_2_down_1));
                this.sq_at_pos(forward_2_down_1).bomb_prob = 0;
                
            }
        }
    }

    reveal_all() {
        this.to_reveal.forEach( sq => {
            this.reveal_squares(sq.pos);
        })
        this.to_reveal = [];
    }

    flag_all() {
        this.to_flag.forEach( sq => {
            if(!sq.flagged) {
                sq.flagged = true;
                this.flags++;
            }
            
        })
        this.to_flag = [];
    }

    set_standard_probs() {
        this.standard_prob = Math.round(100 * (99 - this.flags) / (this.num_unopened_squares - this.flags))
        this.grid.flat(1).forEach( sq => {
            if(!sq.revealed && !sq.flagged) {
                sq.bomb_prob = this.standard_prob;
            }
        })
    }

    check_edges() {
        let to_delete = [];
        let lowest_sq;
        let lowest_prob = 100;
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
            else {
                //set bomb probabilities
                let bomb_prob = Math.round(100 * (edge_square.surr_bombs - num_surr_flags) / unrev_squares.length);
                unrev_squares.forEach( sq => {
                    if(sq.bomb_prob != 0 && (bomb_prob > sq.bomb_prob || sq.bomb_prob == this.standard_prob)) {
                        sq.bomb_prob = bomb_prob;
                    }
                    if(sq.bomb_prob < lowest_prob) {
                        lowest_prob = sq.bomb_prob;
                        lowest_sq = sq;
                    }
                })
            }
            
            // check if any obvious square clears
            if(num_surr_flags == edge_square.surr_bombs) {
                unrev_squares.forEach( unrev => {
                    this.to_reveal.push(unrev);
                    unrev.bomb_prob = 0;
                })
                to_delete.push(key);
            }
            // check if any obvious bomb flags
            if(unrev_squares.length == edge_square.surr_bombs - num_surr_flags) {
                unrev_squares.forEach( unrev => {
                    this.to_flag.push(unrev);
                    unrev.bomb_prob = 100;
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
                            this.two_one_pattern(sq_pos, dir);

                        }
                        
                        //1/1 pattern
                        else if(this.sq_at_pos(new_pos).surr_bombs - new_num_surr_flags == 1) {
                            this.one_one_pattern(sq_pos, dir);
                        }
                    }
                });
                
            }
        })
        if(this.to_reveal.length == 0 && to_delete.length == 0 ) {
            if(lowest_sq != null) {
                this.to_reveal.push(lowest_sq);
            }
            // any stray islands
            else {
                this.grid.flat(1).forEach( sq => {
                    if(!sq.revealed && !sq.flagged) {
                        if(sq.bomb_prob > 50) {
                            this.to_flag.push(sq);
                        }
                        else {
                            this.to_reveal.push(sq);
                        }
                    }
                })
                return 100;
            }

        }
        to_delete.forEach( key => this.edge_squares.delete(key) );
        return lowest_prob;
    }

    reveal_squares(pos) {
        let curr_square = this.grid[pos[0]][pos[1]];

        if(curr_square.surr_bombs > 0 || curr_square.revealed || curr_square.bomb) {
            if(curr_square.surr_bombs > 0 && !curr_square.revealed) {
                this.edge_squares.set(curr_square.id, curr_square);
            }
            if(!curr_square.revealed) {
                this.num_unopened_squares--;

            }
            curr_square.revealed = true;
            if(curr_square.bomb == true) {
                this._lost = true;
            }
            
            return;
        }
        this.surr_squares(pos).forEach((square) => {
            if(!curr_square.revealed) {
                this.num_unopened_squares--;
            }
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
        return this.num_unopened_squares <= 99;
    }
}