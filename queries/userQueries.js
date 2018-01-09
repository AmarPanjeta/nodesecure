var connection = require('./connection');
var bcrypt = require('bcryptjs');


function getUsers(fnCallback){
    connection.query('SELECT name,surname,username,password,type from reg_user', fnCallback);
}

function saveUser(user,fnCallback){
    var hashedPassword = bcrypt.hashSync(user.password,12);
    connection.query('insert into reg_user (username,name,surname,password,type) values(?,?,?,?,1)',[user.username,user.name,user.surname,hashedPassword], fnCallback);
}

function findUserByUsername(username,fnCallback){
    connection.query('SELECT id,name,surname,username,password,type,store_id from reg_user where username=?',[username], fnCallback);
}

function getStoreIdByUserId(userId,fnCallback){
    connection.query('SELECT store_id FROM reg_user WHERE id=?',[userId],fnCallback);
}
/*
function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    console.log('fields',fields);
    }
*/

module.exports={
    getUsers,
    saveUser,
    findUserByUsername,
    getStoreIdByUserId
}