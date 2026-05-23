import { Request, Response } from 'express';
import prisma from '../config/prisma.js';

export const getPlans = async (_req: Request, res: Response): Promise<void> => {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { preco: 'asc' } });
    res.json({ plans });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar planos' });
  }
};

export const getPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await prisma.plan.findUnique({ where: { id: req.params.id } });
    if (!plan) { res.status(404).json({ error: 'Plano não encontrado' }); return; }
    res.json({ plan });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar plano' });
  }
};
