const shipsType = ['1 клеточный', '2 клеточный', '3 клеточный', '4 клеточный'];

const colors = {
    GRAY: 'gray',
    RED: 'red',
    GREEN: 'green',
    DARK_RED: 'darkred'
};

const cellAroundShip = {
	catchedRow: null,
	catchedCell: null,
	aroundRow: null,
	aroundCell: null
};

class GameArea {
	constructor(size){
		this.areaSize = size;
		this.score = null;
		this.allLocation = [];
		this.hitsLocation = [];
		this.ships = [];
        this.table = null;
        this.caption = null;
		this.area = document.getElementById('gameArea');
	}
	createTable(){
        let tableBox = document.createElement('div');
        tableBox.classList.add(this.name);
        this.table = document.createElement('table');
        this.table.classList.add('table');
        this.caption = document.createElement('div');
        this.caption.classList.add('caption');
        for (let i = 0; i < this.areaSize; i++){
            this.table.insertRow();
            this.allLocation[i] = [];
            for (let j = 0; j < this.areaSize; j++){
                this.table.rows[i].insertCell();
                this.allLocation[i][j] = 0;
                this.hitsLocation.push({
                    row: i,
                    cell: j
                });
            }
        }
        tableBox.append(this.table);
        tableBox.append(this.caption);
        this.area.append(tableBox);
	}
    createShip(shipLength = 1){
        let location = this.createShipLocation(shipLength);
        if (location.length){
            this.ships.push(new Ship(shipsType[shipLength-1], location));
        }
        return location;
    }
    createShipLocation(shipLength){
        let location = [];
        let direction = Math.floor(Math.random()*2);
        let validLocation = this.getValidPoints(shipLength, direction);
        if (!validLocation.length){
            if (direction === 1) direction = 2;
            else direction = 1;
            validLocation = this.getValidPoints(shipLength, direction);
            if (!validLocation.length) return 0;
        } 
        validLocation = validLocation[Math.floor(Math.random()*validLocation.length)];
        for(let i = 0; i < shipLength; i++){
            if (direction){
                location.push({
                    row: validLocation.row,
                    cell: validLocation.cell+i,
                    isHitted: false
                });
            } else {
                location.push({
                    row: validLocation.row+i,
                    cell: validLocation.cell,
                    isHitted: false
                });
            }
        }
        this.pushShipLocationArea(location);
        return location;
    }
    pushShipLocationArea(location){
        for (let item of location){
            for (let i = item.row-1; i <= item.row+1; i++){
                for(let j = item.cell-1; j <= item.cell+1; j++){
                    if(!!this.allLocation[i] && (typeof(this.allLocation[i][j]))!=='undefined'){
                        if ((i !== item.row || j !== item.cell) && this.allLocation[i][j]!==1) {
                            this.allLocation[i][j] = 2;
                        } else if (i === item.row && j === item.cell) {
                            this.allLocation[i][j] = 1;

                        }
                    }
                }
            }
        }
    }
    getValidPoints(shipLength = 1, direction = 1){
        let x = [];
        let counter = shipLength;
        let row = this.areaSize;
        let cell = this.areaSize;
        if (direction) {
            cell = this.areaSize-(shipLength-1);
        } else {
            row = this.areaSize-(shipLength-1);
        }
        for (let i = 0; i < row; i++){
            for (let j = 0; j < cell; j++){
                counter = shipLength;
                for (let k = 0; k < shipLength; k++){
                    if (direction && !this.allLocation[i][j+k]){
                        counter--;
                    } 
                    else if (!direction && !this.allLocation[i+k][j]){
                        counter--;
                    }
                } 
                if(!counter){
                    x.push({row: i, cell: j});
                }
            }   
        }
        return x;
    }
    setCaption(){
	    this.caption.innerHTML = "";
        shipsType.forEach( (item) => {
            let span = document.createElement('span');
            span.innerHTML = `${item}: ${this.ships.filter( (ship) => ship.name === item).length}`;
            this.caption.append(span);
        });
    }
    hit(row, cell){
        if (this.allLocation[row][cell] === 1){
            let isKill = [row, cell].drawHit(this.table, this.allLocation, this.hitsLocation, this.ships);
            if(isKill) {
                this.setCaption();
                if (!this.ships.length){
                    return 3;
                }
                return 2;
            }
        return 1;
        }
        else {
            [row, cell].drawMiss(this.table, this.allLocation);
            return 0;
        }
    }
    winner(name){
        alert(`${name} проиграл`);
    }
}

class Computer extends GameArea{
    constructor(name ,size){
        super(size);
        this.name = name;
    }
    hit(row, cell){
    	let hitStatus = super.hit(row, cell); // 0 - промах; 1 - попадание в корабль; 2 - кобраль потоплен; 3 - конец игры.
    	if (hitStatus === 3){ // конец игры
    		this.winner(this.name);
    	}
        if (cellAroundShip.aroundRow !== null){
        	this.hitsLocation.delHitsLocation(cellAroundShip.aroundRow, cellAroundShip.aroundCell);
        	return [cellAroundShip.aroundRow, cellAroundShip.aroundCell];
        } else {
        	let randomIndex = Math.random()*this.hitsLocation.length;
            let cellForHit = this.hitsLocation.slice(randomIndex,randomIndex+1);
            this.hitsLocation.splice(randomIndex, 1);
            return [cellForHit[0].row, cellForHit[0].cell];	
        }
    }
    winner(){
        super.winner(this.name);
        this.ships.forEach( (item) => {
            item.location.drawShips(this.table, true);
        });
    }
}

