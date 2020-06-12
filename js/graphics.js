
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
        if(grid[node.x][node.y].getTileType() == 'Start' || grid[node.x][node.y].getTileType() == 'Finish') {
            return true;
        }
        else {
            return false;
        }  
    },

    setLength: function(parr) {
        var length = document.getElementById("length");
        length.innerHTML = "<h3>Length:"+ parr.length + "</h3>"; 
    },

    setTime: function(ptime) {
        var time = document.getElementById("time");
        ptime = ptime - (500*algorithm.iterations);
        time.innerHTML = "<h3>Time:" + ptime + "ms</h3>"
    },

    setIterations: function(count) {
        var iterations = document.getElementById("iterations");
        iterations.innerHTML = "<h3>Iterations:" + count +"</h3>";
    },

    getAlgorithm: function() {
        var dropbox = document.getElementById("algorithm");
        var algo = dropbox.options[dropbox.selectedIndex].value;
        switch (algo) {
            case 'A*':
                let astar = new AStar();
                astar.iterations = 1
                astar.setStart(Graphics.StartPos.x, Graphics.StartPos.y);
                astar.setFinish(Graphics.FinishPos.x, Graphics.FinishPos.y);
                algorithm = astar;
                break;
            case 'IDA*':
                let idastar = new IDAStar();
                idastar.iterations = 1
                idastar.setStart(Graphics.StartPos.x, Graphics.StartPos.y);
                idastar.setFinish(Graphics.FinishPos.x, Graphics.FinishPos.y);
                algorithm = idastar;
                break;
            case 'Dijkstra':
                let dijkstra = new Dijkstra();
                dijkstra.iterations = 1
                dijkstra.setStart(Graphics.StartPos.x, Graphics.StartPos.y);
                dijkstra.setFinish(Graphics.FinishPos.x, Graphics.FinishPos.y);
                algorithm = dijkstra;
                break; 
        }
    },

    getHeuristic: function(node, endpoint) {
        var dropbox = document.getElementById("heuristic");
        var heuristic = dropbox.options[dropbox.selectedIndex].value;
        var cost = 0;
        switch (heuristic) {
            case 'Manhattan-Distance':
                cost = algorithm.getManhattanDistance(node, endpoint);
                break;
            case 'Euclidian-Distance':
                cost = algorithm.getEuclideanDistance(node, endpoint);
                break;
        }
        return cost;
    },

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
        var openList = algorithm.openList;
        for(let i = 0; i < openList.length; i++) {
            var node = openList[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(0,255,127)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.4 + 'px monospace';
                context.fillText(Math.ceil(node.getFScore()), node.x*Graphics.fieldSize+ Graphics.fieldSize*0.3, node.y*Graphics.fieldSize+ Graphics.fieldSize*0.7);
            } 
        }
    },

    drawClosedList: function() {
        var closedList = algorithm.closedList;
        for(let i = 0; i < closedList.length; i++) {
            var node = closedList[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(255,99,71)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.4 + 'px monospace';
                context.fillText(Math.ceil(node.getFScore()), node.x*Graphics.fieldSize+ Graphics.fieldSize*0.3, node.y*Graphics.fieldSize+ Graphics.fieldSize*0.7);
            } 
        }
    },

    drawVisitedNodes: function() {
        var nodeList = algorithm.visitedNodes;
        for(let i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(224, 102, 255)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.4 + 'px monospace';
                context.fillText(Math.ceil(node.getFScore()), node.x*Graphics.fieldSize+ Graphics.fieldSize*0.3, node.y*Graphics.fieldSize+ Graphics.fieldSize*0.7);
            } 
        }
    },

    drawPath: function() {
        var path = algorithm.path;
        for(let i = 0; i < path.length; i++) {
            var node = path[i];
            if(Graphics.isStartOrFinish(node)) {
                continue;
            }
            else {
                context.fillStyle = 'rgb(152,245,255)';
                context.fillRect(node.x*Graphics.fieldSize, node.y*Graphics.fieldSize, Graphics.fieldSize-2, Graphics.fieldSize-2);
                context.fillStyle = 'black';
                context.font = Graphics.fieldSize*0.4 + 'px monospace';
                console.log('GScore:', node.gScore + ' HScore:', node.hScore);
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
        Graphics.getAlgorithm();
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
                algorithm.setBorder(posX, posY);
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
                if(grid[Graphics.focusField.x][Graphics.focusField.y].getTileType() != 'Finish') {
                    grid[posX][posY] = new Tile(posX, posY);
                    Graphics.drawWhite(posX, posY);
                    posX = Graphics.focusField.x;
                    posY = Graphics.focusField.y;
                    algorithm.setStart(posX, posY);
                    Graphics.StartPos = {x: posX, y: posY};
                    Graphics.clicked = 'None';
                }
                break;
            case 'Finish':
                posX = Graphics.FinishPos.x;
                posY = Graphics.FinishPos.y;
                if(grid[Graphics.focusField.x][Graphics.focusField.y] .getTileType() != 'Start') {
                    grid[posX][posY] = new Tile(posX, posY);
                    Graphics.drawWhite(posX, posY);
                    posX = Graphics.focusField.x;
                    posY = Graphics.focusField.y;
                    algorithm.setFinish(posX, posY);
                    Graphics.FinishPos = {x: posX, y: posY};
                    Graphics.clicked = 'None';
                }
                break;
        }
        Graphics.renderCanvas();
    },

    onStart: function() {
        Graphics.getAlgorithm();
        if(!algorithm.found && algorithm.modus == 'None') {
            algorithm.findPath();
        }
        if(!algorithm.found && algorithm.modus == 'Stop') {
            algorithm.intervall = setInterval(() => {
                algorithm.nextStep();
            }, 500);
        }
    },

    onStop: function(algo) {
        if(!algorithm.found){
            clearInterval(algorithm.intervall);
        }
    },

    onReload: function() {
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
    algorithm.found = false;
    Graphics.initCanvas();
    },
};