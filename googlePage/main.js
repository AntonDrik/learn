const searchForm = {
    FormHTML: document.querySelector('.search-form'),
    HTMLBox: document.querySelector('#search-form__search-box'),
    inputHTML: document.querySelector('#search-form__input'),
    dataListHTML: document.querySelector('#data-list'),
    searchDataArr: ['дом', 'Большая квартира','javascript','чай','программирование','простое предложение', 'human'],

    setListeners(){
        this.inputHTML.addEventListener('click',  (e)=> {
            e.preventDefault();
            if(e.target.value === '' && this.dataListHTML.classList.contains('hidden')){
                this.getSearchList(cookie.searchHistory.sort(sortDate));
                // this.dataListHTML.appendChild(document.querySelector('.search-form__btns'));
                this.dataListHTML.classList.remove('hidden');
            }
        });

        this.inputHTML.addEventListener('keydown', function (e) {
            let key = e.keyCode;
            if (key === 13 && this.value!=='') {
                e.preventDefault();
                e.stopImmediatePropagation();
                let cookieLength = document.cookie.split(';').length;
                let inputValue = this.value.replace(/;/gi, '');
                if (document.cookie === "") cookieLength = 0;
                if (cookieLength < 10){
                    document.cookie = `${cookieLength+1}=${JSON.stringify({date: Date(), value: inputValue})}`;
                }
                else {
                    let min = cookie.searchHistory[0];
                    cookie.searchHistory.forEach(item => {
                        if(new Date(item.date) < new Date(min.date)) min = item;
                    });
                    document.cookie = `${min.id}=${JSON.stringify({date: Date(), value: inputValue})}`;
                }
                cookie.getCookie();
            }
        }); // обработка Enter.

        this.inputHTML.addEventListener('keyup',  (e) => {
            let target = e.target;
            if (e.keyCode !== 13 && target.value !== '') {
                let findItemsFromHistory = cookie.searchHistory.filter(item => item.value.slice(0, target.value.length) === target.value);
                let findItemFromSearch = this.searchDataArr.filter(item => item.slice(0, target.value.length) === target.value);
                this.getSearchList(findItemFromSearch.concat(findItemsFromHistory));
            }

            else if(target.value === '') {
                this.getSearchList(cookie.searchHistory.sort(sortDate));
                this.dataListHTML.classList.remove('hidden');
            }
        });

        // this.inputHTML.addEventListener('blur',  ()=> {
        //     // this.FormHTML.appendChild(document.querySelector('.search-form__btns'));
        //     this.dataListHTML.classList.add('hidden');
        // }); // Выход из фокуса

        this.dataListHTML.addEventListener('click', function (e) {
            e.preventDefault();
        })
    },

    getSearchList(arr){
        this.dataListHTML.innerHTML = "";
        arr.forEach(item => {
            let HTMLItem = null;
            if (typeof item === 'object'){
                HTMLItem = document.querySelector('#history-item').content.cloneNode(true).querySelector('.data-list__item');
                HTMLItem.querySelector('.data-list__value_history').innerText = item.value;
                HTMLItem.querySelector('.data-list__remove').onclick = this.deleteFromHistory.bind(item);
            }
            else {
                HTMLItem = document.querySelector('#search-item').content.cloneNode(true).querySelector('.data-list__item');
                HTMLItem.querySelector('.data-list__value_search').innerText = item;
            }
            this.dataListHTML.prepend(HTMLItem);
        });
    },

    deleteFromHistory(){
        let target = arguments[0];
        cookie.deleteCookie(this.id);
    }
};

const cookie = {

    searchHistory: [],

    getCookie() {
        this.searchHistory.length = 0;
        for(let i = 1; i <= document.cookie.split(';').length; i++){

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

    updCookie(item){

    },

    deleteAllCookies() {
        let cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            let eqPos = cookie.indexOf("=");
            let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    },

    deleteCookie(id){
        // console.log(`cookie: ${document.cookie}, forDel: ${id}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        // document.cookie = id + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = id+"=;expires=-1";

    }
};

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