import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   const { name, points, userEmail, competitionId } = req.body;
   console.log(competitionId);

   const user = await prisma.user.findUnique({
      where: {
         email: userEmail, // Assuming 'email' is the column name for the email in your Users table
      },
      select: {
         id: true, // Only select the user's ID
      },
   });
   console.log(user.id);


   try {
      const competitors = await prisma.competitors.create({
         data: {
            name,
            points,
            userId: user.id,
            competitionId: competitionId
         },
      });

      res.status(201).json({ message: 'comp created successfully', competitors });
   } catch (error) {
      console.error('Error creating competition:', error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
}
