import app from './app';
import { Server } from './src/helpers/env';
import { Logger } from './src/helpers/logger';

const port: string | number = Server.PORT;

app.listen(port, () => {
  Logger.info('Server Running on http://localhost:' + port);
});
