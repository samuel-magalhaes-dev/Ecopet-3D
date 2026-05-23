import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ products });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    res.json({ product });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, descricao, preco, imagem, categoria, estoque } = req.body;
    const product = await prisma.product.create({
      data: { nome, descricao, preco: Number(preco), imagem, categoria, estoque: Number(estoque) || 0 },
    });
    res.status(201).json({ product });
  } catch {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ product });
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};
