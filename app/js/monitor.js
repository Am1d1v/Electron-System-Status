const path = require('path');
const osu = require('node-os-utils');
const { Notification } = require('electron');
const electron = require('electron');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// CPU Overload threshold
let cpuOverload = 60;

// CPU Overload Alert frequency in minutes
let alertFrequency = 3;

// Update CPU Data every 1 seconds
setInterval(() => {
    // CPU Usage
    cpu.usage().then(info => {
        document.querySelector('#cpu-usage').innerText = info + '%';

        // CPU Progress bar
        document.querySelector('#cpu-progress').style.width = info + '%';

        // Make progress bar red if overload
        if(info > cpuOverload){
            document.querySelector('#cpu-progress').style.backgroundColor = 'red';
        } else {
            document.querySelector('#cpu-progress').style.backgroundColor = '#30c88b';
        }

        // Check overload
        if(info > cpuOverload && runNotify(alertFrequency)){
            notifyUser({
                title: 'CPU Overload',
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            });

            localStorage.setItem('lastNotify', +new Date());
            console.log(localStorage.getItem('lastNotify'));
        }

    });

    // CPU Free
    cpu.free().then(info => {
        document.querySelector('#cpu-free').innerText = info + '%';
    });

    // System Uptime
    document.querySelector('#sys-uptime').innerText = showSystemTime(os.uptime());


}, 1000);

// Show system time
function showSystemTime(timeInSeconds){
    let seconds = Math.floor(timeInSeconds % 60)
    let minutes = Math.floor((timeInSeconds/60) % 60)
    let hours = Math.floor((timeInSeconds/(60 * 60)) % 60)
    return `Hours: ${hours}, Minutes: ${minutes}, Seconds: ${seconds}`
}

// Set model
document.querySelector('#cpu-model').innerText = cpu.model();

// Set Computer Name
document.querySelector('#comp-name').innerText = os.hostname();

// OS
document.querySelector('#os').innerText = `${os.type()} ${os.arch()}`;

// Total Memory
mem.info().then(info => {
    document.querySelector('#mem-total').innerText = info.totalMemMb;
});

// Send Notification
function notifyUser(options){
   new electron.remote.Notification (options.title, options).show();
};

// Check how much time has passed since notification
function runNotify(frequency){
    if(localStorage.getItem('lastNotify') === null){
        // Store timestamp
        localStorage.setItem('lastNotify', +new Date());
        return true;
    }

    const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
    const now = new Date();
    const diffTime = Math.abs(now - notifyTime)
    const minutesPassed = Math.ceil(diffTime / (1000 * 60));

    if(minutesPassed > frequency) {
        return true;
    } else {
        return false;
    }
};