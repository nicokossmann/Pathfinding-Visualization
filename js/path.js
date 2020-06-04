class Pathfindinding {

    constructor() {
        this.path = [];
        this.start = null;
        this.finish = null;
        this.currentNode = null;
        this.intervall = null;
        this.found = false;
        this.modus = 'None';
        this.startTime = 0
        this.iterations = 0;
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
    getManhattanDistance(node) {
        let distX = Math.abs(node.x - this.finish.x);
        let distY = Math.abs(node.y - this.finish.y);
        var distance = distX + distY;
        return distance;
    }

    //Heuristic for GScore
    getEuclideanDistance(node) {
        let distX = Math.abs(node.x - this.finish.x);
        let distY = Math.abs(node.y - this.finish.y);
        var distance = Math.sqrt(distX*distX + distY*distY);
        return distance;
    }

    getTime(){
        return new Date() - this.startTime;
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

        this.startTime = new Date();

        this.openList.push(this.start);

        this.intervall = setInterval(() => {
            this.nextStep();
        }, 500);
    }

    //Iteration 
    nextStep() {
        if(this.openList.length > 0) {
            this.sortOpenlist();

            this.removeFromList(this.openList, this.currentNode);
            Graphics.drawOpenList();
            this.closedList.push(this.currentNode);
            Graphics.drawClosedList();

            if(this.currentNode == this.finish){
                var time = this.getTime();
                Graphics.drawPath();
                Graphics.setIterations(this.iterations);
                Graphics.setTime(time);
                this.found = true;
                console.log('Finish');
                clearInterval(this.intervall);
                return;
            }

            var neighbours = this.currentNode.getNeighbours();
            this.checkNeighbours(neighbours);
            this.iterations += 1;
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
               var nextMoveCoast  = this.currentNode.gScore + Graphics.getHeuristic(neighbour);
                if(nextMoveCoast < neighbour.gScore || !this.openList.includes(neighbour)) {
                    neighbour.gScore = nextMoveCoast;
                    neighbour.hScore = Graphics.getHeuristic(neighbour);
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

class IDAStar extends Pathfindinding {

    constructor() {
        super();
    }

    findPath() {

    }
};

class Dijkstra extends Pathfindinding {

    constructor() {
        super();
        this.unvisitedNodes = [];
        this.visitedNodes = [];
    }

    getAllNodes() {
        var nodes = [];
        for(let x = 0; x < gridSize; x++) {
            for(let y = 0; y < gridSize; y++) {
                grid[x][y].gScore = Infinity;
                nodes.push(grid[x][y]);
            }
        }
        return nodes;
    }

    sortNodeList() {
        this.unvisitedNodes.sort( (nodeA, nodeB) => {
            return nodeA.gScore - nodeB.gScore;
        })
    }

    getUnvisitedNeighbours(node) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if(x == 0 && y == 0) {
                    continue;
                }

                var checkX = node.x + x;
                var checkY = node.y + y;

                if(checkX >= 0 && checkX < gridSize && checkY >= 0 && checkY < gridSize && !grid[checkX][checkY].isVisited) {
                    node.neighbours.push(grid[checkX][checkY]);
                } 
            }
        }
        return node.neighbours;
    }

    findPath() {
        this.start = grid[Graphics.StartPos.x][Graphics.StartPos.y];
        this.finish = grid[Graphics.FinishPos.x][Graphics.FinishPos.y];
        Graphics.initNodes();
        this.unvisitedNodes = this.getAllNodes();

        this.startTime = new Date();

        this.start.gScore = null;
        
        this.intervall = setInterval(() => {
            this.nextStep();
        }, 500);
    }

    nextStep() {
        if(this.unvisitedNodes.length > 0) {
            this.sortNodeList();
            this.currentNode = this.unvisitedNodes.shift();

            if (this.currentNode.gScore === Infinity) {
                return this.visitedNodes;
            }
            this.currentNode.isVisited = true;
            this.visitedNodes.push(this.currentNode);
            Graphics.drawNodeList();

            if(this.currentNode == this.finish){
                var time = this.getTime();
                Graphics.drawPath();
                Graphics.setIterations(this.iterations);
                Graphics.setTime(time);
                this.found = true;
                console.log('Finish');
                clearInterval(this.intervall);
                return;
            }

            var neighbours = this.getUnvisitedNeighbours(this.currentNode);
            this.checkNeighbours(neighbours, this.currentNode);
            this.iterations += 1;
        }
        else{
            console.log('No Solution!');
            clearInterval(this.intervall);
            return;
        }
    }

    checkNeighbours(neighbours, node) {
        for(let i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            if(neighbour.getTileType() == 'Border') {
                continue;
            }
            else {
                var nextMoveCoast = node.gScore + 1;
                if(nextMoveCoast < neighbour.gScore){
                    neighbour.gScore = nextMoveCoast;
                    neighbour.parent = node;
                }
            }
        }
    }
};