const searchForm = {
    FormHTML: document.querySelector('.search-form'),
    HTMLBox: document.querySelector('#search-form__search-box'),
    inputHTML: document.querySelector('#search-form__input'),
    dataListHTML: document.querySelector('#data-list'),
    searchDataArr: ['hello', 'hello world', 'orange', 'hello from itsm'],

    setListeners(){
        this.inputHTML.addEventListener('click',  (e)=> {
            e.preventDefault();
            if(e.target.value === '' && this.dataListHTML.classList.contains('hidden')){
                this.getSearchList(cookie.searchHistory.sort(sortDate));

            }
        });

        this.inputHTML.addEventListener('keydown', function (e) { // Проверка на нажатие Enter и добавление слова в историю поиска
            let key = e.keyCode;
            if (key === 13 && this.value!=='') { // обработка Enter
                e.preventDefault();
                e.stopImmediatePropagation();
                searchForm.addWordToSearchList.call(this);
            }
        });

        this.inputHTML.addEventListener('keyup',  (e) => { // Динамическое отображение похожих запросов поиска.
                                                                        // Объединяет похожие запросы из массива и истории
            let target = e.target;
            if (e.keyCode !== 13 && target.value !== '') {
                let findItemsFromHistory = cookie.searchHistory.filter(item => item.value.slice(0, target.value.length) === target.value);
                let findItemFromSearch = this.searchDataArr.filter(item => {
                    if(item.slice(0, target.value.length) === target.value && findItemsFromHistory.map(x=> x.value).indexOf(item) === -1){
                        return item;
                    }
                });
                this.getSearchList(findItemFromSearch.concat(findItemsFromHistory));
            }
            else if (e.keyCode !== 13 && target.value === ''){
                this.getSearchList(cookie.searchHistory.sort(sortDate));
            }
        });

        this.dataListHTML.addEventListener('click', function (e) {
            e.preventDefault();
        });

        this.inputHTML.addEventListener('blur', function () {
            setTimeout(() => {
                blur();
            },150);
        })
    },

    addWordToSearchList(){ // Добавление слова в историю поиска
        let inputValue = this.value.replace(/;/gi, '/');
        if(cookie.searchHistory.map( item => item.value).indexOf(inputValue) === -1){
            let cookieLength = document.cookie.split(';').length;
            if (cookieLength < 10){
                cookie.setCookie(cookie.getFreeID()[0], JSON.stringify({date: Date(), value: inputValue}), new Date());
            }
            else {
                let min = cookie.searchHistory[0];
                cookie.searchHistory.forEach(item => {
                    if(new Date(item.date) < new Date(min.date)) min = item;
                });
                cookie.setCookie(min.id, JSON.stringify({date: Date(), value: inputValue}), new Date());
            }
            cookie.getCookie();
        }
    },

    getSearchList(arr){ // Выводит на экран историю поиска
        this.dataListHTML.innerHTML = "";
        arr.forEach(item => {
            let HTMLItem = null;
            if (typeof item === 'object'){
                HTMLItem = document.querySelector('#history-item').content.cloneNode(true).querySelector('.data-list__item');
                HTMLItem.querySelector('.data-list__value_history').innerText = item.value;
                HTMLItem.querySelector('.data-list__remove').onclick = this.deleteFromHSearchList.bind(item);
                HTMLItem.onclick = this.selectItem.bind(this);
            }
            else {
                HTMLItem = document.querySelector('#search-item').content.cloneNode(true).querySelector('.data-list__item');
                HTMLItem.querySelector('.data-list__value_search').innerText = item;
                HTMLItem.onclick = this.selectItem.bind(this);
            }
            this.dataListHTML.append(HTMLItem);
        });
        this.dataListHTML.classList.remove('hidden');
        this.HTMLBox.classList.add('search-form__search-box_active');
    },

    selectItem(){ // Добавляет в Input выбранный элемент
        let e = arguments[0];
        this.inputHTML.value = e.target.closest('.data-list__item').querySelector('span').textContent;
    },

    deleteFromHSearchList(){
        let e = arguments[0];
        e.preventDefault();
        e.stopPropagation();
        cookie.setCookie(this.id, "", new Date(0));
        e.target.closest('.data-list__item').remove();
        cookie.getCookie();
    }
};

const cookie = {

    searchHistory: [],

    getCookie() {  // Получает историю поиска из Cookie. Добавляет историю в массив searchHistory
        this.searchHistory.length = 0;
        for(let i = 1; i <= 10; i++){
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + String(i).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            if(matches){
                let searchData = JSON.parse(matches[1]);
                this.searchHistory.push({
                    id: i,
                    date: searchData.date,
                    value: searchData.value
                });
            }
        }
        console.log(this.searchHistory);
    },

    setCookie(id, value, date){  // Устанавливает новый item для cookie
        date.setDate(date.getDate()+1);
        console.log(`${id}=${value}; expires=${date.toUTCString()}`);
        document.cookie = `${id}=${value}; expires=${date.toUTCString()}`;
    },

    getFreeID(){ // получает свободные id cookie в диапазоне от 1 до 10.
        let searchID = this.searchHistory.map( item => item.id);
        let arr = Array.from({length: 10}, (i, k) => k+1);
        return arr.filter(item => searchID.indexOf(item) === -1);
    }
};

