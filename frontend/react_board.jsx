import React from 'react';
import Tile from './tile';



const ReactBoard = ({bd, upd}) => (
    <div>
                <div className="grid">
                    {
                        bd.grid.flat(1).map((square) => 
                            <Tile sq={square} key={square.id} upd={upd}/>
                        )
                    }
                </div>
            </div>
)

export default ReactBoard;