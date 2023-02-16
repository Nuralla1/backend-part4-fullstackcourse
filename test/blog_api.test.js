const { mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper.test");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.listWithBlogs.map((b) => new Blog(b));

  const promiseArr = blogObjects.map((b) => {
    b.save();
  });
  await Promise.all(promiseArr);
});

describe("blog api", () => {
  test("get request returns blogs in JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.listWithBlogs.length);
  });

  test("a specific blog is withing the returned blogs", async () => {
    const response = await api.get("/api/blogs");
    const titles = response.body.map((b) => b.title);

    expect(titles).toContain("First class tests");
  });

  test("a valid blog can be saved", async () => {
    const newBlog = {
      title: "New Test Blog",
      author: "Nuralla",
      url: "kakayato ssilka",
      upvotes: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.listWithBlogs.length + 1);

    const titlesAtEnd = blogsAtEnd.map((b) => b.title);
    expect(titlesAtEnd).toContain("New Test Blog");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
