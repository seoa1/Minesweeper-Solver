import React from 'react';
import Timer from './timer';
import FlagCounter from './flag_counter';
import Solver from './solver';

const Header = ({ time, num_flags, solve, cheated }) => (
    <div className="header">
        <FlagCounter num_flags={num_flags}/>
        <Timer time={time}/>
        <Solver solve={solve} cheated={cheated}/>
    </div>
)

export default Header;