var fPong = fPong || {};

fPong.Game = (function (Game, Phaser, $, ko, undefined) {
    'use strict';

    //constructor
    Game = function (settings) {
        //save settings
        this.settings = $.extend(true, {}, this.default_settings, settings);

        //set custom properties
        this._defineProperties();

        //init vars
        this.assets = {
            paddle: null,
            ball: null
        };

        //create phaser game object
        this.pGame = new Phaser.Game(this.settings.width, this.settings.height, settings.renderer, this.settings.parent, {
            preload: function () {
                this.preload();
            }.bind(this),
            create: function () {
                this.create();
            }.bind(this),
            update: function () {
                this.update();
            }.bind(this),
            render: function () {
                this.render();
            }.bind(this)
        });
    };

    //fields
    Game.prototype.default_settings = {
        width: 800,
        height: 600,
        renderer: Phaser.AUTO,
        parent: '',
        stageBackground: '#736357',
        ballSpeed: 450
    };

    Game.Keys = {
        UP: null,
        DOWN: null,
        LEFT: null,
        RIGHT: null
    };

    Game.prototype.settings = null;

    Game.prototype.pGame = null;
    Game.prototype.assets = null;

    Game.prototype.player1 = null;
    Game.prototype.player2 = null;
    Game.prototype.ball = null;

    //functions
    //private
    Game.prototype._defineProperties = function () {
        Object.defineProperty(this, 'width', {
            get: function () {
                return this.pGame.width;
            }
        });

        Object.defineProperty(this, 'height', {
            get: function () {
                return this.pGame.height;
            }
        });
    };

    Game.prototype._loadAssets = function () {
        this._createPaddle();
        this._createBall();
    };

    Game.prototype._createPaddle = function () {
        //create paddle
        var paddle = new Phaser.Graphics(0, 0);
        paddle.beginFill(0xFF3300);
        paddle.lineStyle(2, 0xffffff, 1);
        paddle.moveTo(0, 0);
        paddle.lineTo(25, 0);
        paddle.lineTo(25, 100);
        paddle.lineTo(0, 100);
        paddle.lineTo(0, 0);
        paddle.endFill();

        //convert to sprite
        this.assets.paddle = paddle.generateTexture();
    };

    Game.prototype._createBall = function () {
        //create paddle
        var ball = new Phaser.Graphics(0, 0);
        ball.beginFill(0xffffff);
        ball.lineStyle(2, 0x000000, 1);
        ball.drawCircle(0, 0, 8);
        ball.endFill();

        //convert to sprite
        this.assets.ball = ball.generateTexture();
    };

    Game.prototype._initPlayers = function () {
        this.player1 = new fPong.Player(this.pGame, this.assets.paddle, {
            name: 'Player 1',
            controlled: true,
            startPosition: {
                x: 10,
                y: this.height / 2 - this.assets.paddle.height / 2
            },
            speed: 250
        });
        this.player2 = new fPong.Player(this.pGame, this.assets.paddle, {
            name: 'Player 2',
            controlled: false,
            startPosition: {
                x: this.width - this.assets.paddle.width - 10,
                y: this.height / 2 - this.assets.paddle.height / 2
            },
            speed: 250
        });
    };

    Game.prototype._initBall = function () {
        this.ball = new fPong.Ball(this.pGame, this.assets.ball, {
            startPosition: {
                x: this.width / 2 - this.assets.ball.width / 2,
                y: this.height / 2 - this.assets.ball.height / 2
            },
            speed: this.settings.ballSpeed
        });
    };

    Game.prototype._initStage = function () {
        this.pGame.stage.backgroundColor = this.settings.stageBackground;
    };

    Game.prototype._captureKeys = function () {
        Game.Keys.UP = this.pGame.input.keyboard.addKey(Phaser.Keyboard.UP);
        Game.Keys.DOWN = this.pGame.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        Game.Keys.LEFT = this.pGame.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        Game.Keys.RIGHT = this.pGame.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    };

    Game.prototype._updatePositions = function () {
        this.player2.paddle.x = this.width - this.player2.width - 10;
    };

    //public
    Game.prototype.resizeGame = function (width, height) {
        this.pGame.width = width;
        this.pGame.height = height;
        this.pGame.stage.bounds.width = width;
        this.pGame.stage.bounds.height = height;

        if (this.pGame.renderType === Phaser.WEBGL) {
            this.pGame.renderer.resize(width, height);
        }

        this._updatePositions();
    };

    //event handlers
    Game.prototype.preload = function () {
    };

    Game.prototype.create = function () {
        //load assets
        this._loadAssets();

        //setup stage
        this._initStage();

        //capture key inputs
        this._captureKeys();

        //init game objects
        this._initPlayers();
        this._initBall();

        //setup physics
        this.pGame.physics.startSystem(Phaser.Physics.P2JS);
    };

    Game.prototype.update = function () {
        this.ball.update();
        this.player1.update();
        this.player2.update();

        this.pGame.physics.arcade.collide(this.ball.ball, this.player1.paddle);
        this.pGame.physics.arcade.collide(this.ball.ball, this.player2.paddle);
    };

    Game.prototype.render = function () {
    };

    return Game;
})(fPong.Game || {}, window.Phaser, window.jQuery, window.ko);