import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/prisma.js';

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  telefone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ error: 'Este e-mail já está cadastrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.senha, 12);

    const user = await prisma.user.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        telefone: data.telefone,
      },
      select: { id: true, nome: true, email: true, telefone: true, createdAt: true },
    });

    // Create empty cart for user
    await prisma.cart.create({ data: { userId: user.id } });

    const token = generateToken(user.id);

    res.status(201).json({ user, token, message: 'Conta criada com sucesso!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ error: 'E-mail ou senha incorretos' });
      return;
    }

    const passwordMatch = await bcrypt.compare(data.senha, user.senha);
    if (!passwordMatch) {
      res.status(401).json({ error: 'E-mail ou senha incorretos' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      user: { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone },
      token,
      message: 'Login realizado com sucesso!',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const me = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, nome: true, email: true, telefone: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json({ user });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};
