/// <reference path="snake.ts"/>
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Game;
(function (Game) {
    var start = document.getElementById('start');
    var score = document.getElementById('score');
    var floor = new Game.Floor({
        parent: document.getElementById('container'),
        row: 80,
        col: 100
    });
    floor.initialize();
    // const snake: Snake = new Snake(floor,{
    // 	speed:32,
    // 	eatCB:function(score){
    // 		document.getElementById('score').innerHTML = score;
    // 	}
    // })
    var AI = /** @class */ (function (_super) {
        __extends(AI, _super);
        function AI(floor, options) {
            return _super.call(this, floor, options) || this;
            // this.head = this.bodies[0];
            // this.target = this.model.food;
        }
        AI.prototype.born = function () {
            var _this = this;
            _super.prototype.born.call(this);
            var self = this;
            this.AITimer = setInterval(function () {
                var cl;
                if (self.direction == 0 /* left */ || self.direction == 2 /* right */) {
                    if (self.bodies[0].pos.y > self.model.food.pos.y) {
                        cl = 38 /* up */;
                    }
                    else if (self.bodies[0].pos.y < self.model.food.pos.y) {
                        cl = 40 /* down */;
                    }
                }
                else {
                    if (self.bodies[0].pos.x > self.model.food.pos.x) {
                        cl = 37 /* left */;
                    }
                    else if (self.bodies[0].pos.x < self.model.food.pos.x) {
                        cl = 39 /* right */;
                    }
                }
                // if (self.bodies[0].pos.x > self.model.food.pos.x) {
                // 	cl = KeyCode.left
                // } else if(self.bodies[0].pos.x < self.model.food.pos.x) {
                // 	cl = KeyCode.right
                // }
                // if (self.bodies[0].pos.y > self.model.food.pos.y) {
                // 	cl = KeyCode.up
                // } else if(self.bodies[0].pos.y < self.model.food.pos.y) {
                // 	cl = KeyCode.down
                // }
                _super.prototype.setDirection.call(_this, cl);
            }, self.speed * 2);
        };
        AI.prototype.die = function () {
            _super.prototype.die.call(this);
            clearInterval(this.AITimer);
        };
        return AI;
    }(Game.Snake));
    var snake = new AI(floor, {
        speed: 32,
        eatCB: function (score) {
            document.getElementById('score').innerHTML = score;
        }
    });
    start.onclick = function () {
        snake.born();
        // this.setAttribute('disabled', 'true')
    };
    // Object.observe(snake, observer)
})(Game || (Game = {}));
