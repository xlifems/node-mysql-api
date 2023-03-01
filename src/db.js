import { createPool } from "mysql2/promise";
import admin from "firebase-admin";
import serviceAccount from "../flibdig-2-firebase-adminsdk-ak1wj-7e8c342041.js";

import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  GOOGLE_APPLICATION_CREDENTIALS,
} from "../config.js";

export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
});

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
