import {shuffle} from "./utils"
import {Randomizer} from "./randomizer"
import Deck from "./prefabs/deck"

export default class Scene {
    constructor({delegate, session}) {
        this.delegate = delegate
        this.session = session
        this.random = new Randomizer()
        this.steps = []
        this.step = -1
    }

    get step() {
        return this.current_step | 0;
    }

    set step(value) {
        this.current_step = value;
    }

    next() {
        if (this.step >= otsimo.kv.game.session_step) {
            return false
        }
        let next = this.random.next(this.steps);
        this.step += next.amount;
        this.steps.push(next.amount);

        let deck = new Deck({
            game: otsimo.game,
            items: next.items,
            layout: next.layout.id,
            cardBackground: next.deck
        })

        this.deck = deck;
        this.gameStep = next;

        deck.cardsOpened.add(this.onCardsSelected, this)
        this.announce(-100, 300)

        this.session.startStep();
        return true;
    }

    onCardsSelected(card1, card2) {
        if (this.gameStep.done) {
            return
        }
        if (card1.kind == card2.kind) {
            let dur = this.deck.collectCards()
            if (this.deck.remainingCards == 0) {
                this.gameStep.done = true
                let self = this
                setTimeout(() => self.hide(), dur * 2);
            }
        } else {
            this.deck.closeCards()
        }
        /*
        if (this.gameStep.done) {
            return
        }
        if (this.gameStep.answer.kind == card.item.kind) {
            this.gameStep.done = true
            let dur = card.highlight()
            for (let b of this.deck.cards) {
                if (b.id != card.id) {
                    this.deck.fadeOffItem(b, dur / 2);
                }
            }
            card.playSound();
            this.session.correctInput(card.item)

            let self = this
            setTimeout(() => self.hide(), dur * 4);
        } else {
            card.wrongAnswerCount += 1
            if (card.wrongAnswerCount >= otsimo.kv.game.hide_item_on) {
                this.deck.hideAnItem(card.id)
            }
            this.session.wrongInput(card.item, card.wrongAnswerCount)
        }*/
    }

    announce(leaveY, leaveTime) {
        let txt = otsimo.kv.announceText;
        let text = otsimo.game.add.text(otsimo.game.world.centerX, otsimo.game.world.centerY * 0.7, txt, otsimo.kv.announceTextStyle);

        text.anchor.set(0.5, 0.5);
        text.alpha = 0.1;
        text.fill = '#000000'
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
        let at = this.announceText;
        let dur = otsimo.kv.game.scene_leave_duration
        this.deck.moveOut();
        otsimo.game.add.tween(at).to({ alpha: 0 }, dur / 2, Phaser.Easing.Circular.In, true);
        otsimo.game.add.tween(at).to({ y: 0 }, dur / 2, Phaser.Easing.Circular.In, true)

        let self = this
        setTimeout(() => {
            self.deck.destroy(true)
            at.destroy();
            if (!self.next()) {
                self.delegate.sceneEnded()
            }
        }, dur);
    }

    showHint() {

    }

}