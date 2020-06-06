
class Tile {

    constructor(px, py) {
        this.x = px;
        this.y = py;
    }

    //Returns the tile type
    getTileType() {
        return 'Default';
    }
};

class Border extends Tile {

    	constructor(px, py) {
            super(px, py);
        }

        getTileType() {
            return 'Border';
        }
};

class Node extends Tile {

    constructor(px, py) {
        super(px,py);
        this.parent = null;
        this.gScore = 0;
        this.hScore = 0;
        this.neighbours = [];
        this.isVisited = false;
    }

    //Returns the F-Score of the Node
    getFScore() {
        return this.hScore + this.gScore;
    }

    getNeighbours() {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if(x == 0 && y == 0) {
                    continue;
                }

                var checkX = this.x + x;
                var checkY = this.y + y;

                if(checkX >= 0 && checkX < gridSize && checkY >= 0 && checkY < gridSize) {
                    this.neighbours.push(grid[checkX][checkY]);
                } 
            }
        }
        return this.neighbours;
    }

    getTileType() {
        return 'Node';
    }
}

class Start extends Node {

    constructor(px, py) {
        super(px, py);
    }

    getTileType() {
        return 'Start';
    }
};

class Finish extends Node {

    constructor(px, py) {
        super(px, py);
    }

    getTileType() {
        return 'Finish';
    }
};
