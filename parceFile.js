const XLSX = require('xlsx')
const fs = require('fs');

const nextChar = (c, d = null) => {
    return String.fromCharCode(c.charCodeAt(0) + (d || 1));
}

const saveFiles = (outputLocation = "./") => {
    fs.writeFile(
        outputLocation,
        JSON.stringify(output, null, 4),
        'utf-8',
        (err) => {
            if(err)
                throw err;
        }
    )
}

const read = (inputFile) => {
    let output = []
    const workbook = XLSX.readFile(inputFile);
    let sheet = workbook.Sheets[workbook.SheetNames[0]];

    let ref = sheet['!ref'].split(':');
    let first = ref[0];
    let last = ref[1];

    let firstRow = parseInt(first.slice(first.match(/\d/).index))
    let firstComumn = first.slice(0,first.match(/\d/).index);
    let lastRow = parseInt(last.slice(last.match(/\d/).index))
    let lastColumn = last.slice(0,last.match(/\d/).index);

    let column = firstComumn;
    keys = []

    while(true) {
        let key = sheet[`${column}${firstRow}`]
        console.log(key)
        if(key) {
            keys.push({
                column,
                key:key.v,
            })
            column = nextChar(column)
        } else {
            break
        }
    }
    console.log(keys)

    for(let r = (firstRow + 1); r < lastRow; r++)
    {
        let person = {

        }
        keys.forEach(({key, column}) => {
            let value = sheet[`${column}${r}`];
            if(value){
                person[key.toLowerCase()] = value.v
            }
        })
        
        output.push(person)
    }

    return output
}


module.exports = read;
//read("data.xlsx", "data.json")