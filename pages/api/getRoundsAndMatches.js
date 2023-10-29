import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   const { id } = req.query;


   try {
      const rounds = await prisma.round.findMany({
         where: {
            competitionId: parseInt(id), // Convert id to an integer if it's a string
         },
         include: {
            Match: true, // Include related matches for each round
         },
      });

      res.status(200).json(rounds);

   } catch (error) {
      console.error('Error fetching rounds:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   } finally {
      await prisma.$disconnect(); // Disconnect from the Prisma client
   }
};
