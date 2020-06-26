import React from 'react';
import Square from '../backend/square';

export default class Tile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            square: this.props.sq,
            bg_color: "greenyellow",
            text: "",
            revealed: false
        }
        this.handle_click = this.handle_click.bind(this);
    }

    handle_click(e) {
        if(!this.state.revealed) {
            if(this.state.square.bomb) {
                this.setState({ bg_color: "red" });
            }
            else {
                this.setState({ bg_color: "lightblue", text: this.state.square.surr_bombs.toString() });
            }
            this.setState({ revealed: true });
        }
    }

    render() {
        return (
            <div className="tile" style={{backgroundColor:this.state.bg_color}} onClick={this.handle_click}>
                {this.state.text}
            </div>
        )
    }
}