import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/cities', async (req, res) => {
  try {
    const response = await axios.get(apiUrl)
    .then(response => {
      // Parse HTML response
      const $ = cheerio.load(response.data);
      // Extract data from HTML using jQuery-like selectors
      const cityName = $('div[class="dataset-header"]').find('h1').text();
      console.log('City Name:', cityName);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });;
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching city data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
