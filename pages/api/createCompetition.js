import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   const { name, competitors, scoringSystem1, scoringSystem2, scoringSystem3, createdByEmail } = req.body;

   console.log("ovdje" + req.body.user);
   const user = await prisma.user.findUnique({
      where: {
         email: createdByEmail, // Assuming 'email' is the column name for the email in your Users table
      },
      select: {
         id: true, // Only select the user's ID
      },
   });
   console.log(user);

   try {
      const competition = await prisma.competition.create({
         data: {
            name,
            competitors,
            scoringSystem1,
            scoringSystem2,
            scoringSystem3,
            createdById: user.id,
         },
      });

      res.status(201).json({ message: 'Competition created successfully', competition });
   } catch (error) {
      console.error('Error creating competition:', error);
      res.status(500).json({ message: 'Internal Server Error' });
   }
}
