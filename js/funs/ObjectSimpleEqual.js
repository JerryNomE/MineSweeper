/**
 * 只做简单判断两个对象是否一样
 * 判断方法：对象键值对数是否相等，键值是否对应相等
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
export default function (a,b) {
	if (!a instanceof Object && !b instanceof Object) {return false}
	let A = Object.entries(a);
	let B = Object.entries(b);
	return A.length == B.length && A.every(([k,v]) => b[k]===v)
}