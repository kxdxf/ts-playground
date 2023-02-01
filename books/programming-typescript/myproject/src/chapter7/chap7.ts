// --------------------------------
// 明確な割り当てアサーション
// --------------------------------
class InvalidDateFormatError extends RangeError {}
class DateIsInTheFutureError extends RangeError {}

// 関数の返却値の型としてエラーを記述する
// この手法は効果的ではあるが、例外を返す処理をネストすると冗長になる
function parse(
    birthday: string
): Date | InvalidDateFormatError | DateIsInTheFutureError {
    let date = new Date(birthday)
    if (!isValid(date)) {
        return new InvalidDateFormatError('message')
    }
    if (date.getTime() > Date.now()) {
        return new DateIsInTheFutureError('message')
    }
    return date
}


// --------------------------------
// Option型
// --------------------------------
// エラーが発生する可能性のある処理を効果的に連鎖させて書くことができる

// 値の代わりに「コンテナ」を返却する
function parse2(birthday: string): Date[] {
    let date = new Date(birthday)
    if (!isValid(date)) {
        return []
    }
    return [date]
}


interface Option<T> {
    flatMap<U>(f: (value: T) => Option<U>): Option<U>
    getOrElse(value: T): T
}

class Some<T> implements Option<T> {
    constructor(private value: T) {}
    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
        return f(this.value)
    }
    getOrElse(value: T): T {
        return this.value
    }
}