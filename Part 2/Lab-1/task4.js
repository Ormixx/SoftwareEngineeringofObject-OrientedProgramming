const fs = require('fs');
const html = fs.readFileSync('data/pogoda.html', 'utf8');
function getSunTime(text) {
    const times = [];
    const regex = /Восход:\s*(\d{2}:\d{2})<br>\s*Закат:\s*(\d{2}:\d{2})/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        times.push(`Восход: ${match[1]}  Закат: ${match[2]}`);
    }
    return times;
}
function getDate(text) {
    const dates = [];
    const regex = /<div class="dayweek_date">(\d{2}\s+[а-я]+)<\/div>\s*<div class="dayweek_week">([а-яА-Я]{2})<\/div>/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        dates.push(`${match[1]} ${match[2]}`);
    }
    return dates;
}
const sunTimes = getSunTime(html);
const dates = getDate(html);
for (let i = 0; i < dates.length; i++) {
    console.log(`${dates[i]}  ${sunTimes[i+1]}`);
}