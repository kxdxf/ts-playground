// 名前付き関数
import {type} from "os";

function greet(name: string) {
    return 'hello ' + name
}

// 関数式
let greet2 = function (name: string) {
    return 'hello ' + name
}

// アロー演算子
let greet3 = (name: string) => {
    return 'hello' + name
}

// アロー関数式の省略記法
let greet4 = (name: string) =>
    'hello' + name

// 関数コンストラクター
let greet5 = new Function('name', 'return "hello " + name')


// 4.11
// ?を使うと省略可能なパラメータを定義できる
function log(message: string, userId?: string) {
    let time = new Date().toLocaleTimeString()
    console.log(time, message, userId || 'Not signed in')  // デフォルト引数を与えられる
}

console.log(log('Page loaded'))
console.log(log('User signed in', 'aaaaa'))

// 可変長引数関数
// function sumVariadic(): number {
//     return Array
//         .from(arguments)  // argumentsにより引数の受け渡しは安全ではない
//         .reduce((total, n) => total + n, 0)
// }

function sumVariadic(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0)
}

// 関数を呼び出す
function add(a: number, b:number): number {
    return a + b
}

console.log(add(10, 20))
console.log(add.apply(null, [10, 20]))
console.log(add.call(null, 10, 20))
console.log(add.bind(null, 10, 20))


// 4.1.4
// 関数の呼び出し方法によってthis変数の定義は異なる
let x = {
    a() {
        return this
    }
}
console.log(x.a()) // xオブジェクトを返す

function fancyDate(this: Date) {
    return `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear()}`
}
console.log(fancyDate.call(new Date()))


// イテレータ
// 独自のイテレータを定義する
let numbers = {
    *[Symbol.iterator]() {
        for (let n = 1; n <= 10; n++) {
            yield n
        }
    }
}

// for-ofによる反復
for (let a of numbers) {
    console.log(a)
}

// 展開
let allNumbers = [...numbers]
console.log(allNumbers)

// 分割代入
let [one, two, ...rest] = numbers
console.log(one)
console.log(two)
console.log(rest)


// 文脈的型付け
type Log = (message: string, userId?: string) => void
let log2: Log = (
    message,
    userId = 'not signed in'
) => {
    let time = new Date().toISOString()
    console.log(time, message, userId)
}


// 4.2
type Filter = {
    <T>(array: T[], f: (item: T) => boolean): T[]
}

let filter: Filter = (array, f) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        let item = array[i]
        if (f(item)) {
            result.push(item)
        }
    }
    return result
}

// Tはnumberにバインドされる
console.log(filter([1, 2, 3], _ => _ > 2))
// Tはstringにバインドされる
console.log(filter(['a', 'b'], _ => _ !== 'b'))
// Tは {firstName: string}にバインドされる
let names = [
    {firstName: 'beth'},
    {firstName: 'caitlyn'},
    {firstName: 'xin'}
]
let result = filter(
    names,
    _ => _.firstName.startsWith('b')
)

// 4.2.2
function map(array: unknown[], f: (item: unknown) => unknown): unknown[] {
    let result = []
    for (let i = 0; i < array.length; i++) {
        result[i] = f(array[i])
    }
    return result
}

function map2<T, U>(array: T[], f: (item: T) => U): U[] {
    let result = []
    for (let a = 0; i < array.length; i++) {
        result[i] = f(array[i])
    }
    return result
}


// 4.2.4
type MyEvent<T extends HTMLElement = HTMLElement> = {
    target: T
    type: string
}

type TimedEvent<T extends HTMLElement> = {
    event: MyEvent<T>
    from: Date
    to: Date
}

function triggerEvent<T extends HTMLElement>(event: MyEvent<T>): void {
    // ...
}

// triggerEvent({
//     target: document.querySelector('#myButton'),
//     type: 'mouseover'
// })



// 4.2.5
type TreeNode = {
    value: string
}

// 子ノードを持たないTreeNode
type LeafNode = TreeNode & {
    isLeaf: true
}

// 子ノードを持つTreeNode
type InnerNode = TreeNode & {
    children: [TreeNode] | [TreeNode, TreeNode]
}

let a: TreeNode = {value: 'a'}
let b: LeafNode = {value: 'b', isLeaf: true}
let c: InnerNode = {value: 'c', children: [b]}

// TreeNodeのサブタイプを取り、それと同じサブタイプを返す
// TreeNodeを渡した場合 -> TreeNode
// InnerNodeを渡した場合 -> InnerNode
// LeafNodeを渡した場合 -> LeafNode
function mapNode<T extends TreeNode>(
    node: T,
    f: (value: string) => string
): T {
    return {
        ...node,
        value: f(node.value)
    }
}

let a1 = mapNode(a, _ => _.toUpperCase()) // TreeNode
let b1 = mapNode(b, _ => _.toUpperCase()) // LeafNode
let c1 = mapNode(c, _ => _.toUpperCase()) // InnerNode


// 4.2.5.1 複数の制約を持つ制限付きポリモーフィズム
type HasSides = {numberOfSides: number}
type SidesHaveLength = {sideLength: number}

function logPerimeter<Shape extends HasSides & SidesHaveLength>(s: Shape): Shape {
    console.log(s.numberOfSides * s.sideLength)
    return s
}

type Square = HasSides & SidesHaveLength
let square: Square = {numberOfSides: 4, sideLength: 3}
logPerimeter(square)


// 制限付きポリモーフィズム & 可変超引数をモデル化
function call<T extends unknown[], R>(
    f: (...args: T) => R,
    ...args: T
): R {
    return f(...args)
}

// 4.6  ジェネリック型のデフォルトの型
// let buttonEvent: MyEvent<HTMLButtonElement> = {
//     target: myButton,
//     type: string
// }


// 4.5
// 5 isの実装
function is<T extends string | boolean | number>(
    a: T,
    b: T
): boolean {
    return a === b
}

console.log(is('string', 'otherstring'))  // => false
console.log(is(true, false))  // => false
console.log(is(42, 42))  // => true
// is(10, 'foo')  // => コンパイルエラー