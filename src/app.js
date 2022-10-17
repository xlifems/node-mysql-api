
import express from "express";
import employeesRoutes from "./routes/employees.routes.js";

const app = express();

// Add middleware
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Import routes modules 
app.use('/api',employeesRoutes)

app.use( (req, res, next) => {
  res.status(200).json({
    message: 'welcome to my api'
  })
})

export default app;