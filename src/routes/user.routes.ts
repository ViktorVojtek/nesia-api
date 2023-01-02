import { PrismaClient } from "@prisma/client";
import type { Express } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default (app: Express) => {
  app.get('/users', async (_req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
  });

  app.post('/user/login', async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const token = await generateToken(user.id);
    
    res.json({id: user.id, email: user.email, token});
  });

  app.post('/user/register', async (req, res) => {
    const password = req.body.password;
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      },
    });

    const token = await generateToken(user.id);

    res.json({id: user.id, email: user.email, token});
  });

  app.put('/user/:id', async (req, res) => {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email
      },
    });

    res.json(user);
  });

  app.delete('/user/:id', async (req, res) => {
    const user = await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: `User ${user.name} deleted` });
  });
};


function generateToken(signData: string): Promise<string | undefined> {
  // Expires in 1 year from now
  const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365);

  return new Promise((resolve, reject) => {
    jwt.sign(
      { id: signData, iat: expiresIn },
      process.env.JWT_SECRET as string,
      {},
      (err: Error | null, token?: string) => {
      if (err) { reject(err); }

      resolve(token);
    });
  });
}