import {Randomizer} from "./randomizer"
import Deck from "./prefabs/deck"
import TimerManager from "./timerManager"

export default class Scene {
    constructor({delegate, session}) {
        this.delegate = delegate
        this.session = session
        this.random = new Randomizer()
        this.steps = []
        this.step = 0
        this.timer = new TimerManager();
    }

    get step() {
        return this.current_step | 0;
    }

    set step(value) {
        this.current_step = value;
    }

    next() {
        this.timer.stopTimer();
        console.log("next started");
        console.log("checking timerManager: ", this.timer);
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

            this.deck = deck;
            this.gameStep = next;

            deck.cardsOpened.add(this.onCardsSelected, this)
            this.announce(-100, 300)

            this.session.startStep();
        });
        return true;
    }

    onCardsSelected(card1, card2) {
        if (this.gameStep.done) {
            return;
        }
        if (card1.kind == card2.kind) {
            this.session.correctInput(card1.item,card2.item);
            this.timer.stopTimer();
            let dur = this.deck.collectCards();
            this.timer.chain(dur*2, this.createTimer, this);
            this.timer.begin();
            if (this.deck.remainingCards == 0) {
                this.gameStep.done = true;
                let self = this;
                setTimeout(() => self.hide(), dur * 2);
            }
        } else {
            this.session.wrongInput(card1.item, card2.item);
            this.timer.stopTimer();
            this.createTimer();
            this.deck.closeCards();
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
        //this.createTimer();
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
        otsimo.game.time.events.add(1600 + otsimo.kv.game.scene_enter_duration, this.createTimer, this);
    }

    hide() {
        let at = this.announceText;
        let dur = otsimo.kv.game.scene_leave_duration
        this.deck.moveOut();
        otsimo.game.add.tween(at).to({ alpha: 0 }, dur / 2, Phaser.Easing.Circular.In, true);
        otsimo.game.add.tween(at).to({ y: 0 }, dur / 2, Phaser.Easing.Circular.In, true)

        let self = this
        this.session.incrementHint();
        this.session.addScore();
        setTimeout(() => {
            self.deck.destroy(true)
            at.destroy();
            if (!self.next()) {
                self.delegate.sceneEnded()
            }
        }, dur);
    }

    createTimer () {
        console.log("creating timer");
        this.timer.chain(Phaser.Timer.SECOND * otsimo.settings.hint_duration, this.showHint, this);
        this.timer.begin();
    }

    showHint() {
        console.log("showHint called");
        this.session.hintStep++;
        if (!otsimo.settings.show_hint) {
            console.log("show hint is false");
            return;
        }
        this.timer.stopTimer();
        console.log("showing hint");
        console.log(otsimo.settings.hint_type);
        switch (otsimo.settings.hint_type) {
            case ("single_card"):
                let randCard = this.randomOnScene();
                randCard.turnOn(false);
                this.timer.chain(Phaser.Timer.SECOND, randCard.turnOff, randCard);
                this.timer.chain(Phaser.Timer.SECOND, this.createTimer, this);
                this.timer.begin();
                break;
            case ("all_cards"):
                console.log("returning");
                return;
                for (let i of this.deck.cards) {
                    if ((this.deck.openedCards.length > 0) && i.item.id == this.deck.openedCards[0].item.id) {
                        continue;
                    } else {
                        i.turnOnOff();
                    }
                }
                otsimo.game.time.events.add(Phaser.Timer.SECOND, this.createTimer, this);
                break;
        }
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