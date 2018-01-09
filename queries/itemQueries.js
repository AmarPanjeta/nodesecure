var connection = require('./connection');

function getItemsByStoreId(userId,fnCallback){
    connection.query('SELECT i.id, i.name, i.description,i.store_id FROM item i,reg_user ru WHERE ru.id=? and i.store_id=ru.store_id ',[userId],fnCallback);
}
function createItem(item,fnCallback){
    connection.query('INSERT INTO item (name, description, store_id) VALUES (?,?,?)',[item.name,item.description,item.storeId],fnCallback);
}
module.exports={
    getItemsByStoreId,
    createItem
}