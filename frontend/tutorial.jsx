import React from 'react';

export default class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
        this.next_page = this.next_page.bind(this);
    }

    next_page() {
        this.setState({page: this.state.page + 1});
    }

    first_page() {
        return (
            <div>
                <h1>Welcome to Minesweeper Solver!</h1>
                <p>You can either play Minesweeper like, normal, or have an AI solve it for you!
                    To skip the tutorial, click the x button in the top right. To learn how to play Minesweeper, or to learn how the solver works, click the right arrow!
                </p>
            </div>
        )
    }

    render() {
        return(
            <div className="cover">
                <div className="tutorial">
                    <img className="close_tut" onClick={this.props.hide} src="./images/x_button.png"/>
                    <img className="rightarr" onClick={this.next_page} src="./images/right__arrow.png"/>
                </div>
            </div>
            
        )
    }
}