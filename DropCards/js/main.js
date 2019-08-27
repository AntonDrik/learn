const container = document.getElementById('card-wrapper');
const cardHTML = document.querySelector('#cardTemplate');
const finishCard = document.querySelector('#card__finish');
document.getElementById('container').onselectstart = () => false;
let timeout = null;

const Cards = {
    stack: [
        {color: 'green'},
        {color: 'bisque'},
        {color: 'orange'},
        {infoCard: true, color: 'white', text: 'info2'},
        {infoCard: true, color: 'white', text: 'info1'}
    ],
    finishInfo: [
        {text: 'finish1', img: '/'},
        {text: 'finish2', img: '/'},
        {text: 'finish3', img: '/'}
    ],
    randomColors: ['#59319c', '#dd1d93','#fec204'],
    initHeight: 45,
    stepHeight: 20,
    count: 0,
    isStarted: false,
    setCards(count){
        let height = this.initHeight;
        for (let i = 0; i < this.stack.length; i++) {
            this.stack[i].height = height;
            this.stack[i].zIndex = 100+i;
            this.stack[i].HTML = new Card(this.stack[i]);
            if (!this.stack[i].hasOwnProperty('infoCard')){
                height += this.stepHeight;
            }
        }
        this.stack[this.stack.length-1].HTML.setDrag();
    },
    addCardToStack(){
        const currCard = Cards.stack[Cards.stack.length-1];
        if (!!currCard && !currCard.hasOwnProperty('infoCard')){
            this.count+=1;
            this.stack.forEach(item => {
                item.height+=this.stepHeight;
                item.HTML.transformHeight = item.height;
                item.zIndex+=1;
                item.HTML.card.style.transform = `translateY(${item.height}px)`;
                item.HTML.card.style.zIndex = item.zIndex;
            });
            this.stack.unshift(
                {
                    color: this.randomColors[Math.floor(Math.random() * this.randomColors.length)],
                    height: this.stack[0].height - this.stepHeight,
                    zIndex: this.stack[0].zIndex - 1
                });
            this.stack[0].HTML = new Card(this.stack[0]);
        }
    },
    animate(elem){
        new Promise((resolve, reject) => {
            setTimeout( () => {
                elem.HTML.card.classList.add('card-transition-finish');
                elem.HTML.card.style.transform = "translate3d(0px, 0px, 0px) rotateY(0deg)";
                resolve(elem);
            },200);
        }).then((value) =>{
            setTimeout(() =>{
                const finishData = this.finishInfo[Math.floor(Math.random() * this.finishInfo.length)];
                const finishCardTemplate = finishCard.content.querySelector('.card__finish').cloneNode(true);
                finishCardTemplate.querySelector('.card__title').innerText = finishData.text;
                value.HTML.card.appendChild(finishCardTemplate);
            }, 500);
        });
    },
    finish(){
        clearTimeout(timeout);
        for (let i = 1; i < this.stack.length; i++){
            this.stack[i].HTML.card.outerHTML = "";
        }
        this.stack[0].HTML.card.style.transform = "translate3d(0px, 50px, 0px) rotateY(180deg)";
        this.animate(this.stack[0]);
    }
};

class Card {
    constructor(parameters) {
        this.transformHeight = parameters.height;
        this.card = cardHTML.content.querySelector('.card').cloneNode(true);
        this.getCard(parameters);
    }
    getCard(parameters) {
        this.card.style.backgroundColor = parameters.color;
        this.card.style.zIndex = parameters.zIndex;
        if (parameters.hasOwnProperty('infoCard')){
            this.card.classList.add('card__info');
            this.card.querySelector('.card__title').innerText = parameters.text;
        }
        else if (parameters.hasOwnProperty('finishCard')){
            this.card.classList.add('card__finish');
            this.card.querySelector('.card__title').innerText = parameters.text;
        }
        this.card.style.transform = `translateY(${this.transformHeight}px)`;
        container.append(this.card);
    }
    changeCard(){
        if(!Cards.stack[Cards.stack.length-1].hasOwnProperty('infoCard') && !Cards.isStarted){
            Cards.isStarted = true;
            setTimeout(() => {
                Cards.finish();
            },2000);
        }
        timeout = setTimeout( () => {
            this.removeCard();
            Cards.stack[Cards.stack.length-1].HTML.setDrag();
            Cards.addCardToStack();
        }, 100);
    }
    removeCard(){
        this.card.outerHTML = "";
        Cards.stack.pop();
    }
    setDrag(){
        this.card.onmousedown = (event) => {
            let initX = this.card.offsetLeft;
            let initY = this.card.offsetTop+this.transformHeight;
            let shiftX = event.clientX - this.card.offsetLeft;
            let shiftY = event.clientY - this.card.offsetTop;
            let maxLeft = null;

            moveAt.call(this.card, event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
            	const top = pageY - shiftY;
            	const left = pageX - shiftX;
            	maxLeft = (left < -50) ? -16.7 : (left > 50) ? 16.7 : left/3;
            	const rotate = maxLeft;
                this.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${rotate}deg)`;
            }

            const onMouseMove = (event) => {
                moveAt.call(this.card, event.pageX, event.pageY);
            };

            document.addEventListener('mousemove', onMouseMove);

            this.card.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                this.card.onmouseup = null;
                this.card.classList.add('card-transition');
                if (maxLeft <= -16.7 || maxLeft >= 16.7) {
                    this.card.style.transform = `translate3d(${maxLeft < -15 ? -document.body.clientWidth : document.body.clientWidth}px, ${initY}px, 0px) rotate(${maxLeft}deg)`;
                    this.changeCard();
                }
                else{
                    this.card.style.transform = `translate3d(${initX}px, ${initY}px, 0px) rotate(0deg)`;
                }
            };

        };

        this.card.onselectstart = () => false;
        this.card.ondragstart = () => false;
    }
}

Cards.setCards();