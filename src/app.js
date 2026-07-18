import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
  const bodyLang = req.body?.language;
  const headerLang = req.headers['accept-language'] || req.headers['x-language'];
  const userLang = req.user?.language;
  const accepted = ['ne', 'np'];
  const raw = bodyLang || userLang || headerLang || 'en';
  req.language = accepted.includes(raw?.toLowerCase?.()?.slice(0, 2)) ? 'ne' : 'en';
  next();
});

app.use(['/api/v1', '/v1'], routes);
app.use(errorMiddleware);

export { app }