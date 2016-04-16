export default class TimerManager {
    constructor() {
        this.queue = [];
        this.i = 0;
        this.halt = false;
        this.events = [];
    }
    
    chain(second, func, context) {
        console.log("chaining");
        this.halt = false;
        this.queue.push({
            "second": second,
            "func": func,
            "context": context
        });
        console.log("queue after chain: ", this.queue);
        console.log("i after chain: ", this.i);
    }
    
    begin() {
        console.log("in timemanager begin");
        console.log("queue is: ", this.queue);
        console.log(this.i);
        if (this.halt) {
            return;
        }
        if (this.queue[this.i] == undefined) {
            console.log("queue ended");
            return;
        }
        let cur = this.queue[this.i];
        this.events.push(otsimo.game.time.events.add(cur.second, this.next, this, cur));
    }
    
    next(cur) {
        console.log("in timemanager next");
        if (this.halt) {
            return;
        }
        let f = cur.func;
        let cont = cur.context;
        console.log(cont);
        console.log(f);
        f.call(cont);
        (this.i)++;
        this.begin();
    }
    
    stopTimer() {
        console.log("stopped timer");
        otsimo.game.time.events.removeAll();
        this.halt = true;
        this.queue = [];
        this.i = 0;
        console.log("i becomes: ", this.i);
        console.log("queue becomes: ", this.queue);
    }
}