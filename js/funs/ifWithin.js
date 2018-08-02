/**
 * 传入n个数组，返回组数[0]是否都在[1]~[2]范围内
 * @param  {...[num]} args [要比较的数，最小边界，最大边界]
 * @return {[boolean]}         是否全部符合
 */
export default function ifWithin(...args) {
	return args.every(([a,b,c])=> b<=a && a<=c)
}