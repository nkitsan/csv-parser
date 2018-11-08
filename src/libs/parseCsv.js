const Papa = require('papaparse');
const Joi = require('joi');
const fs = require('fs');
const mongoClient = require("mongodb").MongoClient;
const userSchema = require('./config');

module.exports.parseCsv = function(fileName) {
    let data = '';
    let users = [];
    let readStream = fs.createReadStream(fileName, 'utf8');

    readStream.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
        users = Papa.parse(data,{
            header: true,
            newline: "\r\n"
        });
        return validateUsers(users);
    });
};

function validateUsers(users){
    const filename = Date.now().toString();
    let writeStream = fs.createWriteStream(filename+'.csv');
    if (users.errors.length){
        writeStream.write(Papa.unparse(users.errors));
        return filename;
    }
    let correctUsers = [];
    let invalidUsersInfo = [];
    for (let user of users.data){
        const validationResult = Joi.validate(user, userSchema);
        if (validationResult.error){
            invalidUsersInfo.push(...validationResult.error.details);
        }
        else{
            correctUsers.push(validationResult.value);
        }
    }
    if (correctUsers.length){
        writeToDb(correctUsers);
    }
    if (invalidUsersInfo.length){
        writeStream.write(Papa.unparse(invalidUsersInfo));
    }
    if (!invalidUsersInfo.length){
        const response = [['status', 'message'],['200 OK', 'Successful validation']];
        writeStream.write(Papa.unparse(response));
    }
    return filename;
}

function writeToDb(users) {
    const url = "mongodb://localhost:27017/";
    mongoClient.connect(url, (err, client)=>{
        const db = client.db("usersdb");
        const collection = db.collection("users");
        collection.insertMany(users, (err, results)=>{
            client.close();
        });
    });
}