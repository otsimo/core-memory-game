
export default class Card extends Phaser.Group {
    constructor({game, x, y, item, background, anchor}) {
        super(game)
        this.item = item;
        this.name = item.text;
        this.x = x;
        this.y = y;
        // this.tint = parseInt(item.tint, 16);
        this.wrongAnswerCount = 0
        this.hidden = false

        let back = this.create(0, 0, background)
        back.anchor = anchor

        this.background = back
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

    playQuestion() {
        if (typeof this.item.question !== "undefined") {
            this.game.sound.play(this.item.question);
        }
    }

    highlight() {
        let dur = 150
        let ns = this.scale.x * 1.2
        otsimo.game.add.tween(this.scale).to({ x: ns, y: ns }, dur, Phaser.Easing.Back.Out, true)
        return dur
    }
}