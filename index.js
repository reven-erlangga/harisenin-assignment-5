require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const userController = require("./src/controllers/userController");
const postController = require("./src/controllers/postController");
const auth = require("./src/middlewares/auth");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user", userController.register);
app.post("/login", userController.login);
app.get("/user", auth.verifyToken, userController.show);
app.get("/post", auth.verifyToken, postController.index);
app.post("/post", auth.verifyToken, postController.create);
app.get("/post/:postId", auth.verifyToken, postController.show);
app.put("/post/:postId", auth.verifyToken, postController.update);
app.delete("/post/:postId", auth.verifyToken, postController.destroy);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
