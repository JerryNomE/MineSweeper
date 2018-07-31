import config from '../../../config';

const {BLOCK_SIZE} = config;

const COLOR = ['transparent','blue','green','red','purple','brown','olive','seagreen','grey'];
const FONT_SIZE = 50;

const mine = new Image();
mine.src = '../../../img/mine.png';

export default (num) => {
	let canvas    = document.createElement('canvas');
	canvas.width  = BLOCK_SIZE;
	canvas.height = BLOCK_SIZE;
	let ctx       = canvas.getContext('2d');

	if (num != -1) {
		ctx.font      = `${FONT_SIZE} 'Arial Black'`;
		ctx.fillStyle = COLOR[num];
		ctx.fillText(num,8,15);
	}
	else{
		if (mine.complete) {
			ctx.drawImage(mine,0,0,BLOCK_SIZE,BLOCK_SIZE)
		}
		else mine.onload = function (argument) {
			ctx.drawImage(mine,0,0,BLOCK_SIZE,BLOCK_SIZE)
		}
	}


	// 格子边界
    ctx.lineWidth = .5;
	ctx.strokeStyle = "black";
	ctx.strokeRect(0,0,BLOCK_SIZE,BLOCK_SIZE);

	return canvas;
}