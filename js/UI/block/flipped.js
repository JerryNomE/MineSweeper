import config from '../../../config';

const {BLOCK_SIZE} = config;

const COLOR = ['transparent','blue','green','red','purple','brown','olive','seagreen','grey'];
const FONT_SIZE = 50;

const CROSS_POS = BLOCK_SIZE * .25;

const mine = new Image();
mine.src = '../../../img/mine.png';

export default (num,status) => {
	let canvas    = document.createElement('canvas');
	canvas.width  = BLOCK_SIZE;
	canvas.height = BLOCK_SIZE;
	let ctx       = canvas.getContext('2d');

	if (num > -1) {
		ctx.font      = `${FONT_SIZE} 'Arial Black'`;
		ctx.fillStyle = COLOR[num];
		ctx.fillText(num,8,15);
		if (status) {
			ctx.beginPath();
		    ctx.lineWidth = 2;
			ctx.strokeStyle = "black";
			ctx.moveTo(CROSS_POS,CROSS_POS);
			ctx.lineTo(BLOCK_SIZE-CROSS_POS,BLOCK_SIZE-CROSS_POS);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(BLOCK_SIZE-CROSS_POS,CROSS_POS);
			ctx.lineTo(CROSS_POS,BLOCK_SIZE-CROSS_POS);
			ctx.stroke();
		}
	}
	else{
		if (mine.complete) {
			ctx.drawImage(mine,0,0,BLOCK_SIZE,BLOCK_SIZE);
		}
		else {
			let temp = mine.onload;
			mine.onload = function () {
				if(typeof temp == 'function')temp();
				ctx.drawImage(mine,0,0,BLOCK_SIZE,BLOCK_SIZE);
			}
		}

		if (status) {
			ctx.globalAlpha = .5;
			ctx.fillStyle = 'rgba(255,0,0,.5)';
			ctx.fillRect(0,0,BLOCK_SIZE,BLOCK_SIZE);
		}
	}


	// 格子边界
	ctx.beginPath();
    ctx.lineWidth = .5;
	ctx.strokeStyle = "black";
	ctx.strokeRect(0,0,BLOCK_SIZE,BLOCK_SIZE);

	return canvas;
}