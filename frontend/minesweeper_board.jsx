import React from 'react';
import Board from '../backend/board';
import Tile from './tile';

export default class MinesweeperBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            board: new Board(),
            started: false
        }
        this.start = this.start.bind(this);
    }

    start(e) {
        if(!this.state.started)
        {
            this.setState({started: true});
            this.state.board.set_bombs([e.target.key / 100 | 0, e.target.key % 100]);
            //TODO: fix async bug where first tile is revealed before bombs are set
        }
    }

    render() {
        return (
            <div>
                <div className="grid" onClick={this.start}>
                    {
                        this.state.board.grid.flat(1).map((square) => 
                            <Tile sq={square} key={square.id}/>
                        )
                    }
                </div>
            </div>
        )
    }
    
}