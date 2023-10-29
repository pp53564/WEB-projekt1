import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   if (req.method === 'GET') {
      try {
         const rounds = await prisma.round.findMany();
         res.status(200).json(rounds);
      } catch (error) {
         console.error('Error fetching rounds:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   } else {
      res.status(405).json({ message: 'Method Not Allowed' });
   }
}
