import { PrismaClient } from "@prisma/client";
import type { Express } from "express";

const prisma = new PrismaClient();

export default (app: Express) => {
  app.get('/users', async (_req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
  });

  app.post('/user', async (req, res) => {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        company: {
          create: {
            title: req.body.company.title,
          },
        },
      },
    });

    res.json(user);
  });

  app.put('/user/:id', async (req, res) => {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        company: {
          update: {
            title: req.body.company.title,
          },
        },
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
