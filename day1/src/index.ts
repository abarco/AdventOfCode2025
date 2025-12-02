import fs from 'fs/promises';
import path from 'path';

type Direction = 'R' | 'L';
type Turn = [ Direction, number ];

const fileName: string = process.env.npm_config_filename || 'input.txt';
const initialDial: number = Number(process.env.npm_config_dial) || 0;
const debugFlag: boolean = Boolean(process.env.npm_config_debug) || false;

/**
 * Function to read input file and turn each line of the file into Turn dial instructions
 * @param filePath String with 'input.txt' as default
 * @returns a Promise with an Array of Turns
 */
async function readInputFile(filePath: string): Promise<Turn[]> {
	try {
		const absPath: string = path.join(process.cwd(), 'src', filePath);
		const data = await fs.readFile(absPath, { encoding: 'utf8' });
		const rawInputs: string[] = data.split(/\r?\n/);
		let inputs: Turn[] = [];

		for(let input of rawInputs) {
			inputs.push(parseTurn(input));
		}

		return inputs;
	} catch (err) {
		throw err;

	}
}

/**
 * Function to turn a raw String Turn instruction, into a Turn type. Separating the direction and distance parameters.
 * @param turn Parameter containing a raw string turn instructions
 * @returns a Turn type. Composed of a direction and a distance. 
 */
function parseTurn(turn: string): Turn {
	let direction: string = turn.charAt(0);
	let distance: number = parseInt(turn.slice(1));

	if(direction !== 'R' && direction !== 'L') {
		throw new Error ('Invalid Direction parameter');
	}

	let parsed: Turn = [ direction, distance ];
	return parsed;
}

/**
 * Function to determine the amount of times a dial ends up in the 0 spot based on an array of turns. 
 * @param inputInstructions An Array of Turns. Used to determine direction and distance to turn the Dial in.
 * @param dialStart Initial Dial number location. Can start from 0 to 99
 * @returns The number of times that the Dial stops at the 0 spot. 
 */
function decodeDialPasswordNoClick(inputInstructions: Turn[], dialStart: number): number {
	let zeroCount: number = 0;
	let currentDial: number = dialStart;

	debugFlag && console.log(`- The dial starts by pointing at ${dialStart}`);

	for(let instruction of inputInstructions) {
		currentDial = turnTheDial(instruction, currentDial);

		if (currentDial === 0) zeroCount++;

		debugFlag && console.log(`- The dial is rotated ${instruction} to point at ${currentDial}`);
	}

	return zeroCount;
}

function decodeDialPasswordWithClick(inputInstructions: Turn[], dialStart: number): number {
	let zeroCount: number = 0;
	let currentDial: number = dialStart;
	let clicks: number;

	debugFlag && console.log(`- The dial starts by pointing at ${dialStart}`);

	for(let instruction of inputInstructions) {
		[clicks, currentDial] = countClick(instruction, currentDial);
		zeroCount += clicks;

		if(debugFlag) {
			if(clicks) {
				console.log(`- The dial is rotated ${instruction} to point at ${currentDial}; \n during this rotation, it points at 0 ${clicks} times`);
			} else {
				console.log(`- The dial is rotated ${instruction} to point at ${currentDial}.`);
			}
			
		}
	}


	return zeroCount;
}

function countClick(input: Turn, start: number): [ number, number ] {
	let zeroCount: number = 0;
	let location: number = 0;
	let [ direction, distance ]: [ Direction, number ] = input;

	switch(direction) {
		case 'L':
			// quick hack to identify starter positions.
			if(start === 0) start = 100;
			zeroCount = Math.floor(((100 - start) + distance) / 100);
			location = 100 - Math.floor(((100 - start) + distance) % 100);
			break;
		case 'R':
			// quick hack to identify ending positions. 
			if(start === 100) start = 0;
			zeroCount = Math.floor((start + distance) / 100);
			location = Math.floor((start + distance) % 100);
			break;
	}

	return [ zeroCount, location ];
}

/**
 * Function to determine where the dial will land based on the left turn distance. 
 * @param start Start dial. Where the dial starts from. 
 * @param distance How many turns to the Left we'll be moving. 
 * @returns The location of the dial based on the distance to the Left we must turn it. 
 */
function turnLeft(start: number, distance: number): number {
	let result: number = (start - distance);

	if(result < 0)
		return turnLeft(result + 100, 0);

	return result;
}

/**
 * Function to determine where the dial will land based on the right turn distance. 
 * @param start Start dial. Where the dial starts from. 
 * @param distance How many turns to the Right we'll be moving. 
 * @returns The location of the dial based on the distance to the Right we must turn it. 
 */
function turnRight(start: number, distance: number): number {
	let result: number = (start + distance);

	if(result > 99)
		return turnRight(result - 100, 0);

	return result;
}

/**
 * Function to determine the landing location of the Dial after Turning it. 
 * @param input A turn instruction. Contains a direction and distance for how to turn the Dial.
 * @param start Initial location of the Dial. Can be from 0 - 99
 * @returns The location of the Dial after turning it. 
 */
function turnTheDial(input: Turn, start: number): number {
	let [ direction, distance ]: [ Direction, number ] = input;
	let end: number;

	switch(direction) {
		case 'L':
			end = turnLeft(start, distance);
			break;
		case 'R':
			end = turnRight(start, distance);
			break;
	}

	return end;

}



try {
	let instructionArray: Turn[] = await readInputFile(fileName);
	let zeroCount: number = decodeDialPasswordWithClick(instructionArray, initialDial);

	console.log(`\n The password in this configuration is: ${zeroCount}`);
} catch (err) {
	console.log(err);
}



