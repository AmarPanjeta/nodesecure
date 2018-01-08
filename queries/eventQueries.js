

var connection = require('./connection');

function getEventById(id, fnCallback){
    connection.query('SELECT name FROM event e WHERE id=?',[id],fnCallback);
}

function getEventsOfUser(id, fnCallback){
    connection.query('SELECT * from event where owner_id=?',[id], fnCallback);
}

function getSoldItems(idEvent, fnCallback){
   
    connection.query('SELECT i.name AS name, i.description, s.name AS store FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.available=false and eg.item_id=i.id and i.store_id=s.id',[idEvent],fnCallback);

}

function getAvailableItems(idEvent, fnCallback){

    connection.query('SELECT i.name AS name, i.description, s.name AS store FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.available=true and eg.item_id=i.id and i.store_id=s.id',[idEvent],fnCallback);
    
}

function getEventItems(idEvent,fnCallback){

    connection.query('SELECT i.id AS id,i.name AS name, i.description FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.item_id=i.id and i.store_id=s.id',[idEvent],fnCallback);
    
}

function createEvent(event,fnCallback){
    connection.query('INSERT INTO event (name,description,date,type,owner_id) VALUES (?,?,?,?,?)',[event.name,event.description,event.date,event.type,event.owner_id],fnCallback);
}


/*
function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    console.log('fields',fields);
    }
*/

module.exports={
    getEventsOfUser,
    getAvailableItems,
    getSoldItems,
    getEventById,
    createEvent,
    getEventItems
}