const fs = require('fs');
const readline = require('readline');
async function task02() {
    const rl = readline.createInterface({
        input: fs.createReadStream('sem_02_labrab_01.csv')
    });
    let lineNum = 1;
    for await (const line of rl) {
        if (!line.trim()) { lineNum++; continue; }
        const nums = line.trim().split(' ').map(Number);
        const freq = {};
        for (const n of nums) freq[n] = (freq[n] || 0) + 1;
        const entries = Object.entries(freq);
        const triple = entries.find(([_, count]) => count === 3);
        if (triple) {
            const tripleNum = Number(triple[0]);
            const others = nums.filter(n => n !== tripleNum);
            if (others.length === 3) {
                const avg = others.reduce((a, b) => a + b, 0) / 3;
                if (tripleNum > avg) {
                    console.log(`${lineNum}: ${nums.join(' ')}`);
                }
            }
        }
        lineNum++;
    }
}
task02();