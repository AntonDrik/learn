"use strict";

let currentPostIndex = 1;

const leftPosts = { // Объект левого блока с постами. Методы: загрузка постов, добавление поста в сохраненные.
    HTMLBox: document.querySelector('#left-posts-box'),
    showMoreBtn: document.querySelector('.content-left__btn-showmore'),
    postsArr: [], // Массив с текущими поставми в левом блоке.

    load(maxIndex){ // Рекурсивный метод который выгружает посты с сервера и вставляет в левый блок. Принимает количество постов для выгрузки,
                    // начальный пост рекурсивно увеличивается на один, для последующей выгрузки постов начиная с последней позиции.
                    // Начальный пост находится в глобальной переменной. Возможно неправильный подход.
        if (currentPostIndex <= maxIndex){ // Рекурсия работает до тех пор, пока текущий пост меньше максимального кол-ва постов.
            fetch(`https://jsonplaceholder.typicode.com/posts/${currentPostIndex}`)
                .then(response => {
                    if (response.ok){ // Если запрос прошел верно, преобразуем ответ сервера в json
                        return response.json();
                    }
                    else if (response.status === 404) alert('posts ended'); // Если посты закончились выводим ошибку об этом
                })
                .then(json =>  {
                    currentPostIndex+=1; // Увеличиваем начальный пост на один
                    this.load(maxIndex); // Повторно вызываем функцию
                    this.postsArr.push(pushElem(json, 'left')); // Создаем объект PostItem на основе response сервера и заносим его в массив с постами левого блока
                });
        }

    },
    addPost(post){ // Добавляет пост в правый блок. Возможно стоит перенести этот метод в объект с правым блоком.
        let findPost = rightPosts.postsArr.find( (item) => item.id === post.id); // Смторим есть ли в правом блоке добавляемый пост
        if (typeof findPost === 'undefined'){ // Если добавляемый пост уже есть то ничего не делаем, иначе - добавляем
            localStorage.setItem(post.id, post.id);
            rightPosts.postsArr.push(pushElem(post, 'right'));
        }
    }
};

const rightPosts = { // объект правого блока с сохраненными постами. Методы: загрузка постов из localStorage, удаление поста и сохраненных
    HTMLBox: document.querySelector('#right-posts-box'),
    postsArr: [],

    load(postsStorage = Object.values(localStorage).sort(sortlocalstorage), i = postsStorage.length-1){ // Рекурсивно добавляем посты в правый блок.
                                                                                                        // Посты берутся на основе сохраненных ID в localStorage.
                                                                                                        // Принимает остортированный массив с ID поста из LocalStorage
                                                                                                        // и рекурсивно понижающийся элемент этого массива
        if (i >= 0){
            fetch(`https://jsonplaceholder.typicode.com/posts/${postsStorage[i]}`)
                .then(response => response.json())
                .then(json =>  {
                    console.log(json);
                    this.postsArr.push(pushElem(json, 'right'));
                    this.load(postsStorage, i-1);
                });
        }
    },
    removePost(id){ // Удаляет пост из localStorage, DOM и массива.
        localStorage.removeItem(id);
        let findPost = this.postsArr.find( (item) => item.id === id);
        findPost.HTMLElem.classList.remove('active');
        setTimeout(()=>{
            this.HTMLBox.removeChild(findPost.HTMLElem);
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

function pushElem(post, element){ // Создает новый объект PostItem для дальнейшего добавления в DOM и взвращает созданный элемент для добавления в массив вызвавшего его объекта.
                                  // Вешает обработчики события на кнопки, в зависимости от вызова функции
                                  // Возможно неправильно реализована функция. Некрасивое условие. Дублируется код.
    let postItem = new PostItem(post);
    postItem.setHTMLElem(element);
    let btn;
    if (element === 'left'){
        btn = postItem.HTMLElem.querySelector('.post-item__btn-add');
        btn.onclick = function(){
            leftPosts.addPost(postItem);
        };
        leftPosts.HTMLBox.append(postItem.HTMLElem);
    } else {
        btn = postItem.HTMLElem.querySelector('.post-item__btn-remove');
        btn.onclick = function(){
            rightPosts.removePost(postItem.id);
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
    let HTMLElemClass, HTMLBtnClass, HTMLBtnText;
    if (itemType === 'left'){
        HTMLElemClass = 'content-left__post-item';
        HTMLBtnClass = 'post-item__btn-add';
        HTMLBtnText = 'Add to favorites';
    } else {
        HTMLElemClass = 'content-right__post-item';
        HTMLBtnClass = 'post-item__btn-remove';
        HTMLBtnText = 'Remove from favorites';
    }
    let HTMLWrapper = document.createElement('div');
    let HTMLPostID = document.createElement('h6');
    let HTMLTitle = document.createElement('h4');
    let HTMLBody = document.createElement('article');
    let HTMLBtn = document.createElement('button');
    HTMLWrapper.classList.add('post-item__wrapper');
    this.HTMLElem.className = `${HTMLElemClass} post-item-size`;
    HTMLPostID.classList.add('post-item__postID-title');
    HTMLTitle.classList.add('post-item__title');
    HTMLBody.classList.add('post-item__body');
    HTMLBtn.className = `${HTMLBtnClass} btn__theme-standart btn`;
    HTMLBtn.innerText = HTMLBtnText;
    HTMLPostID.innerHTML = this.id;
    HTMLTitle.innerText = this.title;
    HTMLBody.innerText = this.body;
    HTMLWrapper.append(HTMLPostID, HTMLTitle, HTMLBody, HTMLBtn);
    this.HTMLElem.append(HTMLWrapper);
    setTimeout( () =>{
        this.HTMLElem.classList.add('active');
    }, 300)
};

document.querySelector('#left-posts-box').addEventListener('scroll', function () {
    let currentScrollBottom = this.scrollTop+this.offsetHeight;
    if (this.scrollHeight === currentScrollBottom){
        leftPosts.showMoreBtn.removeAttribute("disabled");
    } else {
        leftPosts.showMoreBtn.setAttribute("disabled", "");
    }
});

leftPosts.showMoreBtn.addEventListener('click', function () {
    leftPosts.load(currentPostIndex+9);
});


leftPosts.load(10);
leftPosts.showMoreBtn.setAttribute("disabled", "");
rightPosts.load();
