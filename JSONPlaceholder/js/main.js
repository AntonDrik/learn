"use strict";
const leftPosts = { // Объект левого блока с постами. Методы: загрузка постов, добавление поста в сохраненные.
    HTMLBox: document.querySelector('#left-posts-box'),
    showMoreBtn: document.querySelector('.content-left__btn-showmore'),
    currentPostIndex: 0,
    postsArr: [], // Массив с текущими поставми в левом блоке.

    load(count = 10){
        fetch(`https://jsonplaceholder.typicode.com/posts`)
                .then(response => {
                    if (response.ok){ // Если запрос прошел верно, преобразуем ответ сервера в json
                        return response.json();
                    }
                }, error => alert(error))
				.then(json =>  {
					let posts = json.filter( (item, index) => {
						if (index>=this.currentPostIndex && index<this.currentPostIndex+count){
							pushElem(item, 'left-posts');
							return item;
						}
					});
                    if (!posts.length) alert('Посты закончились');
                    else{
                        this.postsArr = this.postsArr.concat(posts);
                        this.currentPostIndex+=count;
                    }
                });
    },
    addPost(post){ // Добавляет пост в правый блок. Возможно стоит перенести этот метод в объект с правым блоком.
        let findPost = rightPosts.postsArr.find( (item) => item.id === post.id); // Смторим есть ли в правом блоке добавляемый пост
        if (typeof findPost === 'undefined'){ // Если добавляемый пост уже есть то ничего не делаем, иначе - добавляем
            localStorage.setItem(post.id, post.id);
            rightPosts.postsArr.push(pushElem(post, 'right-posts'));
        } else {
            alert('Пост уже добавлен в избранное');
        }
    }
};

const rightPosts = { // объект правого блока с сохраненными постами. Методы: загрузка постов из localStorage, удаление поста и сохраненных
    HTMLBox: document.querySelector('#right-posts-box'),
    postsArr: [],

    load(postsStorage = Object.values(localStorage).sort(sortlocalstorage)){
            fetch(`https://jsonplaceholder.typicode.com/posts`)
                .then(response => {
                    if (response.ok){ // Если запрос прошел верно, преобразуем ответ сервера в json
                        return response.json();
                    }
                }, error => alert(error))
                .then(json =>  {
                    postsStorage = postsStorage.map(Number);
                    let posts = json.filter(item => {
                        if (postsStorage.indexOf(item.id) !== -1){
                            pushElem(item, 'right-posts');
                            return item;
                        }
                    });
                    this.postsArr = this.postsArr.concat(posts);
                })
    },
    removePost(id, context){ // Удаляет пост из localStorage, DOM и массива.
        let elem  = context.closest('.content-right__post-item');
        localStorage.removeItem(id);
        let findPost = this.postsArr.find(item => item.id === id);
        elem.classList.remove('active');
        setTimeout(()=>{
            this.HTMLBox.removeChild(elem);
        },300);
        this.postsArr.splice(this.postsArr.indexOf(findPost),1);
    }
};

function sortlocalstorage(a,b){ // Сортировка массива из LocalStorage
    if (+a < +b){
        return 1;
    }
    else if (+a > +b) {
        return -1;
    }
    return 0;
}

function pushElem(post, template){ // Создает новый объект PostItem для дальнейшего добавления в DOM и взвращает созданный элемент для добавления в массив вызвавшего его объекта.
                                  // Вешает обработчики события на кнопки, в зависимости от вызова функции
                                  // Возможно неправильно реализована функция. Некрасивое условие. Дублируется код.
    let postItem = new PostItem(post);
    postItem.setHTMLElem(template);
    if (template === 'left-posts'){
        postItem.HTMLElem.querySelector('.post-item__btn-add').onclick = function(){
            leftPosts.addPost(postItem);
        };
        leftPosts.HTMLBox.append(postItem.HTMLElem);
    } else {
        postItem.HTMLElem.querySelector('.post-item__btn-remove').onclick = function(){
            rightPosts.removePost(postItem.id, this);
        };
        rightPosts.HTMLBox.append(postItem.HTMLElem);
    }
    return postItem;
}

function PostItem(post){ // создает объект PostItem. Метод: создание элемента в DOM
    this.HTMLElem = document.createElement('div');
    this.userId = post["userId"];
    this.id = post["id"];
    this.title = post["title"];
    this.body = post["body"];
}

PostItem.prototype.setHTMLElem = function(itemType){
    // let HTMLElemClass, HTMLBtnClass, HTMLBtnText;
    // if (itemType === 'left'){
        // HTMLElemClass = 'content-left__post-item';
        // HTMLBtnClass = 'post-item__btn-add';
        // HTMLBtnText = 'Add to favorites';
        this.HTMLElem.append(document.getElementById(itemType).content.cloneNode(true));
        // this.HTMLElem.classList.add('active');
    // } else {
        // HTMLElemClass = 'content-right__post-item';
        // HTMLBtnClass = 'post-item__btn-remove';
        // HTMLBtnText = 'Remove from favorites';
    // }
    //
    // let HTMLWrapper = document.createElement('div');
    // let HTMLPostID = document.createElement('h6');
    // let HTMLTitle = document.createElement('h4');
    // let HTMLBody = document.createElement('article');
    // let HTMLBtn = document.createElement('button');
    //
    // HTMLWrapper.classList.add('post-item__wrapper');
    // this.HTMLElem.className = `${HTMLElemClass} post-item-size`;
    // HTMLPostID.classList.add('post-item__postID-title');
    // HTMLTitle.classList.add('post-item__title');
    // HTMLBody.classList.add('post-item__body');
    // HTMLBtn.classList.add(HTMLBtnClass, "btn__theme-standart", "btn");
    //
    // HTMLBtn.innerText = HTMLBtnText;
    // HTMLPostID.innerHTML = this.id;
    // HTMLTitle.innerText = this.title;
    // HTMLBody.innerText = this.body;
    //
    // HTMLWrapper.append(HTMLPostID, HTMLTitle, HTMLBody, HTMLBtn);
    // this.HTMLElem.append(HTMLWrapper);
    // setTimeout( () =>{
    //     this.HTMLElem.classList.add('active');
    // }, 300)
};

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


