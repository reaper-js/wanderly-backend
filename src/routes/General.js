import { attractions, autocompleteSearch, getPhoto, getRoute, geocodeAddress, getMapData, placeDetails, fetchWeather} from "../controllers/General.js";
import express from 'express';
const router = express.Router();

//auto complete search destinations
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