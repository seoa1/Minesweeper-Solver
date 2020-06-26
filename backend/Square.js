

export default class Square {
    constructor(id) {
        this._surr_bombs = 0;
        this._bomb = false;
        this._flagged = false;
        this._id = id;
        this._pos = [this._id / 100 | 0, this._id % 100 | 0];
        this._revealed = false;
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

    set revealed(revealed) {
        this._revealed = revealed;
    }

    get revealed() {
        return this._revealed;
    }

    get pos() {
        return this._pos;
    }

    get bomb() {
        return this._bomb;
    }

    get id() {
        return this._id;
    }

    get surr_bombs() {
        return this._surr_bombs;
    }

    get flagged() {
        return this._flagged;
    }
}