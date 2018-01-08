var express = require('express');
var router = express.Router();
var events = require('../queries/eventQueries');
var invitations = require('../queries/invitationQueries');
var eventgifts = require('../queries/eventGiftQueries');
var stores = require('../queries/storeQueries');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/myevents',function(req,res){
  events.getEventsOfUser(res.locals.user.id,(err,results,fields)=>{
    if(err) 
      res.render('forbidden')
    else{
      var events = results.map(o =>{
        return {
          id: o.id,
          name: o.name,
          description: o.description,
          date: o.date,
          type: o.type
        }
      });
      console.log(events);
      res.render('myEvents',{events:events});
    }
  });
});

router.get('/eventgifts/:event_id',function(req,res){
  var eventId=req.params.event_id;
  events.getEventById(eventId,(err,results,fields) => {
    if(err)
      res.render('forbidden')
    else{
      let event = {name:results[0].name,id:eventId};
      console.log("Event", event);
      events.getAvailableItems(eventId,(err,results1,fields)=>{
        console.log("usli u if");
        if(err)
          res.render('forbidden')
        else{
          let availableGifts = results1.map(g => {
            return {
              name: g.name,
              description: g.description,
              store: g.store
            }
          })
            console.log("Dostupni:", availableGifts);
            
            events.getSoldItems(eventId,(err,results2,fields)=>{
              if(err)
                res.render('forbidden')
              else{
                let soldGifts = results2.map(sg => {
                  return {
                    name: sg.name,
                    description: sg.description,
                    store: sg.store
                  }
                });
              
                console.log("Prodani:", soldGifts);

                res.render('eventGiftList',{availableGifts:availableGifts, soldGifts:soldGifts, event:event});
              }
            });

        
        }
      });
    }

  });

});

router.get('/myinvitations',function(req,res){
  invitations.getInvitationsByUserId(res.locals.user.id,(err,results,fields) =>{
    if(err) {
      res.render('forbidden');
      console.log("eoooor",err);
    }
    else{
      let myinvitations = results.map(i => {
        return{
          id: i.id,
          name: i.name,
          description: i.description,
          date: i.date,
          type: i.type
        }
      });
      res.render('myInvitations',{myinvitations:myinvitations});
    }

  });
  
});

router.get('/invitationgifts/:event_id',function(req,res){
  var eventId=req.params.event_id;
  events.getEventById(eventId,(err,results,fields) => {
    if(err)
      res.render('forbidden')
    else{
      let event = {name:results[0].name};
      console.log("Event", event);
      events.getAvailableItems(eventId,(err,results1,fields)=>{
        console.log("usli u if");
        if(err)
          res.render('forbidden')
        else{
          let availableGifts = results1.map(g => {
            return {
              name: g.name,
              description: g.description,
              store: g.store
            }
          })
            console.log("Dostupni:", availableGifts);
            
            events.getSoldItems(eventId,(err,results2,fields)=>{
              if(err)
                res.render('forbidden')
              else{
                let soldGifts = results2.map(sg => {
                  return {
                    name: sg.name,
                    description: sg.description,
                    store: sg.store
                  }
                });
              
                console.log("Prodani:", soldGifts);

                res.render('invitationGiftList',{availableGifts:availableGifts, soldGifts:soldGifts, event:event});
              }
            });

        
        }
      });
    }

  });

});

router.get('/addevent',function(req,res){
  res.render('createEvent');
});

router.post('/addgifttogiftlist',function(req,res){
  console.log('Hidden evId',req.body.eventId);
  var event_gift = {
    event_id:req.body.eventId,
    item_id:req.body.itemId,
    available:true
  };
  
  eventgifts.createEventGift(event_gift,(err,results,fields) => {
    if(err) 
      res.render('forbidden')
    else
      res.redirect('/eventgifts/'+req.body.eventId);
  });
});

router.get('/showavilableitems/:eventId',function(req,res){
  stores.getAvailableItemsForEvent(req.params.eventId,req.query.store_id,(err,results,fields) => {
    if(err)
      res.render('forbidden')
    else {
      let availableGifts = results.map(g => {
        return {
          name: g.name,
          description: g.description,
          id: g.id
               }

    })
    res.render('itemList',{eventId:req.params.eventId,storeId:req.query.store_id, availableGifts:availableGifts});
      
  }
})
})

router.get('/addgifttoevent/:eventId',function(req,res){
  stores.getStores((err,results,fields) => {
    if(err)
      res.render('forbidden')
    else{

      let allStores = results.map(g => {
        return {
          id: g.id,
          name: g.name
        }});

        console.log("evo radnje:",allStores);
        res.render('giftsForm',{eventId:req.params.eventId,allStores:allStores});

    }
  });
  
})

router.get('/invitations/:eventId', function(req,res){
  invitations.getGuestsByEventId(req.params.eventId,(err, results, fields) => {
    if(err)
      res.render('forbidden')
    else{

      let guests = results.map(g => {
          return {
            id: g.id,
            name: g.name,
            surname: g.surname,
            username: g.username

          }
        });
        invitations.getUnivitedUsersByEventId(req.params.eventId,(err,results1, fields) => {
          if(err)
            res.render('forbidden')
          else{

            let uninvitedUsers = results1.map(u => {
              return {
                id: u.id,
                name: u.name,
                surname: u.surname,
                username: u.username
              }
            });
            res.render('guestList',{guests:guests,uninvitedUsers:uninvitedUsers,eventId:req.params.eventId});
          }
        });
      
     
    }
  })
})

router.post("/invite",function(req,res){
  console.log('body',req.body,'params',req.params);
  let invitation = {
    event_id:req.body.eventId,
    user_id:req.body.userId
  }
  console.log("neki aaaaaa:", invitation);
  invitations.createInvitation(invitation,(err,results,fields) =>{
    if(err)
      res.render('forbidden')
    else{
      
      res.redirect('/invitations/'+req.body.eventId);
    }
  })
})

router.post("/deleteinvitation",function(req,res){

  let invitation = {
    event_id:req.body.eventId,
    user_id:req.body.userId
  }
  console.log("neki aaaaaa:", invitation);
  invitations.deleteInvitation(invitation,(err,results,fields) =>{
    if(err)
      res.render('forbidden')
    else{
      
      res.redirect('/invitations/'+req.body.eventId);
    }
  })
})

router.post('/addevent', function(req,res){
  console.log("tijelo zahtjeva:",req.body);

  var event = {
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    type: req.body.type,
    owner_id: res.locals.user.id
  }
  events.createEvent(event, (err,results,fields) => {
    if(err) res.render('forbidden')
    else {
      //res.status(200).send('uspjesno dodavanaddeventje eventa');
      //res.render('myEvents');
      res.redirect('/myevents');
    }
  })
})
module.exports = router;
