var imgArrayHead = ["img/snakeHeadL.png", "img/snakeHeadT.png", "img/snakeHeadR.png", "img/snakeHeadB.png"];
var imgArrayTail = ["img/snakeTailL.png", "img/snakeTailT.png", "img/snakeTailR.png", "img/snakeTailB.png"];
var imgArrayBody = ["img/snakeBodyRL.png", "img/snakeBodyBT.png", "img/snakeBodyRL.png", "img/snakeBodyBT.png"];
var imgArrayCorner = [0, "img/snakeCornerRT.png", "img/snakeCornerLT.png", "img/snakeCornerLB.png", "img/snakeCornerRB.png"]
var gameIteration, score, timeId, KEY_FLAG;
var CURRENT_FLAG, KEY_SPACE, AUTOSPEED_MODE = false;
var table = document.getElementById("area");
var counter = createCounter();

var snake = {
    body: [],
    head: 0,
    tail: 0,
    hp: 4,
    set setHP(s) {
        this.hp = s;
        document.getElementById("hp").innerHTML = "HP: " + this.hp;
    },
    set startPos(l) {
        this.body.length = 0;
        for (var i = l - 1; i >= 0; i--) {
            this.body.push({
                row: Math.floor(gameSet.rows / 2),
                cell: (Math.floor(gameSet.cells / 2) - 1) + i,
                drive: drive[0]
            });
        }
        this.head = this.body[0];
        this.tail = this.body[this.body.length - 1];
    }
}

var storage = {
    mode: "arcade",
    level: 1,
    score: 0,
    speed: 150
}

function getSnakeCell(str) {
    if (str == "head") return table.rows[snake.head.row].cells[snake.head.cell];
    else if (str == "body") return table.rows[snake.body[1].row].cells[snake.body[1].cell];
    else if (str == "tail") return table.rows[snake.tail.row].cells[snake.tail.cell];
    else return table.rows[snake.body[str].row].cells[snake.body[str].cell];
}

function start() {
    KEY_SPACE = true;
    gameIteration = setInterval(function () {
        if (drive[0] == 1 && snake.head.cell)
            snake.body.unshift({
                row: snake.head.row,
                cell: snake.head.cell - 1
            });
        else if (drive[0] == 1 && !snake.head.cell)
            snake.body.unshift({
                row: snake.head.row,
                cell: gameSet.cells - 1
            });

        if (drive[0] == 2 && snake.head.row)
            snake.body.unshift({
                row: snake.head.row - 1,
                cell: snake.head.cell
            });
        else if (drive[0] == 2 && !snake.head.row)
            snake.body.unshift({
                row: gameSet.rows - 1,
                cell: snake.head.cell
            });

        if (drive[0] == 3 && snake.head.cell != gameSet.cells - 1)
            snake.body.unshift({
                row: snake.head.row,
                cell: snake.head.cell + 1
            });
        else if (drive[0] == 3 && snake.head.cell == gameSet.cells - 1)
            snake.body.unshift({
                row: snake.head.row,
                cell: 0
            });

        //����		
        if (drive[0] == 4 && snake.head.row != gameSet.rows - 1)
            snake.body.unshift({
                row: snake.head.row + 1,
                cell: snake.head.cell
            });
        else if (drive[0] == 4 && snake.head.row != gameSet.row - 1)
            snake.body.unshift({
                row: 0,
                cell: snake.head.cell
            });
        //-------------------------------------------------------------------
        if (drive[0] != tmpDrive[0]) {
            var x = 0;
            if (drive[0] == 1) {
                if (tmpDrive[0] == 2) x = 4;
                if (tmpDrive[0] == 4) x = 1;
            } else if (drive[0] == 2) {
                if (tmpDrive[0] == 1) x = 2;
                if (tmpDrive[0] == 3) x = 1;
            } else if (drive[0] == 3) {
                if (tmpDrive[0] == 2) x = 3;
                if (tmpDrive[0] == 4) x = 2;
            } else if (drive[0] == 4) {
                if (tmpDrive[0] == 1) x = 3;
                if (tmpDrive[0] == 3) x = 4;
            }
            snake.body[1].corner = x;
            snake.body[1].drive = drive[0];
            tmpDrive[0] = drive[0];
        }
        snake.body[0].drive = drive[0];
        snake.head = snake.body[0];
        if (!checkNextStep()) printSnake();

        if (drive.length != 1) {
            drive.shift();
            tmpDrive.shift();
        }
        KEY_FLAG = 2;
    }, gameSet.speed);
}

