import fs from 'fs/promises';
import path from 'path';

const fileName: string = 'input.txt';
const debugFlag: boolean = Boolean(process.env.npm_config_debug) || false;
const PART: number = Number(process.env.npm_config_part) || 1;

async function readInputFile(fileName: string): Promise<string[]> {
    try {
        const absPath: string = path.join(process.cwd(), 'src', fileName);
        const data = await fs.readFile(absPath, { encoding: 'utf-8' });
        const rawInputs: string[] = data.split(/\r?\n/).map(chunk => chunk.trim());

        return rawInputs;

    } catch (err) {
        throw err;
    }
}

function determineJolt(bank: string): number {
  let jolt: number = 0;
  let bankLength: number = bank?.length;
  let firstNum: number = 0;
  let firstNumIndex: number = 0;
  let secondNum: number = 0;

  // find the first digit. 
  for(let i = 0; i < bankLength - 1; i++) {
    // cast to number for comparison. 
    let candidate = Number(bank[i]);

    // is the candidate bigger then current one? If so, let's save that.
    if(firstNum < candidate) {
      firstNum = candidate;
      firstNumIndex = i;
    }

    // we don't need to proceed with the loop. We found our biggest battery; let's look for the next one. 
    if(candidate === 9) break;

  }

  // we start from whenre we left off. Fiding second digit.
  for (let j = firstNumIndex + 1; j < bankLength; j++) {
    let candidate = Number(bank[j]);

    if(secondNum < candidate) {
      secondNum = candidate;
    }

    // we don't need to proceed. 9 is king. 
    if(candidate === 9) break;
  }

  // appending the numbers together, and casting to number. 
  jolt = Number('' + firstNum + secondNum);

  debugFlag && console.log(`Bank: ${bank} \t produces Jolt of ${jolt}`);
  return jolt;
}

function produceTotalJoltage(banks: string[]): number {
  let joltAddition: number = 0;

  for(let bank of banks) {
    joltAddition += determineJolt(bank);
  }

  return joltAddition;
}

let inputs: string[] = await readInputFile(fileName);
console.time('Runtime');
let joltAddition: number = produceTotalJoltage(inputs);

console.log(`Your total output joltage is: \t ${joltAddition}`);
console.timeEnd('Runtime');