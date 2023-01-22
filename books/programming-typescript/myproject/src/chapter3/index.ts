// 1
let a = 1042;  // number
let b = 'apple and oranges'  // string
const c = 'pineapples' // 推論なし
let d = [true, true, false]  // boolean[]
let e = {type: 'ficus'}  // {type: string}
let f = [1, false]  // (number|boolean)[]
const g = [3]  // number[]
let h = null  // any → 型の拡大 により

// 2
let i: 3 = 3
// i = 4  // これは実行できない iには3しか代入できない
// i = 3  // これは実行できる

let j = [1, 2, 3]
j.push(4)
// j.push('5')  // これは実行できない jはnumber[] 型なので
// j.push(5)  // これは実行できる

// let k: never = 4  // never型に値を代入することはできない
let k: never  // never型としてなら宣言できる

let l: unknown = 4  // 実行はできる
let m = 1 * 2
console.log(m)