import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';

const app = express();
const port = 3013;

const App = () => {
  app.use(express.json());
  app.use(cors());

  app.get('/', (_req, res) => {
    res.json({ message: 'Hello World!' });
  });

  userRoutes(app);
  productRoutes(app);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default App;
