
function fit(board) { //calculate the total inversions in a given board, low good high bad 
    var count = 0;
    var flag = false;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if(board[i][j] == "") continue;
            for (var k = i; k < board.length; k++) {
                for (var l = 0; l < board.length; l++) {
                    if(k == i && !flag){
                        l = j+1;
                        flag =true;
                    }
                    if (board[k][l] != "" && board[i][j] > board[k][l]) {
                        count++;
                    }
                }
            }
            flag = false;
        }
    }
    return count;
}

function path(moves, fitness,indexOfBlank){ //define path class, members of the population
    this.moves = moves;
    this.fitness = fitness; // low good, high bad
    this.indexOfBlank = indexOfBlank;
    this.solution = null;
    this.setFitness = function(board){
        var penalty = 0; // if path contains invalid move well increase it's fitness
        for(var i =0; i < this.moves.length; i++){
            if(this.moves[i] == "UP" && this.indexOfBlank[0] != 0){
                board[this.indexOfBlank[0]][this.indexOfBlank[1]] = board[this.indexOfBlank[0] - 1][this.indexOfBlank[1]];
                board[this.indexOfBlank[0] - 1][this.indexOfBlank[1]] = "";
                this.indexOfBlank[0]--;
            }
            else if (this.moves[i] == "DOWN" && this.indexOfBlank[0] != 3) {
                board[this.indexOfBlank[0]][this.indexOfBlank[1]] = board[this.indexOfBlank[0] + 1][this.indexOfBlank[1]];
                board[this.indexOfBlank[0] + 1][this.indexOfBlank[1]] = "";
                this.indexOfBlank[0]++;
            }
            else if (this.moves[i] == "RIGHT" && this.indexOfBlank[1] != 3) {
                board[this.indexOfBlank[0]][this.indexOfBlank[1]] = board[this.indexOfBlank[0]][this.indexOfBlank[1] + 1];
                board[this.indexOfBlank[0]][this.indexOfBlank[1] + 1] = "";
                this.indexOfBlank[1]++;
            }
            else if (this.moves[i] == "LEFT" && this.indexOfBlank[1] != 0) {
                board[this.indexOfBlank[0]][this.indexOfBlank[1]] = board[this.indexOfBlank[0]][this.indexOfBlank[1] - 1];
                board[this.indexOfBlank[0]][this.indexOfBlank[1] - 1] = "";
                this.indexOfBlank[1]--;
            }else{
                penalty++;
            }
        }
        this.fitness =  fit(JSON.parse(JSON.stringify(board))) + penalty+ (16 - ((this.indexOfBlank[0] +1) * (this.indexOfBlank[1] +1)));
        this.solution = board; // end product of board
    }    
}

function generateMoves(x,y,num){ //create list of moves
    mov = []
    indexX = x;
    indexY = y;
    for(var i = 0; i < num; i++){
        var list = getMoves(indexX,indexY);
        var item = list[Math.floor(Math.random()*list.length)];
        mov.push(item);
        //update x,y
        if(item == "UP"){ 
            indexX--;
        }
        if(item == "DOWN"){
            indexX++;
        }
        if(item == "LEFT"){
            indexY--;
        }
        if(item == "RIGHT"){
            indexY++;
        }
    }
    return mov;
}



