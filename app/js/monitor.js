const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// Update CPU Data every 2 seconds
setInterval(() => {
    // CPU Usage
    cpu.usage().then(info => {
        document.querySelector('#cpu-usage').innerText = info + '%';
    });
}, 2000);

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


