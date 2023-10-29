import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   if (req.method === 'GET') {
      try {
         const matches = await prisma.match.findMany();
         res.status(200).json(matches);
      } catch (error) {
         console.error('Error fetching matches:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   } else {
      res.status(405).json({ message: 'Method Not Allowed' });
   }
}
