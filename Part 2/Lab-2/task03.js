const fs = require('fs');
const readline = require('readline');
async function task03() {
    const rl = readline.createInterface({
        input: fs.createReadStream('sem_02_labrab_01.csv')
    });
    let lineNum = 1;
    for await (const line of rl) {
        const nums = line.trim().split(' ').map(Number);
        const freq = new Map();
        for (const n of nums) {
            freq.set(n, (freq.get(n) || 0) + 1);
        }
        const doubles = [];
        const others = [];

        for (const [num, count] of freq) {
            if (count === 2) doubles.push(num);
            else if (count === 1) others.push(num);
        }
        
        if (doubles.length === 2 && others.length === 2) {
            const sumDoubles = doubles[0] + doubles[1];
            const sumOthers = others[0] + others[1];
            if (sumDoubles < sumOthers) {
                console.log(lineNum + ': ' + line);
            }
        }
        lineNum++;
    }
}
task03();