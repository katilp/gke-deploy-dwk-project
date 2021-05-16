var express = require('express');
var router = express.Router();
var cd = require('./checkdate');
require('dotenv').config();
const fetch = require('node-fetch');
var newlist = [];



/* GET home page. */
router.get('/', function(req, res, next) {
  cd.checkdate();
  res.render('index', { title: 'My project page', todolist: newlist });
});

router.post('/', function (req, res) {
  console.log(req.body.todoitem);
  var content = req.body.todoitem;
  var query = `mutation addTodo($todo: String) {
    todos(todo: $todo) {
      id
      todo
    }  
  }`;

  const endpoint = process.env.GRAPHQL_URL;
  //const endpoint = 'http://localhost:3001/graphql';
  //const endpoint = 'http://backend-svc.project.svc/graphql';
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        todo: content
      }
    })
  })
  .then(r => r.json())
  .then(data => console.log('data returned:', data));

  var query = `query getTodos {
    getAllTodos {
      todo
    }  
  }`;
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  })
  .then(r => r.json())
  .then(data => {console.log('All items returned:',  typeof data, Object.keys(data), Object.keys(data.data)),
                console.log(data.data),
                //newlist = JSON.stringify(data.data.getAllTodos),
                newlist = Array.from(Object.values(data.data.getAllTodos));
                var i; for (i = 0; i < newlist.length; i++) {
                   newlist[i] = newlist[i].todo;
                };
                //newlist = JSON.stringify({1: 'one', 2: 'two', 3: 'three'}),
                console.log(newlist, typeof newlist )});
  
  var query = `query getTodos {
    getLatestTodo {
      todo
    }  
  }`;
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query
    })
  })
  .then(r => r.json())
  .then(data => console.log('Latest item returned:', data));

  // download a new image if it is a new day
  cd.checkdate()
  res.render('index', { title: 'My project page', todo: req.body.todoitem, todolist: newlist });
});

module.exports = router;
