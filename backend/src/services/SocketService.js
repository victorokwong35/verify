const { addUser } = require("../helper");
const axios = require('axios').default;
const deepEmail = require("deep-email-validator");
const dnsPromises = require("dns").promises;

module.exports = (io, socket) => {
  const createUser = (payload, callback) => {
    const { error, user } = addUser({ id: payload.email, email: payload.email, room: payload.id });
    if(error) return callback(error)
    socket.join(user.room);
    callback("Joined");
  }


  const callAPI = (email) => {
    return new Promise ((res, rej) => {
      const hostname = email.split("@")[1];
  
      try {
        dnsPromises.resolveMx(hostname).then(addresses => {
          if (addresses && addresses.length > 0) {
            const address = addresses.filter((address) => address.priority <= 5 || address.priority === 0);
            if(address.length == 0 || address.length > 0) {
              //console.log(address[0]);
              res({
                email,
                exchange: address[0].exchange,
                priority: address[0].priority
              })
            }
            //console.log(addresses);
            // if(hostname === "gmail.com") {
            //   const address = addresses.filter((address) => address.priority <= 5 || address.priority === 0);
            //   addresses[0].exchange ? res(address[0]) : res(false);
            //   console.log(address[0]);
            // } else {
            //   const address = addresses.filter((address) => address.priority <= 5 || address.priority === 0);
            //   addresses[0].exchange ? res(address[0]) : res(false);
            // }
            //console.log(addresses);
            //addresses[0].exchange ? res(addresses) : res(false);
            return addresses
          }
        })
        .catch(err => {
          // TODO: Deal with the error
          //console.log("mx-check.js - resolveMx ERROR:\n" + err);
          //console.log(false);
          res({
            email,
            exchange: "mx-check.js - resolveMx ERROR:\n" + err,
            priority: "mx-check.js - resolveMx ERROR:\n" + err
          });
          //return "mx-check.js - resolveMx ERROR:\n" + err     
        });
      } catch (err) {
        // TODO: Deal with the error
        //console.log("mx-check.js ERROR:\n" + err);
        rej(err);
        return "mx-check.js ERROR:\n" + err
      }
    });
  }

  
  const validateEmail = async (payload, callback) => {
    const { email } = payload;
    const emailArray = email.split(" ");
    let response = await Promise.all(emailArray.map(async email => {
      return await callAPI(email)
    }))

    callback(response)

    console.log(response)


    // for (let index = 0; index < emailArray.length; index++) {
    //   const email = emailArray[index];
  
    //   console.log(email);
  
    //   if(email) {
    //     // try {
    //     //   const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=c503bd484ac64a6fa4b6728f33bec5e4&email=${email}`);
    //     //   if(response.data) {
    //     //     callback(response.data)
    //     //     continue;
    //     //   }
    //     // } catch (error) {
    //     //   callback(error);
    //     //   console.log(error.response);
    //     // }
    //   }
    // }
      
  }




  socket.on("add_user", createUser);
  socket.on("validate_email", validateEmail);
}