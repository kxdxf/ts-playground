type Sample = 'Sample' | 'Dummy';

const sample: Sample = 'Sample';
console.log(typeof sample);  // => String

type Sample3 = { fieldA: string, fieldB: number }
const sample2: Sample3 = {fieldA: 'test', fieldB: 100 }
console.log(typeof sample2)  // => Object