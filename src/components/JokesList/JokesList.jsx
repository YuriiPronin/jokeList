import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import './JokesList.scss';
import { getAllJokes, getRandomJoke } from '../../API/Api';
import { Box, Typography } from '@mui/material';

const JokesList = () => {
  const [allJokes, setAllJokes] = useState([]);
  const [randomJoke, setRandomJoke] = useState({});
  const [numberOfSlice, setNumberOfSlice] = useState(10);
  const [loadedJokeIds, setLoadedJokeIds] = useState([]);

  async function setAllJoke () {
    try {
      const allJokes = await getAllJokes();
      const filteredJokes = allJokes.filter(joke => !allJokes.some(existingJoke => existingJoke.id === joke.id));
      const updatedJokes = [...filteredJokes, ...allJokes];
      setAllJokes(updatedJokes);
      setLoadedJokeIds(prevIds => [...prevIds, ...allJokes.map(joke => joke.id)]);
      console.log(loadedJokeIds);
      localStorage.setItem('jokes', JSON.stringify(updatedJokes));
    } catch (error) {
      throw new Error('error');
    }
  }

  useEffect(() => {
    setAllJoke();
  }, []);

  async function setRndmJoke () {
    try {
      const rndomJoke = await getRandomJoke();
      if (allJokes.some(joke => joke.id === rndomJoke.id)) {
        setRndmJoke();
      } else {
        setRandomJoke(rndomJoke);
        console.log(randomJoke);
        setLoadedJokeIds(prevIds => [...prevIds, rndomJoke.id]);
        setAllJokes(prevState => {
          const updatedJokes = [...prevState, rndomJoke];
          localStorage.setItem('jokes', JSON.stringify(updatedJokes));
          return updatedJokes;
        });
      }
    } catch (error) {
      throw new Error('error');
    }
  }

  const handleShowMore = async () => {
    await setAllJoke();
    setNumberOfSlice(numberOfSlice + 10);
    setAllJokes(prevState => {
      const updatedJokes = [...prevState];
      const filteredJokes = allJokes.filter(joke => !updatedJokes.some(existingJoke => existingJoke.id === joke.id));
      updatedJokes.push(...filteredJokes.slice(0, 10));
      setLoadedJokeIds(prevIds => [...prevIds, ...filteredJokes.slice(0, 10).map(joke => joke.id)]);
      localStorage.setItem('jokes', JSON.stringify(updatedJokes));
      return updatedJokes;
    });
  };

  const handleDelete = (id) => {
    const newJokeList = allJokes.filter(joke => joke.id !== id);
    setAllJokes(newJokeList);
    setLoadedJokeIds(prevIds => prevIds.filter(jokeId => jokeId !== id));
    localStorage.setItem('jokes', JSON.stringify(newJokeList));
    setNumberOfSlice(numberOfSlice);
  };

  const handleRefresh = async (id, index) => {
    handleDelete(id);
    const updatedJokes = [...allJokes];
    const refreshJoke = await getRandomJoke();
    if (allJokes.some(joke => joke.id === refreshJoke.id)) {
      handleRefresh(id, index);
    } else {
      updatedJokes.splice(index, 0, refreshJoke);
      updatedJokes.splice(index + 1, 1);
      setAllJokes(updatedJokes);
      setLoadedJokeIds(prevIds => [...prevIds, refreshJoke.id]);
      localStorage.setItem('jokes', JSON.stringify(updatedJokes));
    }
  };

  console.log('!!!', allJokes);

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingTop: 25,
        background: 'lightgray',
        alignItems: 'center'
      }}
    >
      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 15, maxWidth: '76%', margin: '0 auto 24px' }}>
        {allJokes.slice(0, numberOfSlice).map((joke, index) => (
          <Card
            key={joke.id}
            sx={{
              width: 275,
              height: 270,
              borderRadius: '10px 10px 10px 10px',
              background: 'gray',
              color: 'white'
            }}
            className="card"
          >
            <CardContent style={{ height: '70%' }}>
              <Box>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 15
                  }}
                >
                  <Box style={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography>Type:</Typography>
                    <Typography style={{ color: 'blue' }}>{joke.type}</Typography>
                  </Box>
                  <Typography style={{ color: 'blue' }}>{`ID #${joke.id}`}</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 3, maxWidth: 210 }}>
                <Typography style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Setup:
                </Typography>
                <Typography style={{ margin: 0, fontSize: 15 }}>
                  {joke.setup}
                </Typography>
              </Box>
              <Box variant="body2">
                <Typography style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Punchline:
                </Typography>
                <Typography style={{ margin: 0, fontSize: 15 }}>
                  {joke.punchline}
                </Typography>
              </Box>
            </CardContent>
            <CardActions className="card-actions">
              <Button
                size="small"
                style={{ width: '33%', background: 'lightgray' }}
                onClick={() => handleDelete(joke.id)}
              >
                Delete
              </Button>
              <Button
                size="small"
                style={{ width: '33%', background: 'lightgray' }}
                onClick={setRndmJoke}
              >
                Add
              </Button>
              <Button
                size="small"
                style={{ width: '33%', background: 'lightgray' }}
                onClick={() => handleRefresh(joke.id, index)}
              >
                Refresh
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box style={{ margin: '0 auto 24px' }}>
        <Button
          style={{
            width: 200,
            background: 'gray',
            color: 'white'
          }}
          onClick={handleShowMore}
        >
            LOAD MORE
        </Button>
      </Box>
    </Box>
  );
};

export default JokesList;
