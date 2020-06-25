

export default class Square {
    constructor() {
        this._surr_bombs = 0;
        this._bomb = false;
        this._flagged = false;
    }

    set flagged(flagged) {
        this._flagged = flagged;
    }

    set bomb(bomb) {
        this._bomb = bomb;
    }

    set surr_bombs(surr_bombs) {
        this._surr_bombs = surr_bombs;
    }

    get bomb() {
        return this._bomb;
    }

    get surr_bombs() {
        return this._surr_bombs;
    }

    get flagged() {
        return this._flagged;
    }
}