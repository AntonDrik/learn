// class localStorage {
//     constructor(){
//
//     }
//
// }
//
// class LeftPosts {
//     constructor(){
//         this.HTMLBox = document.querySelector('#left-posts-box');
//         this.postArr = [];
//     }
//     loadPosts(){
//         for (let i = 1; i < 11; i++){
//             fetch(`https://jsonplaceholder.typicode.com/posts/${i}`)
//                 .then(response => response.json())
//                 .then(json =>  {
//                     let postItem = new PostItem(json);
//                     let btn = postItem.HTMLElem.querySelector('.post-item__btn-add');
//                     btn.onclick = function(){
//
//                     };
//                     this.HTMLBox.append(postItem.HTMLElem);
//                     this.postArr.push(postItem);
//                 });
//         }
//     }
// }
//
// class RightPosts{
//     constructor(){
//
//     }
//
//
//
// }

const leftPosts = {
    HTMLBox: document.querySelector('#left-posts-box'),
    postArr: [],

    loadPosts(){
        for (let i = 1; i < 11; i++){
            fetch(`https://jsonplaceholder.typicode.com/posts/${i}`)
                .then(response => response.json())
                .then(json =>  {
                    let postItem = new PostItem(json);
                    postItem.setHTMLElem('left');
                    let btn = postItem.HTMLElem.querySelector('.post-item__btn-add');
                    btn.onclick = function(){
                        postsStorage.addPost(postItem.ID);
                    };
                    this.HTMLBox.append(postItem.HTMLElem);
                    this.postArr.push(postItem);
                });
        }
    }
};

const rightPosts = {
    HTMLBox: document.querySelector('#right-posts-box'),
    postArr: [],

    loadPosts(){
        postsStorage.loadPosts();
    }
};

const postsStorage = {
    loadPosts(){
        rightPosts.postArr.length = 0;
        rightPosts.HTMLBox.innerHTML = "";
        for (let Key in localStorage) {
            if (typeof localStorage[Key] === 'string'){
                fetch(`https://jsonplaceholder.typicode.com/posts/${localStorage[Key]}`)
                    .then(response => response.json())
                    .then(json =>  {
                        let postItem = new PostItem(json);
                        postItem.setHTMLElem('right');
                        let btn = postItem.HTMLElem.querySelector('.post-item__btn-remove');
                        btn.onclick = function(){

                        };
                        rightPosts.HTMLBox.append(postItem.HTMLElem);
                        rightPosts.postArr.push(postItem);
                    });
            }
        }
    },
    addPost(id){
        localStorage.setItem(id, id);
        this.loadPosts();
    },
    removePost(id){
        localStorage.removeItem(id);
        this.loadPosts();
    },
    clearAll(){
        localStorage.clear();
    }
};

function PostItem(json){
    this.HTMLElem = document.createElement('div');
    this.userID = json["userId"];
    this.ID = json["id"];
    this.title = json["title"];
    this.body = json["body"];
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
    let HTMLTitle = document.createElement('h4');
    let HTMLBody = document.createElement('article');
    let HTMLBtn = document.createElement('button');
    this.HTMLElem.className = `${HTMLElemClass} post-item-size`;
    HTMLTitle.classList.add('post-item__title');
    HTMLBody.classList.add('post-item__body');
    HTMLBtn.className = `${HTMLBtnClass} btn__theme-standart btn`;
    HTMLBtn.innerText = HTMLBtnText;
    HTMLTitle.innerText = this.title;
    HTMLBody.innerText = this.body;
    this.HTMLElem.append(HTMLTitle, HTMLBody, HTMLBtn);
};


// class PostItem {
//     constructor(json){
//         this.HTMLElem = document.createElement('div');
//         this.userID = json["userId"];
//         this.ID = json["id"];
//         this.title = json["title"];
//         this.body = json["body"];
//         this.setHTMLElem();
//     }
// }

// let leftPosts = new LeftPosts();
// let rightPosts = new RightPosts();
leftPosts.loadPosts();
rightPosts.loadPosts();