function setSnake() {
    for (var i = 1; i < snake.body.length; i++) {
        if (!!table.rows[snake.body[i].row] && !!table.rows[snake.body[i].row].cells[snake.body[i].cell])
            getSnakeCell(i).style.backgroundImage = "";
    }
    snake.startPos = 3;
    for (var i = 0; i < snake.body.length; i++) {
        if (i == 0) getSnakeCell(i).style.backgroundImage = "url('img/snakeHeadR.png')";
        else if (i == snake.body.length - 1) getSnakeCell(i).style.backgroundImage = "url('img/snakeTailR.png')";
        else getSnakeCell(i).style.backgroundImage = "url('img/snakeBodyRL.png')";
    }
}

function printSnake() {
    getSnakeCell("head").style.backgroundImage = "url('" + imgArrayHead[drive[0] - 1] + "')";
    if (!!snake.body[1].corner) getSnakeCell("body").style.backgroundImage = "url('" + imgArrayCorner[snake.body[1].corner] + "')";
    else getSnakeCell("body").style.backgroundImage = "url('" + imgArrayBody[drive[0] - 1] + "')";
    getSnakeCell("tail").style.backgroundImage = "";
    snake.body.pop();
    snake.tail = snake.body[snake.body.length - 1];
    getSnakeCell("tail").style.backgroundImage = "url('" + imgArrayTail[(snake.tail.drive) - 1] + "')";
}

function setApple() { //��������� �����
    var appleMas = getRandomCell();
    if (score != gameSet.score - 1) table.rows[appleMas[0]].cells[appleMas[1]].className = "appleElem";
    else table.rows[appleMas[0]].cells[appleMas[1]].className = "lastAppleElem";
    x = Math.round(5 + ((score * 10) / 100));
    if (counter.appleCount == x && gameSet.numberLevel == "Free Game") {
        var speedAppleMas = getRandomCell();
        table.rows[speedAppleMas[0]].cells[speedAppleMas[1]].className = "speedAppleElem";
        timeId = setTimeout(function () {
            table.rows[speedAppleMas[0]].cells[speedAppleMas[1]].className = "";
            counter.appleCount = 0;
        }, 4000)
    }
}

function setHP() {
    var hp = getRandomCell();
    table.rows[hp[0]].cells[hp[1]].className = "hpBlock";
}

function getRandomCell() {
    var FLAG = true;
    var el, el1;
    var mas;
    mas = [Math.floor(Math.random() * gameSet.rows), Math.floor(Math.random() * gameSet.cells)]
    while (FLAG) {
        el = table.rows[mas[0]].cells[mas[1]].className;
        el1 = table.rows[mas[0]].cells[mas[1]].style.backgroundImage;
        if (!!el1 || el == "crashBlock" || el == "appleElem" || el == "hpBlock") {
            mas[0] = Math.floor(Math.random() * gameSet.rows);
            mas[1] = Math.floor(Math.random() * gameSet.cells);
        } else FLAG = false
    }
    return mas;
}

function checkNextStep() {
    var el = getSnakeCell("head").className;
    var elStyle = getSnakeCell("head").style.backgroundImage;

    if (el == "appleElem" || el == "lastAppleElem") {
        getSnakeCell("head").className = "";
        document.getElementById("score").innerHTML = "Score:" + String(score += 1) + "|" + gameSet.score;
        if (gameSet.numberLevel % 3 == 0 && score == gameSet.score - 1) setHP();
        if (gameSet.numberLevel == "Free Game") {
            counter(2);
            if (AUTOSPEED_MODE) {
                gameSet.setSpeed = (200 - (gameSet.speed - 2));
                clearInterval(gameIteration);
                start();
            }
        }
        if (score == gameSet.score) {
            if (counter(1) == levelMas.length - 1) alert("You win! This Free Level. Good luck");
            return 1;
        } else {
            snake.body.push({
                row: snake.tail.row,
                cell: snake.tail.cell
            });
            setApple();
            return 0;
        }
    } else if (el == "speedAppleElem") {
        getSnakeCell("head").className = "";
        clearTimeout(timeId);
        counter.appleCount = 0;
        if (AUTOSPEED_MODE) gameSet.setSpeed = (200 - (gameSet.speed + 35));
        else document.getElementById("score").innerHTML = "Score:" + String(score += 5) + "|" + gameSet.score;
        clearInterval(gameIteration);
        start();
    } else if (el == "hpBlock") {
        getSnakeCell("head").className = "";
        snake.setHP = snake.hp + 1;
    }

    else if (el == "crashBlock" || elStyle != "") {
        stop();
        return 1;
    }
}

