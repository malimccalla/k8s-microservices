const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const posts = {};

app.post('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };

    console.log('Post created:', posts);
  }

  if (type === 'CommentCreated') {
    console.log('CommentCreated event', req.body);

    const { id, content, postId } = data;

    console.log('ALL posts in comments', posts);
    console.log('POST ID', postId);

    console.log('POST BY ID:===', posts[postId]);

    const post = posts[postId];

    console.log('POST', post);

    post.comments.push(content);
  }

  res.send({});
});

app.listen(5002, () => {
  console.log('listening on 5002');
});
