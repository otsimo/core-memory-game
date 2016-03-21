import {shuffle} from "./utils"

export class GameStep {
    constructor({amount, layout, items, deck}) {
        this.amount = amount;
        this.layout = layout;
        this.items = items;
        this.deck = deck;
    }
}

export class Randomizer {
    constructor() {
        let kinds = new Set();
        let sizes = new Set();
        //select kinds only if there are on both from and to
        let fromKinds = new Set();
        let _from = otsimo.kv[otsimo.kv.game.deck1];
        let _to = otsimo.kv[otsimo.kv.game.deck2];
        for (let i of _from) {
            fromKinds.add(i.kind)
        }
        for (let i of _to) {
            if (fromKinds.has(i.kind)) {
                kinds.add(i.kind);
            }
        }
        for (let i of otsimo.kv.layouts) {
            sizes.add(i.num_of_kinds);
        }

        this._from = _from;
        this._to = _to;
        this.sizes = [...sizes];
        this.values = new Set(kinds.values());
        this.kinds = kinds;
        this.layouts = new Map();
    }

    randomAmount(pre) {
        let n = 0
        let min = 1000
        for (let a of pre) {
            n = n + a
            if (a < min) {
                min = a
            }
        }
        for (let a of this.sizes) {
            if (a < min) {
                min = a
            }
        }
        let remain = otsimo.kv.game.session_step - n;
        let f = this.sizes.filter(s => {
            let is_big = s > remain;
            let is_small = (remain - s) < min
            return !is_big && !is_small;
        });
        return f[Math.floor(Math.random() * f.length)]
    }

    randomKind() {
        let randomNumber = Math.floor(Math.random() * this.values.size);
        return [...this.values][randomNumber];
    }

    randomItemOfKind(set, kind, excluded) {
        let f = [...set].filter(l => {
            if (kind != null && l.kind != kind) {
                return false;
            }
            if (excluded != null && excluded.indexOf(l.kind) >= 0) {
                return false;
            }
            return true;
        });

        return f[Math.floor(Math.random() * f.length)]
    }

    randomLayout(size) {
        let ks = []
        for (let [key, value] of this.layouts) {
            ks.push({ "id": key, "amount": value });
        }

        if (ks.length == 0) {
            for (let i of otsimo.kv.layouts) {
                if (i.num_of_kinds == size) {
                    ks.push({ "id": i.id, "amount": i.num_of_kinds });
                    this.layouts.set(i.id, i.num_of_kinds);
                }
            }
        }
        let rn = Math.floor(Math.random() * ks.length);
        let k = ks[rn];
        console.log("random n", size, rn, ks.length, otsimo.kv.layouts)
        this.layouts.delete(k.id)
        return k
    }

    randomDeckBackground() {
        return otsimo.kv.card_backgrounds[Math.floor(Math.random() * otsimo.kv.card_backgrounds.length)]
    }

    next(preSteps) {
        if (this.values.size == 0) {
            this.values = new Set(kinds.values());
        }

        let items = []
        let n = this.randomAmount(preSteps);

        for (let i = 0; i < n; i++) {
            let k = this.randomKind()
            let item1 = this.randomItemOfKind(this._to, k, [])
            let item2 = this.randomItemOfKind(this._from, k, [])
            items.push(item1)
            items.push(item2)
            this.values.delete(k);
        }

        return new GameStep({
            amount: n,
            layout: this.randomLayout(n),
            items: shuffle(items),
            deck: this.randomDeckBackground()
        });
    }
}