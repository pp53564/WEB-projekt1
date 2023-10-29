// pages/api/results.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
   try {
      const competitors = await prisma.competitors.findMany({
         select: {
            id: true,
            name: true,
            points: true,
         },
      });

      res.status(200).json(competitors);
   } catch (error) {
      console.error('Error fetching competitors:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   } finally {
      await prisma.$disconnect();
   }
};
