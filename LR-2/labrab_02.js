const http = require('http');  // commonJS
const { readDataCsv } = require('./moduleReadData');
const [ HOST, PORT ] = [ 'localhost', 3000 ];

const onEvent = (req, res) => {     // http://localhost:3000/filename
    let params = req.url.split('/');
    if ((params.length > 1) && (params.at(-1) != 'favicon.ico')) {
        let filename = params.at(-1);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(
            readDataCsv(`./files/${filename}`)
                .map(num => String(num))
                .join('<br>')
    
            // вывод двумерной таблицы с результатами испытаний RND
            // array.forEach()
        );
        res.write('<br> = = = = = =');    
    }
    res.end();
}

const server = http.createServer(onEvent);

server.listen(PORT, () => console.log(`http://${HOST}:${PORT}/`));
// Ctrl+C to stop
// try

