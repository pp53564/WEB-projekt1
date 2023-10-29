import React, { useState, useEffect, use } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface RoundData {
   roundNumber: number;
   Match: {
      id: number;
      player1: string;
      player2: string;
      result1: string;
      result2: string;
   }[];
}

export default function Competition() {
   const [competitors, setCompetitors] = useState([]);
   const router = useRouter();
   const { id } = router.query;
   const [rounds, setRounds] = useState<RoundData[]>([]);
   const [roundsC, setRoundsC] = useState<{ id: number; roundNumber: number; matches: { id: number; players: string[]; resultTeam1: string; resultTeam2: string }[] }[]>([]);

   const [resultT1, setResultT1] = useState(''); // Dodajte stanje za result1
   const [resultT2, setResultT2] = useState('');
   const [generatedLink, setGeneratedLink] = useState('');

   useEffect(() => {
      const fetchCompetitors = async () => {
         try {
            const response = await fetch(`/api/getCompetitors/?id=${id}`);
            const data = await response.json();
            setCompetitors(data.competitorsSend);
         } catch (error) {
            console.error('Error fetching competitors:', error);
         }
      };

      if (id) {
         fetchCompetitors();
      }
   }, [id]);

   useEffect(() => {
      const fetchRounds = async () => {
         try {
            const response = await fetch(`/api/getRoundsAndMatches/?id=${id}`);
            const data = await response.json();
            setRounds(data); // Spremi runde u stanje
            console.log(rounds);

         } catch (error) {
            console.error('Error fetching rounds:', error);
         }
      };

      if (id) {
         fetchRounds();
      }

   }, [id]);


   const generateRoundRobinSchedule = (competitors: string[]) => {
      const schedule = [];
      for (let i = 0; i < competitors.length - 1; i++) {
         const roundsC = {
            id: i + 1, // Add a unique id for each round
            roundNumber: i + 1,
            matches: [] as { id: number, players: string[], resultTeam1: string, resultTeam2: string }[], // Add id, resultTeam1, and resultTeam2
         };

         for (let j = 0; j < competitors.length / 2; j++) {
            const match = {
               id: j + 1, // Add a unique id for each match
               players: [competitors[j], competitors[competitors.length - 1 - j]],
               resultTeam1: '', // Initialize result as an empty string
               resultTeam2: '', // Initialize result as an empty string
            };
            roundsC.matches.push(match);
         }

         schedule.push(roundsC);

         competitors.splice(1, 0, competitors[competitors.length - 1]);
         competitors.pop();
      }

      return schedule;
   };

   useEffect(() => {
      setRoundsC(generateRoundRobinSchedule(competitors));
   }, [competitors]);

   const handleCreateRound = async (roundNumber: number, competitionId: number) => {
      try {
         const response = await fetch('/api/createRound', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               roundNumber,
               competitionId,
            }),
         });

         if (response.ok) {
            const data = await response.json();

            const roundId = data.round.id;
            const roundMatches = roundsC[roundNumber - 1].matches;

            for (let i = 0; i < roundMatches.length; i++) {

               console.log(roundMatches.length);
               const match = roundMatches[i];
               const player1 = match.players[0];
               const player2 = match.players[1];

               await fetch('/api/addMatch', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                     player1,
                     player2,
                     result1: '', // Initialize results as empty
                     result2: '', // Initialize results as empty
                     roundId,
                  }),
               });
            }

            console.log(`Round ${roundNumber} created successfully with id: ${roundId}`);
         } else {
            console.error(`Error creating round ${roundNumber}`);
         }
      } catch (error) {
         console.error('Error creating round:', error);
      }
   };

   for (let i = 0; i < roundsC.length; i++) {
      const { roundNumber } = roundsC[i];
      if (typeof id === 'string') {
         handleCreateRound(roundNumber, parseInt(id));
      }
   }



   const handleUpdateResult = async (matchId: number, resultTeam1: string, resultTeam2: string) => {
      try {
         const response = await fetch('/api/updateMatchResult', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               matchId,
               resultTeam1,
               resultTeam2,
            }),
         });

         if (response.ok) {
            console.log('Result updated successfully');
            window.location.reload();
         } else {
            console.error('Error updating result');
         }
      } catch (error) {
         console.error('Error updating result:', error);
      }
   };


   const handleGenerateLink = () => {
      // Generate the public link here, e.g., using the current competition ID
      setGeneratedLink('/results');
   };

   const handleGenerateLinkThisPage = () => {
      // Generate the public link here, e.g., using the current competition ID
      setGeneratedLink(`/competition/${id}`);
   };

   return (
      <div>
         <div className="titleTable">
            <Link href={generatedLink}>
               <div className="tableButtonLinkTitle" onClick={handleGenerateLinkThisPage}>
                  Generate Link for this page
               </div>
            </Link>
            <p className="linkTitle">Generated Link: {generatedLink}</p>
         </div>

         <div className="centeredTable">
            <table>
               <thead>
                  <tr>
                     <th>Round</th>
                     <th>Matches</th>
                     <th>Result Team 1</th>
                     <th>Result Team 2</th>
                     <th>Update Result</th>
                     <th>Links</th>
                  </tr>
               </thead>
               <tbody>
                  {rounds.map((round) => (
                     round.Match.map((match: any, index: number) => (
                        <tr key={index}>
                           <td>{round.roundNumber}</td>
                           <td>{match.player1 + ' vs ' + match.player2}</td>
                           <td>
                              <input
                                 type="number"
                                 defaultValue={match.result1}
                                 onChange={(event) => {
                                    if (event.target.value !== '') {
                                       setResultT1(event.target.value);
                                    }
                                    setResultT2(match.result2);
                                 }}
                              />
                           </td>
                           <td>
                              <input
                                 type="number"
                                 defaultValue={match.result2}
                                 onChange={(event) => {
                                    if (event.target.value !== '') {
                                       setResultT2(event.target.value);
                                    }
                                    setResultT1(match.result1);
                                 }}
                              />
                           </td>
                           <td>
                              <button onClick={() => handleUpdateResult(match.id, resultT1, resultT2)}>
                                 Update Result
                              </button>
                           </td>
                           <td>
                              <Link href={generatedLink}>
                                 <div className="tableButtonLink" onClick={handleGenerateLink}>
                                    Generate Link
                                 </div>
                              </Link>
                              <p className="link">Generated Link: {generatedLink}</p>
                           </td>
                        </tr>
                     ))
                  ))}
               </tbody>
            </table>
         </div>
         <Link href="/results">
            <div>
               <button className="tableButton">Show Table with Results</button>
            </div>
         </Link>
      </div>
   );
}
