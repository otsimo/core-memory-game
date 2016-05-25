export default class Hint {
    constructor({game, answer, choice}) {
        this.game = game;
        this.answer = answer;
        this.choice = choice;
        this.step = 0;
        this.tween = undefined;
        this.timer = undefined;
        this.halt = false;
        this.tweenArr = [];
        this.timerArr = [];
    }
    
    call(delay) {
        if (!otsimo.settings.show_hint) {
            return;
        }
        this.removeTimer();
        switch (otsimo.kv.game.hint_type) {
            case ("switch_one"):
                this.timer = otsimo.game.time.events.add(delay + (otsimo.settings.hint_duration * 1000), this.switchOne, this);
                this.timerArr.push(this.timer);
                break;
        }
    }
    
    kill() {
        switch (otsimo.kv.game.hint_type) {
            case ("switch_one"):
                this.killTween();
                break;
        }
    }
    
    removeTimer() {
        
    }
    
    incrementStep() {
        
    }
    
    switchOne() {
        
    }
    
    killTween() {
        
    }
   
    
    
}