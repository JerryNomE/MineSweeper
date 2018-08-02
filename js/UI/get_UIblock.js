import unflip from './block/unflip';
import flipped from './block/flipped';

let b = {
	unknown : unflip(),
	flag    : unflip('flag'),
	hover   : unflip('hover'),
	active  : unflip('active'),
};

let n = Array.from({length:10},(v,i) => flipped(i-1)); // [雷,0~9]
let N = Array.from({length:10},(v,i) => flipped(i-1,1)); // 判断错的[雷,0~9]

export default (block) => {
	if (block.isFlipped) {
		if (!block.isFlagged && !block.trigger) return n[block.mark+1];
		else return N[block.mark+1];
	}
	else if (block.isFlagged) return b.flag
	else if (block.active) return b.active
	else if (block.hover) return b.hover
	else return b.unknown
}