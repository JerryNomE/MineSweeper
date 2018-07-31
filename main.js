import MouseDMUHelper from './js/items/MouseDMUHelper';
import ifWithin from './js/items/ifWithin';
import equal from './js/items/ObjectSimpleEqual.js';
import MineSweeperBoard from './js/logic/MineSweeperBoard';
import getUI_block from './js/UI/UI_block';
import config from './config';

const {BLOCK_SIZE, FONT_SIZE, FONT_MARGIN} = config;

let HOR = 15;
let VER = 10;
let MINE = 10;

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

let mouseon_block = {
	x: -1,
	y: -1,
};

const get_mouseon_block = function (x,y){
	if (ifWithin([x, GAME_X, GAME_X+BLOCKS_WIDTH-1], [y, GAME_Y, GAME_Y+BLOCKS_HEIGHT-1])) {
		return {
			x: Math.floor((x - GAME_X) / BLOCK_SIZE),
			y: Math.floor((y - GAME_Y) / BLOCK_SIZE),
		}
	}
	else{
		return {
			x: -1,
			y: -1,
		}
	}
}

const get_blockUI = (block) =>{
	if (block.isFlipped) {}
	else if (block.isFlagged) {}
	else if (block.active) {return UI_block.active}
	else if (block.hover) {return UI_block.hover}
	else return UI_block.unknown
}

const loop = function () {
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
			ctx.drawImage(UI_block.active,
				GAME_X + Math.floor((x - GAME_X) / BLOCK_SIZE)*BLOCK_SIZE,
				GAME_Y + Math.floor((y - GAME_Y) / BLOCK_SIZE)*BLOCK_SIZE,
				BLOCK_SIZE, BLOCK_SIZE)
		},
		right({x,y}){console.log(`right:${x},${y}`);},
		both({x,y}){console.log(`both:${x},${y}`);},
	};
	let mousemove = {
		default({x,y}){
			let newPos = get_mouseon_block(x,y);
			if (!equal(mouseon_block,newPos)) {
				if (mouseon_block.x != -1) {
					board[mouseon_block.x][ mouseon_block.y].hover = false
				}
				if (newPos.x != -1) {board[newPos.x][newPos.y].hover = true}
				mouseon_block = newPos;
			}
		},
		left({x,y}){},
		right({x,y}){},
		both({x,y}){console.log(`both:${x},${y}`);},
	};
	let mouseup = {
		left({x,y}){
			// let newPos= get_mouseon_block(x,y);
			// let block = board[newPos.x][newPos.y];
			// console.log(block);
		},
		right({x,y}){
			let pos = get_mouseon_block(x,y);
			board[pos.x][pos.y].flag();
		},
		cancelLeft({x,y}){console.log(`cancelLeft:${x},${y}`);},
		cancelRight({x,y}){console.log(`cancelRight:${x},${y}`);},
		both({x,y}){console.log(`both:${x},${y}`);},
	};

	const mh = new MouseDMUHelper(canvas,{mousedown,mousemove,mouseup});

	// 虽然没什么必要用，可以在触发事件时再触发
	// 不过还是加上来吧，万一加个什么动态背景动态图什么的就不用改了
    window.cancelAnimationFrame(aniId);

    aniId = window.requestAnimationFrame(loop);
})();
