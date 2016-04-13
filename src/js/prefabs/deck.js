import Card from './card'

export default class Deck extends Phaser.Group {
    constructor({game, items, layout, cardBackground}) {
        super(game)
        this.items = items
        this.cards = []
        this.layoutId = layout
        this.cardBackground = cardBackground
        this.initialize()
        this.openedCards = []
        this.cardsOpened = new Phaser.Signal()
        this.remainingCards = items.length
    }

    initialize() {
        let layout = otsimo.kv.layouts.filter(l => l.id == this.layoutId)[0]

        let sx = layout.width / 2.0
        let sy = layout.height / 2.0

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let ii = layout.items[i]
            let card = new Card({
                game: this.game,
                x: sx + ii.x,
                y: sy + ii.y,
                item: item,
                background: this.cardBackground,
                anchor: layout.cell_anchor
            });
            card.onInputDown.add(this.clickListener, { card: card, deck: this });

            this.add(card);
            this.cards.push(card);
        }

        this.visiblePos = {
            x: otsimo.game.world.centerX - sx,
            y: otsimo.game.world.centerY - sy,
        }
        this.hiddenPos = {
            x: otsimo.game.world.width + sx,
            y: otsimo.game.world.centerY - sy,
        }

        this.x = this.hiddenPos.x;
        this.y = this.hiddenPos.y;
    }

    moveIn() {
        let tween = otsimo.game.add.tween(this)
            .to({ x: this.visiblePos.x, y: this.visiblePos.y },
            otsimo.kv.game.scene_enter_duration, Phaser.Easing.Back.Out);

        tween.start();
    }

    moveOut() {
        let tween = otsimo.game.add.tween(this)
            .to({ x: this.hiddenPos.x, y: this.hiddenPos.y }, otsimo.kv.game.scene_leave_duration, Phaser.Easing.Circular.In);

        tween.start();
    }

    clickListener() {
        let self = this.deck
        if (this.card.isAnimating) {
            return;
        }
        if (self.openedCards.length >= 2) {
            return;
        }
        if (self.openedCards.length == 1) {
            let firstOne = self.openedCards[0];
            if (firstOne.id == this.card.id) {
                return
            }
        }
        let dur = this.card.toggle()
        self.openedCards.push(this.card)
        setTimeout(() => {
            if (self.openedCards.length == 2) {
                self.cardsOpened.dispatch(self.openedCards[0], self.openedCards[1])
            }
        }, dur * 2);
        console.log("push to openedcards. openedcards is: ", self.openedCards);
    }

    closeCards() {
        for (let a of this.openedCards) {
            a.turnOff();
        }
        this.openedCards = [];
    }

    collectCards() {
        console.log("collect cards");
        let dur = 0
        for (let a of this.openedCards) {
            let d = a.collect();
            if (d > dur) {
                dur = d
            }
            this.remainingCards = this.remainingCards - 1
        }
        this.openedCards = [];
        return dur;
    }
}