import {Randomizer} from "./randomizer"
import Deck from "./prefabs/deck"
import Hint from "./prefabs/hint"

export default class Scene {
    constructor({delegate, session}) {
        this.delegate = delegate;
        this.session = session;
        this.random = new Randomizer();
        this.steps = [];
        this.step = 0;
    }

    get step() {
        return this.current_step | 0;
    }

    set step(value) {
        this.current_step = value;
    }

    next() {
        console.log("next started");
        console.log("step=", this.step, "all", this.steps)
        if (this.step >= otsimo.kv.game.session_step) {
            return false
        }
        this.random.next(this.steps, (next) => {
            this.step += next.amount;
            this.steps.push(next.amount);

            let deck = new Deck({
                game: otsimo.game,
                items: next.items,
                layout: next.layout.id,
                cardBackground: next.deck
            })
            
            let hint = new Hint({
                game: otsimo.game,
                deck : deck
            })

            this.deck = deck;
            this.hint = hint;
            this.deck.addHint(this.hint);
            this.gameStep = next;

            deck.cardsOpened.add(this.onCardsSelected, this)
            this.announce(-100, 300)

            this.session.startStep();
        });
        this.hint.call(1600);
        return true;
    }

    onCardsSelected(card1, card2) {
        if (this.gameStep.done) {
            return;
        }
        if (card1.kind == card2.kind) {
            this.session.correctInput(card1.item,card2.item);
            let dur = this.deck.collectCards();
            if (this.deck.remainingCards == 0) {
                this.gameStep.done = true;
                let self = this;
                setTimeout(() => self.hide(), dur * 2);
                this.hint.call(dur*2);
            }
        } else {
            this.session.wrongInput(card1.item, card2.item);
            this.deck.closeCards();
            this.hint.call(otsimo.kv.game.card_turnoff_duration)
        }
        
    }

    announce(leaveY, leaveTime) {
        let txt = otsimo.kv.announceText;
        let text = otsimo.game.add.text(otsimo.game.world.centerX, otsimo.game.world.centerY * 0.7, txt, otsimo.kv.announceTextStyle);

        text.anchor.set(0.5, 0.5);
        text.alpha = 0.1;
        text.fill = "#000000"
        this.announceText = text;

        otsimo.game.add.tween(text).to({ alpha: 1 }, 100, "Linear", true);
        let a = otsimo.game.add.tween(text).to({ y: otsimo.game.world.centerY }, 300, Phaser.Easing.Circular.Out)
        let b = otsimo.game.add.tween(text).to({ y: leaveY }, leaveTime, Phaser.Easing.Circular.In, false, 1200)
        a.chain(b)
        a.start();

        let deck = this.deck;
        setTimeout(() => {
            deck.moveIn();
        }, 1600);
    }

    hide() {
        this.hint.removeTimer();
        this.hint.kill();
        let at = this.announceText;
        let dur = otsimo.kv.game.scene_leave_duration
        this.deck.moveOut();
        otsimo.game.add.tween(at).to({ alpha: 0 }, dur / 2, Phaser.Easing.Circular.In, true);
        otsimo.game.add.tween(at).to({ y: 0 }, dur / 2, Phaser.Easing.Circular.In, true)

        let self = this
        this.session.addScore();
        setTimeout(() => {
            self.deck.destroy(true)
            at.destroy();
            if (!self.next()) {
                self.delegate.sceneEnded()
            }
        }, dur);
    }

    randomOnScene () {
        let randNum = Math.floor(Math.random() * this.deck.cards.length);
        if (this.deck.openedCards.length > 0) {
            while (this.deck.cards[randNum].item.kind == this.deck.openedCards[0].item.kind) {
                console.log("one of the opened cards or the same kind of it is random");
                randNum = Math.floor(Math.random() * this.deck.cards.length);
            }
        }

        return this.deck.cards[randNum];
    }

}