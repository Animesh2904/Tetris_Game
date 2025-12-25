const board=document.getElementById("board");
for(let i=0;i<200;i++)
{
    const div=document.createElement("div");
    div.classList.add("cell");
    board.appendChild(div);
}
const next_shape=document.getElementById("next_shape");
for(let i=0;i<25;i++)
{
    const div=document.createElement("div");
    div.classList.add("next_cell");
    next_shape.appendChild(div);
}

let isStart=false;
let isPause=false;
let isOver=false;

function startGame(){
    isStart=true;
    isPause=false;
    isOver=false;

    cells.forEach(cell => {
        cell.classList.remove("taken", "active");
    });
    Object.keys(stats).forEach(index => stats[index]=0);

    level=1;
    lines=0;
    currentscore=0;
    dropSpeed=800;
    clearInterval(timer);
    timer=setInterval(drop,dropSpeed);

    updateMainButton();
    SpawnPiece();
    draw();
    updateScores();
}

function pauseResume(){
    if(!isStart || isOver)return;

    if(!isPause)
    {
        clearInterval(timer);
        isPause=true;
    }
    else
    {
        timer=setInterval(drop,dropSpeed);
        isPause=false;
    }
    updateMainButton();
}

function mainAction(){
    if(isOver || !isStart)
    {
        startGame();
    }
    else
    {
        pauseResume();
    }
}

function updateMainButton(){
    const btn=document.getElementById("start_btn");

    if(isOver)
    {
        btn.innerText="RESTART";
    }
    else if(!isStart)
    {
        btn.innerText="START";
    }
    else if(isPause)
    {
        btn.innerText="RESUME";
    }
    else
    {
        btn.innerText="PAUSE";
    }
}

let lines=0;
let level=1;
let currentscore=0;
let topscore=0;
let dropSpeed=800;
let timer=null;

const width=10;
const row=20;

let cells=Array.from(document.querySelectorAll(".cell"));
let nextcells=Array.from(document.querySelectorAll(".next_cell"));

let stats={
    T:0, L:0, Z:0, S:0, O:0, I:0
}

const linesScores=[0,10,30,50,80];

const shapes={
    T:[
        [0,1,2,width+1],
        [1,width,width+1,width*2+1],
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1]
    ],
    L:[
        [2,width,width+1,width+2],
        [1,width+1,width*2+1,width*2+2],
        [width,width+1,width+2,width*2],
        [0,1,width+1,width*2+1]
    ],
    Z:[
        [0,1,width+1,width+2],
        [1,width,width+1,width*2]
    ],
    S:[
        [1,2,width,width+1],
        [0,width,width+1,width*2+1]
    ],
    O:[
        [0,1,width,width+1]
    ],
    I:[
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1]
    ]
}

const nextShapes={
    T:[6,7,8,12],
    L:[8,11,12,13],
    Z:[6,7,12,13],
    S:[7,8,11,12],
    O:[6,7,11,12],
    I:[10,11,12,13]
}

const keys=Object.keys(shapes);

let currentShape;
let currentRotation=0;
let currentPosition=3;
let currentShapeKey;

let nextShapeKey;

function drawNextShape(){
    nextcells.forEach(index => index.classList.remove("active"));
    nextShapes[nextShapeKey].forEach(index => nextcells[index].classList.add("active"));
}

function updateStats(){
    stats[currentShapeKey]++;
    document.getElementById("t_score").innerText=String(stats.T).padStart(3,"0");
    document.getElementById("l_score").innerText=String(stats.L).padStart(3,"0");
    document.getElementById("z_score").innerText=String(stats.Z).padStart(3,"0");
    document.getElementById("s_score").innerText=String(stats.S).padStart(3,"0");
    document.getElementById("o_score").innerText=String(stats.O).padStart(3,"0");
    document.getElementById("i_score").innerText=String(stats.I).padStart(3,"0");
}

function SpawnPiece(){
    if(!nextShapeKey)
    {
        nextShapeKey=keys[Math.floor(Math.random()*keys.length)];
    }
    currentShapeKey=nextShapeKey;
    currentShape=shapes[currentShapeKey];
    currentRotation=0;
    currentPosition=3;
    nextShapeKey=keys[Math.floor(Math.random()*keys.length)];
    drawNextShape();
    updateStats();
    gameOver();
}

function draw(){
    currentShape[currentRotation].forEach(index => {
        cells[currentPosition+index].classList.add("active");
    });
}

function undraw(){
    currentShape[currentRotation].forEach(index =>{
        cells[currentPosition+index].classList.remove("active");
    });
}

