import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import prisma from '../config/prisma.js';

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }
  return cart;
}

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await getOrCreateCart(req.userId!);
    const total = cart.items.reduce((sum: number, item: any) => sum + item.preco * item.quantidade, 0);
    res.json({ cart, total });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { weight, preco, quantidade = 1 } = req.body;
    const cart = await getOrCreateCart(req.userId!);

    const existing = cart.items.find((i: any) => i.weight === weight);

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantidade: existing.quantidade + quantidade },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, weight, preco: Number(preco), quantidade: Number(quantidade) },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: true },
    });

    res.json({ cart: updatedCart, message: 'Item adicionado ao carrinho' });
  } catch {
    res.status(500).json({ error: 'Erro ao adicionar item' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { quantidade } = req.body;

    if (Number(quantidade) < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantidade: Number(quantidade) },
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: true },
    });

    res.json({ cart });
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: true },
    });
    res.json({ cart, message: 'Item removido' });
  } catch {
    res.status(500).json({ error: 'Erro ao remover item' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.userId! } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Carrinho limpo' });
  } catch {
    res.status(500).json({ error: 'Erro ao limpar carrinho' });
  }
};
