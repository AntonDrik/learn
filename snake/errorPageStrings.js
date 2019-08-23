"use strict"
var imgArrayHead = ["img/snakeHeadL.png", "img/snakeHeadT.png", "img/snakeHeadR.png", "img/snakeHeadB.png"];
var imgArrayTail = ["img/snakeTailL.png", "img/snakeTailT.png", "img/snakeTailR.png", "img/snakeTailB.png"];
var imgArrayBody = ["img/snakeBodyRL.png", "img/snakeBodyBT.png", "img/snakeBodyRL.png", "img/snakeBodyBT.png"];
var imgArrayCorner = [0, "img/snakeCornerRT.png", "img/snakeCornerLT.png", "img/snakeCornerLB.png", "img/snakeCornerRB.png"];
let timeID, game = null;
import {ResultStorage} from './storageScript.js';
import {Levels} from './levelScript.js';

const HTML = {
    table:          document.getElementById("area"),
    options:        document.getElementById('options'),
    info:           document.querySelector('.info'),
    speedValue:     document.getElementById("speedValue"),

    setCaption(level) {
        this.info.children[0].innerHTML = "Score: 0|" + level.score;
        this.info.children[1].innerHTML = "Level: " + level.numberLevel;
        this.info.children[2].innerHTML = "Speed: " + (200 - level.speed);
        this.info.children[3].innerHTML = "HP: " + snake.hp;
    }
};

class GameArea {

    constructor() {
        this.level = null;
        this.gameIteration = null;
    }
 
    initArea(){
        this.score = 0;
        this.createTable();
        HTML.setCaption(this.level);
    }

    initGame(){
        clearInterval(this.gameIteration);
        if (!!document.getElementsByClassName("appleElem")[0]){
            document.getElementsByClassName("appleElem")[0].className = "";
        } 
        else if (!!document.getElementsByClassName("lastAppleElem")[0]){
            document.getElementsByClassName("lastAppleElem")[0].className = "";
        }
        this.drive = [3];
        this.tmpDrive = [];
        this.KEY_FLAG = 2;
        this.KEY_SPACE = false;
        snake.setSnake();
        new Apple();
        Apple.counter = 0;
    }

    createTable() {
        if (HTML.table.rows[0] !== undefined){
            HTML.table.querySelector('tbody').remove();
        }
        
        for (let i = 0; i < this.level.rows; i++) {
            HTML.table.insertRow();
            for (let j = 0; j < this.level.cells; j++) {
                HTML.table.rows[i].insertCell();
                if (!!this.level.matrix && this.level.matrix[i][j] === 1) {
                    this.level.crashBlocksArray.push({row: i,cell: j});
                    HTML.table.rows[i].cells[j].className = "crashBlock";
                }
            }
        }
    }

    start() {
        this.KEY_SPACE = true;
        this.gameIteration = setInterval( () => {
            if (this.drive[0] === 1 && snake.head.cell)
                snake.body.unshift({
                    row: snake.head.row,
                    cell: snake.head.cell - 1
                });
            else if (this.drive[0] === 1 && !snake.head.cell)
                snake.body.unshift({
                    row: snake.head.row,
                    cell: this.level.cells - 1
                });

            if (this.drive[0] === 2 && snake.head.row)
                snake.body.unshift({
                    row: snake.head.row - 1,
                    cell: snake.head.cell
                });
            else if (this.drive[0] === 2 && !snake.head.row)
                snake.body.unshift({
                    row: this.level.rows - 1,
                    cell: snake.head.cell
                });

            if (this.drive[0] === 3 && snake.head.cell !== this.level.cells - 1)
                snake.body.unshift({
                    row: snake.head.row,
                    cell: snake.head.cell + 1
                });
            else if (this.drive[0] === 3 && snake.head.cell === this.level.cells - 1)
                snake.body.unshift({
                    row: snake.head.row,
                    cell: 0
                });

            if (this.drive[0] === 4 && snake.head.row !== this.level.rows - 1)
                snake.body.unshift({
                    row: snake.head.row + 1,
                    cell: snake.head.cell
                });
            else if (this.drive[0] === 4 && snake.head.row === this.level.rows - 1)
                snake.body.unshift({
                    row: 0,
                    cell: snake.head.cell
                });
            //-------------------------------------------------------------------
            if (this.drive[0] !== this.tmpDrive[0]) {
                let x = 0;
                if (this.drive[0] === 1) {
                    if (this.tmpDrive[0] === 2) x = 4;
                    if (this.tmpDrive[0] === 4) x = 1;
                } else if (this.drive[0] === 2) {
                    if (this.tmpDrive[0] === 1) x = 2;
                    if (this.tmpDrive[0] === 3) x = 1;
                } else if (this.drive[0] === 3) {
                    if (this.tmpDrive[0] === 2) x = 3;
                    if (this.tmpDrive[0] === 4) x = 2;
                } else if (this.drive[0] === 4) {
                    if (this.tmpDrive[0] === 1) x = 3;
                    if (this.tmpDrive[0] === 3) x = 4;
                }
                snake.body[1].corner = x;
                snake.body[1].drive = this.drive[0];
                this.tmpDrive[0] = this.drive[0];
            }
            snake.body[0].drive = this.drive[0];
            snake.head = snake.body[0];
            if (!this.checkNextStep()) snake.printSnake(this.drive);

            if (this.drive.length !== 1) {
                this.drive.shift();
                this.tmpDrive.shift();
            }
            this.KEY_FLAG = 2;
        }, this.level.speed);
    }

