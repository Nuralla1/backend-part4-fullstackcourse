const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", (requset, response) => {
  const body = requset.body;

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    upvotes: 0,
  });

  blog
    .save()
    .then((res) => response.status(201).json(res))
    .catch((err) => console.error(err.message));
});

module.exports = blogsRouter;
