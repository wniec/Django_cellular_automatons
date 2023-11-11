class Cell{
    constructor(value){
        this.value = value;
    }
    color(maxLevel){
        const proportion = parseFloat(this.value)/maxLevel
        const r = Math.floor(proportion*255)
        return `rgba(${r},0,0,1.0)`
    }
}
class Board{
    constructor(width, height, rules){
        this.width = width;
        this.height = height;
        this.h_unit = 700/this.height;
        this.w_unit = 1500/this.width;
        this.matrix = [];
        this.stop = true
        this.eventListener = null;
        this.rules = rules
        for(let i =0; i<this.height; i++){
            this.matrix.push([new Cell(0)]);
            for(let j =0; j<this.width; j++){
                this.matrix[i][j] = new Cell(0);
            }
        }
    }
    stop(){
        this.stop = true
    }
    nextStage(){
        for(let i = 0 ; i < this.height ; i++){
            for(let j = 0 ; j < this.width ; j++){
                const cell = this.matrix[i][j]
                this.rules.nextStage(cell,[j,i],this)
            }
        }
    }
    draw() {
        const c = document.getElementById("myCanvas");
        const ctx = c.getContext("2d");
        if(this.eventListener!=null){
            c.removeEventListener("click",this.eventListener);
        }
        for(let i = 0 ; i < this.height ; i++){
            for(let j = 0 ; j < this.width ; j++){
                const paint = this.matrix[i][j].color(this.rules.maxVal);
                ctx.beginPath();
                ctx.rect(j*this.w_unit,i*this.h_unit,(j+1)*this.w_unit,(i+1)*this.h_unit);
                ctx.fillStyle = paint;
                ctx.fill();
                ctx.closePath();
            }
        }
        this.eventListener = clickedOnBoard(this)
        c.addEventListener('click', this.eventListener , false);
    }
    run() {
        this.stop=false
        try{
            setInterval(update, 600);
        }catch(e){
        }
    }

}
class Rules{
        constructor(born,survive, grow, maxVal){
        this.born = born;
        this.survive = survive;
        this.grow = grow;
        this.maxVal = maxVal;
    }
    change(lifeSum, value){
        if(value === 0 && this.born.has(lifeSum)){
            return 1
        }else if(value!==0 && !this.survive.has(lifeSum)){
            return value-1
        }
        else if(value!==0 && !this.grow.has(lifeSum)){
            return value+1
        }
        return value
    }
    nextStage(cell,position,board){
        const vectors = [[0,0],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
        let lifeSum = 0;
        for(let i =0 ; i< vectors.length; i++){
            const x = (vectors[i][0] + position[0] + board.width)%board.width;
            const y = (vectors[i][1] + position[1] + board.height)%board.height;
            lifeSum += board.matrix[y][x].value
        }
        cell.value=Math.max(0,Math.min(this.change(lifeSum,cell.value),this.maxVal))
    }

}
function clickedOnBoard(board){

    function clicked(e){
        if(e.offsetX < 0 || e.offsetX > 1500 || e.offsetY < 0 || e.offsetY > 700){
            return
        }
        let x = Math.floor(e.offsetX / board.w_unit);
        let y = Math.floor(e.offsetY / board.h_unit);
        board.matrix[y][x].value=Math.min(board.matrix[y][x].value+1,board.rules.maxVal);
        console.log(board.matrix[y][x].value)
        board.draw()
    }
    return clicked
}

function update(){
    if(board.stop){
        throw("automaton stopped")
    }
    board.nextStage()
    board.draw()
}
const board = new Board(75,35,null)