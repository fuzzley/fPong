var fPong = fPong || {};

fPong.Player = (function (Player, Phaser, $, ko, undefined) {
    'use strict';

    //constructor
    Player = function (game, options) {
        if (options == null) {
            options = {};
        }

        //options = { name, controlled, startPosition, speed, paddle }
        this.game = game;
        this.name = options.name || '';
        this.controlled = options.controlled || false;
        this.speed = options.speed || 1;

        this.assets = {
            paddle: options.paddle
        };

        this._initAssets(options.startPosition);
    };

    //fields
    Player.prototype.gutter = null;
    Player.prototype.game = null;
    Player.prototype.name = '';
    Player.prototype.controlled = false;
    Player.prototype.speed = 1;
    Player.prototype.assets = null;
    Player.prototype.paddle = null;

    //functions
    Player.prototype._initAssets = function (startPosition) {
        if (startPosition == null) {
            startPosition = { x: 0, y: 0 };
        }

        this.paddle = this.game.add.sprite(startPosition.x, startPosition.y, this.assets.paddle);
        this.paddle.inputEnabled = true;

        this.game.physics.enable(this.paddle);
        this.paddle.enableBody = true;
        this.paddle.body.immovable = true;
    };

    //event handlers
    Player.prototype.update = function () {
        this.paddle.body.velocity.y = 0;
        if (this.controlled === true) {
            if (fPong.Game.Keys.UP.isDown) {
                this.paddle.body.velocity.y = -this.speed;
            } else if (fPong.Game.Keys.DOWN.isDown) {
                this.paddle.body.velocity.y = this.speed;
            }
        }
    };

    return Player;
})(fPong.Player || {}, window.Phaser, window.jQuery, window.ko);