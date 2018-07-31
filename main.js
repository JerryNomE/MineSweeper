import MouseDMUHelper from './js/items/MouseDMUHelper';
import ifWithin from './js/items/ifWithin';
import equal from './js/items/ObjectSimpleEqual.js';
import MineSweeperBoard from './js/logic/MineSweeperBoard';
import getUI_block from './js/UI/getUI_block';
import config from './config';

const {BLOCK_SIZE, FONT_SIZE, FONT_MARGIN} = config;

let HOR = 12;
let VER = 10;
let MINE = 20;

let BLOCKS_WIDTH  = HOR * BLOCK_SIZE;
let BLOCKS_HEIGHT = VER * BLOCK_SIZE;

const FONT_HEIGHT = FONT_SIZE + FONT_MARGIN;

let GAME_X = 0;
let GAME_Y = FONT_HEIGHT;

let CANVAS_WIDTH  = BLOCKS_WIDTH;
let CANVAS_HEIGHT = BLOCKS_HEIGHT + FONT_HEIGHT;


const canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
let ctx = canvas.getContext('2d');

let aniId = 0;

let game = new MineSweeperBoard(HOR, VER, MINE);
let board = game.getBoard();

const OUT_OF_BLOCK = {x:-1, y:-1};
let mouseon_block = OUT_OF_BLOCK;

const get_mouseon_block = function (x,y){
	if (ifWithin([x, GAME_X, GAME_X+BLOCKS_WIDTH-1], [y, GAME_Y, GAME_Y+BLOCKS_HEIGHT-1])) {
		return {
			x: Math.floor((x - GAME_X) / BLOCK_SIZE),
			y: Math.floor((y - GAME_Y) / BLOCK_SIZE),
		}
	}
	else{
		return OUT_OF_BLOCK
	}
}

const loop = function () {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

	board.forEach((v,i) => v.forEach((w,j)=>{
		ctx.drawImage(getUI_block(w),
			GAME_X + i*BLOCK_SIZE,
			GAME_Y + j*BLOCK_SIZE,
			BLOCK_SIZE, BLOCK_SIZE);
	}));

    aniId = window.requestAnimationFrame(loop);
};





// xy为鼠标坐标
// ij为格子坐标
(function () {
	let mousedown = {
		left({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				board[newPos.x][newPos.y].active = true;
			}
		},

		right({x,y}){},

		both({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				board[newPos.x][newPos.y].active = true;
				board[newPos.x][newPos.y].around.forEach((b)=>b.active = true);
			}
		},
	};
	let mousemove = {
		default({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(mouseon_block,newPos)) {
				if (mouseon_block.x != -1) {
					board[mouseon_block.x][mouseon_block.y].hover = false
				}
				if (newPos.x != -1) {board[newPos.x][newPos.y].hover = true}
				mouseon_block = newPos;
			}
		},

		left({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(mouseon_block,newPos)) {
				if (mouseon_block.x != -1) {
					board[mouseon_block.x][mouseon_block.y].active = false
				}
				if (newPos.x != -1) {board[newPos.x][newPos.y].active = true}
			}
		},
		right({x,y}){},

		both({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(mouseon_block,newPos)) {
				if (mouseon_block.x != -1) {
					let b = board[mouseon_block.x][mouseon_block.y];
					b.active = false;
					b.around.forEach((x)=>x.active=false);
				}
				if (newPos.x != -1) {
					let b = board[newPos.x][newPos.y];
					b.active = true;
					b.around.forEach((x)=>x.active=true);
				}
			}
		},
	};
	let mouseup = {
		left({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				let cur = board[newPos.x][newPos.y];
				cur.active = false;
				if (!cur.isFlipped && !cur.isFlagged) {
					let result = cur.flip();
					console.log(result);
				}
			}
		},

		right({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				board[newPos.x][newPos.y].flag();
			}

		},

		cancelLeft({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				board[newPos.x][newPos.y].active = false;
				board[newPos.x][newPos.y].around.forEach((b)=>b.active = false);
			}
		},

		cancelRight({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				board[newPos.x][newPos.y].around.forEach((b)=>b.active = false);
			}
		},

		both({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(newPos,OUT_OF_BLOCK)) {
				let cur = board[newPos.x][newPos.y];
				cur.active = false;
				let flags = cur.around.reduce((pre,b)=>{
					b.active = false;
					return b.isFlagged ? pre+1 : pre;
				},0);

				if (cur.isFlipped && flags == cur.mark) {
					let result = cur.flip_around();
					console.log(result);
				}
			}
		},
	};

	const mh = new MouseDMUHelper(canvas,{mousedown,mousemove,mouseup});

	// 虽然没什么必要用，可以在触发事件时再触发
	// 不过还是加上来吧，万一加个什么动态背景动态图什么的就不用改了
    window.cancelAnimationFrame(aniId);

    aniId = window.requestAnimationFrame(loop);
})();