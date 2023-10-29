// pages/api/updateMatchResult.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
   if (req.method === 'PUT') {
      const { matchId, resultTeam1, resultTeam2 } = req.body;
      console.log(resultTeam1 + "tusam");


      try {
         const updatedMatch = await prisma.match.update({
            where: {
               id: matchId
            },
            data: {
               result1: resultTeam1,
               result2: resultTeam2
            }
         });

         res.status(200).json({ message: 'Match result updated successfully', updatedMatch });
      } catch (error) {
         console.error('Error updating match result:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   } else {
      res.status(405).json({ message: 'Method Not Allowed' });
   }
}
