var express = require('express');
var router = express.Router();
var events = require('../queries/eventQueries');
var invitations = require('../queries/invitationQueries');
var eventgifts = require('../queries/eventGiftQueries');
var stores = require('../queries/storeQueries');
var items = require('../queries/itemQueries');
var users = require('../queries/userQueries');
var connection = require('../queries/connection');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/ouritems",function(req,res){
  if(res.locals.user.store_id==null) res.render('forbidden',{error:"Nemate pravo pristupa ovoj stranici"});
  else {
    //console.log("evo user:",res.locals.user.id);
    items.getItemsByStoreId(res.locals.user.id,(err,results,fields) => {
      console.log("evo rez:",results);
      if(err)
        res.render('forbidden')
      else{
        var availableItems = results.map(i => {
          return{
            id: i.id,
            name: i.name,
            description: i.description,
            store_id: i.store_id
          }
        });
        console.log("evo rez:",results);
        res.render('storeItems',{availableItems:availableItems, storeId:res.locals.user.store_id});
      }
    })
  }
});

router.get("/additem/:storeId",function(req,res){
  if(res.locals.user.store_id!=req.params.storeId) res.render('forbidden',{error:"Ovoj stranici imaju pristup samo radnici radnje."})
  else {
    console.log("ueee",res.locals.user.id);
    console.log("radnjaa",req.params.storeId);
    users.getStoreIdByUserId(res.locals.user.id,(err,results,fields) => {
      if(err)
        res.render('forbidden')
      else{
      
        console.log("radnjaa",req.params.storeId);
        res.render('createItem',{storeId:req.params.storeId});
      }
      
    });
  }
  
});

router.post("/additem/:storeId",function(req,res){
  if(res.locals.user.store_id!=req.params.storeId) res.render('forbidden',{error:"Ovu akciju mogu izvrsavati samo radnici radnje."});
  else {
    var item = {
      name:req.body.name,
      description:req.body.description,
      storeId: req.params.storeId

    };
    items.createItem(item,(err,results,fields) => {
      if(err)
        res.render('forbidden')
      else{
        res.redirect('/ouritems');
      }
    })
  }
})

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
          date: new Date(o.date).toUTCString().split(' ').slice(0, 4).join(' '),
          type: o.type
        }
      });
      console.log(events);
      res.render('myEvents',{events:events});
    }
  });
});

router.get('/events',function(req,res){
  stores.getEventsByStoreId(res.locals.user.store_id,(err,results,fields) => {
    if(err)
      res.render('forbidden')
    else{
      var ourEvents = results.map( e => {
        return {
          id: e.id,
          name: e.name,
          description: e.description,
          date: new Date(e.date).toUTCString().split(' ').slice(0, 4).join(' '),     
          type: e.type,
          owner_id: e.owner_id,
          owner_username: e.owner_username,
          owner_name: e.owner_name,
          owner_surname: e.owner_surname
        }
      })
      res.render('events',{ourEvents:ourEvents});
    }
  })
 
})

router.get("/showeventgifts/:eventId",function(req,res){
  console.log("store",res.locals.user.store_id);
  events.getEventById(req.params.eventId,(err,result2,fields) =>{
    if(err)
      res.render('forbidden')
    else{
      var selectedEvent = result2[0].name;
      console.log("ime eventa",selectedEvent);
      events.getAvailabeEventItemsByStoreId(req.params.eventId,res.locals.user.store_id,(err,results,fields) => {
        if(err)
          res.render('forbidden')
        else {
          var availabeGifts = results.map( g => {
            return {
              id: g.id,
              name: g.name,
              description: g.description,
              available: g.available
            }
          });
          events.getSoldEventItemsByStoreId(req.params.eventId,res.locals.user.store_id,(err,results1, fields) => {
            if(err)
              res.render('forbidden')
            else {
              var soldGifts = results1.map( d => {
                return {
                  id: d.id,
                  name: d.name,
                  description: d.description,
                  available: d.available
                }
              });
              res.render('storeGiftList',{availabeGifts:availabeGifts,soldGifts:soldGifts,storeId:res.locals.user.store_id,eventId:req.params.eventId,selectedEvent:selectedEvent});
            }
          })
          
        }
    
      })
    }

  });

})

router.get('/eventgifts/:event_id',function(req,res){
  var eventId=req.params.event_id;
  events.getEventById(eventId,(err,results,fields) => {
    if(err)
      res.render('forbidden')
    else{
      if(results.length!=0 && results[0].owner_id==res.locals.user.id){
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
      else{
        res.render('forbidden',{error:"Ne mozete pristupiti ovoj stranici"});
      }
      
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
          date: new Date(i.date).toUTCString().split(' ').slice(0, 4).join(' '),
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
  if(res.locals.user.type==1) res.render('createEvent');
  else res.render('forbidden');
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

router.post('/changestatustotrue',function(req,res){
  console.log('tjkfchgjkoplhg')
  eventgifts.changeStatusToTrue(req.body.itemId,req.body.eventId,(err,results,fields) => {
    console.log('tu smo')
    if(err)
      res.render('forbidden')
    else
      res.redirect('/showeventgifts/'+req.body.eventId);
  })
})

router.post('/changestatustofalse',function(req,res){
  eventgifts.changeStatusToFalse(req.body.itemId,req.body.eventId,(err,results,fields) => {
    if(err)
      res.render('forbidden')
    else
      res.redirect('/showeventgifts/'+req.body.eventId);
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
  connection.query("select owner_id from event where id=?",[req.body.eventId],(err,results,fields)=>{
    if(err) res.render('forbidden');
    console.log(results);
    if(results.length!=0 && results[0].owner_id==res.locals.user.id){
      console.log("neki aaaaaa:", invitation);
      invitations.createInvitation(invitation,(err,results,fields) =>{
        if(err)
          res.render('forbidden')
        else{
          
          res.redirect('/invitations/'+req.body.eventId);
        }
      })
    }
    else {
      res.render('forbidden',{error:"Nemate dozvolu za izvrsavanje ove akcije"});
    }
  })

})

router.post("/deleteinvitation",function(req,res){

  let invitation = {
    event_id:req.body.eventId,
    user_id:req.body.userId
  }
  connection.query("select owner_id from event where id=?",[req.body.eventId],(err,results,fields)=>{
    if(err) res.render('forbidden');
    if(results.length!=0 && results[0].owner_id==res.locals.user.id){
      console.log("neki aaaaaa:", invitation);
      invitations.deleteInvitation(invitation,(err,results,fields) =>{
        if(err)
          res.render('forbidden')
        else{
          
          res.redirect('/invitations/'+req.body.eventId);
        }
      })
    }
    else{
      res.render('forbidden',{error:"Nemate dozvolu za izvrsavanje ove akcije"});
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
  if(event.name.length==0 || event.description.length==0 || event.date.length==0 || event.type.length==0){
    res.render('createEvent',{error:"Sva polja moraju biti popunjena"});
  }
  else if(event.date.search(/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/)!=0){
    res.render('createEvent',{error:"Datum nije u odgovarajucem formatu"});
  }
  else if(!["Rodjendan","Vjencanje","Diploma","Rodjenje djeteta","Preseljenje u drugi dom"].includes(event.type) ){
    res.render('createEvent',{error:"Niste odabrali vrijednos iz liste!"});
  }
  else{
  events.createEvent(event, (err,results,fields) => {
    if(err) res.render('forbidden')
    else {
      //res.status(200).send('uspjesno dodavanaddeventje eventa');
      //res.render('myEvents');
      res.redirect('/myevents');
    }
  })}
})
module.exports = router;
