var fPong = fPong || {};

fPong.Ball = (function (Ball, Phaser, $, ko, undefined) {
    'use strict';

    //constructor
    Ball = function (game, options) {
        if (options == null) {
            options = {};
        }

        //options = { startPosition, speed, ball }
        this.game = game;
        this.speed = options.speed || 1;

        this.assets = {
            ball: options.ball
        };

        this._initAssets(options.startPosition, options.speed);
    };

    //fields
    Ball.prototype.game = null;
    Ball.prototype.assets = null;
    Ball.prototype.ball = null;

    //functions
    Ball.prototype._initAssets = function (startPosition, speed) {
        this.ball = this.game.add.sprite(startPosition.x, startPosition.y, this.assets.ball);

        this.game.physics.enable(this.ball);
        this.ball.enableBody = true;
        this.ball.body.drag.set(0);
        this.ball.body.bounce.set(1);
        this.ball.body.velocity.x = speed;
        this.ball.body.velocity.y = speed;
        this.ball.body.collideWorldBounds = true;
    };

    Ball.prototype.invertVelocity = function () {
        this.invertVelocityX();
        this.invertVelocityY();
    };

    Ball.prototype.invertVelocityX = function () {
        this.ball.body.velocity.x *= -1;
    };

    Ball.prototype.invertVelocityY = function () {
        this.ball.body.velocity.y *= -1;
    };

    //event handlers
    Ball.prototype.update = function () {
        //if ((this.ball.x <= 0 && this.ball.body.velocity.x < 0) || (this.ball.x + this.ball.width >= this.game.world.width && this.ball.body.velocity.x > 0)) {
        //    this.invertVelocityX();
        //}

        //if ((this.ball.y <= 0 && this.ball.body.velocity.y < 0) || (this.ball.y + this.ball.height >= this.game.world.height && this.ball.body.velocity.y > 0)) {
        //    this.invertVelocityY();
        //}
    };

    return Ball;
})(fPong.Ball || {}, window.Phaser, window.jQuery, window.ko);