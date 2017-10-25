'use strict';
var Game;
(function (Game) {
    var FLOOR = {
        SPACE: 'space',
        BODY: 'body',
        FOOD: 'food'
    };
    var Model = /** @class */ (function () {
        function Model(blocks, row, col) {
            this.blocks = blocks;
            this.row = row;
            this.col = col;
            this.offsets = [[-1, 0], [0, -1], [+1, 0], [0, +1]];
        }
        Object.defineProperty(Model.prototype, "all", {
            get: function () {
                return this.blocks;
            },
            enumerable: true,
            configurable: true
        });
        Model.prototype.getBlock = function (pos) {
            return this.blocks.filter(function (block) {
                if (block.pos.x === pos.x && block.pos.y === pos.y) {
                    return true;
                }
            })[0];
        };
        Model.prototype.sbling = function (source, direction) {
            var _this = this;
            return this.blocks.filter(function (block) {
                if (source.pos.x + _this.offsets[direction][0] === block.pos.x
                    && source.pos.y + _this.offsets[direction][1] === block.pos.y) {
                    return true;
                }
            })[0];
        };
        Model.prototype.random = function () {
            var pos = {
                x: Math.floor(Math.random() * this.col),
                y: Math.floor(Math.random() * this.row)
            };
            var block = this.getBlock(pos);
            return block;
        };
        Model.prototype.genFood = function () {
            var block = this.random();
            // re-random
            if (block.type === FLOOR.BODY) {
                block = this.random();
            }
            block.type = FLOOR.FOOD;
            this.food = block;
            this.render([block]);
        };
        Model.prototype.clear = function () {
            for (var i = 0; i < this.blocks.length; i++) {
                var element = this.blocks[i];
                element.type = FLOOR.SPACE;
                element.node.className = element.type;
            }
        };
        Model.prototype.render = function (blocks) {
            blocks.forEach(function (block) {
                block.node.className = block.type;
            });
        };
        return Model;
    }());
    var Floor = /** @class */ (function () {
        function Floor(options) {
            options = options || {};
            this.table = document.createElement('table');
            this.table.cellPadding = '0';
            this.table.cellSpacing = '0';
            this.parent = options.parent || document.body;
            this.row = options.row || 20;
            this.col = options.col || 20;
            this.blocks = [];
        }
        Object.defineProperty(Floor.prototype, "model", {
            get: function () {
                return new Model(this.blocks, this.row, this.col);
            },
            enumerable: true,
            configurable: true
        });
        Floor.prototype.initialize = function () {
            var y;
            var x;
            for (y = 0; y < this.row; y++) {
                var tr = this.table.insertRow(-1);
                for (x = 0; x < this.col; x++) {
                    var td = tr.insertCell(-1);
                    td.className = FLOOR.SPACE;
                    this.blocks.push({
                        node: td,
                        type: FLOOR.SPACE,
                        pos: { x: x, y: y }
                    });
                }
            }
            this.parent.appendChild(this.table);
        };
        return Floor;
    }());
    Game.Floor = Floor;
    var Snake = /** @class */ (function () {
        function Snake(floor, options) {
            options = options || {};
            this.model = floor.model;
            this.initLength = options.initLength || 3;
            this.direction = 2 /* right */;
            this.bodies = [];
            this.speed = options.speed || 200;
            this.eatCB = options.eatCB || function () { };
            this.timer = null;
            this.score = 0;
            this.step = 0;
        }
        Snake.prototype.setDirection = function (keyCode) {
            switch (keyCode) {
                case 37 /* left */:
                    if (this.direction !== 2 /* right */) {
                        this.direction = 0 /* left */;
                    }
                    break;
                case 38 /* up */:
                    if (this.direction !== 3 /* down */) {
                        this.direction = 1 /* up */;
                    }
                    break;
                case 39 /* right */:
                    if (this.direction !== 0 /* left */) {
                        this.direction = 2 /* right */;
                    }
                    break;
                case 40 /* down */:
                    if (this.direction !== 1 /* up */) {
                        this.direction = 3 /* down */;
                    }
                    break;
            }
        };
        Snake.prototype.born = function () {
            var _this = this;
            var lastStep;
            var lastKeyCode;
            var setDirectionTimer;
            var keyHandler = function (e) {
                var keyCode = e.keyCode || e.which || e.charCode;
                e.preventDefault();
                if (setDirectionTimer) {
                    clearTimeout(setDirectionTimer);
                }
                // within single step
                if (_this.step === lastStep) {
                    // reserve current keycode
                    lastKeyCode = keyCode;
                    // next step will call this
                    setDirectionTimer = setTimeout(function () {
                        this.setDirection(lastKeyCode);
                    }.bind(_this), _this.speed);
                    return;
                }
                _this.setDirection(keyCode);
                // reserve current step count
                lastStep = _this.step;
            };
            document.addEventListener('keydown', keyHandler, false);
            for (var i = this.initLength - 1; i >= 0; i--) {
                this.bodies.push(this.model.all[i]);
            }
            this.bodies.forEach(function (body) {
                body.type = FLOOR.BODY;
            });
            this.model.render(this.bodies);
            this.model.genFood();
            this.timer = setInterval(function () { this.move(); }.bind(this), this.speed);
        };
        Snake.prototype.move = function () {
            var head = this.bodies[0];
            var tail = this.bodies[this.bodies.length - 1];
            var next = this.model.sbling(head, this.direction);
            if (!next || next.type === FLOOR.BODY) {
                this.die();
                return;
            }
            if (next.type === FLOOR.FOOD) {
                this.eat(next);
            }
            // body move
            for (var i = this.bodies.length - 1; i > 0; i--) {
                this.bodies[i] = this.bodies[i - 1];
            }
            next.type = FLOOR.BODY;
            this.bodies[0] = next;
            // clear original tail
            tail.type = FLOOR.SPACE;
            this.model.render([tail]);
            this.model.render(this.bodies);
            this.step++;
        };
        Snake.prototype.die = function () {
            clearInterval(this.timer);
            this.bodies = [];
            this.model.render(this.bodies);
            this.direction = 2 /* right */;
            this.model.clear();
            alert('Game Over!');
        };
        Snake.prototype.eat = function (block) {
            this.bodies.push(block);
            this.model.genFood();
            this.score++;
            this.eatCB(this.score);
        };
        return Snake;
    }());
    Game.Snake = Snake;
})(Game || (Game = {}));
