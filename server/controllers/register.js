const handleRegister = (req, res, db, bcrypt) => {
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
  }

  export default handleRegister;
