import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import prisma from '../config/prisma.js';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tipo, items, planId, total, endereco, cidade, estado, cep } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        tipo,
        total: Number(total),
        planId: planId || null,
        endereco,
        cidade,
        estado,
        cep,
        status: 'pendente',
        items: {
          create: (items || []).map((item: any) => ({
            weight: item.weight,
            preco: Number(item.preco),
            quantidade: Number(item.quantidade),
          })),
        },
      },
      include: { items: true, user: { select: { nome: true, email: true, telefone: true } } },
    });

    res.status(201).json({ order, message: 'Pedido criado com sucesso!' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId! },
      include: { items: true, plan: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};
