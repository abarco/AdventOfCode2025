import type { BunFile } from "bun";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    part: {
      type: "string",
    }
  },
  strict: true,
  allowPositionals: true,
});

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

    // we're going to put the operations at the top;
    let operations: string[] = nParse.pop() || [];
    nParse.unshift(operations);

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

function retOp(location: number, input: string[][]): string[] {
    let operation: string[] = [];

    
}

function executeOperation(operation: string[]): number {
    let operator: Operation = operation.pop() as Operation;
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
    
    for(let row of rawInput) {
        console.log(row);
    }
    
} else {
    let rawInput: string[][] = parseData(data);
    let summation: number = returnOperationAddition(rawInput);
    console.log('THIS IS THE TOTAL: ', summation);
}


