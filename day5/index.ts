import type { BunFile } from "bun";

type Range = { start: number, end: number };

let file: BunFile = Bun.file('input.txt');
let data: string = await file.text();
let split: string[] = data.split(/\n{2,}/);


let rawRanges: string = split[0] || '';
let rawInput: string = split[1] || '';

function formatListOfRanges(ranges: string): Range[] {
    let result: Range[] = ranges.split('\n').map(rng => {
        let r: string[] = rng.split('-');

        return { 
            start: Number(r[0]), 
            end: Number(r[1])
         };
    });

    return result;
}

function formatFruitInput(fruits: string): number[] {
    let result: number[] = fruits.split('\n').map(fruit => Number(fruit));

    return result;
}

function numberOfFreshFruit(fruits: number[], ranges: Range[]): number {
    let freshFruit: number = 0;

    for(let fruit of fruits) {
        for(let range of ranges) {
            if(fruit >= range.start && fruit <= range.end) {
                freshFruit++;// the fresh fruit count is ++. 
                break;// We don't need to find more ranges, so break. 
            }
        }
    }

    return freshFruit;
}

let ranges: Range[] = formatListOfRanges(rawRanges);
let fruits: number[] = formatFruitInput(rawInput);

console.time('Runtime...');

let freshFruit: number = numberOfFreshFruit(fruits, ranges);

console.timeEnd('Runtime...');
console.log('this is the fresh fruit no: ', freshFruit);

