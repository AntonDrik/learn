var CONST_TEXT_EQUAL = "Ничья";
var CONST_TEXT_WIN = "Победил: ";
var CONST_TEXT_CHOOSE = "Выбрано: ";
var gameObj = { // игровой объект

	compareData: {
		rock: false,
		scissors: false,
		paper: false
	},

	players: [],

	setPlayers: function(playersCount){

		let playersWrapper = $('.players');
		let playersBlock = $('.player');

		for (let i = 0; i < playersCount; i++){
			let name = prompt("Введите имя "+(i+1)+" игрока");

			let tmpPlayersBlock = playersBlock.clone(true).addClass("active_player");
			tmpPlayersBlock.find('.btn__player').text(name);
			tmpPlayersBlock.find('.player__result').addClass("player__result-active");
			playersWrapper.append(tmpPlayersBlock);

			this.players.push({
				name: name,
				HTMLBlock: tmpPlayersBlock
			});
		}

		$('.active_player').css("visibility", "visible");

	},
	compare: function () { //сравнение элементов

		if (this.compareData.rock &&
			this.compareData.paper &&
			this.compareData.scissors){
			alert(CONST_TEXT_EQUAL);
		} else{
			let tmpPlayers = Object.assign([], this.players);
			tmpPlayers.sort(sortMas);
			let concatResult = +(tmpPlayers[0].choose / tmpPlayers[tmpPlayers.length-1].choose).toFixed(1); //делю элементы чтобы получить уникальное значение
			if (tmpPlayers[0].choose === tmpPlayers[tmpPlayers.length-1].choose){
				alert(CONST_TEXT_EQUAL);
			}
			else if (concatResult === 0.5 || concatResult === 0.7 || concatResult === 3.0){
				for(let i = 0; i < tmpPlayers.length; i++){
					if (tmpPlayers[i].choose!==tmpPlayers[i+1].choose) {
						tmpPlayers[i].HTMLBlock.css("background-color", "green");
						break;
					}
					else{
						tmpPlayers[i].HTMLBlock.css("background-color", "green");
					}
				}
			} else{
				for(let i = tmpPlayers.length-1; i >=0; i--){
					if (tmpPlayers[i].choose!==tmpPlayers[i-1].choose) {
						tmpPlayers[i].HTMLBlock.css("background-color", "green");
						break;
					}
					else{
						tmpPlayers[i].HTMLBlock.css("background-color", "green");
					}
				}
			}
		}
	},
	removeChoose: function () {
		let i = 0;
		for (let item of $('.player__result-active')){ // вывожу на экран имена выбранных элементов
			item.innerHTML = CONST_TEXT_CHOOSE+gameObj.players[i].chooseName;
			delete gameObj.players[i].choose;
			delete gameObj.players[i].chooseName;
			i++;
		}
	}
};

function sortMas( a, b ) {
	if ( a.choose > b.choose ){
		return -1;
	}
	if ( a.choose < b.choose ){
		return 1;
	}
	return 0;
}

$(document).ready(function() {


	$('.btn__start').on ("click", function(){
		let playerCount = prompt("Enter number of players", "");
		 if (isFinite(+playerCount) && +playerCount>1 && +playerCount<10) {
		 	gameObj.setPlayers(+playerCount);
		 } else {
		 	alert('value is not valid');
		 }
	});

	var clickedEl;

	$('.btn__player').magnificPopup({
		type: 'inline',

		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: true,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});


	$('.btn__player').on("click", function () {
		clickedEl = $('.btn__player').index(this)-1; // запоминаю игрока который делает выбор
		$('#playerName').text(gameObj.players[clickedEl].name); // вывожу имя игрока во всплывающее окно
	});

	$('.items__card').on("click", function () {
			gameObj.players[clickedEl].choose = ($('.items__card').index(this))+1; // добавляю в объект игрока index выбранного элемента (камень - 1, ножницы - 2, бумага - 3)
			gameObj.players[clickedEl].chooseName = this.textContent; // туда же добавляю название выбранного элемента

			if (gameObj.players[clickedEl].choose===1){
				gameObj.compareData.rock = true;
			}

			else if (gameObj.players[clickedEl].choose===2){
				gameObj.compareData.scissors = true;
			}

			else if (gameObj.players[clickedEl].choose===3){
				gameObj.compareData.paper = true;
			}


			let tmpGameObj = gameObj.players.filter(item => item.choose === undefined);
			if (!tmpGameObj.length){ // если у обоих игроков выбран элемент вызываю функцию сравнения
				$('.players__winner').text(gameObj.compare());
				gameObj.removeChoose();
			}
			$.magnificPopup.close();
	})
});