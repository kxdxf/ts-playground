// --------------------------------
// 共変性の確認
// --------------------------------
type ExistingUser = {
    id: number
    name: string
}

type NewUser = {
    name: string
}

// ユーザーを削除するコードの作成
function deleteUser(user: {id?: number, name: string}) {
    delete user.id
}

let existingUser: ExistingUser = {
    id: 123456,
    name: 'Ima User'
}

deleteUser(existingUser)

type LegacyUser = {
    id?: number | string
    name: string
}

let legacyUser: LegacyUser = {
    id: '793331',
    name: 'Xin Yang'
}

// エラー
// deleteUser(legacyUser);


// --------------------------------
// 関数の変性の確認
// --------------------------------
// 関数のパラメータ型は反変
class Animal{}
class Bird extends Animal {
    chirp() {}
}
class Crow extends Bird {
    caw() {}
}

function chirp(bird: Bird): Bird {
    bird.chirp()
    return bird
}

// chirp(new Animal())  // エラー
chirp(new Bird())
chirp(new Crow())

function clone(f: (b: Bird) => Bird): void {}

function birdToBird(b: Bird): Bird {
    return new Bird()
}
function birdToCrow(b: Bird): Crow {
    return new Crow()
}
function birdToAnimal(b: Bird): Animal {
    return new Animal()
}

// Birdを取り、Birdを返す関数は受け取れる
clone(birdToBird)
clone(birdToCrow)
// clone(birdToAnimal)  渡せない


// --------------------------------
// 型の拡大
// --------------------------------
// 型推論の上で方が決まる
let a_6 = 'x'
let b_6 = 3
var c_6 = true
const d_6 = {x: 3}

enum E {X, Y, Z}
let e_6 =  E.X

// イミュータブルな宣言は型が絞られる
const a_6_2 = 'x'
const b_6_2 = 3

// 明示的に型アノテーションを使うと型の拡大を防げる
let a_6_3: 'x' = 'x'
const d_6_3: {x: 3} = {x: 3}

// 際割り当てに伴う型の拡大
let a_6_4 = 'x'
let b_6_4 = a_6_4  // string型


// --------------------------------
// コンストアサーション
// ・型の拡大を抑える
// ・型のメンバーを再帰的にreadonlyにする
// --------------------------------
let c_6_5 = {x: 3} as const
const sample = 'https://******'


// --------------------------------
// 過剰プロパティチェック
// --------------------------------
type Options = {
    baseURL: string
    cacheSize?: number
    tier?: 'prod' | 'dev'
}

class API {
    constructor(private options: Options) {}
}

new API({
    baseURL: 'https://***',
    tier: 'prod'
})

new API({
    baseURL: sample,
    tier: 'prod'
})

new API({
    baseURL: sample,
    // badTIer: 'prod'  IDEで警告 & エラー
})


// --------------------------------
// 型の絞り込み
// --------------------------------
// 制御フロー文を使って型の絞り込みを行う
type Unit = 'cm' | 'px' | '%'
let units: Unit[] = ['cm', 'px', '%']

function parseUnit(value: string): Unit | null {
    for (let i = 0; i < units.length; i++) {
        if (value.endsWith(units[i])) {
            return units[i]
        }
    }
    return null
}

type Width = {
    unit: Unit,
    value: number
}

function parseWidth(width: number | string | null | undefined): Width | null {
    if (width == null) {
        return null
    }

    if (typeof width === 'number') {
        return {unit: 'px', value: width}
    }

    let unit = parseUnit(width)
    if (unit) {
        return {unit, value: parseFloat(width)}
    }

    return null
}


// --------------------------------
// タグ付き合併型
// --------------------------------
type UserTextEvent = {value: string, target: HTMLInputElement}
type UserMouseEvent = {value: [number, number], target: HTMLElement}
type UserEvent = UserTextEvent | UserMouseEvent

// 返却値の型が制御と共に変わってしまってよくない
// function handle(event: UserEvent) {
//     if (typeof event.value === 'string') {
//         event.value // string
//         return
//     }
//     return event.value
// }

function handle(event: UserEvent) {
    if (typeof event.value === 'string') {
        event.value  // string
        event.target  // HTMLInputElement or HTMLElement
    }
    event.value  // [number, number]
    event.target  // HTMLInputElement or HTMLElement
}


// --------------------------------
// 完全生
// 実装が全てのケースをカバーできているかどうか、型チェッカーが確認できるようにするもの
// --------------------------------
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

// 以下のような書き方だと、全てのパターンを網羅できていないことを警告してくれる
// function getNextDay(w: Weekday): Day {
//     switch (w) {
//         case 'Mon' : return 'Tue'
//     }
// }

// 全てのケースをカバーすればエラーは出ない
function getNextDay(w: Weekday): Day {
    switch (w) {
        case 'Mon' : return 'Tue'
        case 'Tue' : return 'Wed'
        case 'Wed' : return 'Thu'
        case 'Thu' : return 'Fri'
        case 'Fri' : return 'Mon'
    }
}

function isBig(n: number) {
    return n >= 100;
}


