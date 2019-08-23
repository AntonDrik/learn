function Storage(){
    const table = document.getElementById('popup__table');
    const popupMode = document.getElementById('popup__mode');
    function compare(a, b){
        if (a.data.hasOwnProperty('numberLevel')){
            if (a.data.numberLevel === b.data.numberLevel){
                return a.data.score - b.data.score;
            }
            return a.data.numberLevel > b.data.numberLevel ? 1 : -1;
        }
        else {
            return a.data.score - b.data.score;
        }
    }

    function getModeArr(key, isResultList = false){
        const parseKey = key.split('|')[1];
        const rg = new RegExp('('+ parseKey +')', 'i');
        return Object.keys(localStorage).map((key) => {
            if (rg.test(key)){
                return {
                    key: (!isResultList) ? key : key.split('|')[0], 
                    data: JSON.parse(localStorage[key])
                };
            }
        }).filter(item => !!item).sort(compare);
    }

    this.setResult = function(key, data) {       
        let index = Object.keys(localStorage).indexOf(key);
        if (index === -1){
                const modeArr = getModeArr(key);
                if (modeArr.length >= 10) {
                    localStorage.removeItem(modeArr[0].key);
                }
            localStorage.setItem(key, `${JSON.stringify(data)}`);
        }
        else {
            let item = JSON.parse(localStorage.getItem(key));
            if (( item.hasOwnProperty('numberLevel') && data.numberLevel >= item.numberLevel && data.score >= item.score) ||
                (!item.hasOwnProperty('numberLevel') && data.score > item.score)){
                localStorage.setItem(key, `${JSON.stringify(data)}`);
            }
        }
    };
    
    this.getResults = function(mode) {
        const modeArr = getModeArr(`0|${mode}`, true).reverse();
        popupMode.innerHTML = `Режим: ${mode}`;
        if (modeArr.length !== 0){
            table.innerHTML = "";
            //header
            let header = table.createTHead().insertRow();
            header.insertCell().innerHTML = 'Name';
            for (let key in modeArr[0].data){
                header.insertCell().innerHTML = key;
            }
            //body
            let TBody = table.createTBody();
            for (let i = 0; i < modeArr.length; i++){
                let body = TBody.insertRow();
                body.insertCell().innerHTML = modeArr[i].key;
                for (let key in modeArr[i].data){
                    body.insertCell().innerHTML = modeArr[i].data[key];
                }
            }
        }
        else{
            table.innerHTML = "No Results";
        }
    };
}
export const ResultStorage = new Storage();