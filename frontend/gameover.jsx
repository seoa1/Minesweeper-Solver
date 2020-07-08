import React from 'react';

export default class GameOver extends React.Component {
    constructor(props) {
        super(props)
        this.try_again = this.try_again.bind(this);
    }

    try_again() {
        this.setState({ color_class: "normal" })
        this.props.restart();
    }

    render() {
        if(!this.props.show) {
            return null;
        }
        let message = "";
        if(this.props.won && !this.props.lost) {
            message = `YOU WON! Congratulations!\nYour time: ${this.props.time}\nPlay Again?`;
        }
        else {
            if(this.props.cheated) {
                message = `The solver hit a bomb! Unlucky!\nYour odds of losing on that square: ${this.props.loss_odds} %\nPlay Again?`;
            }
            else{
                message = `You lost! Better luck next time!\nYour time: ${this.props.time}\nPlay Again?`;
            }
        }
        return (
            <div className="gameover">
                {message}
                <div className="overbutton" onClick={this.try_again}>
                    Yes!
                </div>
            </div>
        )
    }
}