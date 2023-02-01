interface Foo {
    foo: string
    bar: string
    baz: string
}

type F = keyof Foo

console.log('STOP')


// Indexed Access Types
type Person = {
    age: number
    name: string
    alive: boolean
}
type Age = Person["age"]  // Personのageフィールドの型になる
let age: Age = 100

type ReadOnlyPerson<T> = {
    readonly [K in keyof T]: T[K]
}
const readOnlyPerson: ReadOnlyPerson<Person> = {
    age: 30,
    name: 'sample',
    alive: true
}
// readOnlyPerson.age = 100  // 再代入できなくなる


const arr = ['apple', 'banana', 'grapes'] as const
type Arr = typeof arr
type Fruits = Arr[number]

type TupleObject<T extends readonly string[]> = {
    [P in T[number]]: P
}