// --------------------------------
// 高度なオブジェクト型
// --------------------------------
type APIResponse = {
    user: {
        userId: string
        friendList: {
            count: number
            friends: {
                firstName: string
                lastName: string
            }[]
        }
    }
}

// function getAPIResponse(): Promise<APIResponse> {
// }

function renderFriendList(friendList: unknown) {}

// unknownにしているfriendListの型
// type FriendList = {
//     count: number
//     friends: {
//         firstName: string
//         lasrName: string
//     }[]
// }
//
// type APIResponse = {
//     user: {
//         userId: string
//         friendList: FriendList
//     }
// }

// --------------------------------
// keyof演算子
// --------------------------------
type ResponseKey = keyof APIResponse
type UserKeys = keyof APIResponse['user']

// 型安全なゲッター関数
function get<O extends object, K extends keyof O>(o: O, k: K) {
    return o[k]
}

type ActiveLog = {
    lastEvent: Date
    events: {
        id: string
        timestamp: Date
        type: 'Read' | 'Write'
    }[]
}

function createActivityLog(): ActiveLog {
    return {
        lastEvent: new Date(),
        events: [{
            id: '100',
            timestamp: new Date(),
            type: "Read"
        }]
    }
}

let activetyLog: ActiveLog =createActivityLog()
let lastEvent = get(activetyLog, 'lastEvent')
let events = get(activetyLog, 'events')

console.log(lastEvent)
console.log(events)

type Get = {
    <O extends object, K1 extends keyof O>(o: O, k1: K1): O[K1]
    <O extends object, K1 extends keyof O, K2 extends keyof O[K1]>(o: O, k1: K1, k2: K2): O[K1][K2]
    <O extends object, K1 extends keyof O, K2 extends keyof O[K1], K3 extends keyof O[K1][K2]>(o: O, k1: K1, k2: K2, k3: K3): O[K1][K2][K3]
}

let get2: Get = (object: any, ...keys: string[]) => {
    let result = object
    keys.forEach(k => result = result[k])
    return result
}

get2(activetyLog, 'events', 0, 'type')


// --------------------------------
// レコード型
// ある値から別の値へのマッピングを定義できる
// --------------------------------
let nextDay2: Record<Weekday, Day> = {
    Mon: 'Tue',
    Tue: 'Wed',
    Wed: 'Thu',
    Thu: 'Fri',
    Fri: 'Sat'
}


// --------------------------------
// マップ型
// --------------------------------
// Weekdayに対するキー(型はDay)のマッピング
let nextDay3: {[K in Weekday]: Day} = {
    Mon: 'Tue',
    Tue: 'Wed',
    Wed: 'Thu',
    Thu: 'Fri',
    Fri: 'Sat'
}

// type MyMappedType = {
//     [Key in UnionType]: ValueType
// }

// type Record<K extends keyof any, T> = {
//     [P in K]: T
// }

type Account = {
    id: number
    isEmployee: boolean
    notes: string[]
}

type OptionalAccount = {
    [K in keyof Account]?: Account[K]
}

type NUllableAccount = {
    [K in keyof Account]: Account[K] | null
}

type ReadonlyAccount = {
    readonly [K in keyof Account]: Account[K]
}

type Account2 = {
    -readonly [K in keyof ReadonlyAccount]: Account[K]
}

type Account3 = {
    [K in keyof OptionalAccount]-?: Account[K]
}


// --------------------------------
// コンパニオンオブジェクトパターン
// 型と値の情報をグループ化できる
// --------------------------------
type Unit2 = 'EUR' | 'GBP' | 'JPY' | 'USD'
type Currency = {
    unit: Unit2
    value: number
}

let Currency = {
    from(value: number, unit: Unit2): Currency {
        return {
            unit: unit,
            value
        }
    }
}


// --------------------------------
// コンパニオンオブジェクトパターン
// タプルについての型推論の改善
// --------------------------------
function tuple<T extends unknown[]>(...ts: T): T {
    return ts
}

// ユーザー定義型ガード
function isString(a: unknown): a is string {
    return typeof a === 'string'
}


// --------------------------------
// 非nullアサーション
// --------------------------------
// type Dialog = {
//     id?: string
// }

type VisibleDialog = {id: string}
type DestroyedDialog = {}
type Dialog = VisibleDialog | DestroyedDialog

function removeFromDOM(dialog: VisibleDialog, element: Element) {
    element.parentNode!.removeChild(element)
    // delete dialog.id  エラーが出てしまう
}

function closeDialog(dialog: Dialog) {
    if (!('id' in dialog)) {
        return
    }

    setTimeout(() =>
        removeFromDOM(
            dialog,
            document.getElementById(dialog.id)!
        )
    )
}


// --------------------------------
// 明確な割り当てアサーション
// --------------------------------
// let userId: string
// userId.toUpperCase()

let userId!: string
fetchUser()
userId.toUpperCase()

function fetchUser() {
    userId = 'tmp'
}


// --------------------------------
// 練習問題
// --------------------------------
let p_6_a: number = 1
// let p_6_b: 1 = number  割り当てできない
let p_6_c: number | string = 'test'
// let p_6_d: number = true  割り当てできない
let p_6_e: (number|string)[] = [1, 2, 3]
