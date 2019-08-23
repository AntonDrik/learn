const container = document.getElementById('card-wrapper');
const cardHTML = document.querySelector('#cardTemplate');
const cardsArr = [];
const cardsParams = [{}, {}, {}, {}, {}];

class Card {
    constructor(style) {
        this.transformHeight = style.transformHeight;
    }
    getHTML() {
        const card = cardHTML.content.querySelector('.card').cloneNode(true);
        card.classList.add('card__info');
        card.style.transform = `translateY(${this.transformHeight}px)`;
        this.setDrag(card, this.transformHeight);
        container.append(card);
    }

    setDrag(card, height){
    	card.onmousedown = function(event) {

            let shiftX = event.clientX - card.offsetLeft;
            let shiftY = event.clientY - card.offsetTop;

            card.style.position = 'absolute';
            card.style.zIndex = 1000;
            // document.body.append(card);

            moveAt(event.pageX, event.pageY);

            // переносит мяч на координаты (pageX, pageY),
            // дополнительно учитывая изначальный сдвиг относительно указателя мыши
            function moveAt(pageX, pageY) {
            	const top = pageY - shiftY;
            	const left = pageX - shiftX;
            	const rotate = (left < 50) ? left/3 : null;
            	card.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${rotate}deg)`;
            	console.log(card.style.transform)
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            // передвигаем мяч при событии mousemove
            document.addEventListener('mousemove', onMouseMove);

            // отпустить мяч, удалить ненужные обработчики
            card.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                card.onmouseup = null;
            };

        };

        card.ondragstart = function() {
            return false;
        };
    }
}

let height = 45;
for (let i = 0; i < 5; i++) {
    const x = new Card({ transformHeight: height });
    cardsArr.push(x);
    x.getHTML();
    height += 20;
}

// for (let i = 0; i < 10; i++){
// 	const asd = new Card();
// 	container.append(asd.getHTML());
// }