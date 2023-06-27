import 'dotenv/config';
import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import logger from 'koa-logger';

import defaultRouter from '../server/routers/default.js';
import chatRouter from './routers/chat.js';

// instantiate app
const app = new Koa();

app.use(
  koaBody({
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb',
    multipart: true,
  })
);

app.use(logger());

// CORS
const corsOptions = {
  origin: '*',
  allowMethods: 'OPTIONS,GET,HEAD,POST,PUT,PATCH',
  allowHeaders: ['Authorization', 'Content-Type'],
  maxAge: 300000,
};
app.use(cors(corsOptions));

app.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());
app.use(chatRouter.routes()).use(chatRouter.allowedMethods());

const PORT = 5050;

main().catch(err => console.log('Error starting app:', err));

async function main() {
  console.log('App is starting on port:', PORT);

  app.listen(PORT);
}
