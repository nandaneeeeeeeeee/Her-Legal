import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
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

export{app}