function getMoves(i, j) { //generates valid moves based of blank tiles position 
    moves = ["UP", "DOWN", "LEFT", "RIGHT"];
    if (i == 0) {
        var index = moves.indexOf("UP")
        moves.splice(index, 1);
    }
    else if (i == 3) {
        var index = moves.indexOf("DOWN")
        moves.splice(index, 1);
    }
    if (j == 0) {
        var index = moves.indexOf("LEFT")
        moves.splice(index, 1);
    }
    else if (j == 3) {
        var index = moves.indexOf("RIGHT")
        moves.splice(index, 1);
    }
    return moves;
}
    
    
var game = { // game object that runs the things
    generation : 0,
    moveLength : 80,
    populationSize: 10,
    board: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, ""]],
    iBlank: [3,3], // index of blank tile
    paths: [],
    best: null,
    bestgen: 0,
    generatePopulation : function(){ // generates population
        for(var i = 0; i < this.populationSize; i++){
            var p = new path([],0,JSON.parse(JSON.stringify(this.iBlank)));
            p.moves = generateMoves(this.iBlank[0],this.iBlank[1],this.moveLength);
            p.setFitness(JSON.parse(JSON.stringify(this.board)));
            this.paths.push(p);           
        }
    },
    shuffleBoard : function(){ //shuffles the board to a random configuration
        var m = generateMoves(this.iBlank[0],this.iBlank[1], 1000);
        for(var i =0; i < m.length; i++){
            if(m[i] == "UP"){
                this.board[this.iBlank[0]][this.iBlank[1]] = this.board[this.iBlank[0] - 1][this.iBlank[1]];
                this.board[this.iBlank[0] - 1][this.iBlank[1]] = "";
                this.iBlank[0]--;
            }
            else if (m[i] == "DOWN") {
                this.board[this.iBlank[0]][this.iBlank[1]] = this.board[this.iBlank[0] + 1][this.iBlank[1]];
                this.board[this.iBlank[0] + 1][this.iBlank[1]] = "";
                this.iBlank[0]++;
            }
            else if (m[i] == "RIGHT") {
                this.board[this.iBlank[0]][this.iBlank[1]] = this.board[this.iBlank[0]][this.iBlank[1] + 1];
                this.board[this.iBlank[0]][this.iBlank[1] + 1] = "";
                this.iBlank[1]++;
            }
            else if (m[i] == "LEFT") {
                this.board[this.iBlank[0]][this.iBlank[1]] = this.board[this.iBlank[0]][this.iBlank[1] - 1];
                this.board[this.iBlank[0]][this.iBlank[1] - 1] = "";
                this.iBlank[1]--;
            }
        }
        drawTable(JSON.parse(JSON.stringify(this.board)),"puzzle-table"); // draws the table to the page
    },
    singleCross: function(){
        var minp = null;
        var minp2 = null;
        var newmoves = [];
        var newmoves2 = []
        var index = Math.floor(Math.random()*this.moveLength);
        var swap = Math.floor(Math.random()*this.moveLength);
        var swap2 = Math.floor(Math.random()*this.moveLength);
        
        //get top two paths
        for(var i = 0; i < this.paths.length; i++){
            if(minp == null || this.paths[i].fitness < minp.fitness){
                minp = this.paths[i];
            }
        }
        for(var i = 0; i < this.paths.length; i++){
            if((minp2 == null || this.paths[i].fitness < minp2.fitness)&& this.paths[i] != minp){
                minp2 = this.paths[i];
            }
        }
        //apply single crossover
        for(var j = 0; j < this.moveLength;j++){
            if(j < index){
                newmoves.push(minp.moves[j]);
                newmoves2.push(minp2.moves[j]);
            }else{
                newmoves.push(minp2.moves[j]);
                newmoves2.push(minp.moves[j]);
            }
        }
        //swap random indexes;
        var temp = newmoves[swap];
        newmoves[swap] = newmoves[swap2];
        newmoves[swap2] = temp;
        temp = newmoves2[swap];
        newmoves2[swap] = newmoves2[swap2];
        newmoves2[swap2] = temp;
                  
        var p = new path([],0,this.iBlank.slice());
        var p2 = new path([],0,this.iBlank.slice());
        p.moves = newmoves;
        p2.moves = newmoves2;
        p.setFitness(JSON.parse(JSON.stringify(this.board)));
        p2.setFitness(JSON.parse(JSON.stringify(this.board)));
        this.removeLargest();
        this.removeLargest();
        this.paths.push(p);
        this.paths.push(p2);
    },
    doubleCross : function(){
        var minp = null;
        var minp2 = null;
        var newmoves = [];
        var newmoves2 = []
        var index = Math.floor(Math.random()*this.moveLength);
        var index2 = Math.floor(Math.random()*this.moveLength);
        var swap = Math.floor(Math.random()*this.moveLength);
        var swap2 = Math.floor(Math.random()*this.moveLength);
        
        //get top two paths
        for(var i = 0; i < this.paths.length; i++){
            if(minp == null || this.paths[i].fitness < minp.fitness){
                minp = this.paths[i];
            }
        }
        for(var i = 0; i < this.paths.length; i++){
            if((minp2 == null || this.paths[i].fitness < minp2.fitness)&& this.paths[i] != minp){
                minp2 = this.paths[i];
            }
        }
        //apply double crossover
        for(var j = 0; j < this.moveLength;j++){
            if(j < Math.min(index,index2) || j> Math.max(index,index2)){
                newmoves.push(minp.moves[j]);
                newmoves2.push(minp2.moves[j]);
            }else{
                newmoves.push(minp2.moves[j]);
                newmoves2.push(minp.moves[j]);
            }
        }
        //apply random swap 
        var temp = newmoves[swap];
        newmoves[swap] = newmoves[swap2];
        newmoves[swap2] = temp;
        temp = newmoves2[swap];
        newmoves2[swap] = newmoves2[swap2];
        newmoves2[swap2] = temp;
                  
        var p = new path([],0,this.iBlank.slice());
        var p2 = new path([],0,this.iBlank.slice());
        p.moves = newmoves;
        p2.moves = newmoves2;
        p.setFitness(JSON.parse(JSON.stringify(this.board)));
        p2.setFitness(JSON.parse(JSON.stringify(this.board)));
        this.removeLargest();
        this.removeLargest();
        this.paths.push(p);
        this.paths.push(p2);
        
    },
    wisdomOfCrowds : function(){
        var moveMap = [0,0,0,0]; //UP,DOWN,LEFT,RIGHT
        var mins = [];
        var newMove = [];
        var minp = null;
        
        //create list of mins
        for(var i = 0; i < 10; i++){
            for(var j = 0; j < this.paths.length; j++){
                if((minp == null || this.paths[j].fitness < minp.fitness) && $.inArray(this.paths[j], mins) == -1){
                    minp = this.paths[j];
                }
            }
            mins.push(minp);
            minp = null;
        }
        //create new move list
        for(var i = 0; i < this.moveLength; i++){
            for(var j = 0; j < 10; j++){
                if(mins[j].moves[i] == "UP"){
                    moveMap[0]++;
                }else if(mins[j].moves[i] == "DOWN"){
                    moveMap[1]++;
                }else if(mins[j].moves[i] == "LEFT"){
                    moveMap[2]++;
                }else if(mins[j].moves[i] == "RIGHT"){
                    moveMap[3]++;
                }
            }
            var maxX = Math.max.apply(Math,moveMap);
            var index = moveMap.indexOf(maxX);
            if(index == 0){
                newMove.push("UP");
            }else if(index == 1){
                newMove.push("DOWN");
            }else if(index == 2){
                newMove.push("LEFT");
            }else if(index == 3){
                newMove.push("RIGHT");
            }
            moveMap = [0,0,0,0];
        }
        var p = new path([],0,this.iBlank.slice());
        p.moves = newMove;
        p.setFitness(JSON.parse(JSON.stringify(this.board)));
        this.removeLargest();
        this.paths.push(p);
    },
    removeLargest : function(){ //finds path with largest fitness and removes it
        var maxIndex =-1;
        for(var i = 0; i < this.paths.length; i++){
            if(maxIndex == -1 || this.paths[i].fitness > this.paths[maxIndex].fitness){
                maxIndex = i;
            }
        }
        this.paths.splice(maxIndex, 1);
    },
    createBoard : function(){ 
        drawTable(JSON.parse(JSON.stringify(this.board)),"puzzle-table");
    },
    getBestSolution : function(){
        var didImprove = false;
        for(var i = 0; i < this.paths.length; i++){
            if(this.best == null || this.paths[i].fitness < this.best.fitness || (this.paths[i].fitness <= this.best.fitness && this.paths[i].moves.length < this.best.moves.length)){
                this.best = this.paths[i]; 
                console.log(this.best);
                this.bestgen = this.generation;
                didImprove = true;
            }
        }
        drawTable(JSON.parse(JSON.stringify(this.best.solution)),"solution"); 
        return didImprove;
    },
    start : function(){
        this.best = null;
        this.generation = 0;
        this.bestgen = 0;
        this.moveLength = 100;
        this.paths = [];
        this.populationSize = document.getElementById("pop").value;
        var tbl = document.getElementById("solution");
        if(tbl) tbl.parentNode.removeChild(tbl);
        var count = 0;
        game.generatePopulation();
        while( game.moveLength >= 2){
            if(document.getElementById("sc").checked) game.singleCross();
            if(document.getElementById("dc").checked) game.doubleCross();
            game.wisdomOfCrowds();
            var imporved = game.getBestSolution();
            if(!imporved){
                count++;
            }
            if(count%1000 == 0){ // if we haven't seen improvement after 1000 interations, generate new population with shorter moves;
                game.generatePopulation();
                game.moveLength--;
                //this.generation++;
            }
        }
        document.getElementById("fit").value = fit(JSON.parse(JSON.stringify(this.best.solution)));
        document.getElementById("mov").value = this.best.moves.length;
    }
}

function drawTable(board,id){ // draws 15-puzzle to the sceen 
    var tbl = document.getElementById(id);
    if(tbl) tbl.parentNode.removeChild(tbl);
    var div = document.getElementById("puzzle");
    var table = document.createElement("table");
    table.id = id;
        for(var row = 0; row < 4; row++){
            var tr = document.createElement('tr');
            for(var col = 0; col < 4; col++){
                var td = document.createElement('td');
                td.appendChild(document.createTextNode( board[row][col]));
                tr.appendChild(td)
            }
            table.appendChild(tr);
            div.appendChild(table);    
    }
    
}
game.shuffleBoard();
$('#start').click(function(){
    game.start();
});
//console.log(fit(game.board));
            
//objects
    //game object
        //keeps track of current generation
        //max num of paths
        //size of population
        //best solution 
        //cross over function
            //how to handel invalid moves?
        //WoC
        //update ui
        

//generate initial board

//generate inital population
    //each memeber of the population has a path, and fitness score

//