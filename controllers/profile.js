const handleProfile = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (!user.length) {
        res.status(400).json('User not found')
      }
      res.json(user[0])
    })
}
export default handleProfile;
