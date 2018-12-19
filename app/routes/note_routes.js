var ObjectID = require('mongodb').ObjectID;
const express = require("express");
const app = express();
const jsonParser = express.json();
const fs = require('fs');
module.exports = function(app, db) {


// app.post("/register", function (req, res) {
 
//     const note = { username: req.body.username, password: req.body.password };
//     db.collection('notes').insert(note, (err, result) => {
      
//       if (err) { 
//         res.send({ 'error': 'An error has occurred' }); 
//       } else {
//         res.redirect('../');
//         // res.send(result.ops[0]);
//       }
//     })
    
//   })
 
app.post("/raiting",jsonParser, function (req, res) {
  
  
  db.collection('leage').find().toArray(function(err, results){               //
    if (err) { 
      res.send({ 'error': 'Error colections' }); 
    } else {
      // collect_table(results);
      let key_player;
      for ( index in results ){                                           //находим ключ best player и записываем значение  в кей плаер
       if(results[index].best_player){
        key_player=results[index].best_player;
       }
      }
    //  console.log(key_player);
       player(results,key_player);
      
    }
    
   }); 
  function player(result_one,key){                             //находим всех игроков с ключом кей и передаем таблицу лиги и список игроков  в функцию склеивания 
   db.collection('players').find({'key': key }).toArray(function(err, results){
    if (err) { 
         res.send({ 'error': 'Error colections players' }); 
       }
       else {
        // collect_table(result_one,result_one)
        collect_table(result_one,results)
        
        //  console.log(results);
       }

  })
  }
  function collect_table( result_one, result_two){                //склеиваем таблицы
      // console.log(result_one+result_two);
      // let collect_table_result;
      let collect_table_result ={};
      // console.log(Object.assign({},result_one,result_two));
      for (index in result_one){
        if (index<4){
          collect_table_result[index]=result_two[index];
        }
        else if (index>=4){
          collect_table_result[index]=result_one[index-4]
        }
      }
      res.json(collect_table_result);
      //console.log(collect_table_result);
      // // console.log(collect_table_result.length);
      // console.log(Object.assign(collect_table_result,result_one))
      

  }
   
    


});

app.post("/del_news", function (req, res) { 
  var ok = req.body.ok; 
  var not = req.body.not; 
  if (not){ 
  db.collection('added_by_user_news').remove({key : parseInt(not)}); 
  res.redirect('/accept_news'); 
  } 
  if (ok){ 
  db.collection('added_by_user_news').find({key : parseInt(ok)}).toArray(function(err, results){ 
  if (err) { 
  res.send({ 'error': 'Error find colections '+note.collection }); 
  } else { 
  // console.log(results); 
  // console.log(typeof(results)); 
  insert_news(results); 
  del_news(ok); 
  res.redirect('/accept_news'); 
  } 
  function insert_news(resul){ 
    // resul[img]=';
  db.collection('news').insert(resul, (err, result) => { 
  
  if (err) { 
  res.send({ 'error': 'An error has user' }); 
  } else { 
  console.log(result); 
  } 
  }) 
  } 
  function del_news(keys){ 
  db.collection('added_by_user_news').remove({key : parseInt(keys)}); 
  // db.collection('blog').remove(); 
  } 
  }) 
  } 
  // if ( ) 
  // console.log(ok,not); 
  // const key = 
  // 
  
  // }) 
  
  
  })

app.post("/add_news", function (req, res) { 

   
  const note = { title: req.body.title, desc: req.body.news,key:parseInt(Math.random()*1000),img:'../img/news_2.png'}; 
 //  console.log(note); 
  db.collection('added_by_user_news').insert(note, (err, result) => { 
  
  if (err) { 
  res.send({ 'error': 'Error insert colections arsenal_match' }); 
  } else {  
  res.redirect('/add_news');  
  } 
  })

  })


app.post("/main",jsonParser, function (req, res) {
 db.collection('news').find().toArray(function(err, results){
    if (err) { 
      res.send({ 'error': 'Error colections' }); 
    } else {
      res.json(results);
      // res.send(result.ops[0]);
    }
       
   });

});

  

app.post("/matches",jsonParser, function (req, res) {
  db.collection('arsenal_match').find().toArray(function(err, results){
     if (err) { 
       res.send({ 'error': 'Error find colections arsenal_match' }); 
     } else {
       res.json(results);
       
     }
        
    });
 
 });

app.post("/add_db",jsonParser, function (req, res) {
 
    const note = { name: req.body.name, game: req.body.game, scors: req.body.scors };
    // console.log(note);
    db.collection('leage').insert(note, (err, result) => {
      
      if (err) { 
        res.send({ 'error': 'Error insert colections arsenal_match' }); 
      } else {
        // res.json(result)
        res.send("успешно");
        // console.log(res);
        // res.redirect('../');
        // res.send(result.ops[0]);
      }
     })
    
  })
  app.post("/accept_news", function(req,res){

    db.collection('added_by_user_news').find().toArray(function(err, results){ 
      if (err) { 
      res.send({ 'error': 'Error find colections arsenal_match' }); 
      } else { 
      res.json(results); 
      
      } 
      
      })
    
  })
  app.post("/export", function (req, res) {
 
    const note = { collection: req.body.coll };
    db.collection(note.collection).find().toArray(function(err, results){
      if (err) { 
        res.send({ 'error': 'Error find colections '+note.collection }); 
      } else {
       
        let json_res=JSON.stringify(results,'',4);

        fs.writeFile('./export/'+note.collection+'.json',json_res, function(err) {         //   
            if(err) {
                return console.log(err);
            }
            
        }); 
        res.send(json_res);
        // res.send('<p>Коллекция '+ note.collection +'.json<br></p><a href="../export/'+note.collection +'.json">Скачать файл </a>'); 
      }
     
     });
    
  })
  

}
// let comands = [{name: "Манчестер Сити", game: 15, scors:41} , {name: "Ливерпуль", game: 15,scors:39 }];
  //   db.collection('leage').insertMany(comands, function(err, results){
              
  //     console.log(results);
  //     client.close();
  // });

//  