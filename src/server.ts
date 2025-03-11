import { prisma } from './prisma/client'; // Import Prisma client
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import demoroutes from './routes/demoroutes'




const app = express();
const port = process.env.PORT || 3001;

// Middlewares

app.use(json());
app.use(urlencoded({ extended: true }));


app.use(
  cors({
    origin: "*", // Allows all origins
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies and authorization headers
  })
);

app.options('*', cors()); // Handle preflight requests for all routes

app.use('/api/auth', authRoutes);
app.use('/', demoroutes);



// Routes (to be added later)
app.get('/', (req, res) => {
  res.send('Payroll System API');
});

// Error Handler Middleware (must be at the end)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  })


// Connect to PostgreSQL database via Prisma
async function startServer() {
    try {
      await prisma.$connect();  // Connect to PostgreSQL
      console.log("Connected to PostgreSQL successfully!");
  
      // Start the server
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1); // Exit if connection fails
    }
  }
  
  startServer();
