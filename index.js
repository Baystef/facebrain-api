import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'facebrain'
  }
});


const app = express();
app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
  res.json('Welcome to FaceBrain');
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isvalid = bcrypt.compareSync(password, data[0].hash)
      if (isvalid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(401).json('Unable to get user'))
      }
      res.status(400).json('Invalid details')
    })
    .catch(err => res.status(400).json('Invalid details'))
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            res.status(201).json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('An error occurred'));
})

// app.get('/profile/:id', (req, res) => {
//   const { id } = req.params;
//   database.users.forEach(user => {
//     if (user.id === id) {
//       return res.json(user);
//     } else {
//       return res.status(404).json('user not found');
//     }
//   })
// })

// app.put('/image', (req, res) => {
//   const { id } = req.body;
//   let found = false;
//   database.users.forEach(user => {
//     if (user.id === id) {
//       found = true;
//       user.entries++
//       return res.json(user.entries);
//     }
//   })
//   if (!found) {
//     return res.status(404).json('user not found');
//   }
// })

app.listen(3300, () => {
  console.log('App is running on port 3300');
})
