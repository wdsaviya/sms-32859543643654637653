const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
let code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;
app.use('/code', code);

app.use('/error',async (req, res, next) => {
res.sendFile(__path + '/error.html')
})

app.use('/pair',async (req, res, next) => {
res.sendFile(__path + '/pair.html')
})

app.use('/movie-visper-pair',async (req, res, next) => {
res.sendFile(__path + '/visper-pair.html')
})

app.use('/',async (req, res, next) => {
res.sendFile(__path + '/main.html')
})

app.use('/server-statics',async (req, res, next) => {
res.sendFile(__path + '/server-details.html')
})

let serverLogs = [];

const originalConsoleLog = console.log;
console.log = (...args) => {
    const logMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
    serverLogs.push(`[${new Date().toISOString()}] ${logMessage}`);
    originalConsoleLog.apply(console, args); 
};

function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`;
}

app.get('/server-details', (req, res) => {
    osUtils.cpuUsage((v) => {
        const cpuSpeedGHz = os.cpus()[0].speed / 1000; 
        const timePerCycleMs = (1 / cpuSpeedGHz) * 1000; 

        const details = {
            ramUsagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%',
            ramUsageSize: ((os.totalmem() - os.freemem()) / (1024 ** 2)).toFixed(2) + ' MB',
            cpuUsage: (v * 100).toFixed(2) + '%',
            cpuBrand: os.cpus()[0].model,
            ramSize: (os.totalmem() / (1024 ** 2)).toFixed(2) + ' MB', 
            uptime: formatUptime(os.uptime()), 
            speed: timePerCycleMs.toFixed(5) + ' ms per cycle',
            cpuSpeed: os.cpus()[0].speed + ' MHz',
            os: os.platform() + ' ' + os.release()
        };
        res.json(details);
    });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => {
    console.log(`💗 Server running on http://localhost:` + PORT)
})

module.exports = app
