require(['SimplePolation'], function (x) {

    'use strict';
    //const SimplePolationInstance = require('SimplePolationInstance');

    const SimplePolationInstance = x.SimplePolationInstance;
    var sp = new SimplePolationInstance();
    document.datakokos = {
        timeNow: new Date(),
        randomColor: '#1244AA',
        fontSize: '25px',
        stack: {
            inputValue: 155,
        }
    };
    sp.run(document.datakokos); 
})