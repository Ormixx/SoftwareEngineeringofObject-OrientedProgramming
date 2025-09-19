const steps = [10*2, 10*4, 10*6, 10*8];
const digits = 10;

function getRandomInt() {
    return Math.floor(Math.random() * digits);
}

const countsArray = [];

for (let step of steps) {
    const counts = new Array(digits).fill(0);

    for (let i = 0; i < step; i++) {
        counts[getRandomInt()]++;
    }

    countsArray.push(counts);
}

for (let i = 0; i < digits; i++) {
    let line = i.toString();

    for (let arr of countsArray) {
        const formatted = arr[i].toFixed(2).replace('.', ',');
        line += ' ' + formatted;
    }

    console.log(line);
}