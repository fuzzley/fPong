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
        this.pGame = new Phaser.Game(
            this.settings.stage.width,
            this.settings.stage.height,
            this.settings.engine.renderer,
            this.settings.stage.parent, {
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
        stage: {
            width: 1024,
            height: 768,
            background: '#736357',
            parent: ''
        },
        engine: {
            scaleMode: Phaser.ScaleManager.EXACT_FIT,
            renderer: Phaser.AUTO,
            physicsSystem: Phaser.Physics.NINJA
        },
        ball: {
            speed: 650,
            radius: 10,
            fill: '0xffffff',
            stroke: '0x000000',
            strokeWidth: 2
        },
        paddle: {
            playerSpeed: 700,
            aiSpeed: 550,
            width: 20,
            height: 100,
            fill: '0xff3300',
            stroke: '0xffffff',
            strokeWidth: 2,
            offsetX: 10
        }
    };

    Game.States = {
        GAME_OVER: 0,
        BETWEEN_ROUNDS: 1,
        ROUND_IN_PROGRESS: 2
    };
    Game.Keys = {
        UP: null,
        DOWN: null,
        LEFT: null,
        RIGHT: null,
        SPACEBAR: null
    };

    Game.prototype.settings = null;

    Game.prototype.pGame = null;
    Game.prototype.assets = null;
    Game.prototype.labels = null;

    Game.prototype.player1 = null;
    Game.prototype.player2 = null;
    Game.prototype.ball = null;

    Game.prototype.state = Game.States.GAME_OVER;

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
        paddle.beginFill(this.settings.paddle.fill);
        paddle.lineStyle(this.settings.paddle.strokeWidth, this.settings.paddle.stroke, 1);
        paddle.moveTo(0, 0);
        paddle.lineTo(this.settings.paddle.width, 0);
        paddle.lineTo(this.settings.paddle.width, this.settings.paddle.height);
        paddle.lineTo(0, this.settings.paddle.height);
        paddle.lineTo(0, 0);
        paddle.endFill();

        //convert to sprite
        this.assets.paddle = paddle.generateTexture();
    };

    Game.prototype._createBall = function () {
        //create paddle
        var ball = new Phaser.Graphics(0, 0);
        ball.beginFill(this.settings.ball.fill);
        ball.lineStyle(this.settings.ball.strokeWidth, this.settings.ball.stroke, 1);
        ball.drawCircle(0, 0, this.settings.ball.radius);
        ball.endFill();

        //convert to sprite
        this.assets.ball = ball.generateTexture();
    };

    Game.prototype._initPlayers = function () {
        this.player1 = new fPong.Player(this, this.assets.paddle, {
            name: 'Player 1',
            controlled: true,
            startPosition: {
                x:  this.assets.paddle.width / 2 + this.settings.paddle.offsetX,
                y: this.height / 2 - this.assets.paddle.height / 2
            },
            speed: this.settings.paddle.playerSpeed
        });
        this.player2 = new fPong.Player(this, this.assets.paddle, {
            name: 'Player 2',
            controlled: false,
            startPosition: {
                x: this.width - this.assets.paddle.width / 2 - this.settings.paddle.offsetX,
                y: this.height / 2 - this.assets.paddle.height / 2
            },
            speed: this.settings.paddle.aiSpeed
        });
    };

    Game.prototype._initBall = function () {
        this.ball = new fPong.Ball(this, this.assets.ball, {
            startPosition: {
                x: this.pGame.world.centerX,
                y: this.pGame.world.centerY
            },
            speed: this.settings.ball.speed
        });
    };

    Game.prototype._initStage = function () {
        this.pGame.stage.backgroundColor = this.settings.stage.background;

        this.pGame.scale.scaleMode = this.settings.engine.scaleMode;
        this.pGame.scale.setExactFit();
        this.pGame.scale.refresh();
    };

    Game.prototype._initLabels = function () {
        this.labels = {};

        this.labels.startRound = this.pGame.add.text(this.pGame.world.centerX, this.pGame.world.bounds.bottom - 20, 'Press SPACE to start the round.', {
            font: '44px Arial',
            fill: '#ffffff',
            align: 'center',
            'text-align': 'top'
        });
        this.labels.startRound.anchor.set(0.5, 1);
        this.labels.startRound.visible = false;

        this.labels.player1Score = this.pGame.add.text(this.pGame.world.bounds.left, this.pGame.world.bounds.top, '0', {
            font: '44px Arial',
            fill: '#ffffff',
            align: 'center',
            'text-align': 'top'
        });

        this.labels.player2Score = this.pGame.add.text(this.pGame.world.bounds.right, this.pGame.world.bounds.top, '0', {
            font: '44px Arial',
            fill: '#ffffff',
            align: 'center',
            'text-align': 'top'
        });
        this.labels.player2Score.anchor.set(1, 0);
    };

    Game.prototype._captureKeys = function () {
        Game.Keys.UP = this.pGame.input.keyboard.addKey(Phaser.Keyboard.UP);
        Game.Keys.DOWN = this.pGame.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        Game.Keys.LEFT = this.pGame.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        Game.Keys.RIGHT = this.pGame.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        Game.Keys.SPACEBAR = this.pGame.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };

    //public
    Game.prototype.startGame = function () {
        this.prepareRound();
    };

    Game.prototype.prepareRound = function () {
        //reset ball
        this.ball.ball.x = this.pGame.world.centerX;
        this.ball.ball.y = this.pGame.world.centerY;
        this.ball.velocity.x = Math.random() > 0.5 ? this.settings.ball.speed : -this.settings.ball.speed;
        this.ball.velocity.y = Math.random() > 0.5 ? this.settings.ball.speed : -this.settings.ball.speed;

        //show label
        this.labels.startRound.visible = true;

        //change game state
        this.pGame.paused = true;
        this.state = Game.States.BETWEEN_ROUNDS;
    };

    Game.prototype.startRound = function () {
        //hide label
        this.labels.startRound.visible = false;

        //change game state
        this.state = Game.States.BETWEEN_ROUNDS;
        this.pGame.paused = false;
    };

    Game.prototype.updateScore = function () {
        if (this.ball.position.x < this.pGame.world.centerX) {
            this.player2.score++;
        } else {
            this.player1.score++;
        }
        this.labels.player1Score.text = this.player1.score;
        this.labels.player2Score.text = this.player2.score;
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
        this._initLabels();

        //setup physics
        this.pGame.physics.startSystem(this.settings.engine.physicsSystem);

        //start game
        this.startGame();

        //prepare the "unapuse" button
        Game.Keys.SPACEBAR.onDown.add(function () {
            if (this.state === Game.States.BETWEEN_ROUNDS) {
                this.startRound();
            }
        }.bind(this));
    };

    Game.prototype.update = function () {
        //check for "start round"
        if (this.ball.ball.body.onWall() === true) { //check for wall hit
            this.updateScore();
            this.prepareRound();
        } else { //otherwise update game
            this.ball.update();
            this.player1.update();
            this.player2.update();

            this.pGame.physics.arcade.collide(this.ball.ball, this.player1.paddle);
            this.pGame.physics.arcade.collide(this.ball.ball, this.player2.paddle);
        }
    };

    Game.prototype.render = function () {
    };

    return Game;
})(fPong.Game || {}, window.Phaser, window.jQuery, window.ko);