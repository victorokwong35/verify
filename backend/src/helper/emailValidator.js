const axios = require('axios').default;
const deepEmail = require("deep-email-validator");
const dnsPromises = require("dns").promises;



// async function validateEmail(email) {
//   // try {
//   //   const isEmailValid = await deepEmail.validate(email);
//   //   console.log(isEmailValid);
//   //   return isEmailValid;
//   // } catch (error) {
//   //   console.log(e);
//   //   return  { error: e };
//   // }

//   return new Promise ((res, rej) => {
//     const hostname = email.split("@")[1];

//     try {
//       dnsPromises.resolveMx(hostname).then(addresses => {
//         if (addresses && addresses.length > 0) {
//           if(hostname === "gmail.com") {
//             const address = addresses.filter((address) => address.priority === 5);
//             addresses[0].exchange ? res(address[0]) : res(false);
//           } else {
//             addresses[0].exchange ? res(addresses[0]) : res(false);
//           }
//           // console.log(addresses);
//           // addresses[0].exchange ? res(addresses) : res(false);
//           // return addresses
//         }
//       })
//       .catch(err => {
//         // TODO: Deal with the error
//         //console.log("mx-check.js - resolveMx ERROR:\n" + err);
//         //console.log(false);
//         res("mx-check.js - resolveMx ERROR:\n" + err);
//         //return "mx-check.js - resolveMx ERROR:\n" + err     
//       });
//     } catch (err) {
//       // TODO: Deal with the error
//       console.log("mx-check.js ERROR:\n" + err);
//       rej(err);
//       return "mx-check.js ERROR:\n" + err
//     }
//   });

// }

async function validateEmail(email) {
  const emailArray = email.split(" ");

  console.log(emailArray);
  
  for (let index = 0; index < emailArray.length; index++) {
    const email = emailArray[index];

    console.log(email);

    if(email) {
      try {
        const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=c503bd484ac64a6fa4b6728f33bec5e4&email=${email}`);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }

      continue;
    }
  }
    // try {
    //   const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=c503bd484ac64a6fa4b6728f33bec5e4&email=${emailArray}`);
    //   console.log(response.data);
    //   return response.data;
    // } catch (error) {
    //   console.log(e);
    //   return  { error: e };
    // }
}

module.exports = validateEmail;