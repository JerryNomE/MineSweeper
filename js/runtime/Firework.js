const MIN_FIRE = 50;
const MAX_FIRE = 100;

const MIN_SPEEDX = 1;
const MAX_SPEEDX = 4;
const MIN_SPEEDY = -5;
const MAX_SPEEDY = 5;

const MIN_X = 0;
const MAX_X = 0;
const MIN_Y = 20;
const MAX_Y = 50;

const GRAVITY = 2;
const FRICTION = 0;

const SLOW = 24;

const ran = (a, b) => a + Math.random() * (b-a+1);
const ranConfig = (config)=>({
	x: ran(config.min_x,config.max_x),
	y: ran(config.min_y,config.max_y),
	speedx: ran(config.min_speedx,config.max_speedx),
	speedy: ran(config.min_speedy,config.max_speedy),
	color : `rgb(${Math.floor(ran(0,255))},${Math.floor(ran(0,255))},${Math.floor(ran(0,255))})`,
})

class Fire{
	constructor({x,y,speedx,speedy,color}){
		this.x = x;
		this.y = y;
		this.speedx = speedx;
		this.speedy = speedy;
		this.color = color;
	}
}

export default class Firework{
	constructor(config={}){
		config = {
			min_fire : config.min_fire || MIN_FIRE,
			max_fire : config.max_fire || MAX_FIRE,

			min_speedx : (config.min_speedx || MIN_SPEEDX) / SLOW,
			max_speedx : (config.max_speedx || MAX_SPEEDX) / SLOW,
			min_speedy : (config.min_speedy || MIN_SPEEDY) / SLOW,
			max_speedy : (config.max_speedy || MAX_SPEEDY) / SLOW,

			min_x : config.min_x || MIN_X,
			max_x : config.max_x || MAX_X,
			min_y : config.min_y || MIN_Y,
			max_y : config.max_y || MAX_Y,
		};
		this.lights = Array.from({length:ran(config.min_fire,config.max_fire)},()=>new Fire(ranConfig(config)));
		this.gravity = (config.gravity || GRAVITY) / SLOW;
		this.friction = (config.friction || FRICTION) / SLOW; // 别搞friction>gravity
	}

	next(){
		for (var i = 0; i < this.lights.length; i++) {
			let f = this.lights[i];
			f.x += f.speedx;
			f.y += f.speedy;
			if (f.x > 200 || f.y >200) {
				this.lights.splice(i,1);
				i--;
				break;
			}

			let speedx = Math.abs(f.speedx);
			speedx = speedx>this.friction ? speedx-this.friction : 0;
			f.speedx = Math.sign(f.speedx) * speedx;

			f.speedy = f.speedy + this.gravity - this.friction;
		}
	}
}