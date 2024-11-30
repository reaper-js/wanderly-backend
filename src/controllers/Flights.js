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
    const { arrivalQuery } = req.body;
    const cityName = arrivalQuery.split(',')[0].trim();
    const arrivalId = await getKgmid(cityName);
    
  getJson({
    engine: "google_flights",
    hl: "en",
    departure_id: "/m/0dlv0", // New Delhi
    arrival_id: arrivalId,
    outbound_date: "2024-12-07",
    currency: "INR",
    type: "2",
    api_key: process.env.SERPAPI_KEY
  }, (json) => {
    res.json(json.best_flights[0].price);
  });
}