/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';
import passport from 'passport';
import session from 'express-session';
import 'dotenv/config';
import { ApplicationData, FormSubmission } from '../../shared/data';
import { initDB } from './db';
import { DataEntry, IUser, User } from './models';
import { Strategy as LocalStrategy } from 'passport-local';
import { hostname } from 'os';
import { HydratedDocument } from 'mongoose';

interface ExpressUser {
  username: string;
}

const app = express();
const port = Number.parseInt(process.env.PORT ?? '8081');

const isHTTPS = port === 443 || process.env.HTTPS === 'true';
const ROOT_URL = `${isHTTPS ? 'https' : 'http'}://${hostname()}${(port === 443 && isHTTPS) || (port === 80 && !isHTTPS) ? null : `:${port}`}`;

initDB();

app.use(
  session({
    secret: 'gompei',
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

const getExpressUser = (mongoUser?: HydratedDocument<IUser>): ExpressUser | false => {
  if (!mongoUser) {
    return false;
  }

  return {
    username: mongoUser.username,
  };
};

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },

    async (username, password, done) => {
      try {
        if (username.length < 1) {
          done(null, false);
        }
        const user = await User.findOne({ username }).exec();
        if (!user || user.password !== password) {
          done(null, false);
          return;
        }
        done(null, getExpressUser(user));
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id as never);
});

interface Signup {
  username: string;
  password: string;
}

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
  });
  res.redirect('/');
});

app.post('/api/signup', async (req, res) => {
  if (req.user) {
    res.status(403).send('You are already authenticated. Logout first.');
    return;
  }

  const payload = req.body as Signup;

  const newUser = await User.create({
    ...payload,
  });
  await newUser.save();

  res.status(201).json({ status: 'Created' });
});

app.post('/api/login', passport.authenticate('local') as RequestHandler, (req, res) => {
  // const user = req.user as ExpressUser;
  res.status(200).json(req.user);
});

app.get('/api/user', (req, res) => {
  if (!req.user) {
    res.status(200).json({ username: '' });
    return;
  }

  const user = req.user as ExpressUser;
  res.status(200).json(user);
});

app.get('/api/data', async (req, res) => {
  if (!req.user) {
    res.status(200).json([]);
    return;
  }

  const user = req.user as ExpressUser;

  const records = await DataEntry.find({
    author: user.username,
  }).exec();

  const sanitized: ApplicationData[] = records.map(
    (record) =>
      ({
        id: record._id.toString(),
        location: record.location,
        start: record.start,
        end: record.end,
        author: record.author,
      }) as ApplicationData,
  );

  res.status(200).json(sanitized);
});

app.post('/api/data', async (req, res) => {
  const data = req.body as FormSubmission;
  const user = req.user as ExpressUser;

  const newRecord = await DataEntry.create({
    ...data,
    author: user.username,
  });

  await newRecord.save();

  res.status(201).send(newRecord);
});

app.delete('/api/data/:id', async (req, res) => {
  // get necessary deletion id
  const id = req.params.id;
  const user = req.user as ExpressUser;

  const lookup = await DataEntry.findById(id).exec();

  if (!lookup) {
    res.status(404).json({ error: 'Item not found.' });
  } else {
    if (lookup.author !== user.username) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    await lookup.deleteOne();
    res.status(204).json({ status: `Deleted ${id}` });
  }
});

// This server is not able to brew coffee due to being a teapot.
// Do not allow brews and alert the user of being a teapot.
// For more information visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
app.get('/api/brew', (_req, res) => {
  res.status(418).send("I'm a teapot");
});

if (isHTTPS) {
  const key = fs.readFileSync(path.join(__dirname, '../../../certs/privkey.pem'));
  const cert = fs.readFileSync(path.join(__dirname, '../../../certs/certificate.pem'));

  https.createServer({ key, cert }, void app).listen(port, () => {
    console.log(`HTTPS Server is live: ${ROOT_URL}/`);
  });
} else {
  app.listen(port, () => {
    console.log(`HTTP Server is live: ${ROOT_URL}/.`);
  });
}
