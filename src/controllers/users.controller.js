import { pool, firebaseAdmin } from "../db.js";
import { SECRET } from "../../config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const encodePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const validatePassword = (password, passwordEncode) => {
  return bcrypt.compare(password, passwordEncode);
};

export const createUser = async (req, res) => {
  const newUser = req.body;

  // Create a new firebase user object
  const firebaseUser = {
    email: newUser.email,
    emailVerified: false,
    phoneNumber: newUser.phone,
    password: newUser.password,
    displayName: newUser.first_name + " " + newUser.last_name,
    photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false,
  };

  try {
    const userRecord = await firebaseAdmin.auth().createUser(firebaseUser);
    // Create encrypt password
    const bcryptPass = await encodePassword(newUser.password);
    newUser.password = bcryptPass;
    const [rows] = await pool.query("INSERT INTO user SET ?", {
      ...newUser,
      uid: userRecord.uid,
    });

    res.status(201).json({ id: rows.insertId });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await firebaseAdmin
      .auth()
      .getUserByEmail("user@example.com");
    const { providerData, metadata, tokensValidAfterTime, ...restUserRecord } =
      userRecord.toJSON();

    if (!restUserRecord.uid) {
      res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(restUserRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ? ", [
      email,
    ]);

    if (rows.length <= 0) {
      res
        .status(404)
        .send({ status: 404, message: "Email or password invalid" })
        .end();
      return;
    }

    const isValid = await validatePassword(password, rows[0].password);

    if (isValid) {
      // Create new resData object without password property
      const { password, ...resData } = rows[0];

      // Create a JWT token with a payload and secret key
      const payload = { ...resData };
      const options = { expiresIn: "1h" };
      const token = jwt.sign(payload, SECRET, options);

      res
        .status(200)
        .send({ status: 200, data: { ...resData, token } })
        .end();
    } else {
      res
        .status(404)
        .send({ status: 404, message: "Email or password invalid" })
        .end();
    }
  } catch (error) {
    res.status(500).send({ status: "error", data: error }).end();
  }
};
