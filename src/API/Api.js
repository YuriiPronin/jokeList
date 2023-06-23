import axios from 'axios';

const BASE_URL = 'https://official-joke-api.appspot.com/';

export const getAllJokes = () => {
  return axios(`${BASE_URL}/jokes/ten`)
    .then(data => data.data)
    .catch(e => console.log(e));
};

export const getRandomJoke = () => {
  return axios(`${BASE_URL}/jokes/random`)
    .then(data => data.data)
    .catch(e => console.log(e));
};
