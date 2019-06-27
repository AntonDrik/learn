var CONST_TEXT_EQUAL = "Ничья";
var CONST_TEXT_WIN = "Победил: ";
var CONST_TEXT_CHOOSE = "Выбрано: ";
var gameObj = { // игровой объект
	players: [ // массив игроков
		player1 = {name: "Игрок 1"},
		player2 = {name: "Игрок 2"},
	],
	compare: function () { //сравнение элементов
		let concatResult = +(this.players[0].choose / this.players[1].choose).toFixed(1); //делю элементы чтобы получить уникальное значение
		if (this.players[0].choose === this.players[1].choose) // если элементы равны - ничья
			return CONST_TEXT_EQUAL;
		else if (concatResult === 0.5 || concatResult === 0.7 || concatResult === 3.0) //проверка уникальных значений для первого игрока, если равно - первый игрок победил
			return CONST_TEXT_WIN + this.players[0].name;
		else // иначе - победил второй игрок
			return CONST_TEXT_WIN + this.players[1].name;
	},
	removeChoose: function () {
		let i = 0;
		for (let item of $('.players__result')){ // вывожу на экран имена выбранных элементов
			item.innerHTML = CONST_TEXT_CHOOSE+gameObj.players[i].chooseName;
			delete gameObj.players[i].choose;
			delete gameObj.players[i].chooseName;
			i++;
		}
	}
};

$(document).ready(function() {

	var playerEl = $('.btn__player'); // массив кнопок
	var clickedEl;

	let i = 0;
	for (let item of playerEl){ //прохожу по кнопкам и присваиваю каждой кнопке свое имя из массива игроков
		item.innerHTML = gameObj.players[i].name;
		i++;
	}

	playerEl.magnificPopup({
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


	playerEl.on("click", function () {
		clickedEl = playerEl.index(this); // запоминаю игрока который делает выбор
		$('#playerName').text(gameObj.players[clickedEl].name); // вывожу имя игрока во всплывающее окно
	});

	$('.items__card').on("click", function () {
			gameObj.players[clickedEl].choose = ($('.items__card').index(this))+1; // добавляю в объект игрока index выбранного элемента (камень - 1, ножницы - 2, бумага - 3)
			gameObj.players[clickedEl].chooseName = this.textContent; // туда же добавляю название выбранного элемента

			if (gameObj.players[0].choose !== undefined && gameObj.players[1].choose !== undefined){ // если у обоих игроков выбран элемент вызываю функцию сравнения

				$('.players__winner').text(gameObj.compare());
				gameObj.removeChoose();
			}
			$.magnificPopup.close();
	})
});