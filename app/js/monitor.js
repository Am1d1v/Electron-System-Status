const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// Update CPU Data every 1 seconds
setInterval(() => {
    // CPU Usage
    cpu.usage().then(info => {
        document.querySelector('#cpu-usage').innerText = info + '%';
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


