import admin from "firebase-admin";
import serviceAccount from "../../flibdig-2-firebase-adminsdk-ak1wj-7e8c342041.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const createUser = async (req, res) => {
  admin
    .auth()
    .createUser({
      email: "user@example.com",
      emailVerified: false,
      phoneNumber: "+11234567890",
      password: "secretPassword",
      displayName: "John Doe",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.send(userRecord);
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await admin.auth().getUserByEmail("user@example.com");
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
