import React from 'react';
import Board from '../backend/board';
import ReactBoard from './react_board';
import Header from './header';
import GameOver from './gameover';

export default class Game extends React.Component {
    constructor() {
        super();
        this.started = false;
        this.num_flags = 99;
        this.won = false;
        this.state = {
            time: 0,
            board: new Board(),
            show: false
        }
        this.update_game = this.update_game.bind(this);
        this.restart_game = this.restart_game.bind(this);
        this.show_game_over = this.show_game_over.bind(this);
        this.solve = this.solve.bind(this);
        this.take_step = this.take_step.bind(this);
    }

    start_timer() {
        this.interval = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.solve_interval);
    }

    restart_game() {
        this.num_flags = 99;
        this.started = false;
        this.setState({ time: 0, board: new Board(), show: false });
    }

    solve() {
        const REVEAL_INTERVAL = 0;
        if(!this.started) {
            let rand_pos = [Math.random() * 16 | 0, Math.random() * 30 | 0];
            this.state.board.set_bombs(rand_pos);
            this.started = true;
            this.state.board.reveal_squares(rand_pos);
            this.setState({ board: this.state.board});
        }
        else {
            clearInterval(this.interval);
        }    
        this.solve_interval = setInterval(this.take_step, REVEAL_INTERVAL);
    }

    take_step() {
        let cont = this.state.board.check_edges();
        this.setState({ board: this.state.board, time: 999 });
        console.log("running");
        if(!cont) {
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
                this.show_game_over(false);
            }
            else if(this.state.board.won) {
                this.show_game_over(true);
            }
        }
        else if(flagged && !square.flagged) {
            this.num_flags++;
        }
        else if(flagged && !square.revealed) {
            this.num_flags--;
        }
        this.setState({ board: this.state.board });
    }

    show_game_over(winner) {
        clearInterval(this.interval);
        this.won = winner;
        this.setState({ show: true });
    }

    render() {
        return (
            <div>
                <GameOver restart={this.restart_game} won={this.won} show={this.state.show} time={this.state.time}/>
                <Header time={this.state.time} num_flags={this.num_flags} solve={this.solve}/>
                <ReactBoard bd={this.state.board} upd={this.update_game}/>  
            </div>
        )
    }
}