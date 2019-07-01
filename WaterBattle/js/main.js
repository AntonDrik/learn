
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
            if (!shipsCount) shipsCount = 1;
            else{
                while (shipsCount>0){
                	this.mas.push({
						name: this.shipType[i],
						location: this.getRandomLocation(i+1)
                	});

                	this.mas[this.mas.length-1].location.forEach(item => {
                		this.table.rows[item.row].cells[item.cell].style.backgroundColor = "red";
                	});
                    shipsCount--;
                }
            } i++;
        }
    },
    getRandomLocation(shipLength = 1){
        let randomCell = null;
        let location = [];

        while (true){

        	let direction = Math.floor(Math.random()*2);

        	if (direction) {
            	randomCell = {
            		row: Math.floor(Math.random()*(this.allLocation.length-(shipLength-1))),
            		cell: Math.floor(Math.random()*this.allLocation.length)
            	};
        	} else {
        		randomCell = {
        			row: Math.floor(Math.random()*this.allLocation.length),
        			cell: Math.floor(Math.random()*(this.allLocation.length-(shipLength-1)))
        		}
        	}

        	location.length = 0;
            for (let i = 0; i < shipLength; i++){
                if (direction && !this.allLocation[randomCell.row+i][randomCell.cell]){
                	location.push({row: randomCell.row+i, cell: randomCell.cell})

                } else if (!direction && !this.allLocation[randomCell.row][randomCell.cell+i]) {
                	location.push({row: randomCell.row, cell: randomCell.cell+i})
                }
            }
            if (location.length===shipLength){
            	location.forEach(item => {
            		// console.log('init coords: row -> '+ item.row +"; cell -> "+item.cell);
            		// console.log('________________________________________');
            		for (let i = item.row-1; i <= item.row+1; i++){
            			for(let j = item.cell-1; j <= item.cell+1; j++){
            				// console.log('iteration i['+i+']['+j+']');
            				if(!!this.allLocation[i] && (typeof(this.allLocation[i][j]))!=='undefined'){
            					// console.log('+++');
            					this.allLocation[i][j] = 1;
            					// if (i !== item.row && j !== item.cell) {
            					// 	this.allLocation[i][j] = 2;
            					// 	console.log('    -- 2');
            					// } else if (i === item.row && j === item.cell) {
            					// 	this.allLocation[i][j] = 1; 
            					// 	console.log('    -- 1');	
            					// }	          					
            				}
            			}
            		}
            		
            	});
            	break;
            }
        }
        return location;
    },
    createLocationArea(){

    }

};

ships.__proto__ = GameArea;



