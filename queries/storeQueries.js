
var connection = require('./connection');

function getStores(fnCallback){
    connection.query('SELECT id, name FROM store',fnCallback);
}

function getAvailableItemsForEvent(eventId,storeId,fnCallback){
    connection.query('SELECT g.id, g.name, g.description FROM item g WHERE g.store_id=? AND g.id NOT IN (SELECT i.id AS id FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.item_id=i.id and i.store_id=?)',[storeId,eventId,storeId],fnCallback);
}

function getEventsByStoreId(storeId,fnCallback){
    connection.query('select distinct e.id,e.name,e.description,e.date, e.type from event e,item i, event_gift eg where e.id=eg.item_id and i.id=eg.event_id and i.store_id=?',[storeId],fnCallback);
}
module.exports={
    getStores,
    getAvailableItemsForEvent,
    getEventsByStoreId
}