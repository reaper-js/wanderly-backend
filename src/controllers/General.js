import { Client } from '@googlemaps/google-maps-services-js';
import axios from 'axios';


//Search destinations Auto-Complete
const client = new Client({});
export const autocompleteSearch = async (req, res) => {
    const { input } = req.query;
  
  try {
    const response = await client.placeAutocomplete({
      params: {
        input: input,
        types: ['(cities)'],
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    res.json({ predictions: response.data.predictions });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
}


export const placeDetails = async (req, res) => {
  const { placeid } = req.query;
  try {
    // Keep API key in backend only
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          placeid: placeid,
          fields: 'name,formatted_address,photos,editorial_summary',
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );
    
    // Transform photo URLs into your own API endpoints
    const photos = (response.data.result.photos || []).slice(0, 7).map((photo, index) => ({
      id: index,
      url: `/photos/${photo.photo_reference}`, // Your proxy endpoint
      description: "View of the location"
    }));

    const placeDetails = response.data.result;
    const combinedResponse = {
      name: placeDetails.name,
      description: placeDetails.editorial_summary?.overview ||
                  `${placeDetails.name} is a popular destination known for its unique character and attractions.`,
      address: placeDetails.formatted_address,
      photos: photos
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch place details and photos' });
  }
}

// Add a new endpoint to proxy photo requests
export const getPhoto = async (req, res) => {
  const { photoReference } = req.params;
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  
  try {
    const response = await axios.get(photoUrl, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
}


export const attractions = async (req, res) => {
  const { city } = req.query;
  if (!city) {
      return res.status(400).json({ error: 'City is required' });
  }

  try {
      // Example: Using Google Places API
      const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
      const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json`,
          {
              params: {
                  query: `top attractions in ${city}`,
                  type: 'tourist_attraction', // Filter for attractions
                  key: googleApiKey,
                  pagesize: 10,
              },
          }
      );

      const results = response.data.results.slice(0, 10).map((place, index) => ({
          id: index,
          name: place.name,
          photoUrl: `/photos/${place.photos?.[0]?.photo_reference}`, // For fetching photos
      }));

      res.status(200).json(results);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Failed to fetch tourist attractions' });
  }
};