class Player extends GameArea{
    constructor(name, size){
        super(size);
        this.name = name;
    }
    createShip(shipLength = 1){
        let ship = super.createShip(shipLength);
        ship.drawShips(this.table);
    }
    hit(row, cell){
    	let hitStatus = super.hit(row, cell); // 0 - промах; 1 - попадание в корабль; 2 - кобраль потоплен; 3 - конец игры.
    	if (!hitStatus && cellAroundShip.aroundRow !== null){ //промах
    		// alert('Промах, но корабль захвачен');
    		return this.getCellAroundHittedShip(cellAroundShip.catchedRow, cellAroundShip.catchedCell);
    	}
    	else if (hitStatus === 1){ //попадание в корабль
    		// alert('Попадание, кобраль захвачен');
    		cellAroundShip.catchedRow = row;
    		cellAroundShip.catchedCell = cell;
    		return this.getCellAroundHittedShip(row, cell);
    	}
    	else if (hitStatus === 2){ // корабль потоплен
    		// alert('Корабль потоплен');
    		return 2;
    	}
    	else if (hitStatus === 3){ // конец игры
    		this.winner(this.name);
    	}
    }
    getCellAroundHittedShip(row, cell){
	    let isTrue = true;
        while (isTrue){
            let randCell = {
                row: getRandInterval(row-1, row+2), // изменить на выбор ячеек "крестом"
                cell: getRandInterval(cell-1, cell+2) // изменить на выбор ячеек "крестом"
            };
            // console.log(`Переданная ячейка: row: ${row} cell: ${cell}; новые координаты: row: ${randCell.row} cell: ${randCell.cell};
            // диапазон: row:${row-1}-${row+2} cell: ${cell-1}-${cell+2}`);
            if (randCell.row !== row  || randCell.cell !== cell){
                if(!!this.allLocation[randCell.row] && typeof(this.allLocation[randCell.row][randCell.cell])!=='undefined' &&
                    this.allLocation[randCell.row][randCell.cell]!==3){
                    return randCell;
                }
            }
        }
    }
    winner() {
        super.winner(this.name);
    }
}

class Ship{
	constructor(name, location){
		this.name = name;
		this.location = location;
	}
}

function getRandInterval (min, max){
    return Math.floor(Math.random()* (max - min)) + min;
}

Array.prototype.drawShips = function(table, isHitted = false) {
    this.forEach( (item) => {
        if (isHitted) {
            table.rows[item.row].cells[item.cell].style.backgroundColor = colors.DARK_RED;
        } else {
            table.rows[item.row].cells[item.cell].style.backgroundColor = colors.GREEN;
        }
    });
};

Array.prototype.drawHit = function(table, allLocation, location, ships) {
	location.delHitsLocation(cellAroundShip.aroundRow, cellAroundShip.aroundCell);
    for (let i = 0; i < ships.length; i++){
        let shipIndex  = null;
        ships[i].location.forEach( (item, index) => {
            if(item.row === this[0] && item.cell === this[1]) {
                table.rows[item.row].cells[item.cell].style.backgroundColor = colors.RED;
                allLocation[this[0]][this[1]] = 3;
                shipIndex = index;
            }
        });
        
        if (shipIndex !== null){
            ships[i].location[shipIndex].isHitted = true;
            let activeShipCell = ships[i].location.find (current => current.isHitted === false);
            if ((typeof activeShipCell) === 'undefined'){
                ships[i].location.drawShips(table, true);
                ships.splice(i,1);
                return true;
            }
            return false;
        }
    }
};

Array.prototype.drawMiss = function(table, allLocation) {
    table.rows[this[0]].cells[this[1]].style.backgroundColor = colors.GRAY;
    allLocation[this[0]][this[1]] = 3;
};

Array.prototype.delHitsLocation = function(row, cell){
	let findIndex = 0;
    for (let i = 0; i < this.length; i++){
        if (this[i].row === row && this[i].cell === cell){
        	findIndex = i;
        	break;
        } 	
    }
    this.splice(findIndex, 1);
}

document.getElementById('btnStart').addEventListener("click", function(){

    let areaSize = prompt("Введите размер поля", "");
    // if (!areaSize || areaSize<10) areaSize = 10;
    computer = new Computer("Alpha",areaSize);
    player = new Player("Anton", areaSize);
    computer.createTable();
    player.createTable();
    // let maxShipCount = areaSize;
    for (let i = 0; i < 1; i++){
        // let shipsCount = prompt(`${shipsType[i]}: Введите количество. Осталось ${maxShipCount}`, "");
        // if (!+shipsCount) shipsCount = 1;
        // else if (+shipsCount>maxShipCount) shipsCount = maxShipCount;
        for (let j = 0; j < 4+i; j++){
            computer.createShip(2-i);
            player.createShip(2-i);
        }
        // maxShipCount-=shipsCount;
        // if (!maxShipCount) break;
    }
    computer.setCaption();
    player.setCaption();
    computer.table.onclick = function (element) {

        let row = element.target.parentNode.rowIndex;
        let cell = element.target.cellIndex;

        let coords = computer.hit(row, cell); // получение рандомных координат для Player

        setTimeout(() => {
            let hitStatus = player.hit(coords[0], coords[1]); // 0 - Промах; {} - Попадание в корабль; 2 - Кобраль потоплен; 3 - Все корабли потоплены
            if (hitStatus === 2){
            	for (let key in cellAroundShip){
            		cellAroundShip[key] = null;
            	}
            } 
            else if (typeof (hitStatus) === 'object' && hitStatus.hasOwnProperty('row')){
            	cellAroundShip.aroundRow = hitStatus.row;
            	cellAroundShip.aroundCell = hitStatus.cell;
            }
        },100)
    }
});