"use strict";
let mongodb = require('mongodb');
let mongoclient = new mongodb.MongoClient;
let url = 'mongodb://localhost:27017/test';
let collection_name = 'user_collection';
let database;

function dbOpen(err, db) {
    if (err) {
        console.log('open database error', err);
        return;
    } else {
        database = db;
        let User = db.collection(collection_name);
        addUser(User).then(showUser).then(updateUser).then(showUser).then(clearUser).then(closeDB);
    }
}

function closeDB() {
    console.log('close database connection ');
    database.close();
    process.exit();
}

function addUser(User) {
    console.log('start insert data to collection');
    let promise = new Promise(function (resolve, reject) {
        User.insert({
            name: 'joseph',
            datetime: new Date()
        }, {}, function (err, data) {
            if (err) {
                reject();
            } else {
                console.log('insert success \r\n', JSON.stringify(data.ops));
                resolve(User);
            }
        });
    });

    return promise;
}

function showUser(User) {
    let promise = new Promise(function (resolve, reject) {
        var users = User.find();
        console.log('show all users');
        users.each(function (err, doc) {
            if (err) {
                reject(err);
            } else if (!doc) {
                resolve(User);
            } else {
                printItems(doc);
            }
        });
    });
    return promise;
}

function clearUser(User) {
    let promise = new Promise(function (resolve, reject) {
        User.drop(function (err, resp) {
            if (err) {
                reject(err)
            } else {
                console.log('delete all users');
                resolve(User);
            }
        });
    });
    return promise;
}

function updateUser(User) {
    let promise = new Promise(function (resolve, reject) {
        User.updateOne({
            name: 'joseph'
        }, {
            $set: {
                age: 17
            },
            $currentDate: {
                "lastModified": true
            }
        }, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(User);
            }
        })
    });
    return promise;
}

function printItems(items) {
    console.log('items: ', JSON.stringify(items));
}

// connect database.
mongoclient.connect(url, dbOpen);