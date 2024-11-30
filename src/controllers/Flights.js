import axios from 'axios';
import { getJson } from 'serpapi';

const getKgmid = async (query) => {
  try {
    const response = await axios.get(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(
        query
      )}&key=${process.env.GOOGLE_MAPS_API_KEY}&limit=1&indent=True`
    );

    const data = response.data;

    if (data.itemListElement && data.itemListElement.length > 0) {
      return data.itemListElement[0].result['@id'].slice(3);
    }

    return null;
  } catch (error) {
    console.error('Error fetching kgmid:', error);
    return null;
  }
};

// export const searchkgmid = async (req, res) => {
//   const { query } = req.body;
//   const kgmid = await getKgmid(query);
//   res.json({ kgmid });
// };

export const searchFlights = async (req, res) => {
  try {
    const { arrivalQuery, departureQuery, date } = req.body;
    const cityName = arrivalQuery.split(',')[0].trim();
    const departureCityName = departureQuery.split(',')[0].trim();
    const arrivalId = await getKgmid(cityName);
    const departureId = await getKgmid(departureCityName);
    const nowdate = date? date :  new Date().toISOString().split('T')[0];
    console.log(date);
    getJson({
      engine: "google_flights",
      hl: "en",
      departure_id: departureId,
      arrival_id: arrivalId,
      outbound_date: nowdate,
      currency: "INR",
      type: "2",
      api_key: process.env.SERPAPI_KEY
    }, (json) => {
      if (!json.best_flights || json.best_flights.length === 0) {
        return res.status(404).json(null);
      }
      res.json(json.best_flights[0].price);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
}