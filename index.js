const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js')

const server = express();

server.use(express.json())
//connect to database here!
const db = knex(knexConfig.development);

server.get('/', (req, res) => {
  res.send('api working')
});

//Get List of Zoos endpoint
server.get('/api/zoos', (req, res) => {
  db('zoos').then(zoos => {
    res.status(200).json(zoos);
  }).catch(err => {res.status(500).json(err)});
})

//Get zoo by ID
server.get('/api/zoos/:id', (req, res) =>{
  const zooID = req.params.id;
  db('zoos')
    .where({ id: zooID })
    .first()
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})



//Post a zoo
server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert(req.body)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => res.status(500).json(err));
});

//Delete a zoo
server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .delete()
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err =>  res.status(500).json(err))
})

//Update a zoo
server.put('/api/zoos/:id', (req, res) => {
  const changes = req.body;
  db('zoos')
    .where({ id: req.params.id })
    .update(changes)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => res.status(500).json(err));
})




server.use(express.json());
server.use(helmet());

// endpoints here

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
