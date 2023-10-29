// results.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Competitor {
   id: number;
   name: string;
   points: number;
}


function ResultsPage() {
   const [data, setData] = useState<Competitor[]>([]);
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch('/api/results');
            if (response.ok) {
               const result = await response.json();
               setData(result);
            } else {
               console.error('Error fetching data');
            }
         } catch (error) {
            console.error('Error fetching data:', error);
         }
      };

      fetchData();
      console.log(data);
   }, []);

   return (
      <div className="containerResults">
         <h1 className="title">Results</h1>
         <Link href="/">Back to Home</Link>
         <table>
            <thead>
               <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Points</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{item.name}</td>
                     <td>{item.points}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default ResultsPage;
