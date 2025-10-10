const request = require('request');

const urls = {
    '1': 'http://pcoding-ru.1gb.ru/txt/labrab04-1.txt',
    '2': 'http://pcoding-ru.1gb.ru/txt/labrab04-2.txt',
    '3': 'http://pcoding-ru.1gb.ru/txt/labrab04-2.txt',
    '4': 'http://pcoding-ru.1gb.ru/txt/labrab04-3.txt',
    '5': 'http://pcoding-ru.1gb.ru/txt/labrab04-3.txt'
};

// Задание 1: Максимальное двузначное число
function task1(lines) {
    let maxTwoDigit = -1;
    for (let line of lines) {
        let num = parseInt(line.trim());
        if (num >= 10 && num <= 99 && num > maxTwoDigit) {
            maxTwoDigit = num;
        }
    }
    return `Максимальное двузначное число: ${maxTwoDigit}`;
}

// Задание 2: Количество строк, где все числа нечётные
function task2(lines) {
    let count = 0;
    for (let line of lines) {
        let nums = line.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
        if (nums.length > 0 && nums.every(n => n % 2 !== 0)) {
            count++;
        }
    }
    return `Количество строк, где все числа нечётные: ${count}`;
}

// Задание 3: Номер строки с максимальной суммой нечётных
function task3(lines) {
    let maxSum = -1;
    let maxLineIndex = -1;
    let index = 1;
    for (let line of lines) {
        let nums = line.trim().split(/\s+/).map(Number);
        let sumOdd = nums.filter(n => n % 2 !== 0).reduce((a, b) => a + b, 0);
        if (sumOdd > maxSum) {
            maxSum = sumOdd;
            maxLineIndex = index;
        }
        index++;
    }
    return `Номер строки с максимальной суммой нечётных: ${maxLineIndex}`;
}

// Задание 4: Языки по алфавиту
function task4(lines) {
    const langs = lines.map(line => line.split(';')[1]).filter(lang => lang && lang.trim());
    langs.sort((a, b) => a.localeCompare(b));
    return 'Список языков в алфавитном порядке:\n' + langs.join('\n');
}

// Задание 5: Языки по рейтингу убывания
function task5(lines) {
    const data = lines.map(line => {
        const [ratingStr, lang] = line.split(';');
        const rating = parseFloat(ratingStr.replace(',', '.').replace('%', ''));
        return { lang: lang.trim(), rating };
    }).filter(item => item.lang);
    data.sort((a, b) => b.rating - a.rating);
    return 'Список языков по убыванию рейтинга:\n' +
        data.map(d => `${d.rating.toFixed(2)}% — ${d.lang}`).join('\n');
}

function solveTask(taskIndex, lines) {
    switch (taskIndex) {
        case '1': return task1(lines);
        case '2': return task2(lines);
        case '3': return task3(lines);
        case '4': return task4(lines);
        case '5': return task5(lines);
        default: return 'Invalid task number';
    }
}

let taskIndex = '5'; //здесь менять номер задачи нужно 1-5 и Ctrl+S

let url = urls[taskIndex];
if (!url) {
    console.log('Invalid task number');
} else {
    request(url, (error, response, body) => {
        if (error) {
            console.log('Error loading data:', error.message);
            return;
        }
        if (response.statusCode !== 200) {
            console.log('Request failed with status:', response.statusCode);
            return;
        }
        let lines = body.split('\n');
        let result = solveTask(taskIndex, lines);
        console.log(result);
    });
}  //Для запуска в теминале node solver_1_request.js