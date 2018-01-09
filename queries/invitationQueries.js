var connection = require('./connection');

function getInvitationsByUserId(id, fnCallback){
    connection.query('SELECT e.id,e.name,e.description,e.date,e.type FROM event e,invitation i WHERE i.user_id=? and e.id=i.event_id',[id],fnCallback);
}

function getGuestsByEventId(id, fnCallback){
    connection.query('SELECT ru.id, ru.name, ru.surname, ru.username FROM reg_user ru, invitation i WHERE ru.id=i.user_id and i.event_id=?',[id],fnCallback);
}

function getUnivitedUsersByEventId(id,fnCallback){
    connection.query('select ru.id,ru.name,ru.surname,ru.username from reg_user ru where ru.id!=(select owner_id from event where id=?) and ru.id not in (select user_id from invitation where event_id=?)',[id,id],fnCallback);
    
}

function getSoldItems(idEvent, fnCallback){
   
    connection.query('SELECT i.name AS name, i.description, s.name AS store FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.available=false and eg.item_id=i.id and i.store_id=s.id',[idEvent],fnCallback);

}

function getAvailableItems(idEvent, fnCallback){

    connection.query('SELECT i.name AS name, i.description, s.name AS store FROM item i,event_gift eg, store s WHERE eg.event_id=? and eg.available=true and eg.item_id=i.id and i.store_id=s.id',[idEvent],fnCallback);
    
}

function createInvitation(invitation, fnCallback){
    connection.query('INSERT INTO invitation (user_id,event_id) VALUES (?,?)',[invitation.user_id,invitation.event_id],fnCallback);
}

function deleteInvitation(invitation, fnCallback){
    connection.query('DELETE FROM invitation WHERE user_id=? AND event_id=?',[invitation.user_id,invitation.event_id],fnCallback);
}

/*
function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
    console.log('fields',fields);
    }
*/

module.exports={
   getInvitationsByUserId,
   getGuestsByEventId,
   getUnivitedUsersByEventId,
   createInvitation,
   deleteInvitation
}