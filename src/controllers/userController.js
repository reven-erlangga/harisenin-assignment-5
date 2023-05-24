const crypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = crypt.hashSync(password, 8);

    const createUser = await user.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (!createUser) {
      return res.status(203).send({
        message: "Failed to create a new user",
      });
    }

    return res.status(201).send({
      message: "Success create a new user",
    });
  } catch (error) {
    console.log(error);
    return res.status(203).send({
      message: error,
    });
  }
};

exports.show = async (req, res, next) => {
  try {
    const userReq = req.user;
    console.log(userReq);
    const findUser = await user.findOne({
      where: { email: userReq.email },
    });

    if (!findUser) {
      return res.status(404).send({ message: "Data not found" });
    }

    return res.send({
      message: "Success",
      data: findUser.dataValues,
    });
  } catch (error) {
    console.log(error);
    return res.status(203).send({
      message: error,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await user.findOne({
    where: { email: email },
  });

  if (!findUser) {
    return res.status(404).send({ message: "Data not found" });
  }

  const isPasswordValid = crypt.compareSync(
    password,
    findUser.dataValues.password
  );

  if (!isPasswordValid) {
    return res.status(400).send({ message: "Password is wrong" });
  }

  const token = jwt.sign(
    {
      id: findUser.dataValues.id,
      name: findUser.dataValues.name,
      email: findUser.dataValues.email,
    },
    process.env.JWT_TOKEN_KEY,
    { expiresIn: 3600 }
  );

  return res.send({
    message: "Success login",
    name: findUser.dataValues.name,
    token: token,
  });
};
