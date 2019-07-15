const searchForm = {
    FormHTML: document.querySelector('.search-form'),
    HTMLBox: document.querySelector('#search-form__search-box'),
    inputHTML: document.querySelector('#search-form__input'),
    dataListHTML: document.querySelector('#data-list'),
    lastRequests: [],

    getLastRequests(){
        let str = document.cookie.replace(/;\s/gi, '').split('=request');
        console.log(str);
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

    setListeners(){
        this.inputHTML.addEventListener('focus',  ()=> {
           this.dataListHTML.appendChild(document.querySelector('.search-form__btns'));
           this.dataListHTML.classList.remove('hidden');
        });

        this.inputHTML.addEventListener('keydown', function (e) {
            let key = e.keyCode;
            if (key === 13) {
                e.preventDefault();
                document.cookie = `${JSON.stringify({date: Date(), value: this.value})}=request`;
            }
        });

        this.inputHTML.addEventListener('blur',  ()=> {
            this.FormHTML.appendChild(document.querySelector('.search-form__btns'));
            this.dataListHTML.classList.add('hidden');
        });
    }
};

searchForm.setListeners();