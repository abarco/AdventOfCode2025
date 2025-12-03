import fs from 'fs/promises';
import path from 'path';

const fileName: string = 'input.txt';
const PATTERN_PART1: RegExp = /^([1-9]\d*)\1$/;
const PATTERN_PART2: RegExp =  /^([1-9]\d*)(\1)+$/;

const debugFlag: boolean = Boolean(process.env.npm_config_debug) || false;
const PART: number = Number(process.env.npm_config_part) || 1;

// Range type with a beginning and end range. 
type Range = [ number , number ];

async function readInputFile(fileName: string): Promise<string[]> {
    try {
        const absPath: string = path.join(process.cwd(), 'src', fileName);
        const data = await fs.readFile(absPath, { encoding: 'utf-8' });
        const rawInputs: string[] = data.split(',').map(chunk => chunk.trim());
        let inputs: string[] = [];
        
        for(let input of rawInputs) {
            inputs.push(input);
        }

        return inputs;

    } catch (err) {
        throw err;
    }
}

function produceRange(range: string): Range {
    let stringRange: string[] = range.split('-');
    
    if(stringRange.length !== 2) {
        throw new Error('Bad range, should contain two numbers per range input');
    }

    if (!(stringRange && stringRange[0] && stringRange[1])){
        throw new Error('Ranges are not defined well. Check range input');
    }

    let start: number = parseInt(stringRange[0]);
    let end: number = parseInt(stringRange[1]);

    return [ start, end ];
}

function produceSequence([ start, end ]: Range ): Array<string> {
    // produce array from start to end inclusive sequence. 
    return Array.from({ length: (end - start) + 1 }, (_, i) => (start + i).toString());
}

function checkSequenceForInvalidIDs(sequence: Array<string>, pattern: RegExp): Array<number> {
    let offendingIDs: Array<number> = [];

    for(let sec of sequence) {
        let matches: Array<string> = sec.match(pattern) || [];
        
        if(matches && matches.length > 0 && matches[0]) {
            let offender: string = matches[0];
            let converted: number = parseInt(offender);
            offendingIDs.push(converted);
        }
    }
    debugFlag && console.log('Invalid sequences: ', offendingIDs);
    return offendingIDs;
}

function produceRangedArray(ranges: string[]): Range[] {
    let rangedArray: Range[] = [];

    for(let range of ranges) {
        rangedArray.push(produceRange(range));
    }

    return rangedArray;
}

function addRangedArray(array: Array<number>): number {
    return array.reduce((acc, curr) => acc + curr, 0);
}

let ranges: string[] = await readInputFile(fileName);
let rangeArray: Range[] = produceRangedArray(ranges);
let offendingIDs: Array<number> = [];
for(let r of rangeArray) {
    let seq: Array<string> = produceSequence(r);
    
    if(PART === 1) {
        offendingIDs.push(...checkSequenceForInvalidIDs(seq, PATTERN_PART1));
        
    } else if(PART === 2) {
        offendingIDs.push(...checkSequenceForInvalidIDs(seq, PATTERN_PART2));
    }
    
    
}

let invalidIDSum: number = addRangedArray(offendingIDs);

console.log(`\x1b[1m\x1b[32mThis is the invalid ID output: \t ${invalidIDSum} \x1b[0m`);