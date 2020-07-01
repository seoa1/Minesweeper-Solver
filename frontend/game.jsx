import React from 'react';
import Board from '../backend/board';
import ReactBoard from './react_board';
import Header from './header';

export default class Game extends React.Component {
    constructor() {
        super();
        this.started = false;
        this.num_flags = 99;
        this.state = {
            time: 0,
            board: new Board(),
        }
        this.update_game = this.update_game.bind(this);
    }

    start_timer() {
        this.interval = setInterval(() => this.setState({ time: this.state.time + 1 }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    update_game(square, flagged) {
        if(!this.started) {
            this.state.board.set_bombs(square.pos);
            this.started = true;
            this.start_timer();
        }
        if(!flagged && !square.flagged){
            this.state.board.reveal_squares(square.pos);
        }
        else if(flagged && !square.flagged) {
            this.num_flags++;
        }
        else if(flagged && !square.revealed) {
            this.num_flags--;
        }
        this.setState({ board: this.state.board });
    }

    render() {
        return (
            <div>
                <Header time={this.state.time} num_flags={this.num_flags}/>
                <ReactBoard bd={this.state.board} upd={this.update_game}/>  
            </div>
        )
    }
}