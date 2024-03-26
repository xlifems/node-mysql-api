import express from "express";
import employeesRoutes from "./routes/employees.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import certificatesRoutes from "./routes/certificates.routes.js";
import booksRoutes from "./routes/books.routes.js";
import usersRoutes from "./routes/users.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import { jwtMiddleware } from "./middleware/validateToken.js";



import cors from "cors";

const app = express();

// Add middleware
app.use(express.json());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));


// Import routes modules
app.use("/api", usersRoutes);
app.use("/api", studentsRoutes);
app.use("/api", certificatesRoutes);
app.use("/api", booksRoutes);
app.use("/api", jwtMiddleware, schoolRoutes);
app.use("/api", jwtMiddleware, employeesRoutes);

app.use((req, res, next) => {
  res.status(200).json({
    message: "welcome to my api",
  });
});

export default app;
