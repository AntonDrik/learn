
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

const GameArea = {

    areaSize: null,
    allLocation: [],
    table: document.getElementById('area'),

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
};

Object.defineProperty(GameArea, "size", {
    set: function (value) {
        this.areaSize = value;
    }
});

const ships = {
    mas: [],
    shipType: ['1st', '2st', '3st', '4st'],
    createShips(){
        let i = 0;
         while (i<this.shipType.length){
            let shipsCount = prompt(this.shipType[i], "");
            if (!shipsCount) alert('Edit number');
            else{
                while (shipsCount>=0){

                    // let tmp = this.getRandomLocation();
                    // this.mas.push(tmp);
                    shipsCount--;
                }

            } i++;
        }
    },
    getRandomLocation(shipLength, direction){
        let tmpRow, tmpCell = null;
        if (direction) {
            tmpRow = Math.floor(Math.random()*this.allLocation.length-shipLength);
            tmpCell = Math.floor(Math.random()*this.allLocation.length);
        }
        else {
            tmpRow = Math.floor(Math.random()*this.allLocation.length);
            tmpCell = Math.floor(Math.random()*this.allLocation.length-shipLength);
        }

        let isTrue = true;
        while (isTrue){
            for (let i = 0; i < shipLength; i++){
                if (this.allLocation[tmpRow][tmpCell]){

                }
                if (direction) tmpRow++;
                else tmpCell++;
            }
        }
    }
};

ships.__proto__ = GameArea;



