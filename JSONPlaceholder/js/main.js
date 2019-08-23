"use strict";
const leftPosts = Object.create(
    {
        load(count = 10){
            fetch(`https://jsonplaceholder.typicode.com/posts?_start=${this.currentPostIndex}&_limit=${count}`)
                .then(response => {
                    if (response.ok){ // Если запрос прошел верно, преобразуем ответ сервера в json
                        return response.json();
                    }
                }, error => alert(error))
				.then(json =>  {
                    if (json.length){
                        json.forEach(item => {
                            setElem(item, 'left-posts', function(){
                                this.HTMLElem.querySelector('.post-item__btn-add').onclick = () =>{
                                    leftPosts.addPostToFavorites(this);
                                };
                                leftPosts.HTMLBox.append(this.HTMLElem);
                            });
                        });
                        this.currentPostIndex+=count;
                    }
                    else {
                        this.showMoreBtn.dataset.end = "true";
                        leftPosts.showMoreBtn.setAttribute("disabled", "");
                    }
                });
        },
        addPostToFavorites(postItem){
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
    },
    {
        HTMLBox: {
            value: document.querySelector('#left-posts-box')
        },
        showMoreBtn: {
            value: document.querySelector('.content-left__btn-showmore')
        },
        currentPostIndex: {
            value: 0,
            writable: true
        }
    }
);

const rightPosts = Object.create(
    {
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
    },
    {
        HTMLBox: {
            value: document.querySelector('#right-posts-box')
        },
        postsArr: {
            value: [],
            writable: true
        }
    }
);

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
    if (currentScrollBottom > this.scrollHeight && !leftPosts.showMoreBtn.getAttribute("data-end")){
        leftPosts.showMoreBtn.removeAttribute("disabled");
    } else {
        leftPosts.showMoreBtn.setAttribute("disabled", "");
    }
});

leftPosts.showMoreBtn.addEventListener('click', function () {
    leftPosts.load(10);
    leftPosts.showMoreBtn.setAttribute("disabled", "");
});

leftPosts.load(90);
rightPosts.load();