function blur() {
    searchForm.dataListHTML.classList.add('hidden');
    searchForm.HTMLBox.classList.remove('search-form__search-box_active');
}

function sortDate(a,b){
    if(a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
}

if (navigator.cookieEnabled) {
    searchForm.setListeners();
    cookie.getCookie();
} else {
    alert('Включите cookie');
}


// (function( $ ){
//
//     $.fn.setClock = function(timeZone) {
//
//
//
//     };
// })( jQuery );

// /** Our wonderfull little clock **/
// class Clock {
//
//     /**
//      * Clock initialization
//      */
//     constructor(timeZone) {
//         this.hourHand   = document.querySelector('.hour.hand');
//         this.minuteHand = document.querySelector('.minute.hand');
//         this.secondHand = document.querySelector('.second.hand');
//         this.timeZone = timeZone;
//         this.timer();
//
//         setInterval(() => this.timer(), 1000);
//     }
//
//     /**
//      * Timer of the clock
//      */
//     timer() {
//         this.sethandRotation('hour');
//         this.sethandRotation('minute');
//         this.sethandRotation('second');
//     }
//
//     /**
//      * Changes the rotation of the hands of the clock
//      * @param  {HTMLElement} hand   One of the hand of the clock
//      * @param  {number}      degree degree of rotation of the hand
//      */
//     sethandRotation(hand) {
//         let timeZone = new Date().toLocaleString('en-US', { timeZone: this.timeZone});
//         let date = new Date(timeZone), hours, minutes, seconds, percentage, degree;
//         switch (hand) {
//             case 'hour':
//                 hours       = date.getHours();
//                 hand        = this.hourHand;
//                 percentage  = this.numberToPercentage(hours, 12);
//                 break;
//             case 'minute':
//                 minutes     = date.getMinutes();
//                 hand        = this.minuteHand;
//                 percentage  = this.numberToPercentage(minutes, 60);
//                 break;
//             case 'second':
//                 seconds     = date.getSeconds();
//                 hand        = this.secondHand;
//                 percentage  = this.numberToPercentage(seconds, 60);
//                 break;
//         }
//
//         degree                = this.percentageToDegree(percentage);
//         hand.style.transform  = `rotate(${degree}deg) translate(-50%, -50%)`;
//     }
//
//     /**
//      * Converting a number to a percentage
//      * @param  {number} number Number
//      * @param  {number} max    Maximum value of the number
//      * @return {number}        Return a percentage
//      */
//     numberToPercentage(number = 0, max = 60) {
//         return (number / max) * 100;
//     }
//
//     /**
//      * Converting a percentage to a degree
//      * @param  {number} percentage Percentage
//      * @return {number}            Return a degree
//      */
//     percentageToDegree(percentage = 0) {
//         return (percentage * 360) / 100;
//     }
//
// }
//
// let clock = new Clock('America/New_York');


// ---- VARIABLES

// $clockSize: 320px
// $clockPadding: ($clockSize / 14.4)
// $clockBackground: #F7F7F7
// $innerBorderWidth: ($clockSize / 72)
// $innerBorderColor: #181818
// $secondHandBackgroundColor: #ec231e
//
// // ---- DOCUMENT
//
// html, body
// height: 100%
//
// body
// display: flex
// align-items: center
// justify-content: center
// background: linear-gradient(110deg, #D2D2D2, #F5F5F5)
//
// *
// box-sizing: border-box !important
//
// // ---- CLOCK
//
//     .clock
//
//     .inner
//
//     .hand
// position: absolute
// top: 50%
// left: 50%
// width: 3px
// background-color: #181818
//
// &.hour
// height: ($clockSize / 4)
// margin-top: -($clockSize / 13.2)
// transform: rotate(0deg) translate(-50%, -50%)
// transform-origin: 0 ($clockSize / 13.2)
//
// &.minute
// height: ($clockSize / 3)
// margin-top: -($clockSize / 13.2)
// transform: rotate(0deg) translate(-50%, -50%)
// transform-origin: 0 ($clockSize / 13.2)
//
// &.second
// width: ($clockSize / 185)
// height: ($clockSize / 3)
// background-color: $secondHandBackgroundColor
// margin-top: -($clockSize / 10)
// transform: rotate(0deg) translate(-50%, -50%)
// transform-origin: 0 ($clockSize / 10)
//
// &:before, &:after
// content: ''
// display: inherit
// position: inherit
// left: inherit
// background-color: inherit
// border-radius: 100%
// transform: translate(-50%, -50%)
//
// &:before
// top: ($clockSize / 3.8)
// width: ($clockSize / 20)
// height: ($clockSize / 20)
// box-shadow: -2px -2px 2px 0 rgba(0, 0, 0, 0.15)