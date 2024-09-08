const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;


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


