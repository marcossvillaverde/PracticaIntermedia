import app from './app.js';
import dbConnect from './config/db.js';
import { config } from './config/index.js';

const start = async () => {
  await dbConnect();
  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
};

start();