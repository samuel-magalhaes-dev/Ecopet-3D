import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Plans
  await prisma.plan.deleteMany();
  await prisma.plan.createMany({
    data: [
      {
        nome: 'Maker Start',
        descricao: '3 rolos de filamento por mês',
        preco: 279,
        rolls: 3,
        popular: false,
        beneficios: [
          '3 rolos de filamento/mês',
          'Entrega recorrente gratuita',
          '5% de desconto por rolo',
          'Suporte por e-mail',
          'Cancele quando quiser',
        ],
      },
      {
        nome: 'Maker Pro',
        descricao: '6 rolos de filamento por mês',
        preco: 534,
        rolls: 6,
        popular: true,
        beneficios: [
          '6 rolos de filamento/mês',
          'Entrega recorrente gratuita',
          '11% de desconto por rolo',
          'Suporte prioritário',
          'Acesso a cores exclusivas',
          'Cancele quando quiser',
        ],
      },
      {
        nome: 'Maker Business',
        descricao: '12 rolos de filamento por mês',
        preco: 1020,
        rolls: 12,
        popular: false,
        beneficios: [
          '12 rolos de filamento/mês',
          'Entrega recorrente gratuita',
          '15% de desconto por rolo',
          'Suporte dedicado',
          'Acesso a cores exclusivas',
          'Faturamento empresarial',
          'Cancele quando quiser',
        ],
      },
    ],
  });

  // Seed Products
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { nome: 'Filamento PET 250g', descricao: 'Filamento PET reciclado 1.75mm - 250g', preco: 29.75, categoria: 'filamento', estoque: 50 },
      { nome: 'Filamento PET 500g', descricao: 'Filamento PET reciclado 1.75mm - 500g', preco: 54.50, categoria: 'filamento', estoque: 40 },
      { nome: 'Filamento PET 1kg', descricao: 'Filamento PET reciclado 1.75mm - 1kg', preco: 99.00, categoria: 'filamento', estoque: 30 },
    ],
  });

  console.log('✅ Seed concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
