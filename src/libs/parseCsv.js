const Papa = require('papaparse');
const Joi = require('joi');

const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const mongoClient = require("mongodb").MongoClient;
const userSchema = require('./config');


exports.parseCsv = async (fileName, outputDirectory) => {
    const data = await readFileAsync(fileName, {
        encoding: 'utf8'
    });

    const users = Papa.parse(data, {
        header: true,
        newline: "\r\n"
    });

    const filePath = outputDirectory+Date.now().toString()+'.csv';

    const isValid = await isParsingValid(users, filePath);
    if (!isValid){
        return filePath;
    }

    let validUsers = findValidUsers(users);
    let invalidUsers = findInvalidUsers(users);

    await writeParsingResults(validUsers, invalidUsers, filePath);
    return filePath;
};

function findValidUsers(users){
    let correctUsers = [];
    for (let user of users.data){
        const validationResult = Joi.validate(user, userSchema);
        if (validationResult.error === null){
            correctUsers.push(validationResult.value);
        }
    }
    return correctUsers;
}

function findInvalidUsers(users) {
    let invalidUsers = [];
    for (let user of users.data){
        const validationResult = Joi.validate(user, userSchema);
        if (validationResult.error){
            invalidUsers.push(Object.assign({},
                {message: validationResult.error.details[0]['message']},
                validationResult.error["_object"]));
        }
    }
    return invalidUsers;
}

async function isParsingValid(users, filePath){
    if (users.errors.length){
        await writeFileAsync(filePath, users);
        return false;
    }
    return true;
}


async function writeParsingResults(validUsers, invalidUsers, filePath) {
    if (validUsers.length){
        correctUsersToDb(validUsers);
    }
    if (invalidUsers.length){
        await writeFileAsync(filePath, Papa.unparse(invalidUsers));
    }
    if (!invalidUsers.length){
        const response = [['status', 'message'],['200 OK', 'Successful validation']];
        await writeFileAsync(filePath, Papa.unparse(response));
    }
}


function correctUsersToDb(users) {
    const url = "mongodb://localhost:27017/";
    mongoClient.connect(url, (err, client)=>{
        const db = client.db("usersdb");
        const collection = db.collection("users");
        collection.insertMany(users, (err, results)=>{
            client.close();
        });
    });
}