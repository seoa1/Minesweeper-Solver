import React from 'react';
import Board from '../backend/board';
import ReactBoard from './react_board';
import Header from './header';
import GameOver from './gameover';

export default class Game extends React.Component {
    constructor() {
        super();
        this.started = false;
        this.state = {
            time: 0,
            board: new Board(),
            show_modal: false,
            cheated: false
        }
        this.update_game = this.update_game.bind(this);
        this.restart_game = this.restart_game.bind(this);
        this.show_game_over = this.show_game_over.bind(this);
        this.solve = this.solve.bind(this);
        this.take_step = this.take_step.bind(this);
        this.loss_odds = 0;
    }

    start_timer() {
        this.interval = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.solve_interval);
    }

    restart_game() {
        this.started = false;
        this.setState({ cheated: false, time: 0, board: new Board(), show_modal: false });
    }

    solve() {
        this.setState({ cheated: true });
        const REVEAL_INTERVAL = 90;
        if(!this.started) {
            // regular execution
            let rand_pos = [Math.random() * 16 | 0, Math.random() * 30 | 0];
            this.state.board.set_bombs(rand_pos);
            this.state.board.reveal_squares(rand_pos);

            //test suite
            // let test_start = [0,0];
            // this.state.board.set_bombs_test_grid();
            // this.state.board.reveal_squares(test_start);

            this.started = true;
            
            this.setState({ board: this.state.board});
        }
        else {
            clearInterval(this.interval);
        }
        //this.take_step();    
        this.solve_interval = setInterval(this.take_step, REVEAL_INTERVAL);
    }

    take_step() {
        this.state.board.set_standard_probs();
        let cont = this.state.board.check_edges();
        this.loss_odds = cont;
        this.setState({ board: this.state.board, time: 999 });
        this.state.board.flag_all();
        this.state.board.reveal_all();
        if(this.state.board.lost) {
            this.show_game_over();
            clearInterval(this.solve_interval);
        }
        else if(this.state.board.won) {
            this.show_game_over();
        }
        
        if(cont == 100) {
            clearInterval(this.solve_interval);
        }
    }

    update_game(square, flagged) {
        if(!this.started) {
            this.state.board.set_bombs(square.pos);
            this.started = true;
            this.start_timer();
        }
        if(!flagged && !square.flagged){
            this.state.board.reveal_squares(square.pos);
            if(this.state.board.lost) {
                this.show_game_over();
            }
            else if(this.state.board.won) {
                this.show_game_over();
            }
        }
        else if(flagged && !square.flagged) {
            this.state.board.remove_flag();
        }
        else if(flagged && !square.revealed) {
            this.state.board.add_flag();
        }
        this.setState({ board: this.state.board });
    }

    show_game_over() {
        clearInterval(this.interval);
        this.setState({ show_modal: true });
    }

    render() {
        return (
            <div>
                <GameOver restart={this.restart_game} 
                    won={this.state.board.won} 
                    lost={this.state.board.lost}
                    show={this.state.show_modal} 
                    time={this.state.time} 
                    loss_odds={this.loss_odds}
                    cheated={this.state.cheated}/>
                <Header time={this.state.time} num_flags={99 - this.state.board.num_flags()} solve={this.solve}/>
                <ReactBoard bd={this.state.board} upd={this.update_game} cheated={this.state.cheated}/>  
            </div>
        )
    }
}