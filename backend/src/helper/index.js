const crypto = require("crypto");
const moment = require("moment");
const handleAPIErrors = require("./axiosError");
const { sendResponse } = require("./ResponseHelper");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./userHelper");
const validateEmail = require("./emailValidator");
const parserStream = require("./parserCSV");


const cryptoTokenBuffer = (length = 56) => crypto.randomBytes(length)
.toString('hex');

module.exports = {
	sendResponse,
    cryptoTokenBuffer,
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	handleAPIErrors,
	validateEmail,
	parserStream
}