let json = `
    { 
        "a": 1, 
        "b":   { "c": 2, "d": 3 }, 
        "e": 4, 
        "fff":{ "v": 10 } 
    };`;
const objectFields = [...json.matchAll(/"(\w+)"\s*:\s*(\{[^{}]*\})/g)];
const valuesOnly = objectFields.map(match => match[2]); //значения полей
console.log(valuesOnly);
const keysOnly = objectFields.map(match => match[1]); //имена полей
console.log(keysOnly);
const pairsArray = objectFields.map(match => [match[1], match[2]]); //массив пар
console.log(pairsArray);