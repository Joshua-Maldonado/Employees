var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    consolidate = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    fs = require('fs'),
    app = express();

// BD Connect String
var connect = "postgres://postgres:12345@localhost/practice";

//Assign Dust engine to .dust files
app.engine('dust', consolidate.dust);

//Set Default Ext to .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Routes
app.get('/', function(req, res){
  pg.connect(connect, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM employee', function(err, result){
      if(err) {
        return console.error('error running query', err);
      }
      res.render('index', {employee: result.rows});
      done();
    });
  });
});

app.get('/employees/:id', function(req, res){
  pg.connect(connect, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM employee where id = $1', req.params.id, function(err, result){
      if(err) {
        return console.error('error running query', err);
      }
      res.render('index', {employee: result.rows});
      done();
    });
  });
});

app.post('/employees', function(req, res){
  pg.connect(connect, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("INSERT INTO employee(firstName, lastName, age, sex) VALUES($1, $2, $3, $4)",
      [req.body.first, req.body.last, req.body.age, req.body.sex]);
    done();
    res.redirect('/');
  });
});

app.delete('/employees/:id', function(req,res){
  pg.connect(connect, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("DELETE FROM employee WHERE id = $1",
      [req.params.id]);
    done();
    res.send(200);
  });
});

app.put('/employees/:id', function(req, res){
  pg.connect(connect, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("UPDATE employee SET firstname=$1, lastname=$2, age=$3, sex=$4 WHERE id = $5",
      [req.body.first, req.body.last, req.body.age, req.body.sex, req.params.id]);
    console.log("success");
    done();
    res.redirect('/');
  });
});

app.post('/search', function(req, res){
  pg.connect(connect, function(err, client, done){
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var search = req.body.search;
    var sql = "SELECT * FROM employee WHERE firstname LIKE '%"+search+"%' OR lastname LIKE '%"+search+"%'";
    client.query(sql, function(err, result){
      if(err) {
        return console.error('error running query', err);
      }
      res.render('search', {found: result.rows});
      done();
    });
  });
});

//server
app.listen(3000, function(){
    console.log('Server Running on Port 3000');
});
