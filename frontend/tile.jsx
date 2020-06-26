import React from 'react';
import Square from '../backend/square';

export default class Tile extends React.Component{
    constructor(props) {
        super(props);

        this.handle_click = this.handle_click.bind(this);
        this.flag = this.flag.bind(this);
    }

    handle_click(e) {
        this.props.upd(this.props.sq, false);
    }

    flag(e) {
        e.preventDefault();
        if(this.props.sq.flagged) {
            this.props.sq.flagged = false;
        }
        else {
            this.props.sq.flagged = true;
        }
        this.props.upd(this.props.sq, true);
    }

    render() {
        let status;
        let text = "";
        let square = this.props.sq;
        if(square.revealed) {
            if(square.bomb) {
                status = "bomb";
            }
            else{
                if(square.surr_bombs > 0 && !square.bomb) {
                    text = square.surr_bombs.toString();
                }
                status = "reveal";
            }
        }
        else{
            if(square.flagged) {
                status = "flag";
            }
            else {
                status = "hidden";
            }
        }
        
        return (
            <div className={"tile " + status} onClick={this.handle_click} onContextMenu={this.flag}>
                {text}
            </div>
        )
    }
}
