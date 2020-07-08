import React from 'react';

export default class GameOver extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            color_class: "normal"
        }
        this.try_again = this.try_again.bind(this);
        this.go_green = this.go_green.bind(this);
        this.go_default = this.go_default.bind(this);
    }

    try_again() {
        this.setState({ color_class: "normal" })
        this.props.restart();
    }

    go_green() {
        this.setState({ color_class: "hover" })
    }

    go_default() {
        this.setState({ color_class: "normal" })
    }

    render() {
        if(!this.props.show) {
            return null;
        }
        let message = "";
        let color;
        if(this.props.won && !this.props.lost) {
            message = `YOU WON! Congratulations!\nYour time: ${this.props.time}\nPlay Again?`;
            color = "congrats";
        }
        else {
            if(this.props.cheated) {
                message = `The solver hit a bomb! Unlucky!\nYour odds of losing on that square: ${this.props.loss_odds} %\nPlay Again?`;
            }
            else{
                message = `You lost! Better luck next time!\nYour time: ${this.props.time}\nPlay Again?`;
            }
            color = "loser";
        }
        return (
            <div className={"gameover " + color}>
                {message}
                <div className={this.state.color_class} onClick={this.try_again}
                onMouseEnter={this.go_green}
                onMouseLeave={this.go_default}>
                    Yes!
                </div>
            </div>
        )
    }
}