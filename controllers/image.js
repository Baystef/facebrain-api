import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'ef6e3b3777c44b08a345ca8e4b3f1f08'
});

const handleApiCall = (req, res) => {
  const { input } = req.body;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('A Clarifai error has occured.'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('Unable to increment entries'))
}

export { handleImage, handleApiCall };
