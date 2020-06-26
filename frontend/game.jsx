import React from 'react';
import Board from '../backend/board';
import ReactBoard from './react_board';

export default class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            board: new Board(),
            started: false
        }
        this.update_game = this.update_game.bind(this);
    }

    update_game(square, flagged) {
        if(!this.state.started) {
            this.state.board.set_bombs(square.pos);
            this.setState({started: true});
        }
        if(!flagged && !square.flagged){
            this.state.board.reveal_squares(square.pos);
        }
        this.setState({ board: this.state.board });
    }

    render() {
        return (
            <ReactBoard bd={this.state.board} upd={this.update_game}/>
        )
    }
}