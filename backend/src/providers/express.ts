import express, { Request } from 'express';
import cors from 'cors'

const app = express();

app.use(cors<Request>())
app.use(express.json());

export default app;