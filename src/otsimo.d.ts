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
    step_score: number;
    deck1: string;
    deck2: string;

    scene_enter_duration: number;
    scene_leave_duration: number;

    balloon_options: any;
    balloon_sound: string;

    card_hide_duration: number;
    card_show_duration: number;
    card_turnoff_duration: number;
    card_collect_duration: number;
}

interface TextShadow {
    x: number;
    y: number;
    color: string;
    blur: number;
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

    custom_announce_color: string;
    background_image: string;
    play_background_color: string;
    home_background_color: string;
    over_background_color: string;
    decoration: Array<DecorationItem>;
    name_shadow: TextShadow;
    gameNameTextStyle: any;
    gameNameLayout: XYAnchorLayout;
    homePlayButton: XYAnchorLayout;
    game_music: MusicInfo;
}

interface Manifest {
    unique_name: string;
    version: string;
    metadata: Array<LanguageMetadata>;
}

interface GameLayoutAxisEntry {
    multiplier: number;
    constant: number;
}

interface XYAnchorLayout {
    anchor: Phaser.Point;
    x: GameLayoutAxisEntry;
    y: GameLayoutAxisEntry;
}

interface DecorationItem {
    image: string;
    frame: string;
    anchor: Phaser.Point;
    x: GameLayoutAxisEntry;
    y: GameLayoutAxisEntry;
}

interface MusicInfo {
    music: string;
    volume: number;
    loop: boolean;
    volume_load_screen: number;
    volume_home_screen: number;
    volume_play_screen: number;
    volume_over_screen: number;
}

interface LanguageMetadata {
    language: string;
    visible_name: string;
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
    var currentMusic: Phaser.Sound;

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