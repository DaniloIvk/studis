import express from 'express';
import appConfig from '../config/app';

const webRouter = express.Router();

webRouter.get('/', (_: express.Request, response: express.Response) => {
  response.end(appConfig.appName);
});

export default webRouter;