function createCounter() {
    function body(params) {
        if (params == 1) {
            getArea(nextLevel());
            return body.winCount++;
        } else {
            return body.appleCount++;
        }
    };
    body.winCount = 1;
    body.appleCount = 0;
    return body;
}

function setBlocksFreeLevel() {
    table.addEventListener('click', function (e) {
        //if (gameSet.numberLevel == "Free Game"){
        var rowIndex = e.target.parentNode.rowIndex;
        var cellIndex = e.target.cellIndex;
        gameSet.crashBlocksArray.push({
            row: rowIndex,
            cell: cellIndex
        });
        if (!!table.rows[rowIndex] && table.rows[rowIndex].cells[cellIndex].className == "")
            table.rows[rowIndex].cells[cellIndex].className = "crashBlock";
        //}
    });
    table.addEventListener('dblclick', function (e) {
        var rowIndex = e.target.parentNode.rowIndex;
        var cellIndex = e.target.cellIndex;
        if (!!table.rows[rowIndex])
            table.rows[rowIndex].cells[cellIndex].className = "";
        gameSet.crashBlocksArray.pop();
    });
}

function printMas() {
    var str;
    for (var i = 0; i < gameSet.rows; i++) {
        for (var j = 0; j < gameSet.cells; j++) {
            if (table.rows[i].cells[j].className == "crashBlock")
                str += 1 + ","
            else str += 0 + ","
        }
        str += "\n";
    }
    console.log(str);
}

function stop() {
    if (gameSet.numberLevel != "Free Game") {
        snake.setHP = snake.hp - 1;
        if (!snake.hp) {
            var name = prompt("GameOver.You score:"+score+" Enter your Name", "");
            if (name) {
                storage.name = name;
                storage.mode = gameSet.mode;
                storage.level = gameSet.numberLevel;
                storage.score = score;
                setLocalStorage(name, storage);
            }
            getArea(levelMas[0]);
            snake.setHP = 3;
            lCount = 0;
            counter.winCount = 1;
        } else {
            clearInterval(gameIteration);
            drive = [3];
            tmpDrive = [];
            KEY_SPACE = false;
            setSnake();
            document.getElementsByClassName("appleElem")[0].className = "";
            setApple();
        }

    } else {
        var name = prompt("GameOver.You score:"+score+" Enter your Name", "");
        if (name) {
            storage.name = name;
            storage.mode = gameSet.mode;
            storage.level = gameSet.numberLevel;
            storage.speed = 200-gameSet.speed;
            storage.score = score;
            setLocalStorage(name, storage);
        }
        if (gameSet.mode=="Standart") counter.appleCount = 0;
        getArea(freeLevel);
    }
}

function setOptions() {
    clearInterval(gameIteration);
    drive = [3];
    tmpDrive = [];
    score = 0;
    snake.setHP = snake.hp;
    KEY_FLAG = 2;
    CURRENT_FLAG = true;
    KEY_SPACE = false;
    if (gameSet == freeLevel) {
        snake.setHP = 1;
        gameSet.setSpeed = Math.floor(document.getElementById("speedValue").value);
        document.getElementById('options').hidden = false;
        document.getElementById('options').selectedIndex = 0;
        document.getElementById('mode').innerHTML = "Mode: " + gameSet.mode;
    } else {
        document.getElementById('options').hidden = true;
        document.getElementById('mode').innerHTML = "Mode: " + gameSet.mode;
    }
    document.getElementById("score").innerHTML = "Score: 0|" + gameSet.score;
    document.getElementById("speed").innerHTML = "Speed: " + (200 - gameSet.speed);
    document.getElementById("level").innerHTML = "Level: " + gameSet.numberLevel;
    document.getElementById('caption').hidden = false;
}

function createTable() {
    for (var i = 0; i < gameSet.rows; i++) {
        table.insertRow();
        for (var j = 0; j < gameSet.cells; j++) {
            table.rows[i].insertCell();
            if (!!gameSet.tmp && gameSet.tmp[i][j] == 1) {
                gameSet.crashBlocksArray.push({
                    row: i,
                    cell: j
                });
            }
        }
    }
}

function createCrashBlocks() {
    for (var i = 0; i < gameSet.crashBlocksArray.length; i++) {
        if (!!table.rows[gameSet.crashBlocksArray[i].row])
            table.rows[gameSet.crashBlocksArray[i].row].cells[gameSet.crashBlocksArray[i].cell].className = "crashBlock";
    }
}

