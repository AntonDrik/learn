const shipsType = ['1 клеточный', '2 клеточный', '3 клеточный', '4 клеточный'];

class GameArea {
	constructor(size){
		this.areaSize = size;
		this.score = null;
		this.allLocation = [];
		this.ships = [];
        this.table = null;
		this.area = document.getElementById('gameArea');
	}
	createTable(){
        let tableBox = document.createElement('div');
        tableBox.classList.add(this.name);
        this.table = document.createElement('table');
        this.table.classList.add('table');
        let caption = document.createElement('div');
        caption.classList.add('caption');
        for (let i = 0; i < this.areaSize; i++){
            this.table.insertRow();
            this.allLocation[i] = [];
            for (let j = 0; j < this.areaSize; j++){
                this.table.rows[i].insertCell();
                this.allLocation[i][j] = 0;
            }
        }
        tableBox.append(this.table);
        tableBox.append(caption);
        this.area.append(tableBox);
	}
    createShip(shipLength = 1){
        let location = this.createShipLocation(shipLength);
            if (location.length){
                this.ships.push(new Ship(shipsType[shipLength-1], location));
            }
    }
    createShipLocation(shipLength){
        let randomCell = null;
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
                location.push({row: validLocation.row, cell: validLocation.cell+i});
            } else {
                location.push({row: validLocation.row+i, cell: validLocation.cell});
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
                            this.table.rows[i].cells[j].style.backgroundColor = 'gray';
                        } else if (i === item.row && j === item.cell) {
                            this.allLocation[i][j] = 1;
                            this.table.rows[i].cells[j].style.backgroundColor = 'red';
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
        // this.mas.forEach( (item) => {
            let x = [];
        x.push(this.ships.reduce( (previous, current) => {
            console.dir(previous.name+" "+ current.name);
                if (previous.name === current.name){
                    previous[current.count] +=1
                }
                return current;
        }));
            // let span = document.createElement('span');
            // span.innerHTML = item.name+": "+item.location.length;
            // this.caption.append(span);
        // });
    }
}

class Computer extends GameArea{
    constructor(name ,size){
        super(size);
        this.name = name;
    }
    
}

class Player extends GameArea{
    constructor(name, size){
        super(size);
        this.name = name;
    }
    createLocation(){

    }
}

class Ship{
	constructor(name, location){
		this.name = name;
		this.location = location;
        this.count = 0;
	}  
}

document.getElementById('btnStart').addEventListener("click", function(){

    let areaSize = prompt("Введите размер поля", "");
    if (!areaSize || areaSize<10) areaSize = 10;
    computer = new Computer("Alpha",areaSize);
    player = new Player("Anton", areaSize);
    computer.createTable();
    player.createTable();
    // let maxShipCount = areaSize;
    for (let i = 0; i < shipsType.length; i++){
        // let shipsCount = prompt(`${shipsType[i]}: Введите количество. Осталось ${maxShipCount}`, "");
        // if (!+shipsCount) shipsCount = 1;
        // else if (+shipsCount>maxShipCount) shipsCount = maxShipCount;
        for (let j = 0; j < 1+i; j++){
            computer.createShip(4-i);
            player.createShip(4-i);
        }
        // maxShipCount-=shipsCount;
        // if (!maxShipCount) break;
    }

});


// const gameArea = { // Объект игровая область

//     areaSize: null,
//     score: null,
//     allLocation: [],
//     table: document.getElementById('area'),
//     caption: document.getElementById('caption'),

//     createTable(){ // Создание таблицы и матрицы с указанными размерами
//         this.areaSize = 10;
//         for (let i = 0; i < this.areaSize; i++){
//             this.table.insertRow();
//             this.allLocation[i] = [];
//             for (let j = 0; j < this.areaSize; j++){
//                 this.table.rows[i].insertCell();
//                 this.allLocation[i][j] = 0;
//             }
//         }
//     }
// };

// Object.defineProperty(gameArea, "size", { // Устанавливаю сеттер-свойство для свойства gameArea.areaSize
//     set: function (value) {
//         this.areaSize = value;
//     }
// });

// const ships = { // объект корабли
//     __proto__: gameArea, // Наследование от gameArea, нужно для получения значений: areaSize, score, allLocation, table, caption.
//                          // Возможно не стоит передавать весь объект, а только нужные свойства. Не знаю как правильно реализовать.

