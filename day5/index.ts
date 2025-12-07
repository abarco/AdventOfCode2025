import type { BunFile } from "bun";
import { debug } from "console";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    part: {
      type: "string",
    },
    debug: {
        type: "boolean"
    }
  },
  strict: true,
  allowPositionals: true,
});
const debugFlag: boolean = !!values.debug;

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

function numberOfFreshFruitPossible(ranges: Range[]): number {
    let numberOfValidFruit: number = 0;
    let listOfRanges: Range[] = [];

    /**
     * Iterating through the ranges to make sure they don't clash with any from listOfRanges.
     */
    ranges.forEach((x, index) => {

        // We're going to queue our first range
        if(listOfRanges.length === 0) {
            listOfRanges.push(x);
            return;
        }

        debugFlag && console.log('List of candidate Ranges: ', JSON.stringify(listOfRanges));
        listOfRanges.forEach((p, i) => {    

            if(x.start === 0 && x.end === -1) return;
            if(p.start === 0 && p.end === -1) return;

            // if no collision, we can compare it to the next listOfRanges
            else if(x.start > p.end || x.end < p.start) {
                debugFlag && console.log(`this x and p = (${x.start}, ${x.end}) (${p.start}, ${p.end}) \n`);
                return;
            }

            // Range collides to the right
            // x:     [3  -  7]
            // p: [1  -  5]
            //
            else if(x.start <= p.end && x.start > p.start) {
                debugFlag && console.log(`this is the x =        (${x.start}, ${x.end})`);
                debugFlag && console.log(`this is the p = (${p.start}, ${p.end}) \n`);

                // we modify the range to account for collision
                x.start = p.end + 1;
                // compare to next itme.
                return;
            }

            // Range collides to the left
            // x: [1  -  5]
            // p:     [3  -  7]
            //
             else if(x.end >= p.start && x.end < p.end) {
                debugFlag && console.log(`this is the x = (${x.start}, ${x.end})`);
                debugFlag && console.log(`this is the p =        (${p.start}, ${p.end}) \n`);

                // we modify the range to account for collision
                x.end = p.start -1;

                // compare to next item.
                return;
            }

            // Range is bigger subset
            //x: [1     -       10]
            //p:     [4 - 8]
            //
            else if(x.start <= p.start && x.end >= p.end) {
                debugFlag && console.log(`this is the x =        (${x.start}     ,       ${x.end})`);
                debugFlag && console.log(`this is the p =             (${p.start}, ${p.end}) \n`);

                // // we need to remove p, as a more inclusive range has come
                // listOfRanges.splice(i, 1);

                // we're going to invalidate this element
                listOfRanges[i] = { start: 0, end: -1 };

                // we proceed to compare to the rest
                return;
            }

            // Range is smaller subset
            //x:     [4 - 8]
            //p: [1     -      10]
            // 
            else if(x.start >= p.start && x.end <= p.end) {
                debugFlag && console.log(`this is the x =        (${x.start}, ${x.end})`);
                debugFlag && console.log(`this is the p = (${p.start}       ,            ${p.end}) \n`);
                
                // we flag x as invalid, since we don't need its value. 
                x = {
                    start: 0,
                    end: -1
                };
                
                return;
            }

            else {
                console.log('UNCHARTED WATERS!!!');
                console.log(`this is the x = (${x.start}, ${x.end})`);
                console.log(`this is the p = (${p.start}, ${p.end}) \n`);
            }
        });
        
        listOfRanges = listOfRanges.filter(range => !(range.start === 0 && range.end === -1));

        // After iterating, if we didn't mark it, or modify further
        if(!(x.start === 0 && x.end === -1)) {
            // we add it to our clean list of Ranges
            listOfRanges.push(x);
        }

        if(x.start === 0 && x.end === -1) {
            console.log(' we got one invalid!', x);
        }

    });
    debugFlag && console.log('\x1b[32m%s\x1b[0m', 'Final List Ranges: ', JSON.stringify(listOfRanges));
    // Now with a clean list of non-colliding ranges
    for(let range of listOfRanges) {
        // we add them up
        numberOfValidFruit += rangeArea(range);
    }

    return numberOfValidFruit;
}

function rangeArea(range: Range): number {
    return (range.end - range.start) + 1
}

let ranges: Range[] = formatListOfRanges(rawRanges);
let fruits: number[] = formatFruitInput(rawInput);

if(values.part === '1' || values.part === undefined) {
    console.time('Runtime...');

    let freshFruit: number = numberOfFreshFruit(fruits, ranges);

    console.timeEnd('Runtime...');
    console.log('this is the fresh fruit no: ', freshFruit);
}

if(values.part === '2') {
    console.time('Runtime 2...');

    let freshFruit: number = numberOfFreshFruitPossible(ranges);

    console.timeEnd('Runtime 2...');
    console.log('this is the fresh fruit no: ', freshFruit);
}



