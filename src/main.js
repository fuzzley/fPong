import { fPong } from "./fPong.namespace.js";
import "./fPong/Player.js";
import "./fPong/Ball.js";
import "./fPong/Game.js";

fPong.Page = (function (Page) {
    'use strict';

    //fields
    Page.game = null;

    //functions
    Page.initialize = function (callback) {
        //init game
        Page.game = new fPong.Game({
            stage: {
                parent: 'canvas-wrap'
            }
        });

        //tell anyone waiting on us that we are done
        if (typeof (callback) === 'function') {
            callback.call(this);
        }
    };

    return Page;
})(fPong.Page || {});

$(document).ready(function () {
    fPong.Page.initialize();
});
