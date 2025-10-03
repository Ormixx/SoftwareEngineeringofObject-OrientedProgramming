const digits = 10;
const idealPercent = 10;

function getRandomInt() {
    return Math.floor(Math.random() * digits);
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Ошибка: не переданы данные для steps');
    process.exit(1);
}

const steps = args.map(str => Number(str));
if (steps.some(isNaN)) {
    console.error('Ошибка: аргументы должны быть числами');
    process.exit(1);
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
    return num.toFixed(2);
}

let html = '<table border="1" style="border-collapse: collapse; width: 100%; font-family: monospace;">';

html += '<tr><th>i</th>';
for (let step of steps) {
    html += `<th>${step}</th>`;
}
html += '</tr>';

for (let i = 0; i < digits; i++) {
    html += `<tr><td>${i}</td>`;
    for (let deviations of deviationsArray) {
        html += `<td>${formatNumber(deviations[i])}</td>`;
    }
    html += '</tr>';
}

html += '</table>';
console.log(html);