const http = require('http');
const { execFile } = require('child_process');
const { readDataCsv } = require('./moduleReadData');
const fs = require('fs');
const HOST = 'localhost';
const PORT = 3000;
const onEvent = (req, res) => {
    const params = req.url.split('/').filter(Boolean);
    const endpoint = params[0] || '';

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    let num = null;
    if (/^\d+$/.test(endpoint)) {
        num = parseInt(endpoint);
    } else if (endpoint.endsWith('.js') && /^\d+$/.test(endpoint.slice(0, -3))) {
        num = parseInt(endpoint.slice(0, -3));
    }

    if (num !== null) {
        const csvFile = `./files/data${num}.csv`;
        if (!fs.existsSync(csvFile)) {
            res.end(`<h2>Ошибка: файл ${csvFile} не найден.</h2>`);
            return;
        }
        if (!fs.existsSync('./1.js')) {
            res.end('<h2>Ошибка: файл 1.js не найден в корневой директории.</h2>');
            return;
        }
        let csvData;
        try {
            csvData = readDataCsv(csvFile);
        } catch (err) {
            res.end(`<h2>Ошибка чтения CSV (${csvFile}):</h2><pre>${err.message}</pre>`);
            return;
        }
        execFile('node', ['./1.js', ...csvData.map(String)], (error, stdout, stderr) => {
            if (error) {
                res.write('<h2>Ошибка запуска 1.js:</h2><pre>' + error.message + '</pre>');
                if (stderr) res.write('<h2>Stderr:</h2><pre>' + stderr + '</pre>');
                res.end();
                return;
            }
            res.end(`<h2>Таблица отклонений (сгенерирована 1.js на основе ${csvFile}):</h2>${stdout}`);
        });
        return;
    }

    if (params.length > 0 && params[0] !== 'favicon.ico' && params[0].endsWith('.csv')) {
        const filename = params[0];
        try {
            const data = readDataCsv(`./files/${filename}`);
            res.end('<h2>Данные из CSV (' + filename + '):</h2>' +
                data.map((num, idx) => `${idx + 1}: ${num}`).join('<br>') +
                '<br>===== Конец данных =====');
        } catch (err) {
            res.end('<h2>Ошибка чтения CSV:</h2><pre>' + err.message + '</pre>');
        }
        return;
    }
    res.end('<h2>Параметры запроса:</h2>' +
        params.map((elm, ind) => `${ind}: ${elm}`).join('<br>') +
        '<br>===== Конец параметров =====');
};

const server = http.createServer(onEvent);

server.listen(PORT, () => {
    console.log(`Сервер запущен: http://${HOST}:${PORT}/`);
    console.log('Примеры запросов:');
    console.log('  - Таблица отклонений для data1.csv: http://localhost:3000/1');
    console.log('  - Таблица отклонений для data2.csv: http://localhost:3000/2');
    console.log('  - CSV: http://localhost:3000/data_1.csv');
});