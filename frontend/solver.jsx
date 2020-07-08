import React from 'react';

const Solver = ({ solve, cheated }) => {
    const handle_click = () => {
        if(!cheated) {
            solve();
        }
    }
    return (
        <div className="button" onClick={handle_click}>
            SOLVE!
        </div>
    )
    
}

export default Solver;