import { Client } from "@googlemaps/google-maps-services-js";
import axios from "axios";

//Search destinations Auto-Complete
const client = new Client({});
export const autocompleteSearch = async (req, res) => {
  const { input } = req.query;

  try {
    const response = await client.placeAutocomplete({
      params: {
        input: input,
        types: ["(cities)"],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    res.json({ predictions: response.data.predictions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
};

export const placeDetails = async (req, res) => {
  const { placeid } = req.query;
  try {
    // Keep API key in backend only
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          placeid: placeid,
          fields: "name,formatted_address,photos,editorial_summary",
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    // Transform photo URLs into your own API endpoints
    const photos = (response.data.result.photos || [])
      .slice(0, 7)
      .map((photo, index) => ({
        id: index,
        url: `/photos/${photo.photo_reference}`, // Your proxy endpoint
        description: "View of the location",
      }));

    const placeDetails = response.data.result;
    const combinedResponse = {
      name: placeDetails.name,
      description:
        placeDetails.editorial_summary?.overview ||
        `${placeDetails.name} is a popular destination known for its unique character and attractions.`,
      address: placeDetails.formatted_address,
      photos: photos,
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch place details and photos" });
  }
};

// Add a new endpoint to proxy photo requests
export const getPhoto = async (req, res) => {
  const { photoReference } = req.params;
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(photoUrl, { responseType: "stream" });
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch photo" });
  }
};

export const attractions = async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    // Example: Using Google Places API
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: `top attractions in ${city}`,
          type: "tourist_attraction", // Filter for attractions
          key: googleApiKey,
          pagesize: 10,
        },
      }
    );

    const results = response.data.results.slice(0, 10).map((place, index) => ({
      id: index,
      name: place.name,
      photoUrl: `/photos/${place.photos?.[0]?.photo_reference}`, // For fetching photos
      formatted_address: place.formatted_address,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch tourist attractions" });
  }
};

export const fetchWeather = async (req, res) => {
  const cityName = req.params.city;
  const apikey = process.env.WEATHER_API_KEY;
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${cityName}&aqi=no`;
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (e) {
    console.log(e);
  }
};

// export const getRoute = async (req, res) => {
//   const { origin, destination, intermediates, travelMode, routingPreference } =
//     req.body;

//   try {
//     const response = await client.directions({
//       params: {
//         origin: origin.address,
//         destination: destination.address,
//         waypoints: intermediates.map((point) => point.address),
//         mode: travelMode.toLowerCase(),
//         optimize: true,
//         key: process.env.GOOGLE_MAPS_API_KEY,
//       },
//     });

//     res.json({
//       routes: [
//         {
//           polyline: {
//             encodedPolyline: response.data.routes[0].overview_polyline.points,
//           },
//         },
//       ],
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to get route" });
//   }
// };

export const getMapData = async (req, res) => {
  const locationsData = await JSON.parse(req.query.locations);
  try {
    // Get route directions
    const directionsResponse = await client.directions({
      params: {
        origin: locationsData[0].address,
        destination: locationsData[locationsData.length - 1].address,
        waypoints: locationsData.slice(1, -1).map((loc) => loc.address),
        optimize: true,
        mode: "driving",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    const polyline = directionsResponse.data.routes[0].overview_polyline.points;

    // Construct the static map URL
    const params = {
      size: "800x600",
      path: `enc:${polyline}`,
      key: process.env.GOOGLE_MAPS_API_KEY,
    };

    // Add markers for each location
    locationsData.forEach((loc, index) => {
      params[`markers`] = `label:${String.fromCharCode(65 + index)}|${
        loc.address
      }`;
    });

    // Convert params to query string
    const queryString = new URLSearchParams(params).toString();

    // Construct the URL
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?${queryString}`;

    const staticMapResponse = await axios.get(staticMapUrl, {
      responseType: "arraybuffer",
    });

    const mapData = {
      routes: directionsResponse.data.routes,
      staticMapUrl,
      mapImage: `data:image/png;base64,${Buffer.from(
        staticMapResponse.data
      ).toString("base64")}`,
      markers: locationsData,
    };
    res.json(mapData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate map" });
  }
};
