import db from "../config/db.js";
import jwt from "jsonwebtoken";

function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const query = "SELECT * FROM user WHERE email = ? AND password = ?";

    db.query(query, [email, password], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send({ msg: "Database Error" });
      }

      if (result.length === 0) {
        return res.status(404).send({ msg: "Invalid username or password" });
      }

      console.log(result[0]);
      const payload = { id: result[0].id, role: result[0].role };
      console.log("user from database", payload);
      const token = jwt.sign(payload, "password", { expiresIn: "1h" });
      console.log(token);
      res.status(200).send({ msg: "success", user: result[0], token: token });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send({ msg: "Server Error" });
  }
}

function registration(req, res) {
  const { name, email, password, role } = req.body;
  const query =
    "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, password, role], (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Database error",
          error: error.message,
        });
    }

    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        userId: result.insertId,
      });
  });
}

function getUserInfo(req, res) {
  const userInfo = req.user;
  const id = userInfo.id;
  console.log(id);

  try {
    const query3 = `select* from user where id=${id}`;
    db.query(query3, (err, result) => {
      if (err) throw err;
      res.status(200).send({ sucess: true, data: result[0] });
    });
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        message: "User fail registration ",
        error: error.message,
      });
  }
}

export default { login, registration, getUserInfo };
