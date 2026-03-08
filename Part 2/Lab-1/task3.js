const fs = require('fs');
const data = fs.readFileSync('task_03.txt', 'utf8');
const numbers = data.match(/[0-9A-F]+/g)
    .map(s => s.replace(/^0+/, ''))
    .filter(s => s && '02468ACE'.includes(s[s.length-1]));
const maxLen = Math.max(...numbers.map(s => s.length));
const maxNum = numbers.filter(s => s.length === maxLen)
    .reduce((max, s) => parseInt(s, 16) > parseInt(max, 16) ? s : max);
console.log(maxNum);