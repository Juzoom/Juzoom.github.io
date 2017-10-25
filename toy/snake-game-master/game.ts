/// <reference path="snake.ts"/>

'use strict'

module Game {
	const start: HTMLElement = document.getElementById('start')
	const score: HTMLElement = document.getElementById('score')

	const floor: Floor = new Floor({
		parent: document.getElementById('container'),
		row:80,
		col:100
	})
	floor.initialize()

	// const snake: Snake = new Snake(floor,{
	// 	speed:32,
	// 	eatCB:function(score){
	// 		document.getElementById('score').innerHTML = score;
	// 	}
	// })

	class AI extends Snake{
		private head:Block
		private target:Block
		private AITimer:number
		constructor(floor: Floor, options?:snakeOption){
			super(floor,options)
			// this.head = this.bodies[0];
			// this.target = this.model.food;
		}
		born(){
			super.born();
			let self = this;
			this.AITimer = setInterval(() => {
				let cl:KeyCode
				if (self.direction == Direction.left || self.direction == Direction.right) {
					if (self.bodies[0].pos.y > self.model.food.pos.y) {
						cl = KeyCode.up
					} else if(self.bodies[0].pos.y < self.model.food.pos.y) {
						cl = KeyCode.down
					}
				} else {
					if (self.bodies[0].pos.x > self.model.food.pos.x) {
						cl = KeyCode.left
					} else if(self.bodies[0].pos.x < self.model.food.pos.x) {
						cl = KeyCode.right
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
				
				super.setDirection(cl)
			}, self.speed*2)
		}
		die(){
			super.die()
			clearInterval(this.AITimer)
		}
	}

	const snake:AI = new AI(floor,{
		speed:32,
		eatCB:function(score){
			document.getElementById('score').innerHTML = score;
		}
	})

	start.onclick = function () {
		snake.born()
		// this.setAttribute('disabled', 'true')
	}
	// Object.observe(snake, observer)
}