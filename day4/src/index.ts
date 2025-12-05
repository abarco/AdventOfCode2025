import fs from 'fs/promises';
import path from 'path';

const fileName: string = 'input.txt';
const debugFlag: boolean = Boolean(process.env.npm_config_debug) || false;
const PART: number = Number(process.env.npm_config_part) || 1;

async function readInputFile(fileName: string): Promise<Space[][]> {
    try {
        const absPath: string = path.join(process.cwd(), 'src', fileName);
        const data = await fs.readFile(absPath, { encoding: 'utf-8' });
        const rawInputs: string[] = data.split(/\r?\n/).map(chunk => chunk.trim());
        const finalSpaceGrid: Space[][] = [];

        for(let input of rawInputs) {
          finalSpaceGrid.push(input.split('').map(sp => sp as Space));
        }
        
        return finalSpaceGrid;

    } catch (err) {
        throw err;
    }
}

enum Space {
  EMPTY = '.',
  ROLL = '@',
  MARKED = 'X'
}

type Coordinate = {
  x: number,
  y: number,
}

class Crawler {
  grid: Space[][];
  newGrid: Space[][];
  markedGrid: Space[][];
  currentCoordinate: Coordinate = { x: 0, y: 0};

  constructor(grid: Space[][]) {
    this.grid = grid.map(inner => inner.slice());
    this.newGrid = grid.map(inner => inner.slice());
    this.markedGrid = grid.map(inner => inner.slice());
  }

  start(): number {
    // start our creepy crawly

    // evaluate first Square
    let accessiblePaperRolls: number = 
      (this.check() === Space.ROLL && this.evaluateAdjacentRolls()) ? 1 : 0;
    
    // While we have more items to explore
    while(this.next()) {
      // if next item is a Roll, we evaluate. If not, we do nothing. 
      if(this.check() === Space.ROLL) {
        if(this.evaluateAdjacentRolls()) {
          accessiblePaperRolls++;
        }
      }
    }

    return accessiblePaperRolls;

  }

  next(): Space | undefined {

    // Sets the new currentSpace, and returns the Space character
    let { x, y } = this.currentCoordinate;
    
    if(this.isValidCoordinates({x, y: y + 1})) {
      // first we try to move to the right. (x, y + 1);
      this.currentCoordinate = { x, y: y + 1};
      return this.grid[this.currentCoordinate.x][this.currentCoordinate.y];
    } else if(this.isValidCoordinates({x: x + 1, y: 0})) {
      // if not allowed, we move down a row. (x + 1, y);
      this.currentCoordinate = {x: x + 1, y: 0};
      return this.grid[this.currentCoordinate.x][this.currentCoordinate.y];
    } else {
      // we're done
      return;
    }
  }

  // What is in the coordinate for the grid? 
  check(coord?: Coordinate): Space | undefined {
    let coordinate: Coordinate = coord ? coord : this.currentCoordinate;
    if(this.isValidCoordinates(coordinate)) {
      return this.grid[coordinate.x][coordinate.y];
    }
  }

  // evaluates the coordinate to check how many rolls are adjacent. 
  // if rolls adjacent are more than 4. We print true, else false
  evaluateAdjacentRolls(coord?: Coordinate): boolean {
    let count: number = 0;
    let coordinate = coord ? coord : this.currentCoordinate;
    
    // previous Up
    if(this.check({ x: coordinate.x - 1, y: coordinate.y - 1}) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }

    // Up
    if(this.check({ x: coordinate.x - 1, y: coordinate.y }) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }
    // next Up
    if(this.check({ x: coordinate.x - 1, y: coordinate.y + 1}) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }

    // previous
    if(this.check({ x: coordinate.x, y: coordinate.y - 1 }) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }
    // next
    if(this.check({ x: coordinate.x, y: coordinate.y + 1 }) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }
    // previous down
    if(this.check({ x: coordinate.x + 1, y: coordinate.y - 1}) === Space.ROLL) {
      
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }
    // down
    if(this.check({ x: coordinate.x + 1, y: coordinate.y }) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }
    // next down
    if(this.check({ x: coordinate.x + 1, y: coordinate.y + 1 }) === Space.ROLL) {
      // There is an adjecent roll
      count++;

      if(count >= 4) {
        return false;
      }
    }
    
    // Mark with an X if i want
    this.markedGrid[this.currentCoordinate.x][this.currentCoordinate.y] = Space.MARKED;
    this.newGrid[this.currentCoordinate.x][this.currentCoordinate.y] = Space.EMPTY;

    return true;
  }

  isValidCoordinates(coord: Coordinate): boolean{
    let { x, y } = coord;
    
    let isValid = 
      (!(x < 0) && !(y < 0)) && // if either index is less than zero OR
      (!(x > this.grid.length - 1) && !(y > this.grid[0].length - 1));// if index is greater than lengths.
    
    return isValid;
  }

  printGrid(): void {
    console.log('\x1b[32m%s\x1b[0m', 'Toilet paper grid:');
    for(let row of this.grid) {
      console.log('\x1b[31m%s\x1b[0m', row.join(''));
    }
  }
  printSolved(): void {
    console.log('\x1b[32m%s\x1b[0m', 'Toilet SOLVED paper grid:');
    for(let row of this.newGrid) {
      console.log('\x1b[31m%s\x1b[0m', row.join(''));
    }
  }

  produceNewGrid(): Space[][] {
    return this.newGrid;
  }
}


let grid: Space[][] = await readInputFile(fileName);
let crawly: Crawler = new Crawler(grid);

crawly.printGrid();




if(PART === 1) {
  console.time('Runtime...');
  let numberOfAccessiblePaper: number = crawly.start();
  console.timeEnd('Runtime...');
  crawly.printSolved();

  console.log('\x1b[32m%s\x1b[0m', `This is the number of accessible paper rolls: ${numberOfAccessiblePaper}`);
} else if(PART === 2) {
  console.time('Runtime...');
  let numberOfAccessiblePaper: number = crawly.start();
  let countAccessed = numberOfAccessiblePaper;

  while(numberOfAccessiblePaper !== 0) {
    crawly = new Crawler(crawly.produceNewGrid());
    numberOfAccessiblePaper = crawly.start();
  
    countAccessed += numberOfAccessiblePaper;
  }
  
  console.timeEnd('Runtime...');
  crawly.printSolved();

  console.log('\x1b[32m%s\x1b[0m', `This is the number of accessible paper rolls: ${countAccessed}`);
}