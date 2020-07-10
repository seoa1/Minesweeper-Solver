import React from 'react';

export default class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            right: true,
            left: false
        }
        this.next_page = this.next_page.bind(this);
        this.get_page = this.get_page.bind(this);
        this.first_page = this.first_page.bind(this);
        this.prev_page = this.prev_page.bind(this);
        this.second_page = this.second_page.bind(this);
        this.third_page = this.third_page.bind(this);
    }

    next_page() {
        this.state.page++;
        if(this.state.page < 3) {
            this.state.right = true;
        }
        else {
            this.state.right = false;
        }
        if(this.state.page > 1) {
            this.state.left = true;
        }
        else {
            this.state.left = false;
        }
        this.setState({ page: this.state.page, left: this.state.left });
    }

    prev_page() {
        this.state.page--;
        if(this.state.page < 3) {
            this.state.right = true;
        }
        else {
            this.state.right = false;
        }
        if(this.state.page > 1) {
            this.state.left = true;
        }
        else {
            this.state.left = false;
        }
        this.setState({ page: this.state.page, left: this.state.left });
    }

    first_page() {
        return (
            <div className="page1">
                <h1>Welcome to Minesweeper Solver!</h1>
                <p>
                    This is a quick tutorial for those who haven't played Minesweeper before, or for those who want to know more about how the solver works!
                    If you're neither of these, go ahead and click the x at the top right of the screen.
                    Otherwise, click the arrow on the right!
                    <br/>
                    <br/>
                    Contents:
                    <br/>
                    Page 2: How to Play
                    <br/>
                    Page 3: How the solver works
                    <br/>
                </p>
                <img src="./images/cover_page.png" className="coverpic"/>
            </div>
        )
    }

    second_page() {
        return (
            <div>
                <h1>How to Play</h1>
                <p>
                    Minesweeper is actually quite a simple game to understand. The board is a 16 x 30 grid of tiles. 
                    In total, there are 99 bombs scattered randomly within this grid. 
                    The goal of the game is to reveal all of the squares that don't have a bomb hidden underneath, without revealing any of the bombs.
                    If you accidentally reveal a bomb, you lose!
                    <img className="boardpng" src="./images/board_screenshot.png"/>

                    There are two controls: left-click and right-click. 
                    Left clicking reveals a square. That square will either be blank, or will have a number on it.
                    If the square is blank, that means that there are no bombs in the eight squares surrounding that square! If this happens,
                    all eight of the surrounding squares will also be revealed. As you might imagine, this effect can chain, revealing a large chunk of squares!
                    If the square has a number, that indicates how many bombs are in the eight surrounding squares. Use this as a hint to deduce where the bombs are!
                    Right-clicking will flag a square. This is used to indicate to yourself that you think that a bomb is underneath that square. If you want to remove
                    the flag later, just right-click it again. You cannot left-click a square that is flagged.
                </p>

            </div>
        )
    }

    third_page() {
        return (
            <div>
                <h1>How the Solver works</h1>
                <img className="solverpng" src="./images/solver_screenshot.png"/>

                <p>
                    The solver uses an algorithm that keeps track of all of the edge squares on the board (the revealed squares that have unrevealed adjacent squares).
                    From these edge squares, the algorithm first checks for trivial flags or reveals, where the number of unrevealed squares is equal to the number of surrounding bombs
                    unaccounted for, or all of a square's surrounding squares have been flagged, meaning that any other unrevealed squares will not have a bomb. Then, the 
                    solver detects numerical patterns in the square values that can be used to guarantee a square having a bomb or not having a bomb, even without incomplete information.
                    Once the solver is unable to find any trivial solutions or detect any patterns, it calculates the probability of each of the remaining unrevealed squares of containing a bomb,
                    and selects the square that gives the solver the highest probability of success.

                </p>

            </div>
        )
    }

    get_page() {
        switch(this.state.page) {
            case 1:
                return this.first_page();
            case 2:
                return this.second_page();
            case 3:
                return this.third_page();
            case 4:
                return this.fourth_page();
            case 5:
                return this.fifth_page();
            case 6:
                return this.sixth_page();
            default:
                break;
        }
    }

    render() {
        return(
            <div className="cover">
                <div className="tutorial">
                    {this.get_page()}
                    <img className="close_tut" onClick={this.props.hide} src="./images/x_button.png"/>
                    {this.state.right ? 
                        <img className="rightarr" onClick={this.next_page} src="./images/right__arrow.png"/>
                        : null}
                    {this.state.left ? 
                        <img className="leftarr" onClick={this.prev_page} src="./images/left_arrow.png"/>
                        : null}
                </div>
            </div>
            
        )
    }
}