    checkNextStep() {
        const el = snake.get("head").className;
        const elStyle = snake.get("head").style.backgroundImage;

        if (el === "crashBlock" || elStyle !== "") {
            this.stop();
            return 1;
        }
        
        else if ((el === "appleElem" || el === "lastAppleElem") && this.score !== this.level.score){
            HTML.info.children[0].innerHTML = "Score:" + String(this.score += 1) + "|" + this.level.score;
            snake.body.push({
                row: snake.tail.row,
                cell: snake.tail.cell
            });
            new Apple();
        }

        else if (el === "speedAppleElem") {
            clearTimeout(timeID);
            Apple.counter = 0;
        }
        return 0;
    }

    getRandomCell(){
        let searchArr = Array.from(HTML.table.querySelectorAll("td:not([class])")).filter(item => !item.style[0]);
        return searchArr[Math.floor(Math.random() * searchArr.length)];
    }

}

// Arcade
class Arcade extends GameArea {

    constructor() {
        super();
        this.level = Levels.ArcadeLevel.init();
        this.initArea();
    }

    initArea(){
        super.initArea();
        HTML.options.hidden = true;
        HTML.info.children[4].innerHTML = "Mode: Arcade";
    }

    nextlevel(){
        const nextLevel = Levels.ArcadeLevel.next();
        if(nextLevel !== 1) {
            this.level = nextLevel;
            this.initArea();
            this.initGame();
        }
        else {
            clearInterval(this.gameIteration);
            game = new StandartMode();
            game.initGame();
            alert("You win! Next level is Free Level. Enjoy it");
        }   
    }

    stop(){
        snake.setHP(snake.hp - 1);
        if (!snake.hp) {
            let name = prompt("GameOver.You score:"+this.score+" Enter your Name", "");
            if (name){
                const data = {
                    numberLevel: this.level.numberLevel,
                    score: this.score
                };
                ResultStorage.setResult(`${name}|${this.constructor.name}`, data);
            }
            this.level = Levels.ArcadeLevel.init();
            this.initArea();
            this.initGame();
            snake.setHP(3);
        } else {
            this.initGame();
        }
    }

    checkNextStep() {
        if (!super.checkNextStep()){
            const el = snake.get("head").className;

            if (el === "appleElem" || el === "lastAppleElem") {
                if (this.level.numberLevel % 3 === 0 && this.score === this.level.score - 1) {
                    this.setHP();
                }

                if (this.score === this.level.score) {
                    this.nextlevel();
                    return 1;
                }
            } 
    
            if (el === "hpBlock") {
                snake.setHP(snake.hp + 1);
            }

            if (el === "appleElem" || el === "lastAppleElem" || el === "hpBlock") snake.get("head").className = "";
        } else return 1;
    }

    setHP() {
        game.getRandomCell().className = "hpBlock";
    }
}

// Free Game
class FreeGame extends GameArea{

