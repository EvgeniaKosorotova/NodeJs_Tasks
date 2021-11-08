const fs = require("fs");
var https = require('https');

var optionsGetCurrencies = {
    host: 'www.nbrb.by',
    path: '/api/exrates/currencies'
};

var today = new Date();
var endDate = today.toISOString().split('T')[0];
var startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];

var path = './BLR';
!fs.existsSync(path) && fs.mkdirSync(path);
var stream = fs.createWriteStream(`${path}/all_${startDate}-${endDate}.txt`, { flags: 'a' });

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
            let body = Buffer.concat(bodyChunks);
            let array = JSON.parse(body);

            for (let currency of array)
            {
                getRates(currency.Cur_ID);
            }
        })
    }
}).on('error', function (e)
{
    console.log('ERROR: ' + e.message);
});

function getRates(curId)
{
    let options = {
        host: 'www.nbrb.by',
        path: `/API/ExRates/Rates/Dynamics/${curId}?startDate=${startDate}&endDate=${endDate}`
    };

    https.get(options, function (res)
    {
        var bodyChunks = [];

        if (res.statusCode == 200)
        {
            res.on('data', (chunk) =>
            {
                bodyChunks.push(chunk);
            }).on('end', () =>
            {
                let body = Buffer.concat(bodyChunks);
                let array = JSON.parse(body);

                if (array.length > 0)
                {
                    stream.write(body);
                }
            })
        }
    }).on('error', (e) =>
    {
        console.log('ERROR: ' + e.message);
    });
}


