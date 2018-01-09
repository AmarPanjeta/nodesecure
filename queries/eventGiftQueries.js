var connection = require('./connection');

function createEventGift(eventGift,fnCallback){
    connection.query('INSERT INTO event_gift (item_id,event_id,available) VALUES (?,?,?)',[eventGift.item_id,eventGift.event_id,eventGift.available],fnCallback);
}

function changeStatusToTrue(itemId,eventId,fnCallback){
    connection.query('UPDATE event_gift SET available=true  WHERE item_id=? and event_id=?',[itemId,eventId],fnCallback);
}

function changeStatusToFalse(itemId,eventId,fnCallback){
    connection.query('UPDATE event_gift SET available=false  WHERE item_id=? and event_id=?',[itemId,eventId],fnCallback);
}

module.exports={
    createEventGift,
    changeStatusToFalse,
    changeStatusToTrue
}