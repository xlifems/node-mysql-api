import express from "express";
import employeesRoutes from "./routes/employees.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import certificatesRoutes from "./routes/certificates.routes.js";
import booksRoutes from "./routes/books.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { verifyToken } from "./middleware/validateToken.js";


const app = express();

// Add middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Allow", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});


// Import routes modules
app.use("/api", usersRoutes);
app.use("/api", studentsRoutes);
app.use("/api", certificatesRoutes);
app.use("/api", booksRoutes);
app.use("/api", verifyToken, employeesRoutes);

app.use((req, res, next) => {
  res.status(200).json({
    message: "welcome to my api",
  });
});

export default app;
