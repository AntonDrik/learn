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
    },

    setCookie(id, value, date){  // Устанавливает новый item для cookie
        date.setDate(date.getDate()+1);
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