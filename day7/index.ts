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

enum Mark {
    Empty = '.',
    Beam = '|',
    Source = 'S',
    Splitter = '^'
};

type Coordinate = {
    x: number,
    y: number,
}

let data: string = await Bun.file('input.txt').text();
let map: Mark[][] = data.split('\n').map(str => str.split('').map(char => char as Mark));

const toGreen = (message: string): string => `\x1b[32m${message}\x1b[0m`;
const toRed = (mess: string): string => `\x1b[31m${mess}\x1b[0m`;

function drawMap(map: Mark[][]): number {
    let count: number = 0;
    let rowLength: number = map[0]?.length || 0;
    let columnLength: number = map.length || 0;

    for(let i = 0; i < columnLength; i++) {
        for(let j = 0; j < rowLength; j++) {
            let coordinate: Coordinate = { x: i, y: j };
            let current: Mark | undefined = getMark(coordinate);

            if(current && (isSource(current) || isBeam(current))) {
                sendBeamDown(coordinate);
            }
            
            else if(current && isSplitter(current)) {
                if(isBeamAbove(coordinate)) {
                    splitBeam(coordinate);
                    // don't forget to send the beam down for then one on the left. 
                    sendBeamDown({ x: coordinate.x, y: coordinate.y - 1 });
                    count++;
                }
                
            }
        }
    }
    return count;
}

function getMark(coord: Coordinate): Mark | undefined {
    if (isValidCoordinates(coord)) {
        let subMap: Mark[] = map[coord.x] || [];
        let mark = subMap[coord.y];
        return mark;
    } else {
        debugFlag && console.log('GET FAILED!', coord);
    }
    
}

function setMark(coord: Coordinate, mk: Mark): void {
    let { x, y }: Coordinate = coord;
    
    if(isValidCoordinates(coord)) {
        if(map[x]) {
            map[x][y] = mk;
        }
    } else {
        debugFlag && console.log('SET FAILED!', coord);
    }
    
}

function isSource(mark: Mark): boolean {
    return mark === Mark.Source;
}

function isEmpty(mark: Mark): boolean {
    return mark === Mark.Empty;
}

function isSplitter(mark: Mark): boolean {
    return mark === Mark.Splitter
}

function isBeam(mark: Mark): boolean {
    return mark === Mark.Beam;
}

function isBeamAbove(coord: Coordinate): boolean {
    let { x, y }: Coordinate = coord;
    let compare: Mark | undefined = getMark({ x: x - 1, y });

    return Boolean(compare && isBeam(compare));
}

function splitBeam(coord: Coordinate): void {
    let { x, y }: Coordinate = coord;

    setMark({ x , y: y - 1}, Mark.Beam);
    setMark({ x , y: y + 1}, Mark.Beam);
}

function sendBeamDown(coord: Coordinate): void {
    let { x, y } = coord;

    let mk: Mark | undefined = getMark({ x: x + 1, y });

    // If there is NOT a splitter down there, go ahead
    if(mk && !isSplitter(mk)) {
        setMark({ x: x + 1, y }, Mark.Beam);
    }
}

function isValidCoordinates(coord: Coordinate): boolean{
    let { x, y } = coord;
    let yLength: number = map[0]?.length || 0;

    let isValid = 
      (!(x < 0) && !(y < 0)) && // if either index is less than zero OR
      (!(x > map.length - 1) && !(y > yLength - 1));// if index is greater than lengths.
    
    return isValid;
}

function printGrid(grid: Mark[][]) {
    for(let row of grid) {
        console.log(toGreen(row.join(' ')));
    }
}



if(values?.part === '2') {

} else {

    printGrid(map);
    console.log('\n\n');

    console.time('Runtime...');
    
    let count: number = drawMap(map);
    console.timeEnd('Runtime...');

    printGrid(map);

    console.log(toRed(`The tachyon beam was split ${count} times!`));

    


}
