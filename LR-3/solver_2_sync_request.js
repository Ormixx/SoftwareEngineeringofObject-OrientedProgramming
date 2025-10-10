const request = require('sync-request');

const urls = {
    1: 'http://pcoding-ru.1gb.ru/txt/labrab04-1.txt',
    2: 'http://pcoding-ru.1gb.ru/txt/labrab04-2.txt',
    3: 'http://pcoding-ru.1gb.ru/txt/labrab04-2.txt',
    4: 'http://pcoding-ru.1gb.ru/txt/labrab04-3.txt',
    5: 'http://pcoding-ru.1gb.ru/txt/labrab04-3.txt'
};

// Задание 1: Максимальное двузначное число
function task1() {
    const res = request('GET', urls[1]);
    const text = res.getBody('utf8');
    const numbers = text.split(/\s+/).map(Number).filter(n => !isNaN(n));
    const maxTwoDigit = Math.max(...numbers.filter(n => n >= 10 && n <= 99));
    return `Максимальное двузначное число: ${maxTwoDigit}`;
}

// Задание 2: Количество строк, где все числа нечётные
function task2() {
    const res = request('GET', urls[2]);
    const lines = res.getBody('utf8').trim().split('\n');
    let count = 0;
    lines.forEach(line => {
        const nums = line.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
        if (nums.length > 0 && nums.every(n => n % 2 !== 0)) count++;
    });
    return `Количество строк, где все числа нечётные: ${count}`;
}

// Задание 3: Номер строки с максимальной суммой нечётных
function task3() {
    const res = request('GET', urls[3]);
    const lines = res.getBody('utf8').trim().split('\n');
    let maxSum = -Infinity;
    let maxIndex = -1;
    lines.forEach((line, idx) => {
        const nums = line.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
        const sumOdd = nums.filter(n => n % 2 !== 0).reduce((a, b) => a + b, 0);
        if (sumOdd > maxSum) {
            maxSum = sumOdd;
            maxIndex = idx + 1;
        }
    });
    return `Номер строки с максимальной суммой нечётных чисел: ${maxIndex}`;
}

// Задание 4: Языки по алфавиту
function task4() {
    const res = request('GET', urls[4]);
    const lines = res.getBody('utf8').trim().split('\n');
    const langs = lines.map(line => line.split(';')[1]).filter(lang => lang && lang.trim());
    langs.sort((a, b) => a.localeCompare(b));
    return 'Список языков в алфавитном порядке:\n' + langs.join('\n');
}

// Задание 5: Языки по рейтингу убывания
function task5() {
    const res = request('GET', urls[5]);
    const lines = res.getBody('utf8').trim().split('\n');
    const data = lines.map(line => {
        const [ratingStr, lang] = line.split(';');
        const rating = parseFloat(ratingStr.replace(',', '.').replace('%', ''));
        return { lang: lang.trim(), rating };
    }).filter(item => item.lang);
    data.sort((a, b) => b.rating - a.rating);
    return 'Список языков по убыванию рейтинга:\n' +
        data.map(d => `${d.rating.toFixed(2)}% — ${d.lang}`).join('\n');
}

console.log('Результаты заданий:\n');
console.log('Задание 1:', task1());
console.log('\nЗадание 2:', task2());
console.log('\nЗадание 3:', task3());
console.log('\nЗадание 4:', task4());
console.log('\nЗадание 5:', task5()); //Для запуска в теминале node solver_2_sync_request.js