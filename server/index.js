import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import morgan from 'morgan';
import db from './db';
import {
  handleRegister, handleImage, handleApiCall, handleProfile, handleSignin
} from './controllers'


const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())


app.get('/', (req, res) => { res.json('Welcome to FaceBrain'); })

app.post('/signin', handleSignin(db, bcrypt))

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) })

app.put('/image', (req, res) => { handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { handleApiCall(req, res) })

app.listen(3300, () => {
  console.log('App is running on port 3300');
})
