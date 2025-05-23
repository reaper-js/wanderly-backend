import { attractions, autocompleteSearch, getPhoto, getRoute, geocodeAddress, getMapData, placeDetails, fetchWeather} from "../controllers/General.js";
import express from 'express';
// import { apiLimiter } from '../middleware/rateLimiter.js';
const router = express.Router();

//auto complete search destinations
// router.get('/autocompleteSearch', apiLimiter, autocompleteSearch);
// router.get('/getPlaceDetails', apiLimiter, placeDetails);
// router.get('/photos/:photoReference', apiLimiter, getPhoto); // New route for photo proxy
// router.get('/attractions', apiLimiter, attractions);
// router.get('/fetchWeather/:city', apiLimiter, fetchWeather);
// router.post('/getRoute', apiLimiter, getRoute);
// router.get('/getMapData', apiLimiter, getMapData);
// router.post('/geocodeAddress', apiLimiter, geocodeAddress);
// // router.get('/getPlacePhotos', getPlacePhotos);

router.get('/autocompleteSearch', autocompleteSearch);
router.get('/getPlaceDetails', placeDetails);
router.get('/photos/:photoReference', getPhoto); // New route for photo proxy
router.get('/attractions', attractions);
router.get('/fetchWeather/:city', fetchWeather);
router.post('/getRoute', getRoute);
router.get('/getMapData', getMapData);
router.post('/geocodeAddress', geocodeAddress);
// router.get('/getPlacePhotos', getPlacePhotos);

export default router;