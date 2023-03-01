import { pool, firebaseAdmin } from "../db.js";

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
    const [rows] = await pool.query("INSERT INTO user SET ?", {
      ...newUser,
      uid: userRecord.uid,
    });
    console.log("User added successfully", rows.insertId);

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
