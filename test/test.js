const expect = require('chai').expect; 
const should = require('should'), 
supertest = require('supertest') 
const express = require('express'); 
const MongoClient = require('mongodb').MongoClient; 
const db = require('../config/db'); 
const app = express(); 



describe("connect", function() { 


it("Проверка статуса главной страницы", function() {           
supertest('http://127.0.0.1:8080') 
.get('/') 
.expect(200) 
.end(function(err, res){ 
res.status.should.equal(200) 
}); 

}) 
it("Проверка статуса admin страницы", function() { 
supertest('http://127.0.0.1:8080') 
.get('export') 
.expect(404) 
.end(function(err, res){ 
res.status.should.equal(404) 

}); 

}) 
it('Проверка статуса формы логина auth0', function(){ 
// this.timeout(5000); 
supertest('http://127.0.0.1:8080') 
.get('/login') 
.expect(302) 
.end(function(err, res){ 
res.status.should.equal(302) 
}); 

}); 
it("Проверка подключения к бд ", function() {                      
const connect = connect_db(); 
expect(connect).is.empty; 
}) 
it('Проверка формы добавление новости', function(done){ 
// this.timeout(5000); 
supertest('http://127.0.0.1:8080') 
.post('/add_news') 
.type('form') 
.field('title','test') 
.field('news','test') 
.redirects(1)                           
.expect(200) 
.end(function(err, res){ 
res.status.should.equal(200) 
done() 
}); 

}); 
it('Проверка времени < 500ms', function(done){    
this.timeout(500); 
setTimeout(done, 300); 
}); 

}); 


























function connect_db(){ 
let error_db=''; 
MongoClient.connect(db.url, (err, database) => { 
if (err) { 
error_db=err; 
} 
// return database 
}) 
return error_db; 
}