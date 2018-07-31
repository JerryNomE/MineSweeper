/**
 * MouseDMUHelper类
 * 主要目的是针对需要判断mousedown、mousemove、mouseup事件的左右键及其同时事件
 */
let down = {left : false, right : false};
const DELAY = 100; // 判断是否同时时间

// 应该拿e.timestamp判断还是拿settimeout判断？
let timing = false; // 判断是否在判断同时放开

const isFun = (f) => typeof f === 'function';

export default class MouseDMUHelper{
	/**
	 * @param  {{fun}} options.mousedown 绑定mousedown事件，可以传left、right、both
	 * @param  {{fun}} options.mousemove 绑定mousemove事件，可以传left、right、both
	 * @param  {{fun}} options.mouseup   绑定mouseup事件，可以传left、right、cancelLeft、cancelRight、both
	 */
	constructor(target, {mousedown,mousemove,mouseup}){
		this.mousedown = mousedown;
		this.mousemove = mousemove;
		this.mouseup   = mouseup;

		this.left  = false;
		this.right = false;

		target.addEventListener('contextmenu', (e) => {e.preventDefault()});
		target.addEventListener("mousedown" , (e) => {this.mouseEvent(e)}, false);
		target.addEventListener("mousemove" , (e) => {this.mouseEvent(e)}, false);
		target.addEventListener("mouseup"   , (e) => {this.mouseEvent(e)}, false);
	}

	// TODO：考虑加一个判断是执行函数还是返回执行函数
	mouseEvent(e){
		e.preventDefault();
		let l = (e.button == 0) ? true : false;
		let r = (e.button == 2) ? true : false;

		/*----------mousedown----------*/
		if (e.type == 'mousedown') {
			down.left  = l ? true : down.left;
			down.right = r ? true : down.right;

			let m = this.mousedown;
			let position = {x:e.offsetX, y:e.offsetY};

			if (l && down.right || (r && down.left)) {
				if (isFun(m.both)) {
					m.both(position);
				}
			}
			else{
				if (l && isFun(m.left)) {m.left(position)}
				else if (r && isFun(m.right)) {m.right(position)}
			}
		}

		/*----------mousemove----------*/
		else if (e.type == 'mousemove') {
			let m = this.mousemove;
			let position = {x:e.offsetX, y:e.offsetY};

			if (isFun(m.default)) {m.default(position)}

			if (down.right &&  down.left) {
				if (isFun(m.both)) {
					m.both(position);
				}
			}
			else{
				if (l && isFun(m.left)) {m.left(position)}
				if (r && isFun(m.right)) {m.right(position)}
			}
		}

		/*----------mouseup----------*/
		else if (e.type == 'mouseup'){
			let m = this.mouseup;
			let position = {x:e.offsetX, y:e.offsetY};

			down.left  = l ? false : down.left;
			down.right = r ? false : down.right;

			if (down.left||down.right) {
				timing = true;
				if (l && isFun(m.cancelLeft)) {m.cancelLeft(position)}
				if (r && isFun(m.cancelRight)) {m.cancelRight(position)}
				// 超过时限，不视为同时点击，视为取消同时点击事件而变回单键事件
				setTimeout(() => {
					timing = false;
				}, DELAY);
			}
			else{
				if (timing) {
					if (isFun(m.both)) {
						m.both(position);
					}
				}
				else{
					if (l && isFun(m.left)) {m.left(position)}
					else if (r && isFun(m.right)) {m.right(position)}
				}
			}
		}
	}
}