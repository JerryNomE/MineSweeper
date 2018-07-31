import unflipped from './block/unflipped';
import flipped from './block/flipped';

let b = {
	unknown : unflipped(),
	flag    : unflipped('flag'),
	hover   : unflipped('hover'),
	active  : unflipped('active'),
};

let n = Array.from({length:10},(v,i) => flipped(i-1));
console.log(n);

export default (block) => {
	if (block.isFlipped) return n[block.mark+1]
	else if (block.isFlagged) return b.flag
	else if (block.active) return b.active
	else if (block.hover) return b.hover
	else return b.unknown
}