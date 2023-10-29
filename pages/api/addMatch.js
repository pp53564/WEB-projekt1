// pages/api/createMatch.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   if (req.method === 'POST') {
      const { player1, player2, result1, result2, roundId } = req.body;

      try {


         const match = await prisma.match.create({
            data: {
               player1,
               player2,
               result1,
               result2,
               round: { connect: { id: roundId } }
            }
         });

         res.status(200).json({ message: 'Match created successfully', match });
      } catch (error) {
         console.error('Error creating match:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   } else {
      res.status(405).json({ message: 'Method Not Allowed' });
   }
}
