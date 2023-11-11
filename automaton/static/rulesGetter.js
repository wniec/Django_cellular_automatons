function getRules(){
    let rulesList = []
    const table = document.querySelector('form').querySelector('table');
    const trs = table.querySelector('tbody').querySelectorAll('tr');
    for(let row = 1; row<trs.length; row++){
        let tr = trs[row]
        let tds = tr.querySelectorAll('td')
        for(let col = 0; col<tds.length; col++){
            let td = tds[col]
            if(td.querySelector(':checked') !== null){
                rulesList.push([col, row-1])
            }
        }
    }
    return rulesList
}

    function getMaxVal(){
        return eval(document.getElementById("maxVal").value)
}