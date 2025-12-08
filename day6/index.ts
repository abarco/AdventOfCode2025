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

let data: string = await Bun.file('input.txt').text();
enum Operation {
    PLUS = '+',
    MINUS = '-',
    MULT = '*',
    DIV = '/',
}

function parseData(data: string): string[][] {
    let parse: string[] = data.split('\n');
    
    let nParse: string[][] = parse.map(s => s.split(' ').filter(c => { if(c) return c; }));

    return nParse;
}

function parseDataTwo(data: string): string[][] {
    let parse: string[] = data.split('\n');
    
    let nParse: string[][] = parse.map(s => s.split(''));

    return nParse;
}

function returnOperationAddition(cephalopodInput: string[][]): number {
    let addition: number = 0;
    let amountOfOperations: number = Number(cephalopodInput[0]?.length) - 1 || 0;

    while(amountOfOperations >= 0) {
        let operation: string[] = retrieveOperation(amountOfOperations, cephalopodInput);
        addition += executeOperation(operation);
        amountOfOperations--;
    }

    return addition;
}

function retrieveOperation(location: number, input: string[][]): string[] {
    let operation: string[] = [];
    for(let row of input) {
        if(row && row[location]){
            operation.push(row[location]);
        }
    }

    return operation;
}

function transformToHuman(cephalopodInput: string[][]): string[][] {
    let rowLength: number = cephalopodInput[0]?.length || 0;
    let columnLength: number = cephalopodInput.length;
    let operations: string[] = [];
    let chunk: string = '';

    for(let j = 0; j <= rowLength -1; j++) {
        let unit: string = '';
        
        for(let i = columnLength - 1; i >= 0; i--) {
            let character: string = cephalopodInput[i]?.[j] || '';
            
            if(character === Operation.MULT || character === Operation.PLUS) {
                unit += character + ' ';
            } else {
                unit += character;
            }

            debugFlag && console.log(`(i , j) => (${i} , ${j}) : ${character}`);
        }
        
        // if our unit is a set amount of whitespaces or this is the end, we save our chunk
        if(unit === ' '.repeat(columnLength) || j === rowLength -1) {
            // last iteration, let's get our last unit
            if(j === rowLength -1) chunk += unit;
            
            debugFlag && console.log('THIS IS A CHUNK:', chunk);

            operations.push(chunk.trim());
            chunk = '';
        };

        // we keep adding the chunks together
        chunk += unit;
    }

    let human: string[][] = [];
    for(let op of operations) {
        human.push(op.split(' ').filter(c => c !== '').map(str => str.split('').reverse().join('')));
    }
    
    return human;
}

function returnFullOperationResult(input: string[][]): number {
    
    let count: number = 0;

    for(let operation of input) {
        count += executeOperation(operation);
    }

    return count;
}


function executeOperation(operation: string[]): number {
    let operator: Operation;
    if(values.part === '2') {
        operator = operation.shift() as Operation;
    } else {
        operator = operation.pop() as Operation;
    }
    
    let result: number = 0;
    switch(operator) {
        case Operation.PLUS:
            result = operation.reduce((acc, coll) => Number(acc) + Number(coll), 0);
            break;
        case Operation.MINUS:
            result = operation.reduce((acc, coll) => Number(acc) - Number(coll), 0);
            break;
        case Operation.MULT:
            result = operation.reduce((acc, coll) => Number(acc) * Number(coll), 1);
            break;
        case Operation.DIV:
            result = operation.reduce((acc, coll) => Number(acc) / Number(coll), 1);
            break;
    }

    return result;
}

if(values.part === '2') {
    let rawInput: string[][] = parseDataTwo(data);

    console.time('Runtime...');
    
    let humanInput: string[][] = transformToHuman(rawInput);
    
    let summation: number = returnFullOperationResult(humanInput);
    
    console.timeEnd('Runtime...');
    console.log('THIS IS THE TOTAL: ', summation);
    
} else {
    let rawInput: string[][] = parseData(data);
    console.time('Runtime...');
    
    let summation: number = returnOperationAddition(rawInput);
    
    console.timeEnd('Runtime...');
    console.log('THIS IS THE TOTAL: ', summation);
}


