import axios from 'axios';

const api = axios.create({
  /*baseURL: 'http://192.168.1.12:3333',*/
  baseURL: 'https://my-json-server.typicode.com/FcoCleirtonMFernandes/rentx',
});

export { api };