const shipsType = ['1 клеточный', '2 клеточный', '3 клеточный', '4 клеточный']; // Массив с типами кораблей

const colors = { // Обект с цветами
    GRAY: 'gray',
    RED: 'red',
    GREEN: 'green',
    DARK_RED: 'darkred'
};

const focusedShip = { // Сфокусированный корабль который расстреливает компьютер.
                      // Содержит область в которой находится корабль, и рандомную координату этой области.
                      // Также содержит информацию об уровне сложноости на основе которого обстреливает корабль
    difficult: 0,
    currentRow: null,
    currentCell: null,
    location: [],
    defocus (){
        this.currentRow = null;
        this.currentCell = null;
        this.location = [];
    }
};

class GameArea { // Игровая область. Содержит
                                        // Свойства:
                                            // HTML таблицу со всеми кораблями игрока/компьютера и HTML блок с отображением текущего количества кораблей
                                            // Матричное представление таблицы с кораблями и областью вокруг них
                                        // Методы:
                                            // Создание таблицы и матрицы createTable()
                                            // Создание корабля: createShip(), createShipLocation(), getValidPoints()
                                            // Создание блок с информацией о количестве кораблей setCaption()
                                            // Ход игрока/компьютера
                                            // Вывод сообщения о победе winner()

	constructor(size){
		this.areaSize = size;
		this.allLocation = [];
		this.ships = [];
        this.table = null;
        this.caption = null;
		this.area = document.getElementById('gameArea');
	}


	createTable(){ // Создание таблицы. Также создает матрицу по размеру таблицы и заполняет её нулями.
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
            }
        }
        tableBox.append(this.table);
        tableBox.append(this.caption);
        this.area.append(tableBox);
	}


    createShip(shipLength = 1){ // Создание корабля. Входной параметр - длина корабля
        let location = this.createShipLocation(shipLength); // Получаем рандомную и ВАЛИДНУЮ область для корабля.
        if (location.length){
            this.ships.push(new Ship(shipsType[shipLength-1], location, )); // Добавляем объект Ship в общий массив кораблей.
        }
        return location; // Возвращаем корабль для его дальнейшей отрисовки (только для игрока).
    }


    createShipLocation(shipLength){ // Возвращает созданный корабль. Определяет направление корабля.
        let location = [];
        let direction = Math.floor(Math.random()*2); // Рандомно определяем направление корабля 0 - вертикально 1 - горизонтально
        let validLocation = this.getValidPoints(shipLength, direction); // Получаем массив валидных стартовых ячеек в зависимости от направления и размера создаваемого корабля
        if (!validLocation.length){ // Если валидных ячеек для корабля нет, меняем направление и ищем снова
            if (direction === 1) {
                direction = 2;
            }
            else {
                direction = 1;
            }
            validLocation = this.getValidPoints(shipLength, direction);
            if (!validLocation.length) return 0; // Возвращает 0 если места для создания корабля нет
        } 
        validLocation = validLocation[Math.floor(Math.random()*validLocation.length)]; // Выбираем рандомную ячейку из массива полученных валидных ячеек

        for(let i = 0; i < shipLength; i++){ // Заполняем временный массив на основе стартовой ячейки, направления корабля и его длины
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
        location.locationArea(this.allLocation, 'set'); // Записываем в матрицу созданную область корабля и область вокруг
        return location; // Возвращаем область созданного корабля
    }

    getValidPoints(shipLength = 1, direction = 1){ // Метод получения валидных ячеек на основе длины и направления корабля
        let validPoints = [];
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
                    if (direction && !this.allLocation[i][j+k]){ // Проверяем чтобы по направлению корабля ячейки были свободны. Для горизонтального корабля
                        counter--;
                    } 
                    else if (!direction && !this.allLocation[i+k][j]){ // Проверяем чтобы по направлению корабля ячейки были свободны. Для вертикального корабля
                        counter--;
                    }
                } 
                if(!counter){ // Если все ячейки по направлению корабля свободны записываем ячейку в массив.
                    validPoints.push({row: i, cell: j});
                }
            }   
        }
        return validPoints; // Возвращаем массив ячеек
    }

    setCaption(){ // Устанавливает HTML блок с информацией о количестве кораблей
	    this.caption.innerHTML = "";
        shipsType.forEach( (item) => {
            let span = document.createElement('span');
            span.innerHTML = `${item}: ${this.ships.filter( (ship) => ship.name === item).length}`;
            this.caption.append(span);
        });
    }


    hit(row, cell){ // Совершает один ход игрока/компьютера. Возвращает данные в зависимости от попадания. Промах                    - 0;
	                                                                                                    // Попадание                 - 1;
	                                                                                                    // Корабль потоплен          - 2;
                                                                                                        // Конец игры(все потоплены) - 3;
        if (this.allLocation[row][cell] === 1){ // Попал
            let isKill = [row, cell].drawHit(this.table, this.allLocation, this.ships); // Рисуем попадание
            if(isKill) { // Если корабль потоплен
                this.setCaption(); // Обновляем информацию о количестве кораблей
                if (!this.ships.length){ // Если все корабли потоплены
                    return 3; // Конец игры
                }
                return 2;
            }
        return 1;
        }
        else { // Промах
            [row, cell].drawMiss(this.table, this.allLocation); // Рисуем промах
            return 0;
        }
    }

    winner(name){
        alert(`${name} выиграл`);
    }
}

