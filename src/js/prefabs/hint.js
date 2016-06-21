export default class Hint {
    constructor({game, deck}) {
        this.game = game;
        this.deck = deck;
        this.step = 0;
        this.tween = undefined;
        this.timer = undefined;
        this.halt = false;
        this.tweenArr = [];
        this.timerArr = [];
    }
    
    /**
     * Call hint timer
     * Timer is calls hint otsimo.settings.hint_duration seconds with delay
     * @param {integer} delay for outside conditions
     */
    
    call(delay) {
        if (!otsimo.settings.show_hint) {
            return;
        }
        //console.log("removetimer called from call");
        this.removeTimer();
        console.log("hint called");
        if (otsimo.kv.game.hint_type == "switch_one") {
                console.log("switch_one case");
                this.timer = otsimo.game.time.events.add(delay + (otsimo.settings.hint_duration * 1000), this.switchOne, this);
                this.timerArr.push(this.timer);
        }
    }
    
    /**
     * Kill hint from scene if needed
     * Also destroys tweens
     */
    
    kill() {
        this.tweenArr = [];
        switch (otsimo.kv.game.hint_type) {
            case ("switch_one"):
                this.killTween();
                break;
        }
    }
    
    /**
     * Removes timer calls if there was any
     * Does not affect active tweens
     */
    
    removeTimer() {
        console.log("removetimer called from hint");
        otsimo.game.time.events.stop(false);
        if (this.timer) {
            otsimo.game.time.events.remove(this.timer);
            this.timer = undefined;
        }
        otsimo.game.time.events.start();
    }
    
    incrementStep() {
        this.step++;
    }
    
    switchOne() {
        if (this.deck.openedCards.length >= 2) {
            return;
        }
        let randCard = this.random();
        let dur = randCard.turnOnOff();
        this.call(dur);
    }
    
    killTween() {
        // not needed for now
    }
    
    random() { 
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