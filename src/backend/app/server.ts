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
import { DataEntry, User } from './models';
import { Strategy } from 'passport-local';

const app = express();
const port = process.env.PORT ?? '8081';

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

passport.use(
  new Strategy(
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
        done(null, user);
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

app.post('/api/login', passport.authenticate('local') as RequestHandler, (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/api/data', async (_req, res) => {
  const records = await DataEntry.find({}).exec();

  const sanitized: ApplicationData[] = records.map(
    (record) =>
      ({
        id: record._id.toString(),
        name: record.name,
        location: record.location,
        start: record.start,
        end: record.end,
      }) as ApplicationData,
  );

  res.status(200).json(sanitized);
});

// Is there any way to handle data validation? I miss JOI.

app.post('/api/data', async (req, res) => {
  const data = req.body as FormSubmission;

  const newRecord = await DataEntry.create({
    ...data,
  });

  await newRecord.save();

  res.status(201).send(newRecord);
});

app.delete('/api/data/:id', async (req, res) => {
  // get necessary deletion id
  const id = req.params.id;
  const user = req.user;

  if (!user) {
    res.status(403).send('You must be logged in.');
    return;
  }

  const lookup = await DataEntry.findById(id).exec();

  if (!lookup) {
    res.status(404).json({ status: 'Item not found.' });
  } else {
    await lookup.deleteOne();
    res.status(204).json({ status: `Deleted ${id}` });
  }
});

if (port === '443') {
  const key = fs.readFileSync(path.join(__dirname, '../../../certs/privkey.pem'));
  const cert = fs.readFileSync(path.join(__dirname, '../../../certs/certificate.pem'));

  https.createServer({ key, cert }, void app).listen(port, () => {
    console.log('HTTPS Server is live!');
  });
} else {
  app.listen(port, () => {
    console.log(`HTTP Server is live on port ${port}.`);
  });
}

// This server is not able to brew coffee due to being a teapot.
// Do not allow brews and alert the user of being a teapot.
// For more information visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
app.get('/api/brew', (_req, res) => {
  res.status(418).send("I'm a teapot");
});
