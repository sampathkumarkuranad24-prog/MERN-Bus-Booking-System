import axios from 'axios';

export async function getRoutesFromApi(startCity, destination) {
  return axios.post('http://localhost:8080/booking/', { startCity, destination });
}
