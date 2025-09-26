const http = require('http');
const { exec } = require('child_process');  //запуск 1.js
const { readDataCsv } = require('./moduleReadData');
const [HOST, PORT] = ['localhost', 3000];

const onEvent = (req, res) => {
    let params = req.url.split('/').filter(p => p);
    let endpoint = params[0] || '';

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    switch (endpoint) {
        case '1':
        case '1.js':
            exec('node 1.js', (error, stdout, stderr) => {
                if (error) {
                    res.write('<h2>Ошибка при запуске 1.js:</h2><pre>' + (stderr || error.message) + '</pre>');
                    res.end();
                    return;
                }
                res.write('<h2>Результат выполнения 1.js (таблица отклонений):</h2>');
                res.write('<pre style="font-family: monospace; white-space: pre;">' + stdout + '</pre>');
                res.write('<br>===== Результат сгенерирован динамически (random) =====');
                res.end();
            });
            return;

        default:
            if (params.length > 0 && params[0] !== 'favicon.ico' && params[0].endsWith('.csv')) {
                let filename = params[0];
                try {
                    let data = readDataCsv(`./files/${filename}`);
                    res.write(
                        data
                            .map(num => String(num))
                            .join('<br>')
                    );
                    res.write('<br>===== Данные из CSV =====');
                } catch (err) {
                    res.write('<h2>Ошибка чтения CSV:</h2><pre>' + err.message + '</pre>');
                }
            } else {
                res.write(
                    params
                        .map((elm, ind) => `${ind} ${elm}`)
                        .join('<br>')
                );
                res.write('<br>===== Параметры запроса =====');
            }
            res.end();
            break;
    }
};

const server = http.createServer(onEvent);

server.listen(PORT, () => {
    console.log(`http://${HOST}:${PORT}/`);
    console.log('Примеры запросов:');
    console.log('  - CSV: http://localhost:3000/data_1.csv');
    console.log('  - Ваш скрипт: http://localhost:3000/1');
});