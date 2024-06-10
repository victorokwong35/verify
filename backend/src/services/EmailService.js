const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const validateEvents = require("../subscribers/validate");
const workspaceEvents = require("../subscribers/workspace");
const event = require("../subscribers/events");
const { uuid } = require("uuidv4");
const deepEmail = require("deep-email-validator");
const { validateEmail, parserStream } = require("../helper");
const parse_csv = require('parse-csv-stream');
const fs = require('fs');
const { resolve } = require('path');
const emailExistence = require("email-existence");
const verifier = require('email-verify');
const dns = require('dns');
        var es = require('event-stream');


module.exports = class EmailService {
    constructor(emailModel) {
      this.emailModel = emailModel;
    }


    async getMXRecords(email) {
        return new Promise((resolve, reject) => {
            let domain = email.split('@')[1];
            dns.resolve(domain, 'MX', (err, addresses) => {
                if(err) {
                    reject(err);
                    console.log(err);
                } else {
                    console.log(addresses);
                    resolve(addresses);
                }
            });
        });
    };

    async ValidateEmail(email) {
    //     console.log(email);
    //    await emailExistence.check(email, function(error, response){
    //         return console.log('res: '+ response);
    //     });
        //const isEmailValid = await validateEmail(email);

        // const isEmailValid = await deepEmail.validate(email);

        // console.log(isEmailValid);

        // return isEmailValid;

        const test = await validateEmail(email);

        console.log(test);

        return test

        // console.log("hello");

        
        //     let records = new Promise((resolve, reject) => {
        //         let domain = email.split('@')[1];
        //         dns.resolve(domain, 'MX', (err, addresses) => {
        //             if(err) {
        //                 console.log(err);
        //                 reject(err);
        //             } else {
        //                 console.log(addresses);
        //                 resolve(addresses);
        //             }
        //         });
        //     });
        //     let found = false;
  
        //     if(Array.isArray(records) && records.length > 0) {
        //         records.forEach(record => {
        //            if(record.exchange && typeof record.exchange === 'string') {
        //                if(record.exchange.includes('google.com') || record.exchange.includes('googlemail.com')) {
        //                    found = true;
        //                }
        //            }
        //         });
        //     }
        //     return found;


    }
    

    async ParseCSV() {
        const file = resolve(__dirname, "../uploads/TEDx.csv");
        const json = resolve(__dirname, "../test.json");
        console.log(file);

        

        const newCsv = fs.createWriteStream('new.csv');

        fs.createReadStream(file)
        .pipe(es.split())
        .pipe(
            es.mapSync(function(line) {
            // modify line way you want
            console.log(line);
            }))

        //newCsv.end();
        // const readStream = await fs.createReadStream(file, 'utf8');
        // const writeStream = fs.createWriteStream(json);

        // //default option.
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

        // [A.] working with events
        // events.on('data', (row) => {
        //     console.log(row); //process each row seperately.
        // })

        // readStream.on('data', (chunk) => {
        //     let resultset =  parser.parse(chunk); //process resultset (array of rows).
        //     console.log(resultset);
        //     readStream.pause();

        //     setTimeout(() => {
        //         console.log('Now data will start flowing again.');
        //         readStream.resume();
        //     }, 5000);
        //     //validateEvents.dispatch(event.validate.isValidEmail, { creator_id: data.creator_id, list: data.list });
        // });

        // readable.on('data', (chunk) => {
        //     console.log(`Received ${chunk.length} bytes of data.`);
        //     readable.pause();
        //     console.log('There will be no additional data for 1 second.');
        //     setTimeout(() => {
        //       console.log('Now data will start flowing again.');
        //       readable.resume();
        //     }, 1000);
        //   });

        // readStream.on('end', () => {
        //     console.log('Reached end of stream.');
        // });

        //readStream.read
        //parser.parse(chunk)
        // const chunks = [];

        // readStream.on('readable', () => {
        // let chunk;
        // while (null !== (chunk = parser.parse(readStream.read()))) {
        //     chunks.push(chunk);
        //     console.log(chunks);
        // }
        // });

        // readStream.on('end', () => {
        //     console.log('Reached end of stream.');
        //     // const content = chunks.join('');
        //     // console.log(content);
        // });

        //[B.] Working with streams.
        //readStream.pipe(parser).pipe(writeStream); //pipe parsed stream.
    }


    async SaveEmail(chunk) {
        const saveEmail = await this.emailModel.insertMany(chunk);
        return saveEmail
    }
}


