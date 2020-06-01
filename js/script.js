//Global variables
var canvas, context, pathfinding, astar;
var grid = [];
var gridSize;

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
    }

    //Returns the G-Score of the Node
    getFScore() {
        return this.gScore + this.gScore;
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

class Pathfindinding {

    constructor() {
        this.path = [];
        this.start = null;
        this.finish = null;
        this.currentNode = null;
        this.lineCoast = 10;
        this.diagonalCoast = 14;
        this.found = false;
        this.modus = 'None';
    }

    setBorder(px, py) {
        grid[px][py] = new Border(px, py);
    }

    setStart(px, py) {
        grid[px][py] = new Start(px, py);
    }

    setFinish(px, py) {
        grid[px][py] = new Finish(px, py);
    }

    getPath() {
        var node = this.currentNode;
        this.path.push(node);
        while(node.parent) {
            this.path.push(node.parent);
            node = node.parent;   
        }
        Graphics.setLength(this.path);
        return this.path;
    }

    //Heuristic for GScore
    getEuclideanDistance(node) {
        let distX = node.x - this.finish.x;
        let distY = node.y - this.finish.y;
        console.log(node);
        var distance = Math.sqrt(distX*distX + distY*distY);
        console.log('Euclidean Distance', distance);
        return distance;
    }

    //Heuristic for GScore
    getManhattanDistance(node) {
        let distX = Math.abs(node.x - this.finish.x);
        let distY = Math.abs(node.y - this.finish.y);
        var distance = distX + distY - 1;
        console.log('Manhattan Distance', distance);
        return distance;
    }

    removeFromList(arr, elem) {
        for (let i = arr.length; i >= 0; i--) {
            if(arr[i] == elem) {
                arr.splice(i, 1);
            }
        }
    }
};

class AStar extends Pathfindinding{

    constructor() {
        super();
        this.openList = [];
        this.closedList = [];
        this.intervall = null;
    }

    sortOpenlist() {
        this.currentNode = this.openList[0]
        for (let i = 0; i < this.openList.length; i++) {
            if(this.openList[i].getFScore() < this.currentNode.getFScore() || this.openList[i].getFScore() == this.currentNode.getFScore() && this.openList.hScore < this.currentNode.hScore) {
                this.currentNode = this.openList[i];
            }
        }
    }

    //A* Pathfinding Algorithm
    findPath() {        
        this.start = grid[Graphics.StartPos.x][Graphics.StartPos.y];
        this.finish = grid[Graphics.FinishPos.x][Graphics.FinishPos.y];
        Graphics.initNodes();

        this.openList.push(this.start);

        this.intervall = setInterval(() => {
            this.nextStep();
        }, 500);
    }

    //Iteration 
    nextStep() {
        if(this.openList.length > 0) {
            this.sortOpenlist();

            astar.removeFromList(this.openList, this.currentNode);
            Graphics.drawOpenList();
            this.closedList.push(this.currentNode);
            Graphics.drawClosedList();

            if(this.currentNode == this.finish){
                Graphics.drawPath();
                console.log('Finish');
                this.found = true;
                clearInterval(this.intervall);
                return;
            }

            var neighbours = this.currentNode.getNeighbours();
            this.checkNeighbours(neighbours);
        }
        else{
            console.log('No Solution!');
            clearInterval(this.intervall);
            return;
        }

    }

    checkNeighbours(neighbours) {
        for(let i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            if(neighbour.getTileType() == 'Border' || this.closedList.includes(neighbour)) {
                continue;
            }
            else {
               var nextMoveCoast  = this.currentNode.gScore + this.getEuclideanDistance(neighbour);
                if(nextMoveCoast < neighbour.gScore || !this.openList.includes(neighbour)) {
                    neighbour.gScore = nextMoveCoast;
                    neighbour.hScore = this.getEuclideanDistance(neighbour);
                    neighbour.parent = this.currentNode;

                    if(!this.openList.includes(neighbour)){
                        this.openList.push(neighbour);
                        Graphics.drawOpenList();
                    }
                }
            }
        }
    }
};


//Visulize the Grid
const Graphics = {

    fieldSize: 10,

    focusField: {x:0, y:0},

    clicked: 'None',

    StartPos: {x: 3, y: 5},

    FinishPos: {x: 8, y: 5},

    //Calculate the Size of Tile
    calcFieldSize: function() {
        if(canvas.width > canvas.height) {
            Graphics.fieldSize = canvas.height / gridSize;
        } else {
            Graphics.fieldSize = canvas.width / gridSize;
        }
    },

    isStartOrFinish: function(node) {
        console.log(node);
        if(grid[node.x][node.y].getTileType() == 'Start' || grid[node.x][node.y].getTileType() == 'Finish') {
            return true;
        }
        else {
            return false;
        }  
    },

    setLength: function(parr) {
        var length = document.getElementById("length");
        length.innerHTML = "<h2>Length:"+ parr.length + "</h2>"; 
    },

    setTime: function(ptime) {
        var time = document.getElementById("time");
    },

    //unsicher ob man die neighbours direkt initalisieren kann
    initNodes: function() {
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                if(grid[x][y].getTileType() != 'Default'){
                    continue;
                }
                else{
                    grid[x][y] = new Node(x, y);
                }
            }
        }
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                if(grid[x][y].getTileType() == 'Node')
                 grid[x][y].getNeighbours()
            }
        }
    },

    //Initilize he grid on the canvas
    initGrid: function() {
        for (let x = 0; x < gridSize; x++) {
            var row = [];
            for (let y = 0; y < gridSize; y++) {
                row.push(new Tile(x,y));
            }
            grid.push(row);            
        }
    },

    drawWhite: function(px, py) {
        context.fillStyle = 'white';
        context.fillRect(px*Graphics.fieldSize, py*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2)
    },

    drawFocusField: function(px, py) {
        if (px == Graphics.focusField.x && py == Graphics.focusField.y) {
            context.strokeStyle = 'red';
        }
        else{
            context.strokeStyle = 'rgb(56, 56, 56)';
        }
        context.strokeRect(px*Graphics.fieldSize, py*Graphics.fieldSize, Graphics.fieldSize-1, Graphics.fieldSize-1);
        
    },

    drawBorder: function(px, py) {
        if (px == Graphics.focusField.x && py == Graphics.focusField.y) {
            context.fillStyle = 'rgb(131,139,139)';
            context.fillRect(px*Graphics.fieldSize, py*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
        }
    },

    drawStart: function(px, py) {
        context.fillStyle = 'rgb(67,110,238';
        context.fillRect(px*Graphics.fieldSize, py*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
        context.fillStyle = 'black';
        context.font = Graphics.fieldSize*0.8 + 'px monospace';
        context.fillText("S", px*Graphics.fieldSize+ Graphics.fieldSize*0.3, py*Graphics.fieldSize+ Graphics.fieldSize*0.7);
    },

    drawFinish: function(px, py) {
        context.fillStyle = 'rgb(67,110,238';
        context.fillRect(px*Graphics.fieldSize, py*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
        context.fillStyle = 'black';
        context.font = Graphics.fieldSize*0.8 + 'px monospace';
        context.fillText("F", px*Graphics.fieldSize+ Graphics.fieldSize*0.3, py*Graphics.fieldSize+ Graphics.fieldSize*0.7);
    },

    drawOpenList: function() {
        var openList = astar.openList;
        for(let i = 0; i < openList.length; i++) {
            var node = openList[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(0,255,127)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.5 + 'px monospace';
                context.fillText(Math.ceil(node.getFScore()), node.x*Graphics.fieldSize+ Graphics.fieldSize*0.3, node.y*Graphics.fieldSize+ Graphics.fieldSize*0.7);
            } 
        }
    },

    drawClosedList: function() {
        var closedList = astar.closedList;
        for(let i = 0; i < closedList.length; i++) {
            var node = closedList[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(255,99,71)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.5 + 'px monospace';
                context.fillText(Math.ceil(node.getFScore()), node.x*Graphics.fieldSize+ Graphics.fieldSize*0.3, node.y*Graphics.fieldSize+ Graphics.fieldSize*0.7);
            } 
        }
    },

    drawPath: function() {
        var path = astar.getPath();
        for(let i = 0; i < path.length; i++) {
            var node = path[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(152,245,255)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.5 + 'px monospace';
                context.fillText(Math.ceil(node.getFScore()), node.x*Graphics.fieldSize+ Graphics.fieldSize*0.3, node.y*Graphics.fieldSize+ Graphics.fieldSize*0.7);
            } 
        }
    },

    drawGrid: function() {
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                Graphics.drawFocusField(x, y);
                switch (grid[x][y].getTileType()){
                    case 'Border':
                        Graphics.drawBorder(x, y);
                        break;
                    case 'Start':
                        Graphics.drawStart(x, y);
                        break;
                    case 'Finish':
                        Graphics.drawFinish(x, y);
                        break;
                    case 'Node':
                        Graphics.drawNode(x, y);
                        break;
                }
            }
        }
    },

    initCanvas: function() {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        gridSize = 12;
        Graphics.initGrid();
        astar = new AStar();
        astar.setStart(Graphics.StartPos.x, Graphics.StartPos.y);
        astar.setFinish(Graphics.FinishPos.x, Graphics.FinishPos.y);
        Graphics.resizeCanvas();
    },

    renderCanvas: function(){
        Graphics.calcFieldSize();
        Graphics.drawGrid();
    },

    calcField: function(px,py) {
        return {
            x: Math.round(px / Graphics.fieldSize),
            y: Math.round(py / Graphics.fieldSize)
        }
    },

    resizeCanvas: function() {
        if(window.innerWidth <= 750) {
            canvas.height = "300";
            canvas.width = "300";
        }
        else {
            canvas.height = "500";
            canvas.width = "500";
        }
        Graphics.renderCanvas();
    },

    onMouseMove: function(event) {
        canvasRect = canvas.getBoundingClientRect()
        px = event.clientX - canvasRect.left;
        py = event.clientY - canvasRect.top
        Graphics.focusField = Graphics.calcField(px,py);
        Graphics.renderCanvas();
    },

    onMouseClick: function(event) {
    var posX = Graphics.focusField.x;
    var posY = Graphics.focusField.y;
    switch (grid[posX][posY].getTileType()) {
        case 'Default':
            astar.setBorder(posX, posY);
            break;
        case 'Border':
            grid[posX][posY] = new Tile(posX, posY);
            Graphics.drawWhite(posX, posY);
            break;
    }
    Graphics.renderCanvas();
    },

    onMouseDown: function() {
        var posX = Graphics.focusField.x;
        var posY = Graphics.focusField.y;
        switch (grid[posX][posY].getTileType()) {
            case 'Start':
                Graphics.clicked = 'Start';
                break;
            case 'Finish':
                Graphics.clicked = 'Finish';
                break;
        }
        Graphics.renderCanvas();
    },

    onMouseUp: function() {
        var posX = 0;
        var posY = 0;
        switch (Graphics.clicked) {
            case 'Start':
                posX = Graphics.StartPos.x;
                posY = Graphics.StartPos.y;
                grid[posX][posY] = new Tile(posX, posY);
                Graphics.drawWhite(posX, posY);
                posX = Graphics.focusField.x;
                posY = Graphics.focusField.y
                astar.setStart(posX, posY);
                Graphics.StartPos = {x: posX, y: posY};
                Graphics.clicked = 'None';
                break;
            case 'Finish':
                posX = Graphics.FinishPos.x;
                posY = Graphics.FinishPos.y;
                grid[posX][posY] = new Tile(posX, posY);
                Graphics.drawWhite(posX, posY);
                posX = Graphics.focusField.x;
                posY = Graphics.focusField.y
                astar.setFinish(posX, posY);
                Graphics.FinishPos = {x: posX, y: posY};
                Graphics.clicked = 'None';
            default:
                break;
        }
        Graphics.renderCanvas();
    },

    onStart: function() {
        if(!astar.found && astar.modus == 'None') {
            astar.findPath();
        }
        if(!astar.found && astar.modus == 'Stop') {
            astar.intervall = setInterval(() => {
                astar.nextStep();
            }, 500);
        }
    },

    onStop: function() {
        if(!astar.found){
            clearInterval(astar.intervall);
        }
    },

    onReload: function() {
        if(astar.found){
            for(let x = 0; x < gridSize; x++) {
                for(let y = 0; y < gridSize; y++) {
                    if(grid[x][y].getTileType() == 'Start' || grid[x][y].getTileType() == 'Finish') {
                        continue;
                    }
                    else {
                        grid[x][y] = new Tile(x, y);
                        Graphics.drawWhite(x, y);
                    }
                }
            }
            astar.found = false;
            Graphics.initCanvas();
        }
    }

    
};

//Eventlistener
window.addEventListener('load', () => {
    Graphics.initCanvas();

    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
    var reload = document.getElementById("reload");

    window.addEventListener('resize', Graphics.resizeCanvas)
    //document.addEventListener('keydown', Graphics.onKeyDown);

    canvas.addEventListener('mousemove', Graphics.onMouseMove);
    canvas.addEventListener('click', Graphics.onMouseClick);
    canvas.addEventListener('mousedown', Graphics.onMouseDown)
    canvas.addEventListener('mouseup', Graphics.onMouseUp);

    start.addEventListener('click', Graphics.onStart);
    stop.addEventListener('click', Graphics.onStop);
    reload.addEventListener('click', Graphics.onReload);
});