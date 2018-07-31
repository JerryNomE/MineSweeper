import config from '../../config';

const {BLOCK_SIZE} = config;

const COLOR = ['transparent','blue','green','red','purple','brown','olive','seagreen','grey'];

export default (num) => {
	let canvas = document.createElement('canvas');
	canvas.width  = BLOCK_SIZE;
	canvas.height = BLOCK_SIZE;
	let ctx = canvas.getContext('2d');

	ctx.font="40px Arial";

	// 格子边界
    ctx.lineWidth = .5;
	ctx.strokeStyle = "black";
	ctx.strokeRect(0,0,BLOCK_SIZE,BLOCK_SIZE);
}