    constructor(){
        super();
        this.level = Levels.FreeLevel; 
    }

    initArea(mode){
        super.initArea();
        snake.setHP(1);
        level.setSpeed = Math.floor(HTML.speedValue.value);
        HTML.options.hidden = false;
        HTML.info.children[4].innerHTML = "Mode: " + mode;
    }

    setCrashBlocks(){
        HTML.table.addEventListener('click',  (e) => {
            let rowIndex = e.target.parentNode.rowIndex;
            let cellIndex = e.target.cellIndex;
            this.level.crashBlocksArray.push({
                row: rowIndex,
                cell: cellIndex
            });
            if (!!HTML.table.rows[rowIndex] && HTML.table.rows[rowIndex].cells[cellIndex].className === "")
                HTML.table.rows[rowIndex].cells[cellIndex].className = "crashBlock";
        });
        HTML.table.addEventListener('dblclick',  (e) => {
            var rowIndex = e.target.parentNode.rowIndex;
            var cellIndex = e.target.cellIndex;
            if (!!HTML.table.rows[rowIndex])
                HTML.table.rows[rowIndex].cells[cellIndex].className = "";
        });
    }

    clearCrashBlocks(){
        this.level.crashBlocksArray.length = 0;
        this.createTable();
        this.initGame();
    }

    stop(){
        let name = prompt("GameOver.You score:"+this.score+" Enter your Name", "");
        
        if (name){
            const data = {
                speed: 200 - this.level.speed,
                score: this.score
            };
            ResultStorage.setResult(`${name}|${this.constructor.name}`, data);
        }
        this.score = 0;
        this.level.speed = 200 - HTML.speedValue.value;
        this.initGame();
        HTML.setCaption(this.level);
    }
}

// Modes for Free Game
class StandartMode extends FreeGame {

    constructor(){
        super();
        this.initArea('Standart');
    }

    checkNextStep(){
        if (!super.checkNextStep()){
            const el = snake.get("head").className;

            if (el === "speedAppleElem") {
                HTML.info.children[0].innerHTML = "Score:" + String(this.score += 5) + "|" + this.level.score;
                snake.body.push({
                    row: snake.tail.row,
                    cell: snake.tail.cell
                });
                clearInterval(this.gameIteration);
                this.start();
            } 

            if (el === "appleElem" || el === "speedAppleElem") snake.get("head").className = "";
        } else return 1;
    }
}

class AutoSpeedMode extends FreeGame {

    constructor(){
        super();
        this.initArea('AutoSpeed');
    }

    checkNextStep(){
        if (!super.checkNextStep()){
            const el = snake.get("head").className;

            if (el === "appleElem") {
                this.level.setSpeed(200 - (this.level.speed - 2), true);
                clearInterval(this.gameIteration);
                this.start();
            } 

            if (el === "speedAppleElem") {
                this.level.setSpeed(200 - (this.level.speed + 35), true);
                clearInterval(this.gameIteration);
                this.start();
            } 
            if (el === "appleElem" || el === "speedAppleElem") snake.get("head").className = "";
        } else return 1;
    } 
}

