
// function GameArea() {
//     this.areaSize = null;
//     this.allLocation = [];
//     this.table = document.getElementById('area');
//
//     this.setAreaSize = function (value) {
//         if (value<=0) alert('incorrect number');
//         else{
//             this.areaSize = value;
//             for (let i = 0; i < (value*value); i++){
//                 this.allLocation.push(i);
//             }
//         }
//     };
//
//     this.createTable = function () {
//         for (let i=0; i< this.areaSize; i++){
//             this.table.insertRow();
//             for (let j=0; j< this.areaSize; j++){
//                 this.table.rows[i].insertCell();
//             }
//         }
//     };
//
//     this.Ships = {
//         x: allLocation,
//         mas: [],
//         shipType: ['1st', '2st', '3st', '4st'],
//
//         createShips(){
//             let i = 0;
//             while (i<this.shipType.length){
//                 let shipsCount = prompt(this.shipType[i], "");
//                 if (!shipsCount) alert('Edit number');
//                 else{
//                     while (shipsCount>=0){
//                         // let tmp = this.getRandomLocation();
//                         // this.mas.push(tmp);
//                         shipsCount--;
//                     }
//
//                 } i++;
//             }
//         },
//         getRandomLocation(){
//             console.log(allLocation[0]);
//         }
//
//     }
// }

const gameArea = {

    areaSize: null,
    score: null,
    allLocation: [],
    table: document.getElementById('area'),
    caption: document.getElementById('caption'),

    createTable(){
        this.areaSize = 10;
        for (let i = 0; i < this.areaSize; i++){
            this.table.insertRow();
            this.allLocation[i] = [];
            for (let j = 0; j < this.areaSize; j++){
                this.table.rows[i].insertCell();
                this.allLocation[i][j] = 0;
            }
        }
    },
    hit(element){
        element.style.backgroundColor = 'red';
    },
    missed(element){
        this.score+=1;
        element.style.backgroundColor = 'gray';
    }
};

Object.defineProperty(gameArea, "size", {
    set: function (value) {
        this.areaSize = value;
    }
});

const ships = {
    mas: [],
    shipType: ['1st', '2st', '3st', '4st'],
    createShips(){
        let i = this.shipType.length-1;
         shipsLoop: while (i>-1){
            let shipsCount = prompt(this.shipType[i], "");
            if (!shipsCount) shipsCount = 1;
            else{
                while (shipsCount>0){
                    let tmpLocation = this.getRandomLocation(i+1);
                    if (!tmpLocation.length) break shipsLoop;
                	this.mas.push({
						name: this.shipType[i],
						location: tmpLocation
                	});
                	this.mas[this.mas.length-1].location.forEach(item => {
                		this.table.rows[item.row].cells[item.cell].style.backgroundColor = "red";
                	});
                    shipsCount--;
                }
            } i--;
        }
    },
    setCaption(){
        Object.keys(this.mas).map( (key) => {

        });
        // this.caption
    },
    getRandomLocation(shipLength = 1){
        let randomCell = null;
        let location = [];
        let breakCounter = 0;
        while (true){

            if (breakCounter>60) break;
            breakCounter++;

            let direction = Math.floor(Math.random()*2);
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
                this.createLocationArea(location);
            	break;
            }
        }
        return location;
    },
    createLocationArea(location){
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
    }
};

ships.__proto__ = gameArea;

gameArea.table.onclick = (event) => {
    let el = event.target;
    let row = el.parentNode.rowIndex;
    let cell = el.cellIndex;
    if (gameArea.allLocation[row][cell] === 0 || gameArea.allLocation[row][cell] === 2){
        gameArea.missed(el);
    } else if (gameArea.allLocation[row][cell] === 1){
        gameArea.hit(el);
    }
}