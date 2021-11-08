const fs = require("fs");
var https = require('https');

var optionsGetCurrencies = {
    host: 'www.nbrb.by',
    path: '/api/exrates/currencies'
};

var today = new Date();
var endDate = today.toISOString().split('T')[0];
var startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];

var path = './files';
!fs.existsSync(path) && fs.mkdirSync(path);

https.get(optionsGetCurrencies, (res) =>
{
    var bodyChunks = [];
    if (res.statusCode == 200)
    {
        res.on('data', (chunk) =>
        {
            bodyChunks.push(chunk);
        }).on('end', () =>
        {
            var body = Buffer.concat(bodyChunks);
            var array = JSON.parse(body);

            for (let i = 0; i < array.length; i++) {
                getRates(array[i].Cur_ID, array[i].Cur_Name);
            }
        });
    }
}).on('error', function (e)
{
    console.log('ERROR: ' + e.message);
});

function getRates(curId, curName)
{
    let options = {
        host: 'www.nbrb.by',
        path: `/API/ExRates/Rates/Dynamics/${curId}?startDate=${startDate}&endDate=${endDate}`
    };

    https.get(options, (res) =>
    {
        var bodyChunks = [];

        if (res.statusCode == 200)
        {
            res.on('data', (chunk) =>
            {
                bodyChunks.push(chunk);
            }).on('end', () =>
            {
                var body = Buffer.concat(bodyChunks);
                var array = JSON.parse(body);

                if (array.length > 0) {
                    var fileName = `${path}/${curName.replace(' ', '_')}_${startDate}-${endDate}.txt`;
                    writeFile(fileName, body);
                }

            });
        }
    }).on('error', (e) =>
    {
        console.log('ERROR: ' + e.message);
    });
}

function writeFile(fileName, data)
{
    fs.writeFile(fileName, data, (err) =>
    {
        if (err)
            throw err;
    });
}