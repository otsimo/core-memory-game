/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />

interface Child {
    firstname: string;
    lastname: string;
    language: string;
}

interface Settings {
    show_hint: boolean;
    hint_duration: number;
}

interface Asset {
    name: string;
    path: string;
    type: string;
}

interface DeckItem {
    id: string;
    kind: string;
    audio: string;
    tint: string;
    text: string;
    image: string;
}

interface OtsimoGame {
    session_step: number;
    deck1: string;
    deck2: string;

    scene_enter_duration: number;
    scene_leave_duration: number;

    balloon_options: any;

    card_hide_duration: number;
    card_show_duration: number;
    card_turnoff_duration: number;
    card_collect_duration: number;
}

interface DeckLayout {
    id: string;
    num_of_kinds: number;
    width: number;
    height: number;
    cell_anchor: Phaser.Point;
    items: Array<Phaser.Point>;
}

interface KeyValue {
    preload: Array<Asset>;
    game: OtsimoGame;
    layouts: Array<DeckLayout>;
    announceTextStyle: any;
    announceText: string;
    card_backgrounds: Array<string>;
    deck_colors: Array<DeckItem>;
    deck_star_colors: Array<DeckItem>;
}

interface Manifest {
    unique_name: string;
    version: string;
}

declare namespace otsimo {

    var debug: boolean;
    var sound: boolean;
    var child: Child;
    var width: number;
    var height: number;
    var settings: Settings;
    var iOS: boolean;
    var manifest: Manifest;
    var kv: KeyValue;

    var game: Phaser.Game;

    function quitgame(): void;

    function customevent(event: string, payload: Object): void;

    function log(str: string): void;

    function init(): void;

    function run(callback: Function): void;

    function onSettingsChanged(callback: Function): void;

}

declare module "otsimo" {
    export = otsimo;
}