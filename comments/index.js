const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[postId] = comments;

  console.log('comment serivce post id=======', postId);

  const event = {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: postId },
  };

  console.log('EVENT SENDING', event);

  await axios.post('http://localhost:5005/events', event);

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log('Recieved event: ', req.body.type);

  res.send({});
});

app.listen(5001, () => {
  console.log('Listening on 5001');
});
