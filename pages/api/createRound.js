// pages/api/createRound.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   if (req.method === 'POST') {
      const { roundNumber, competitionId } = req.body;

      try {
         // Check if a round with the same roundNumber and competitionId already exists
         const existingRound = await prisma.round.findFirst({
            where: {
               roundNumber,
               competitionId
            }
         });

         if (existingRound) {
            res.status(201).json({ message: 'Round with the same round number and competition ID already exists' });
            return;
         }

         // If no existing round found, create a new round
         const round = await prisma.round.create({
            data: {
               roundNumber,
               competition: { connect: { id: competitionId } }
            }
         });

         res.status(200).json({ message: 'Round created successfully', round });
      } catch (error) {
         console.error('Error creating round:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   } else {
      res.status(405).json({ message: 'Method Not Allowed' });
   }
}
