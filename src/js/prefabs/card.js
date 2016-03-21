
export default class Card extends Phaser.Group {
    constructor({game, x, y, item, background, anchor}) {
        super(game)
        this.item = item;
        this.name = item.text;
        this.x = x;
        this.y = y;
        this.wrongAnswerCount = 0
        this.hidden = false

        let back = this.create(0, 0, background)
        back.inputEnabled = true
        back.anchor = anchor
        back.events.onInputDown.add(this.bodyTouched, this)

        let front = this.create(0, 0, item.image)
        front.inputEnabled = true
        front.anchor = anchor
        front.visible = false
        front.tint = parseInt(item.tint, 16);
        front.events.onInputDown.add(this.bodyTouched, this)

        this.back = back
        this.front = front
        this.isClosed = true
        this.onInputDown = new Phaser.Signal()
    }

    bodyTouched(obj, pointer) {
        this.onInputDown.dispatch();
    }

    get id() {
        return this.item.id
    }

    get kind() {
        return this.item.kind
    }

    playSound() {
        this.game.sound.play(this.item.audio);
    }

    highlight() {
        let dur = 150
        let ns = this.scale.x * 1.2
        otsimo.game.add.tween(this.scale).to({ x: ns, y: ns }, dur, Phaser.Easing.Back.Out, true)
        return dur
    }

    turnOn() {
        this.front.scale.x = 0
        this.front.visible = true

        let back = otsimo.game.add.tween(this.back.scale)
            .to({ x: 0 }, otsimo.kv.game.card_hide_duration, Phaser.Easing.Sinusoidal.In);
        let front = otsimo.game.add.tween(this.front.scale)
            .to({ x: 1 }, otsimo.kv.game.card_show_duration, Phaser.Easing.Sinusoidal.Out);
        front.onComplete.addOnce(() => { this.back.visible = false }, this);
        back.chain(front)
        back.start();
        this.isClosed = false

        this.playSound();
        return otsimo.kv.game.card_hide_duration + otsimo.kv.game.card_show_duration
    }

    turnOff() {
        this.back.scale.x = 0
        this.back.visible = true

        let front = otsimo.game.add.tween(this.front.scale)
            .to({ x: 0 }, otsimo.kv.game.card_turnoff_duration / 2, Phaser.Easing.Sinusoidal.In);
        let back = otsimo.game.add.tween(this.back.scale)
            .to({ x: 1 }, otsimo.kv.game.card_turnoff_duration / 2, Phaser.Easing.Sinusoidal.Out);
        back.onComplete.addOnce(() => { this.front.visible = false }, this);
        front.chain(back)
        front.start();

        this.isClosed = true
        return otsimo.kv.game.card_turnoff_duration;
    }

    toggle() {
        if (this.isClosed) {
            return this.turnOn()
        } else {
            return this.turnOff()
        }
    }

    collect() {
        let front = otsimo.game.add.tween(this)
            .to({ y: this.y - 75 }, otsimo.kv.game.card_collect_duration, Phaser.Easing.Cubic.Out)
            .to({ y: this.y }, otsimo.kv.game.card_collect_duration, Phaser.Easing.Cubic.In)
        front.onComplete.addOnce(() => {
            this.emitStars({ x: this.worldPosition.x, y: this.worldPosition.y })
        }, this);
        front.start();
        return otsimo.kv.game.card_collect_duration * 2
    }

    emitStars(pointer) {
        let emitter = otsimo.game.add.emitter(pointer.x, pointer.y, 100);
        emitter.makeParticles('ballon_star');
        emitter.gravity = 500;
        emitter.setYSpeed(-500, 0);
        emitter.width = this.front.width;
        emitter.height = this.front.width / 2;
        emitter.start(true, 4000, null, 10);
        otsimo.game.time.events.add(4000, emitter.destroy, emitter);
        emitter.forEach((a, c) => {
            a.tint = c;
        }, this, true, this.front.tint);
        this.destroy(true);
    }
}