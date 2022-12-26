import express from 'express';

import userEndpoints from './user';
import productEndpoints from './product';

const app = express();
const port = 3000;

const App = () => {
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ message: 'Hello World!' });
  });

  userEndpoints(app);
  productEndpoints(app);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default App;
