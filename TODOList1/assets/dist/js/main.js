var btnAdd = document.getElementById("add");
var mainInput = document.getElementById("main-input");

var TODOList = [];

mainInput.addEventListener("keyup", function () {

    if (this.value==""){
        btnAdd.disabled = true;
    } else {
        btnAdd.disabled = false;
    }

});

btnAdd.addEventListener("click", function () {

    var TODOEditBox = document.getElementById("edit-task");
    if (TODOEditBox.classList.contains("toggle")){
        TODOEditBox.removeClass("toggle");
    }
    else {
        TODOEditBox.removeClass("");
    }

    TODOList.push({

    })

});