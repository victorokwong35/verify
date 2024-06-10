const parse_csv = require('parse-csv-stream');
const fs = require('fs');
const { parse } = require("csv-parse");

// const readStream = fs.createReadStream('../uploads/TEDx.csv', 'utf8');
// const writeStream = fs.createWriteStream('../test.json');

//default option.
// const options = {
//     // delimiter: ',',
//     // wrapper: '"',
//     // newlineSeperator: '\r\n'
// };

// const parser = new parse_csv(options);
// const events = parser.events;

/*
There are 2 approaches you can take : 
[A.] events. 
[B.] streams.

There are 3 ways to handle data : 
[1.] Process each row seperately via events.
[2.] Process resultset (array of rows).
[3.] Pipe parsed stream.
 
 choose any one.
*/

// [A.] working with events.
// events.on('data', (row) => {
//     console.log(row); //process each row seperately.
// })

// readStream.on('data', (chunk) => {
//    let resultset =  parser.parse(chunk); //process resultset (array of rows).
// });

//[B.] Working with streams.
//readStream.pipe(parser).pipe(writeStream); //pipe parsed stream.


const stream = (file) => {
    fs.createReadStream(file)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        console.log(row);
        return row
    })
    .on("end", function () {
        console.log("finished");
        return "Finished"
    })
    .on("error", function (error) {
        console.log(error.message);
        return error.message
    });
}

module.exports = stream;