function getArea(level) {
    if (CURRENT_FLAG) {
        for (var i = 0; i < gameSet.rows; i++) {
            table.deleteRow(0);
        }
        CURRENT_FLAG = false;
    }
    gameSet = level;
    setOptions();
    createTable();
    setSnake();
    createCrashBlocks();
    setApple();
    document.getElementById('caption').click();
}

onkeydown = function (e) {
    var key = e.keyCode;
    if (KEY_FLAG && KEY_SPACE) {
        if (key == 37 && drive[drive.length - 1] != 3) {
            drive.push(1);
            tmpDrive.push(drive[0]);
        } else if (key == 38 && drive[drive.length - 1] != 4) {
            drive.push(2);
            tmpDrive.push(drive[0]);
        } else if (key == 39 && drive[drive.length - 1] != 1) {
            drive.push(3);
            tmpDrive.push(drive[0]);
        } else if (key == 40 && drive[drive.length - 1] != 2) {
            drive.push(4);
            tmpDrive.push(drive[0]);
        }
    }
    if (drive.length == 2 && KEY_FLAG != 1) {
        drive.shift();
        tmpDrive.shift();
    }
    KEY_FLAG--;
    if (key == 32 && !KEY_SPACE) {
        e.preventDefault();
        if (gameSet == freeLevel) gameSet.setSpeed = Math.floor(document.getElementById("speedValue").value);
        start();
        document.getElementById('caption').hidden = true;
        document.getElementById('options').hidden = true;
    }
}

function setLocalStorage(name, value) {
	obj = [];
	var tmpCount=0;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var el = JSON.parse(localStorage.getItem(key));
        if (name+"|"+value.mode==key){
        	if (gameSet=="Free Game" && score>el.score){
    			localStorage.setItem(name+"|"+value.mode, JSON.stringify(value));
        	} else if (gameSet!="Free Game" && gameSet.numberLevel>=el.level && score>el.score){
        		localStorage.setItem(name+"|"+value.mode, JSON.stringify(value));
        	}
        } else tmpCount+=1;
    }
    if (tmpCount==localStorage.length) localStorage.setItem(name+"|"+value.mode, JSON.stringify(value));
}

function getLocalStorage() {
	function del(){
		    	localStorage.removeItem(obj[obj.length-1].name);
		    	delete obj[obj.length-1];
	}
    var tmpStr = "RATING FOR ";
    obj = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var el = JSON.parse(localStorage.getItem(key));
        obj.push({
            name: key,
            level: el.level,
            score: el.score,
            speed: el.speed
        });
    }
    if (!window.gameSet) {
        alert("Press New Game");
    } else {
        if (gameSet.numberLevel != "Free Game") {
        	//obj;
            obj = obj.filter(function (el) {
                return el.level != "Free Game"
            }).sort(function (a, b) {
		        if (a.level > b.level) return 1;
		        if (a.level < b.level) return -1;
		        return 0;
		    }).reverse();
            if (localStorage.length>20)  del();
            tmpStr+="ARCADE\n"
            for (var i = 0; i < obj.length; i++) {
                tmpStr += "" + (i + 1) +
                    ")Name: " + obj[i].name +
                    ", MaxLevel: " + obj[i].level +
                    ", SCORE: " + obj[i].score + "\n----------\n";
            }
        } else {
            obj = obj.filter(function (el) {
                return el.level == "Free Game"
            }).sort(function (a, b) {
		        if (a.score > b.score) return 1;
		        if (a.score < b.score) return -1;
		        return 0;
		    }).reverse();
            if (localStorage.length>20) del();
            tmpStr+="FREE GAME\n"
            for (var i = 0; i < obj.length; i++) {
                tmpStr += "" + (i + 1) +
                    ")Name: " + obj[i].name +
                    ", Speed: " + obj[i].speed +
                    ", SCORE: " + obj[i].score + "\n----------\n";
            }
        }
        alert(tmpStr);
    }
}

document.getElementById("options").addEventListener('change', function (e) {
    //if (gameSet.numberLevel != "Free Game"){
    var index = e.srcElement.selectedIndex;
    if (!index) {
        AUTOSPEED_MODE = false;
        gameSet.mode = "Standart";
        document.getElementById('mode').innerHTML = "Mode: " + gameSet.mode;
    } else if (index == 1) {
        AUTOSPEED_MODE = true;
        gameSet.mode = "AutoSpeed";
        document.getElementById('mode').innerHTML = "Mode: " + gameSet.mode;
    } else if (index == 2) setBlocksFreeLevel();
    else {
        gameSet.crashBlocksArray.length = 0;
        //getArea(freeLevel);
    }
    //}
});
