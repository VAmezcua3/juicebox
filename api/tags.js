const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  try {
    const { tagName } = req.params;
    const allPosts = await getPostsByTagName(tagName);
    const posts = allPosts.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id);
    });
    
    res.send({
      posts: posts,
    });
  } catch ({ name, message }) {
    next ({
      name: 'Tag Error',
      message: 'There is an error with this tag request'
    })
  }
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });
});

module.exports = tagsRouter;