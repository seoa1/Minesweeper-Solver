import React from 'react';
import Square from '../backend/square';

export default class Tile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handle_click = this.handle_click.bind(this);
    }

    handle_click(e) {
        this.props.upd(this.props.sq);
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
                if(this.props.sq.surr_bombs > 0 && !this.props.sq.bomb) {
                    text = this.props.sq.surr_bombs.toString();
                }
                status = "reveal";
            }
        }
        else{
            status = "hidden";
        }
        
        return (
            <div className={"tile " + status} onClick={this.handle_click} onChange={this.handle_click}>
                {text}
            </div>
        )
    }
}