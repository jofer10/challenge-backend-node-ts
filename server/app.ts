import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { startApolloServer } from './graphql';

import config from './config/app';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

startApolloServer(app);

app.set('port', config.server.port);

app.listen(app.get('port'), () => console.info(`Server running on port ${app.get('port')}`));
