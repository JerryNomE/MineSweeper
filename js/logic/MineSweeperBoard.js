import ifWithin from '../items/ifWithin'

let instance = null;

// 全局变量用「$」开头
let $w, $h, $m;
let $board;
let $unflipped, $first;

// Symbol用「_」开头
let _win = Symbol('win');
let _lose = Symbol('lose');

const ran = (a, b) => a + Math.floor(Math.random() * (b-a+1));

/**
 * 代表每一个格子
 * 属性：
 * x、y：坐标
 * mark：记号，当前格子是否雷/周围有多少格
 * isFlipped：是否已被翻开
 * isFlagged：是否已被标记为雷
 *
 * TODO：是否要加「？」功能
 */
const block_around = (x, y) =>{
	let around = Array.from({length:9},(v, i) => ({i:x+i%3-1, j:y+Math.floor(i/3)-1}));
	return around.filter(({i, j})=>
		ifWithin([i, 0, $w-1], [j, 0, $h-1]) && !(i==x && j==y)
	);
};

const setMines = (x, y) => {
	let result = [{x, y}];
	while(result.length <= m+1){
		let ranPos = {x:ran(0, $w-1), y:ran(0, $h-1)};
		if (!result.some(({x, y}) => x==ranPos.x&&y==ranPos.y)) {result.push(ranPos)}
	}

	result.shift();
	result.forEach(({x, y}) => $board[x][y].mark = -1);

	$board.forEach((v) => {
		v.forEach((w) => {
			if (w.mark != -1) {w.mark = w.around.reduce((pre, cur)=>cur.mark==-1 ? pre++ : pre, 0)}
		})
	})
}

class Block{
	constructor(x, y){
		this.x = x;
		this.y = y;

		this.mark = 0;

		this.isFlipped = false;
		this.isFlagged = false;

		this.hover  = false;
		this.active = false;
	}

	init(){
		this.around = block_around(this.x, this.y).map(({i, j})=> $board[i][j]);
	}

	flip(){
		if ($first) {setMines(this.x, this.y)}

		if (this.mark == -1) return _lose;

		this.isFlipped = true;
		$unflipped--;

		if ($unflipped == 0) return _win;

		if (this.mark == 0){
			this.around.forEach(({i, j}) => {
				let next = $board[i][j];
				if (!next.isFlipped && !next.isFlagged) {
					next.flip()
				}
			})
		};

		return $unflipped;
	}

	flag(){this.isFlagged = !this.isFlagged}

	active_around(){
		this.around.forEach((b) => b.active = true)
	}

	unactive_around(){
		this.around.forEach((b) => b.active = false)
	}
}

export default class MineSweeperBoard{
	constructor(w, h, m){
		if(instance){
			instance.reset(w, h, m);
			return instance
		}
		this.reset(w, h, m);
	}

	reset(w, h, m){
		[$w, $h, $m, $unflipped, $first] = [w, h, m, w*h, true];
		$board = Array.from({length:w},(v, i)=>Array.from({length:h},(w, j)=>new Block(i, j)));
		$board.forEach((a)=>a.forEach((b)=>b.init()));
	}

	getBoard(){return $board}
}