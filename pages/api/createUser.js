import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export default async function handler(req, res) {


   const { name, email } = req.body;

   try {
      const newUser = await prisma.user.create({
         data: {
            name,
            email,
         },
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
   } catch (error) {

      res.status(500).json({ message: 'Internal Server Error' });

   }
}
