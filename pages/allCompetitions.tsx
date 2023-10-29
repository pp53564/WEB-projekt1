import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Link from 'next/link';

export default function AllCompetitions() {
   const { user } = useUser();
   const [competitions, setCompetitions] = useState<{ id: number; name: string; competitors: string }[]>([]);

   useEffect(() => {
      const fetchCompetitions = async () => {
         try {
            const response = await axios.get(`/api/getUserCompetitions?userEmail=${user?.email}`);
            setCompetitions(response.data.competitions);
            console.log(response.data);
            console.log(response.data.competitions);
         } catch (error) {
            console.error('Error fetching competitions:', error);
         }
      };

      if (user) {
         fetchCompetitions();
      }
   }, [user]);

   if (!user) {
      return <div>Please log in to view your competitions.</div>;
   }

   return (
      <div className="page-container">
         <h1 className="page-title">Your Competitions</h1>
         <div className="table-container">
            <table className="competitions-table">
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Name</th>
                     <th>Competitors</th>
                  </tr>
               </thead>
               <tbody>
                  {competitions.map((competition) => (
                     <tr key={competition.id}>
                        <td>{competition.id}</td>
                        <td>
                           <Link href={`/competition/${competition.id}`}>
                              <div>{competition.name}</div>
                           </Link>
                        </td>
                        <td>{competition.competitors}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>


      </div>
   );
}