//     mas: [ // Массив с кораблями. Возможно масив перегружен, неправильная структура. Слишком большая вложенность.
//         {name: '1 клеточный', location: []},
//         {name: '2 клеточный', location: []},
//         {name: '3 клеточный', location: []},
//         {name: '4 клеточный', location: []}
//         ],
//     createShips(){ // Создание корабля
//         let i = this.mas.length-1;
//          shipsLoop: while (i>-1){ // Цикл по всем типам кораблей.
//                                   // Поставил метку в случае выхода из цикла если нет клеток для кораблей, но корабли ещё есть.
//             let shipsCount = prompt(this.mas[i].name+": Введите количество", ""); //поочередно запрашиваю количество всех 4 кораблей
//             if (!shipsCount) shipsCount = 1; // Проверка на ввод данных
//             else{
//                 while (shipsCount>0){
//                     let tmpLocation = this.getRandomLocation(i+1); // Назначаю кораблю координаты и заношу его в матрицу, возвращаю полученные координаты корабля
//                     if (!tmpLocation.length) break shipsLoop; // Выход из цикла в случае отсутствия ячеек
//                 	this.mas[i].location.push(tmpLocation); // Заношу координаты корабля в массив всех кораблей ships.mas
//                     shipsCount--;
//                 }
//             } i--;
//         }
//         this.setCaption(); // устанавливаю блок caption с информацией о количестве кораблей
//     },
//     setCaption(){
//         this.mas.forEach( (item) => {
//             let span = document.createElement('span');
//             span.innerHTML = item.name+": "+item.location.length;
//             this.caption.append(span);
//         });
//     },
//     getRandomLocation(shipLength = 1){ // Назначение рандомных ячеек кораблю.
//                                        // Возможно функция перегружена.
//                                        // Также, вероятно, неправильно реализована функция выхода из цикла при отсутствии свободных ячеек.
//         let randomCell = null;
//         let location = [];
//         let breakCounter = 0;

//         while (true){

//             if (breakCounter>60) break; // Функция выхода из цикла при отсутствии свободных ячеек. Если в течении 60 итераций не найдена рандомная клетка - выход из цикла.
//             breakCounter++;             // Реализация по вопросом.

//             let direction = Math.floor(Math.random()*2); // Направление корабля. 0 - Горизонтально, 1 - Вертикально
//             let validlocation = this.getValidlocation(shipLength, direction);
//             validlocation = validlocation[Math.floor(Math.random()*validlocation.length)];
//             if (!!!validlocation) break;
//             randomCell = {
//                 row: validlocation.i,
//                 cell: validlocation.j
//             };

//         	location.length = 0;
//             for (let i = 0; i < shipLength; i++){
//                 if (direction && !this.allLocation[randomCell.row+i][randomCell.cell]){
//                 	location.push({row: randomCell.row+i, cell: randomCell.cell})
//                 } else if (!direction && !this.allLocation[randomCell.row][randomCell.cell+i]) {
//                 	location.push({row: randomCell.row, cell: randomCell.cell+i})
//                 }
//             }
//             if (location.length===shipLength){
//                 this.pushLocationArea(location); //записываю в матрицу координаты корабля и область вокруг созданного корабля
//             	break;
//             }
//         }
//         return location;
//     },
//     pushLocationArea(location){
//         location.forEach(item => {

//             for (let i = item.row-1; i <= item.row+1; i++){
//                 for(let j = item.cell-1; j <= item.cell+1; j++){
//                     if(!!this.allLocation[i] && (typeof(this.allLocation[i][j]))!=='undefined'){
//                         if ((i !== item.row || j !== item.cell) && this.allLocation[i][j]!==1) {
//                             this.allLocation[i][j] = 2;
//                         } else if (i === item.row && j === item.cell) {
//                             this.allLocation[i][j] = 1;
//                         }
//                     }
//                 }
//             }

//         });
//     },
//     getValidlocation(shipLength, direction){
//         let x = [];
//         for (let i = 0; i < 10; i++){
//             for (let j = 0; j < 10; j++){
//                 if(!this.allLocation[i][j]){
//                     if (direction && i<=this.areaSize-(shipLength)){
//                         x.push({i: i, j: j});
//                     }
//                     if (!direction && j<=this.areaSize-(shipLength)) {
//                         x.push({i: i, j: j});
//                     }

//                 }
//             }
//         }
//         return x;
//     },
//     hit(element, row, cell) {
//         let locationIndex = 0;
//         let isTrue = false;
//         this.mas.forEach((item, index) => {
//             item.location.forEach((locItem, index) => {
//                 for (let i = 0; i < locItem.length; i++) {
//                     if (locItem[i].row === row && locItem[i].cell === cell){
//                         locItem.splice(i,1);
//                     }
//                 }
//                 if (!locItem.length){
//                     isTrue = true;
//                     locationIndex = index;
//                 }
//             });
//             if (isTrue) {
//                 item.location.splice(locationIndex,1);
//                 this.setCaption();
//                 isTrue = false;
//             }
//             element.style.backgroundColor = 'red';
//         });
//         this.checkWin();
//     },
//     missed(element, row, cell){
//         this.score+=1;
//         element.style.backgroundColor = 'gray';
//     },
//     checkWin(){
//         let x = this.mas.filter( (item) => item.location.length!==0);
//         if (!x.length) alert('Win! You score: '+this.score+" hits");
//     }
// };

// gameArea.table.onclick = (event) => {
//     let el = event.target;
//     let row = el.parentNode.rowIndex;
//     let cell = el.cellIndex;
//     if (gameArea.allLocation[row][cell] === 0 || gameArea.allLocation[row][cell] === 2){
//         ships.missed(el, row, cell);
//     } else if (gameArea.allLocation[row][cell] === 1){
//         ships.hit(el, row, cell);
//     }
// };