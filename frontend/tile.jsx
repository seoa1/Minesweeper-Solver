import React from 'react';

export default class Tile extends React.Component{
    constructor(props) {
        super(props);

        this.handle_click = this.handle_click.bind(this);
        this.flag = this.flag.bind(this);
        this.prob_color = this.prob_color.bind(this);
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

    prob_color() {
        let sq_bomb_prob = this.props.sq.bomb_prob;
        if(sq_bomb_prob == 100) {
            return "guarantee";
        }
        else if(sq_bomb_prob >= 80) {
            return "high";
        }
        else if(sq_bomb_prob >= 60) {
            return "midhigh";
        }
        else if(sq_bomb_prob >= 40) {
            return "mid";
        }
        else if(sq_bomb_prob >= 30) {
            return "middishlow";
        }
        else if(sq_bomb_prob >= 20) {
            return "midlow";
        }
        else if(sq_bomb_prob > 0) {
            return "low";
        }
        return "zero";
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
                if(this.props.cheated) {
                    text = this.props.sq.bomb_prob.toString();
                    status = "cheater " + this.prob_color();
                }
                else {
                    status = "hidden";
                }
            }
        }
        
        return (
            <div className={"tile " + status} onClick={this.handle_click} onContextMenu={this.flag}>
                {text}
            </div>
        )
    }
}
