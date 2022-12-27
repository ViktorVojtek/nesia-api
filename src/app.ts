import express from 'express';

import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';

const app = express();
const port = 3000;

const App = () => {
  app.use(express.json());

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
