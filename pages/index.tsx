import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import Link from Next.js

interface CompetitionData {
  name: string;
  competitors: string;
  scoringSystem: string;
}

function Index() {
  const { user, error, isLoading } = useUser();
  const [userCreated, setUserCreated] = useState(false);
  const [competitionData, setCompetitionData] = useState<CompetitionData>({
    name: '',
    competitors: '',
    scoringSystem: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompetitionData({
      ...competitionData,
      [name]: value,
    });
  };

  const router = useRouter();

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const field in competitionData) {
      if (!competitionData[field as keyof typeof competitionData].trim()) {
        alert(`Field ${field} must not be empty.`);
        return;
      }
    }

    const competitorsArray = competitionData.competitors.split(/[\n,;]/);

    if (competitorsArray.length < 4 || competitorsArray.length > 8) {
      alert('List of competitors must have between 4 and 8 competitors.');
      return;
    }
    if (
      competitorsArray.some(
        (competitor) =>
          competitor.trim() === '' || competitor.trim().endsWith(';')
      )
    ) {
      alert('All competitors must have a name and cannot end with ;.');
      return;
    }

    const scoringFormat = competitionData.scoringSystem;

    const scoringPattern = /^\d+\/\d+\/\d+$/;

    if (!scoringPattern.test(scoringFormat)) {
      alert('Scoring format is not valid. Examples: 3/1/0, 1/0.5/0, 2/0/1');
      return;
    }

    const name = competitionData.name;
    const competitors = competitionData.competitors;
    const scoringSystem = competitionData.scoringSystem;

    const data = { name, competitors, scoringSystem };

    if (user) {
      console.log(user);
      console.log(user.sub);
    }

    try {
      if (user) {
        const scoringSystemArray = competitionData.scoringSystem.split('/');
        const response = await axios.post('/api/createCompetition', {
          name: competitionData.name,
          competitors: competitionData.competitors,
          scoringSystem1: scoringSystemArray[0],
          scoringSystem2: scoringSystemArray[1],
          scoringSystem3: scoringSystemArray[2],
          createdByEmail: user.email, // Assuming 'sub' is the unique identifier for the user
        });
        console.log('Competition created:', response.data);
        const competitorNames = competitionData.competitors
          .split(/[\n,;]/)
          .filter((name) => name.trim() !== '');

        const competitionId = response.data.competition.id;
        console.log(response.data);
        for (const competitorName of competitorNames) {
          const response2 = await axios.post('/api/createCompetitors', {
            name: competitorName,
            points: 0,
            userEmail: user.email,
            competitionId: competitionId,
          });
        }
        alert('Competition created!');
        router.push('/allCompetitions');
      }
    } catch (error) {
      console.error('Error creating competition:', error);
    }
  }

  useEffect(() => {
    if (!userCreated) {
      const createUser = async () => {
        if (user && !userCreated) {
          // Only execute if user exists and hasn't been created yet
          try {
            const response = await axios.post('/api/createUser', {
              name: user.name,
              email: user.email,
              nickname: user.nickname,
            });
            console.log('User created:', response.data.user);
            setUserCreated(true); // Set userCreated to true after successful creation
          } catch (error) {
            console.error('Error creating user:', error);
          }
        }
      };

      createUser(); // Call the createUser function when user state changes
    }
  }, [user, userCreated]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        <div className="form-container">
          <h2>Enter Competition Information</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="labelFrom" htmlFor="name">
                Competition Name:
              </label>
              <input
                className="inputForm"
                type="text"
                id="name"
                name="name"
                value={competitionData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="labelFrom" htmlFor="competitors">
                List of Competitors (e.g. Competitor1; Competitor2; Competitor3):
              </label>
              <textarea
                className="textForm"
                id="competitors"
                name="competitors"
                value={competitionData.competitors}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="labelFrom" htmlFor="scoringSystem">
                Scoring System (e.g. 3/2/1):
              </label>
              <input
                className="inputForm"
                type="text"
                id="scoringSystem"
                name="scoringSystem"
                value={competitionData.scoringSystem}
                onChange={handleInputChange}
              />
            </div>
            <button className="buttonForm" type="submit">
              Save
            </button>
            <button className="buttonForm" type="button" onClick={handleLogout}>
              Logout
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="containerLogin">
      <h1 className="title">Welcome!</h1>
      {/* Use Link component for login */}
      <Link href="/api/auth/login">
        <button className="button">Login</button>
      </Link>
    </div>
  );
}

export default Index;
