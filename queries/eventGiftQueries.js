var connection = require('./connection');

function createEventGift(eventGift,fnCallback){
    connection.query('INSERT INTO event_gift (item_id,event_id,available) VALUES (?,?,?)',[eventGift.item_id,eventGift.event_id,eventGift.available],fnCallback);
}

module.exports={
    createEventGift
}