const snake = {
    body: [],
    head: {},
    tail: {},
    hp: 3,

    setSnake() {
        
        //remove previous snake
        for (let i = 1; i < this.body.length; i++) {
            if (!!HTML.table.rows[this.body[i].row] && !!HTML.table.rows[this.body[i].row].cells[this.body[i].cell])
                this.get(i).style.backgroundImage = "";
        }

        this.startPosition(3);
        
        for (let i = 0; i < snake.body.length; i++) {
            switch(i){
                case 0:                     this.get("head").style.backgroundImage = "url('img/snakeHeadR.png')"; break;
                case this.body.length - 1:  this.get(i).style.backgroundImage = "url('img/snakeTailR.png')"; break;
                default:                    this.get(i).style.backgroundImage = "url('img/snakeBodyRL.png')"; break;
            }
        }
    },

    startPosition(length){
        this.body.length = 0;
        for (var i = length - 1; i >= 0; i--) {
            
            this.body.push({
                row: Math.floor(game.level.rows / 2),
                cell: (Math.floor(game.level.cells / 2) - 1) + i,
                drive: game.drive[0]
            });     
        }
        this.head = this.body[0];
        this.tail = this.body[this.body.length - 1];
    },

    printSnake(drive) {
        this.get("head").style.backgroundImage = `url('${imgArrayHead[drive[0] - 1]}')`;

        if (!!this.body[1].corner){
            this.get("neck").style.backgroundImage = `url('${imgArrayCorner[this.body[1].corner]}')`;
        }
        else {
            this.get("neck").style.backgroundImage = `url('${imgArrayBody[drive[0] - 1]}')`;
        }

        this.get("tail").style.backgroundImage = "";
        this.body.pop();
        this.tail = this.body[this.body.length - 1];
        this.get("tail").style.backgroundImage = `url('${imgArrayTail[(this.tail.drive) - 1]}')`;
    },

    setHP(value){
        this.hp = value;
        HTML.info.children[3].innerHTML = "HP: " + this.hp;
    },

    get(value){
        switch(value){
            case "head": return HTML.table.rows[this.head.row].cells[this.head.cell];
            case "neck": return HTML.table.rows[this.body[1].row].cells[this.body[1].cell];
            case "tail": return HTML.table.rows[this.tail.row].cells[this.tail.cell];
            default:     return HTML.table.rows[this.body[value].row].cells[this.body[value].cell];
        }
    }
};

class Apple {
    constructor(){
        this.cellForApple = game.getRandomCell();
        this.constructor.counter+=1;
        this.setApple();
    }

    setApple() {
        this.cellForApple.className = (game.score !== game.level.score - 1) ? "appleElem" : "lastAppleElem";
        const x = Math.round(5 + ((game.score * 10) / 100));
        if (game instanceof FreeGame && Apple.counter === x){
            const cellForSpeedApple = game.getRandomCell();
            cellForSpeedApple.className = "speedAppleElem";
            Apple.counter = 0;
            timeID = setTimeout(function () {
                cellForSpeedApple.className = "";
            }, 4000);
        }
    }
}
Apple.counter = 0;
//-----------------
game = new Arcade();
game.initGame();

window.addEventListener('keydown', (e) => {
    let key = e.keyCode;
    if (game.KEY_FLAG && game.KEY_SPACE) {
        if (key === 37 && game.drive[game.drive.length - 1] !== 3) {
            game.drive.push(1);
            game.tmpDrive.push(game.drive[0]);
        } else if (key === 38 && game.drive[game.drive.length - 1] !== 4) {
            game.drive.push(2);
            game.tmpDrive.push(game.drive[0]);
        } else if (key === 39 && game.drive[game.drive.length - 1] !== 1) {
            game.drive.push(3);
            game.tmpDrive.push(game.drive[0]);
        } else if (key === 40 && game.drive[game.drive.length - 1] !== 2) {
            game.drive.push(4);
            game.tmpDrive.push(game.drive[0]);
        }
    }
    if (game.drive.length === 2 && game.KEY_FLAG !== 1) {
        game.drive.shift();
        game.tmpDrive.shift();
    }
    game.KEY_FLAG--;
    if (key === 32 && !game.KEY_SPACE) {
        e.preventDefault();
        game.start();
        document.getElementById('caption').hidden = true;
        HTML.options.hidden = true;
        HTML.speedValue.value = 200 - (game.level.speed);	
    }
});

document.getElementById('freeGameBtn').addEventListener('click', () => {
    clearInterval(game.gameIteration);
    game = new StandartMode();
    game.initGame();
});

document.getElementById('rating-btn').addEventListener('click', function(e){
    ResultStorage.getResults(game.constructor.name);
});

HTML.speedValue.addEventListener('keyup', function(e){
    if (game.level.hasOwnProperty('setSpeed')) game.level.setSpeed(e.target.value);
});

HTML.options.addEventListener('change', function (e) {
    var index = e.srcElement.selectedIndex;
    console.log(index);
    switch(index){
        case 0: {
            game  = new StandartMode();
            game.initGame();
            break;
        }
        case 1: {
            game  = new AutoSpeedMode();
            game.initGame();
            break;
        }
        case 2: {
            game.setCrashBlocks();
        }
        case 3: {
            game.clearCrashBlocks();
        }
    }
});