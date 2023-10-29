import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

   var user = null;
   //console.log(req.user);
   const { userEmail } = req.query;
   try {

      user = await prisma.user.findUnique({
         where: { email: userEmail }
      });
      console.log(user);

      if (user) {
         const userId = user.id;
         // Now you have the user's ID, you can use it for your operations
      }
   } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Errorrrrrrr' });
   }

   console.log(user.id);
   try {
      const competitions = await prisma.competition.findMany({
         where: {
            createdById: user.id,
         },
         select: {
            competitors: true,
            name: true,
            id: true
         },
      });

      console.log(competitions);
      res.status(200).json({
         competitions: competitions.map(competition => ({
            id: competition.id,
            name: `${competition.name}`,
            competitors: competition.competitors,
            // Add any other modifications you need
         }))
      });

   } catch (error) {
      console.error('Error fetching competitions:', error);
      res.status(500).json({ message: 'Internal Server E' });
   }
}

