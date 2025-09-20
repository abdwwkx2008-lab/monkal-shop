import axios from 'axios';

export default axios.create({
  baseURL: 'https://monkal-shop.onrender.com', // путь к backend
  withCredentials: false
});
