const fs = require('fs');
const readline = require('readline');
async function task01() {
    const rl = readline.createInterface({
        input: fs.createReadStream('sem_02_labrab_01.csv')
    });
    const result = [];
    let lineNum = 1;
    for await (const line of rl) {
        if (!line.trim()) { lineNum++; continue; }
        const nums = line.trim().split(' ').map(Number);
        const allOdd = nums.every(n => n % 2);
        const allDistinct = new Set(nums).size === nums.length;
        const isSorted = nums.every((n, i) => i === 0 || n > nums[i-1]);
        if (allOdd && allDistinct && isSorted) result.push(lineNum);
        lineNum++;
    }
    console.log(result.length ? result.join(' ') : '');
}
task01();