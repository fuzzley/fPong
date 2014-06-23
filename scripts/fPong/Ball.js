var fPong = fPong || {};

fPong.Ball = (function (Ball, Phaser, $, ko, undefined) {
    'use strict';

    //constructor
    Ball = function (game, ball, settings) {
        this.settings = $.extend(true, {}, this.default_settings, settings);

        this.game = game;
        this.assets = {
            ball: ball
        };

        this._defineProperties();
        this._initAssets(this.settings.startPosition, this.settings.speed);
    };

    //fields
    Ball.prototype.default_settings = {
        startPosition: { x: 0, y: 0 },
        speed: 10,
        ball: null
    };

    Ball.prototype.settings = null;

    Ball.prototype.game = null;
    Ball.prototype.assets = null;
    Ball.prototype.ball = null;

    //functions
    //private
    Ball.prototype._defineProperties = function () {
        Object.defineProperty(this, 'position', {
            get: function () {
                return this.ball.body.position;
            }
        });

        Object.defineProperty(this, 'velocity', {
            get: function () {
                return this.ball.body.velocity;
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return this.ball.body.width;
            }
        });

        Object.defineProperty(this, 'height', {
            get: function () {
                return this.ball.body.height;
            }
        });
    };

    Ball.prototype._initAssets = function (startPosition, speed) {
        this.ball = this.game.pGame.add.sprite(startPosition.x, startPosition.y, this.assets.ball);

        this.game.pGame.physics.enable(this.ball);
        this.ball.enableBody = true;
        this.ball.anchor.set(0.5);
        this.ball.body.drag.set(0);
        this.ball.body.bounce.set(1);
        this.ball.body.velocity.x = speed;
        this.ball.body.velocity.y = speed;
        this.ball.body.collideWorldBounds = true;
    };

    //event handlers
    Ball.prototype.update = function () {
    };

    return Ball;
})(fPong.Ball || {}, window.Phaser, window.jQuery, window.ko);