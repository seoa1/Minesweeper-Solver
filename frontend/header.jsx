import React from 'react';
import Timer from './timer';
import FlagCounter from './flag_counter';

const Header = ({ time, num_flags }) => (
    <div className="header">
        <FlagCounter num_flags={num_flags}/>
        <Timer time={time}/>
    </div>
)

export default Header;