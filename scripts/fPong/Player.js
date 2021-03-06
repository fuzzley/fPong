﻿var fPong = fPong || {};

fPong.Player = (function (Player, Phaser, $, ko, undefined) {
    'use strict';

    //constructor
    Player = function (game, paddle, settings) {
        this.settings = $.extend(true, {}, this.default_settings, settings);

        this.game = game;
        this.assets = {
            paddle: paddle
        };

        this._defineProperties();
        this._initAssets(this.settings.startPosition);
    };

    //fields
    Player.prototype.default_settings = {
        name: 'Player',
        controlled: false,
        startPosition: { x: 0, y: 0 },
        speed: 1
    };

    Player.prototype.settings = null;

    Player.prototype.gutter = null;
    Player.prototype.game = null;
    Player.prototype.assets = null;
    Player.prototype.paddle = null;
    Player.prototype.score = 0;

    //functions
    //private
    Player.prototype._defineProperties = function () {
        Object.defineProperty(this, 'name', {
            get: function () {
                return this.settings.name;
            }
        });

        Object.defineProperty(this, 'controlled', {
            get: function () {
                return this.settings.controlled;
            }
        });

        Object.defineProperty(this, 'speed', {
            get: function () {
                return this.settings.speed;
            }
        });

        Object.defineProperty(this, 'position', {
            get: function () {
                return this.paddle.body.position;
            }
        });

        Object.defineProperty(this, 'velocity', {
            get: function () {
                return this.paddle.body.velocity;
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return this.paddle.body.width;
            }
        });

        Object.defineProperty(this, 'height', {
            get: function () {
                return this.paddle.body.height;
            }
        });
    };

    Player.prototype._initAssets = function (startPosition) {
        if (startPosition == null) {
            startPosition = { x: 0, y: 0 };
        }

        this.paddle = this.game.pGame.add.sprite(startPosition.x, startPosition.y, this.assets.paddle);
        this.paddle.anchor.set(0.5);
        this.paddle.inputEnabled = true;

        this.game.pGame.physics.enable(this.paddle);
        this.paddle.enableBody = true;
        this.paddle.body.immovable = true;
    };

    Player.prototype.updateAI = function () {
        var ball = this.game.ball;
        if (ball == null || ball.ball == null) {
            return;
        }

        var distance = Math.abs(ball.ball.x - this.paddle.x);
        if (distance < this.game.width * .5) {
            if (this.paddle.y < ball.ball.y - ball.height) {
                this.velocity.y = this.speed;
            } else if (this.paddle.y > ball.ball.y + ball.height) {
                this.velocity.y = -this.speed;
            }
        }
    };

    //event handlers
    Player.prototype.update = function () {
        var KEYS = fPong.Game.Keys;

        this.paddle.body.velocity.y = 0;
        if (this.controlled === true) {
            if (KEYS.UP.isDown && this.position.y > 0) {
                this.velocity.y = -this.speed;
            } else if (KEYS.DOWN.isDown && this.position.y + this.height < this.game.pGame.height) {
                this.velocity.y = this.speed;
            }
        } else {
            this.updateAI();
        }
    };

    return Player;
})(fPong.Player || {}, window.Phaser, window.jQuery, window.ko);