class Computer extends GameArea{ // Объект компьютер

    constructor(name ,size){
        super(size);
        this.name = name;
        this.hitsLocation = [];
    }

    setHitslocation(allLocation){
        for (let i = 0; i < this.areaSize; i++){
            for (let j = 0; j < this.areaSize; j++){
                if (focusedShip.difficult === 2){
                    if (allLocation[i][j]!==2){
                        this.hitsLocation.push({
                            row: i,
                            cell: j
                        });
                    }
                } else {
                    this.hitsLocation.push({
                        row: i,
                        cell: j
                    });
                }
            }
        }
    }

    hit(row, cell){
    	let hitStatus = super.hit(row, cell); // 0 - промах; 1 - попадание в корабль; 2 - кобраль потоплен; 3 - конец игры.
    	if (hitStatus === 3){ // конец игры
    		return hitStatus;
    	}
        if (focusedShip.currentRow !== null){
        	this.hitsLocation.findLocation(focusedShip.currentRow, focusedShip.currentCell, 'delete');
        	return [focusedShip.currentRow, focusedShip.currentCell];
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
            item.location.drawShips(this.table, false);
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

    	if (!hitStatus && focusedShip.currentRow !== null){ // промах, но корабль в фокусе
            this.setRandFocusedShipCell(focusedShip.location);
    	}
    	else if (hitStatus === 1){ //попадание в корабль
            for (let i = 0; i < this.ships.length; i++){
                let isFind = this.ships[i].location.findLocation(row, cell, 'getLocation');
                if (isFind){
                        focusedShip.location = this.ships[i].location.locationArea(this.allLocation, 'get');
                    break;
                }
            }
    		this.setRandFocusedShipCell(focusedShip.location);
    	}
    	else if (hitStatus === 2 || hitStatus === 3){ // корабль потоплен или конец игры
            return hitStatus;
        }
    }

    setRandFocusedShipCell(location){
        let randIndex = Math.floor(Math.random()*location.length);
        let randCell = location.slice(randIndex, randIndex+1);
        focusedShip.location.splice(randIndex,1);
        focusedShip.currentRow =  randCell[0].row;
        focusedShip.currentCell = randCell[0].cell;
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

Array.prototype.locationArea = function(allLocation, action){
    let location = [];
    let tmpAllLocation = JSON.parse(JSON.stringify(allLocation));
    for (let item of this){
        for (let i = item.row-1; i <= item.row+1; i++){
            for(let j = item.cell-1; j <= item.cell+1; j++){
                if(!!allLocation[i] && (typeof(allLocation[i][j]))!=='undefined'){
                    if (action === 'set'){
                        if ((i !== item.row || j !== item.cell) && allLocation[i][j]!==1) {
                            allLocation[i][j] = 2;
                        } else if (i === item.row && j === item.cell) {
                            allLocation[i][j] = 1;

                        }
                    }
                    else if (action === 'get'){
                        if (!focusedShip.difficult){
                            if (tmpAllLocation[i][j]!==3 && tmpAllLocation[i][j]!==-1 && tmpAllLocation[i][j]!==4) {
                                tmpAllLocation[i][j] = -1;
                                location.push({
                                    row: i,
                                    cell: j
                                });
                            }
                        } else{
                            if (tmpAllLocation[i][j]===1){
                                location.push({
                                    row: i,
                                    cell: j
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    if (action === 'get') return location;
};

Array.prototype.drawShips = function(table, isHitted = false) {
    this.forEach( (item) => {
        if (isHitted) {
            table.rows[item.row].cells[item.cell].style.backgroundColor = colors.DARK_RED;
        } else {
            table.rows[item.row].cells[item.cell].style.backgroundColor = colors.GREEN;
        }
    });
};

Array.prototype.drawHit = function(table, allLocation, ships) {
    for (let i = 0; i < ships.length; i++){
        let shipIndex  = null;
        ships[i].location.forEach( (item, index) => {
            if(item.row === this[0] && item.cell === this[1]) {
                table.rows[item.row].cells[item.cell].style.backgroundColor = colors.RED;
                allLocation[this[0]][this[1]] = 4;
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

Array.prototype.findLocation = function(row, cell, action){
	let findIndex = 0;
    for (let i = 0; i < this.length; i++){
        if (this[i].row === row && this[i].cell === cell){
        	findIndex = i;
            if (action === 'delete') {
                this.splice(findIndex, 1);
            }
            else if (action === 'getLocation') {
                return true;
            }
        	break;
        } 	
    }
};

let select = document.getElementById('select');
let btnStart = document.getElementById('btnStart');

select.addEventListener('change', function () {
   focusedShip.difficult = this.selectedIndex;
});

btnStart.addEventListener("click", function(){
    select.setAttribute("disabled", "disabled");
    let areaSize = prompt("Введите размер поля", "");
    let shipsStep = 1;
    if (!areaSize || (+areaSize<10 || +areaSize>20)) areaSize = 10;
    if (+areaSize === 15) shipsStep = 4;
    if (+areaSize === 20) shipsStep = 6;
    let computer = new Computer("Alpha", areaSize);
    let player = new Player("Anton", areaSize);
    computer.createTable();
    player.createTable();
    for (let i = 0; i < shipsType.length; i++){
        for (let j = 0; j < shipsStep+i; j++){
            computer.createShip(4-i);
            player.createShip(4-i);
        }
    }
    computer.setHitslocation(player.allLocation);
    computer.setCaption();
    player.setCaption();
    computer.table.onclick = function (element) {
        let row = element.target.parentNode.rowIndex;
        let cell = element.target.cellIndex;
        if (element.target.style.backgroundColor!==colors.GRAY && element.target.style.backgroundColor!==colors.RED){
            let coords = computer.hit(row, cell); // получение рандомных координат для Player
            if (coords === 3) player.winner();
            setTimeout(() => {
                let hitStatus = player.hit(coords[0], coords[1]);
                if (hitStatus === 2){ // Корабль потоплен, убираем корабль из фокуса
                    focusedShip.defocus();
                }
                else if (hitStatus === 3){
                    computer.winner();
                }
            },100)
        } else {
            alert('Ячейка уже проверена');
        }
    }
});