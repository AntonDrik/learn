"use strict";
const leftPosts = { // Объект левого блока с постами. Методы: загрузка постов, добавление поста в сохраненные.
    HTMLBox: document.querySelector('#left-posts-box'),
    showMoreBtn: document.querySelector('.content-left__btn-showmore'),
    currentPostIndex: 0,

    load(count = 10){
        fetch(`https://jsonplaceholder.typicode.com/posts`)
                .then(response => {
                    if (response.ok){ // Если запрос прошел верно, преобразуем ответ сервера в json
                        return response.json();
                    }
                }, error => alert(error))
				.then(json =>  {

				    let posts = json.filter( (item, index) => index>=this.currentPostIndex && index<this.currentPostIndex+count);

                    if (!posts.length) alert('Посты закончились');
                    else {
                        posts.forEach(item => {
                            setElem(item, 'left-posts', function(){
                                this.HTMLElem.querySelector('.post-item__btn-add').onclick = () =>{
                                    leftPosts.addPostToFavorites(this);
                                };
                                leftPosts.HTMLBox.append(this.HTMLElem);
                            });
                        });
                        this.currentPostIndex+=count;
                    }
                });
    },
    addPostToFavorites(postItem){ // Добавляет пост в правый блок. Возможно стоит перенести этот метод в объект с правым блоком.
        let findPost = rightPosts.postsArr.find( (item) => item.id === postItem.id); // Смторим есть ли в правом блоке добавляемый пост
        if (typeof findPost === 'undefined'){ // Если добавляемый пост уже есть то ничего не делаем, иначе - добавляем

            localStorage.setItem(postItem.id, postItem.id);
            setElem(postItem, 'right-posts', function(){ // Заносим в массив правых постов добавляемый пост. Через callback ставим onclick

                this.HTMLElem.querySelector('.post-item__btn-remove').onclick = ()=>{
                    rightPosts.removePost(this);
                };
                rightPosts.HTMLBox.append(this.HTMLElem);
                rightPosts.postsArr.push(this);

            });
        } else alert('Пост уже добавлен в избранное');
    }

};

const rightPosts = { // объект правого блока с сохраненными постами. Методы: загрузка постов из localStorage, удаление поста и сохраненных
    HTMLBox: document.querySelector('#right-posts-box'),
    postsArr: [],

    load(postsStorage = Object.values(localStorage).sort(sortLocalStorage)){ //загрузка постов
            fetch(`https://jsonplaceholder.typicode.com/posts`)
                .then(response => {

                    if (response.ok) return response.json(); // Если запрос прошел верно, преобразуем ответ сервера в json

                }, error => alert(error)) // Обработка ошибки
                .then(json =>  {

                    postsStorage = postsStorage.map(Number);
                    let posts = json.filter(item => postsStorage.indexOf(item.id) !== -1);
                    posts.forEach( item => {
                        setElem(item, 'right-posts', function(){

                            this.HTMLElem.querySelector('.post-item__btn-remove').onclick = () =>{
                                rightPosts.removePost(this);
                            };

                            rightPosts.HTMLBox.append(this.HTMLElem);
                            rightPosts.postsArr.push(this);
                        });
                    });

                })
    },
    removePost(postItem){ // Удаляет пост из localStorage, DOM и массива.
        let elem  = postItem.HTMLElem;
        localStorage.removeItem(postItem.id);
        let findPost = this.postsArr.find(item => item.id === postItem.id);
        elem.classList.remove('active');

        setTimeout(()=>{
            this.HTMLBox.removeChild(postItem.HTMLElem);
        },300);

        this.postsArr.splice(this.postsArr.indexOf(findPost),1);
    }

};

function PostItem(post){ // создает объект PostItem.
    this.HTMLElem = null;
    this.userId = post["userId"];
    this.id = post["id"];
    this.title = post["title"];
    this.body = post["body"];

    Object.defineProperty(this, "HTML", {
        set(value){
            value.querySelector('.post-item__postID-title').innerText = this.id;
            value.querySelector('.post-item__title').innerText = this.title;
            value.querySelector('.post-item__body').innerText = this.body;
            this.HTMLElem = value.querySelector('.post-item-size');
            setTimeout(()=>{
                this.HTMLElem.classList.add('active');
            },300)
        }
    });
}

function setElem(post, template, fn){ // Создает новый объект PostItem для дальнейшего добавления в DOM и взвращает созданный элемент для добавления в массив вызвавшего его объекта.
    let postItem = new PostItem(post);
    postItem.HTML = document.getElementById(template).content.cloneNode(true);
    fn.call(postItem);
}

function sortLocalStorage(a,b){ // Сортировка массива из LocalStorage
    if (+a < +b){
        return 1;
    }
    else if (+a > +b) {
        return -1;
    }
    return 0;
}

document.querySelector('#left-posts-box').addEventListener('scroll', function () {
    let currentScrollBottom = (this.scrollTop+this.offsetHeight)+2;
    if (currentScrollBottom > this.scrollHeight){
        leftPosts.showMoreBtn.removeAttribute("disabled");
    } else {
        leftPosts.showMoreBtn.setAttribute("disabled", "");
    }
});

leftPosts.showMoreBtn.addEventListener('click', function () {
    leftPosts.load(10);
    leftPosts.showMoreBtn.setAttribute("disabled", "");
});

leftPosts.load(10);
rightPosts.load();