function rotation() {
    if(!isStart || isPause || isOver)return;

    undraw();
    if(currentShape[currentRotation].some(index => (currentPosition+index)%width===0))
    {
        if((currentShapeKey==='T' && currentRotation===3) || (currentShapeKey==='I' && currentRotation===1)||
           (currentShapeKey==='L' && currentRotation===1))
        {
            currentPosition++;
        }
    }
    else if(currentShape[currentRotation].some(index => (currentPosition+index)%width===9))
    {
        if((currentShapeKey==='L' && currentRotation===3) || (currentShapeKey==='Z' && currentRotation===1) ||
           (currentShapeKey==='S' && currentRotation===1) || (currentShapeKey==='I' && currentRotation===1) ||
           (currentShapeKey==='T' && currentRotation===1))
        {
            if(currentShapeKey==='I')
            {
                currentPosition-=2;
            }
            else
            {
                currentPosition--;
            }
        }
    }
    else if(currentShape[currentRotation].some(index => (currentPosition+index)%width===8))
    {
        if(currentShapeKey==='I' && currentRotation===1)
        {
            currentPosition--;
        }
    }

    if(!canrotation())currentRotation=(currentRotation+1)%currentShape.length;
    draw();
}
function canrotation(){
    return currentShape[(currentRotation+1)%currentShape.length].some(
        index => cells[currentPosition+index]?.classList.contains("taken")
    );
}

function leftshift(){
    if(!isStart || isPause || isOver)return;

    undraw();
    if(!isAtLeft())currentPosition--;
    draw();
}
function isAtLeft(){
    if(currentShape[currentRotation].some(index => (currentPosition+index)%width===0))
    {
        return true;
    }
    else if(currentShape[currentRotation].some(index => cells[currentPosition+index-1]?.classList.contains("taken")))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

function rightshift(){
    if(!isStart || isPause || isOver)return;

    undraw();
    if(!isAtRight())currentPosition++;
    draw();
}
function isAtRight(){
    if(currentShape[currentRotation].some(index => (currentPosition+index)%width===width-1))
    {
        return true;
    }
    else if(currentShape[currentRotation].some(index => cells[currentPosition+index+1]?.classList.contains("taken")))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

function drop(){
    if(!isStart || isPause || isOver)return;

    undraw();
    if(!candrop())currentPosition=currentPosition+width;
    draw();
    freeze();
    updateScores();
}
function candrop(){
    return currentShape[currentRotation].some(index => cells[(currentPosition+index+width)]?.classList.contains("taken"));
}

function freeze(){
    if(
        (currentShape[currentRotation].some(
            index => cells[currentPosition+index+width]?.classList.contains("taken")
        )) || 
        ( currentShape[currentRotation].some(
            index => (currentPosition+index)>189
        ))
    ){
        currentShape[currentRotation].forEach(
            index => {cells[currentPosition+index].classList.add("taken");}
        )
        clearLine();
        SpawnPiece();
        draw();
    }
}

function clearLine(){
    let linesClears=0;
    for(let i=0;i<200;i+=width)
    {
        let fixcells=[];
        for(let j=0;j<width;j++)
        {
            fixcells.push(i+j);
        }
        if(fixcells.every(index => cells[index]?.classList.contains("taken")))
        {
            fixcells.forEach(index => cells[index].classList.remove("taken"));
            fixcells.forEach(index => cells[index].classList.remove("active"));
            const removedCells=cells.splice(i,width);
            cells=removedCells.concat(cells);
            cells.forEach(index => board.appendChild(index));
            linesClears++;
        }
    }
    if(linesClears>0)
    {
        lines+=linesClears;
        currentscore+=linesScores[linesClears];
        if(topscore<currentscore)
        {
            topscore=currentscore;
        }
    }
    if(lines>=level*10 && level<10)
    {
        level++;
        dropSpeed=Math.max(100,dropSpeed-70);
        clearInterval(timer);
        timer=setInterval(drop,dropSpeed);
    }
    updateScores();
}

function updateScores(){
    document.getElementById("level_count").innerText=String(level).padStart(2,"0");
    document.getElementById("current_score").innerText=String(currentscore).padStart(5,"0");
    document.getElementById("top_score").innerText=String(topscore).padStart(5,"0");
    document.getElementById("line_count").innerText=String(lines).padStart(5,"0");
}

function gameOver(){
    if(currentShape[currentRotation].some(index => cells[currentPosition+index]?.classList.contains("taken"))){
        clearInterval(timer);
        isOver=true;
        isStart=false;
        updateMainButton();
        alert("GAME OVER");
    }
}

document.addEventListener("keydown",control);

function control(e){
    if(e.code==="Space")
    {
        e.preventDefault();
        mainAction();
    }
    else if(e.key==="ArrowLeft")
    {
        leftshift();
    }
    else if(e.key==="ArrowRight")
    {
        rightshift();
    }
    else if(e.key==="ArrowDown")
    {
        drop();
    }
    else if(e.key==="ArrowUp")
    {
        rotation();
    }
}
document.getElementById("left_btn").addEventListener("click", leftshift);
document.getElementById("right_btn").addEventListener("click", rightshift);
document.getElementById("down_btn").addEventListener("click", drop);
document.getElementById("rotate_btn").addEventListener("click", rotation);


document.getElementById("start_btn").addEventListener("click", mainAction);



