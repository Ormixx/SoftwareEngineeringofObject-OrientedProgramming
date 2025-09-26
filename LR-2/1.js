const steps = [10 * 2, 10 * 4, 10 * 6, 10 * 8];
const digits = 10;
const idealPercent = 10;

function getRandomInt() {
    return Math.floor(Math.random() * digits);
}

const deviationsArray = [];

for (let step of steps) {
    const counts = new Array(digits).fill(0);
    for (let i = 0; i < step; i++) {
        counts[getRandomInt()]++;
    }

    const deviations = counts.map(c => Math.abs((c / step) * 100 - idealPercent));
    deviationsArray.push(deviations);
}

function formatNumber(num) {
    return num.toFixed(2).replace('.', ',').padStart(7, ' ');
}

let header = 'i'.padStart(3, ' ');
for (let step of steps) {
    let s = step.toExponential().replace('e+', 'e').replace('.', ',');
    header += s.padStart(9, ' ');
}
console.log(header);

for (let i = 0; i < digits; i++) {
    let line = i.toString().padStart(3, ' ');
    for (let deviations of deviationsArray) {
        line += formatNumber(deviations[i]);
    }
    console.log(line);
}