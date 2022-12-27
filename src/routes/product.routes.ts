import { PrismaClient } from "@prisma/client";
import type { Express } from "express";

const prisma = new PrismaClient();

export default (app: Express) => {
  app.get('/products', async (_req, res) => {
    const products = await prisma.product.findMany();

    res.json(products);
  });

  app.get('/product/:id', async (req, res) => {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.json(product);
  });

  app.post('/product', async (req, res) => {
    const product = await prisma.product.create({
      data: {
        author: {
          connect: {
            // TODO: authenticate via JWT from req.headers
            id: req.body.author.id,
          },
        },
        title: req.body.title,
        price: req.body.price,
        category: {
          create: {
            title: req.body.category.title,
          },
        },
      },
    });

    res.json(product);
  });

  app.put('/product/:id', async (req, res) => {
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        price: req.body.price,
        category: {
          update: {
            title: req.body.category.title,
          },
        },
      },
    });

    res.json(product);
  });

  app.delete('/product/:id', async (req, res) => {
    const product = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: `Product ${product.title} deleted` });
  });
};
