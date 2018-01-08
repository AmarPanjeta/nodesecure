
var connection = require('./connection');

function getStores(fnCallback){
    connection.query('SELECT id, name FROM store',fnCallback);
}

function getAvailableItemsForEvent(eventId,storeId,fnCallback){
    connection.query('SELECT g.id, g.name, g.description FROM item g WHERE g.store_id=? AND g.id NOT IN (SELECT i.id AS id FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.item_id=i.id and i.store_id=?)',[storeId,eventId,storeId],fnCallback);
}
module.exports={
    getStores,
    getAvailableItemsForEvent
}