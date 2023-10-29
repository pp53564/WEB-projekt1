import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   const { id } = req.query;


   try {
      const competitors = await prisma.competition.findMany({
         select: {
            competitors: true,
         },
         where: {
            id: parseInt(id) // Assuming id is a number
         }
      });

      if (competitors.length === 0) {
         res.status(404).json({ message: 'Competition not found' });
         return;
      }

      const competitorsSend = competitors[0].competitors.split(';').map(competitor => competitor.trim());
      //const competitorsSend = competitors[0];
      res.status(200).json({ competitorsSend });

   } catch (error) {
      console.error('Error fetching competitors:', error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
}
