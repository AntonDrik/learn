const gameArea = { // Объект игровая область

    areaSize: null,
    score: null,
    allLocation: [],
    table: document.getElementById('area'),
    caption: document.getElementById('caption'),

    createTable(){ // Создание таблицы и матрицы с указанными размерами
        this.areaSize = 10;
        for (let i = 0; i < this.areaSize; i++){
            this.table.insertRow();
            this.allLocation[i] = [];
            for (let j = 0; j < this.areaSize; j++){
                this.table.rows[i].insertCell();
                this.allLocation[i][j] = 0;
            }
        }
    }
};

Object.defineProperty(gameArea, "size", { // Устанавливаю сеттер-свойство для свойства gameArea.areaSize
    set: function (value) {
        this.areaSize = value;
    }
});

const ships = { // объект корабли
    __proto__: gameArea, // Наследование от gameArea, нужно для получения значений: areaSize, score, allLocation, table, caption.
                         // Возможно не стоит передавать весь объект, а только нужные свойства. Не знаю как правильно реализовать.

    mas: [ // Массив с кораблями. Возможно масив перегружен, неправильная структура. Слишком большая вложенность.
        {name: '1 клеточный', location: []},
        {name: '2 клеточный', location: []},
        {name: '3 клеточный', location: []},
        {name: '4 клеточный', location: []}
        ],
    createShips(){ // Создание корабля
        let i = this.mas.length-1;
         shipsLoop: while (i>-1){ // Цикл по всем типам кораблей.
                                  // Поставил метку в случае выхода из цикла если нет клеток для кораблей, но корабли ещё есть.
            let shipsCount = prompt(this.mas[i].name+": Введите количество", ""); //поочередно запрашиваю количество всех 4 кораблей
            if (!shipsCount) shipsCount = 1; // Проверка на ввод данных
            else{
                while (shipsCount>0){
                    let tmpLocation = this.getRandomLocation(i+1); // Назначаю кораблю координаты и заношу его в матрицу, возвращаю полученные координаты корабля
                    if (!tmpLocation.length) break shipsLoop; // Выход из цикла в случае отсутствия ячеек
                	this.mas[i].location.push(tmpLocation); // Заношу координаты корабля в массив всех кораблей ships.mas
                    shipsCount--;
                }
            } i--;
        }
        this.setCaption(); // устанавливаю блок caption с информацией о количестве кораблей
    },
    setCaption(){
        this.mas.forEach( (item) => {
            let span = document.createElement('span');
            span.innerHTML = item.name+": "+item.location.length;
            this.caption.append(span);
        });
    },
    getRandomLocation(shipLength = 1){ // Назначение рандомных ячеек кораблю.
                                       // Возможно функция перегружена.
                                       // Также, вероятно, неправильно реализована функция выхода из цикла при отсутствии свободных ячеек.
        let randomCell = null;
        let location = [];
        let breakCounter = 0;

        while (true){

            if (breakCounter>60) break; // Функция выхода из цикла при отсутствии свободных ячеек. Если в течении 60 итераций не найдена рандомная клетка - выход из цикла.
            breakCounter++;             // Реализация по вопросом.

            let direction = Math.floor(Math.random()*2); // Направление корабля. 0 - Горизонтально, 1 - Вертикально
            let validlocation = this.getValidlocation(shipLength, direction);
            validlocation = validlocation[Math.floor(Math.random()*validlocation.length)];
            if (!!!validlocation) break;
            randomCell = {
                row: validlocation.i,
                cell: validlocation.j
            };

        	location.length = 0;
            for (let i = 0; i < shipLength; i++){
                if (direction && !this.allLocation[randomCell.row+i][randomCell.cell]){
                	location.push({row: randomCell.row+i, cell: randomCell.cell})
                } else if (!direction && !this.allLocation[randomCell.row][randomCell.cell+i]) {
                	location.push({row: randomCell.row, cell: randomCell.cell+i})
                }
            }
            if (location.length===shipLength){
                this.pushLocationArea(location); //записываю в матрицу координаты корабля и область вокруг созданного корабля
            	break;
            }
        }
        return location;
    },
    pushLocationArea(location){
        location.forEach(item => {

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

        });
    },
    getValidlocation(shipLength, direction){
        let x = [];
        for (let i = 0; i < 10; i++){
            for (let j = 0; j < 10; j++){
                if(!this.allLocation[i][j]){
                    if (direction && i<=this.areaSize-(shipLength)){
                        x.push({i: i, j: j});
                    }
                    if (!direction && j<=this.areaSize-(shipLength)) {
                        x.push({i: i, j: j});
                    }

                }
            }
        }
        return x;
    },
    hit(element, row, cell) {
        let locationIndex = 0;
        let isTrue = false;
        this.mas.forEach((item, index) => {
            item.location.forEach((locItem, index) => {
                for (let i = 0; i < locItem.length; i++) {
                    if (locItem[i].row === row && locItem[i].cell === cell){
                        locItem.splice(i,1);
                    }
                }
                if (!locItem.length){
                    isTrue = true;
                    locationIndex = index;
                }
            });
            if (isTrue) {
                item.location.splice(locationIndex,1);
                this.setCaption();
                isTrue = false;
            }
            element.style.backgroundColor = 'red';
        });
        this.checkWin();
    },
    missed(element, row, cell){
        this.score+=1;
        element.style.backgroundColor = 'gray';
    },
    checkWin(){
        let x = this.mas.filter( (item) => item.location.length!==0);
        if (!x.length) alert('Win! You score: '+this.score+" hits");
    }
};

gameArea.table.onclick = (event) => {
    let el = event.target;
    let row = el.parentNode.rowIndex;
    let cell = el.cellIndex;
    if (gameArea.allLocation[row][cell] === 0 || gameArea.allLocation[row][cell] === 2){
        ships.missed(el, row, cell);
    } else if (gameArea.allLocation[row][cell] === 1){
        ships.hit(el, row, cell);
    }
};