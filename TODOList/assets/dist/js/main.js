let btnAdd = document.getElementById("add");
let mainInput = document.getElementById("main-input");

const TODOEditTask = {

    toggle: function(){
        if (this.EditBox.classList.contains("toggle")){
            this.EditBox.classList.remove('toggle');
        } else {
            this.EditBox.classList.add('toggle');
        }
    },

    save: function(){
        if(this.EditInput.value!==""){
            this.TODOText.children[0].innerHTML = this.EditInput.value;
            this.toggle();
        } else{
            this.EditInput.setAttribute('placeholder', 'Введите текст!');
        }
    },

    edit: function(){
        this.EditBox.children[0].value = this.TODOText.children[0].innerHTML;
        this.toggle();

    }
};

Object.defineProperty(TODOEditTask, "TODOListItem", {
    set: function (value){
        this.elem = value;
        this.TODOText = this.elem.children[0];
        this.EditBox = this.elem.children[1];
}
});

function createDom(tag, className, value){
    let tmp = document.createElement(tag);
    tmp.className = className;
    if (value) tmp.innerHTML = value;
    return tmp;
}

function appendDom(parent, child1, child2){
    if (child1) parent.append(child1);
    if (child2) parent.append(child2);
}

function clickEvent(elem){
    elem.onclick = function(event){
        let target = event.target;
        if (target.tagName === 'BUTTON'){

            TODOEditTask.TODOListItem = target.closest('.TODO__list-item');

            if (target.className.split(" ")[0] === 'TODO__btn-delete'){
                target.closest('.TODO__list-item').remove();
            }
            if (target.className.split(" ")[0] === 'TODO__btn-edit'){
                TODOEditTask.EditInput = target.previousElementSibling;
                TODOEditTask.edit();
            }
            if (target.className.split(" ")[0] === 'TODO__btn-save'){
                TODOEditTask.EditInput = target.previousElementSibling;
                TODOEditTask. save();
            }
        }
    }
}

function createTODOElem(TaskText){
    let TODOList = document.getElementById('list');
        let TODOListItem = createDom('div', 'TODO__list-item hidden');
            let TODOTask = createDom('div', 'TODO__task');
                let TODOText = createDom('span', 'TODO__text', TaskText);
                let TODOBtnBlock = createDom('div', 'TODO__btn-block');
                    let TODOBtnDel = createDom('button', 'TODO__btn-delete TODO__btn-size btn', 'del');
                    let TODOBtnEdit = createDom('button', 'TODO__btn-edit TODO__btn-size btn', 'edit');
                appendDom(TODOBtnBlock, TODOBtnDel, TODOBtnEdit);
            appendDom(TODOTask, TODOText, TODOBtnBlock);

            let TODOEditTask = createDom('div', 'TODO__edit-task');
                let TODOEditInput = createDom('input', 'TODO__edit-input');
                let TODOBtnSave = createDom('button', 'TODO__btn-save', 'save');
            appendDom(TODOEditTask, TODOEditInput, TODOBtnSave);
        appendDom(TODOListItem, TODOTask, TODOEditTask);
        clickEvent(TODOListItem);
    TODOList.prepend(TODOListItem);
    setTimeout(function(){
        TODOListItem.classList.remove('hidden');
    }, 150);
}

mainInput.addEventListener("keyup", function () {

    if (this.value === ""){
        btnAdd.disabled = true;
    } else {
        btnAdd.disabled = false;
    }

});

btnAdd.addEventListener("click", function () {
    let TaskText = document.getElementById('main-input').value;
    createTODOElem(TaskText);
});
