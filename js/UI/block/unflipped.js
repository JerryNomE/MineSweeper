import config from '../../config';

const {BLOCK_SIZE} = config;

const BLOCK_SHADOW_WIDTH  = 7.5;
const BLOCK_DEFAULT_COLOR = {bg:'#ccc',shadow:'#8c8c8c'};
const BLOCK_ACTIVE_COLOR  = {bg:'#999',shadow:'#aaa'};
const BLOCK_HOVOR_COLOR   = {bg:'#eee',shadow:'#aeaeae'};

const flag = new Image();
flag.src = '../../../img/flag.png';

export default (status) => {
	let canvas = document.createElement('canvas');
	canvas.width  = BLOCK_SIZE;
	canvas.height = BLOCK_SIZE;
	let ctx = canvas.getContext('2d');

	let {bg,shadow} = 	status == 'hover' ? BLOCK_HOVOR_COLOR :
						status == 'active' ? BLOCK_ACTIVE_COLOR : BLOCK_DEFAULT_COLOR;

    // 格子本体
	ctx.fillStyle = bg;
	ctx.fillRect(0,0,BLOCK_SIZE,BLOCK_SIZE);

	// 格子阴影
    ctx.lineWidth = BLOCK_SHADOW_WIDTH;
    ctx.beginPath();
	ctx.moveTo(BLOCK_SIZE,0);
	ctx.lineTo(0,0);
	ctx.lineTo(0,BLOCK_SIZE);
	ctx.strokeStyle = shadow;
	ctx.stroke();

	// 格子边界
    ctx.lineWidth = .5;
	ctx.strokeStyle = "black";
	ctx.strokeRect(0,0,BLOCK_SIZE,BLOCK_SIZE);

    return canvas;
};

// export default const createBlocks = (mouseon) => {
// 	let canvas = document.createElement('canvas');
//     canvas.width  = BLOCKS_WIDTH;
//     canvas.height = BLOCKS_HEIGHT;
//     let ctx = canvas.getContext('2d');

// 	let blocks = ctx.createPattern(createBlock(),'repeat');
// 	ctx.fillStyle = blocks;
// 	ctx.fillRect(0,0,BLOCKS_WIDTH,BLOCKS_HEIGHT);

// 	if (mouseon) {
// 		let block = ctx.createPattern(createBlock(mouseon.status),'none');
// 		ctx.fillStyle = block;
// 		ctx.fillRect(mouseon.x,mouseon.y,BLOCK_SIZE,BLOCK_SIZE);
// 	}

// 	return canvas;
// }