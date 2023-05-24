const { post } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const userRequest = req.user;

    const getPosts = await post.findAll({
      where: {
        user_id: userRequest.id,
      },
      raw: true,
    });

    return res.status(203).send({
      message: "Success get post",
      data: getPosts,
    });
  } catch (error) {
    return res.status(203).send({
      message: error.message,
    });
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userRequest = req.user;

    const createPost = await post.create({
      user_id: userRequest.id,
      title: title,
      description: description,
    });

    if (!createPost) {
      return res.status(203).send({
        message: "Failed to create a new post",
      });
    }

    return res.status(201).send({
      message: "Success create a new post",
    });
  } catch (error) {
    return res.status(203).send({
      message: error.message,
    });
  }
};

exports.show = async (req, res, next) => {
  try {
    const userRequest = req.user;
    const { postId } = req.params;

    const findPost = await post.findOne({ where: { id: postId } });

    if (!findPost) {
      return res.status(203).send({
        message: "Post not found",
      });
    } else if (findPost.dataValues.user_id != userRequest.id) {
      return res.status(203).send({
        message: "You cannot access this post!",
      });
    }

    return res.send({
      message: "Success show post",
      data: findPost.dataValues,
    });
  } catch (error) {
    return res.status(203).send({
      message: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const userRequest = req.user;
    const { postId } = req.params;
    const { title, description } = req.body;

    const findPost = await post.findOne({ where: { id: postId } });

    if (!findPost) {
      return res.status(203).send({
        message: "Post not found",
      });
    } else if (findPost.dataValues.user_id != userRequest.id) {
      return res.status(203).send({
        message: "You cannot access this post!",
      });
    }

    await findPost.update({ title, description });

    return res.send({
      message: "Success update post",
      data: findPost.dataValues,
    });
  } catch (error) {
    return res.status(203).send({
      message: error.message,
    });
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const userRequest = req.user;
    const { postId } = req.params;

    const findPost = await post.findOne({ where: { id: postId } });

    if (!findPost) {
      return res.status(203).send({
        message: "Post not found",
      });
    } else if (findPost.dataValues.user_id != userRequest.id) {
      return res.status(203).send({
        message: "You cannot access this post!",
      });
    }

    await findPost.destroy();

    return res.send({
      message: "Success delete post",
      data: findPost.dataValues,
    });
  } catch (error) {
    return res.status(203).send({
      message: error.message,
    });
  }
};
