import { autocompleteSearch, getPlaceDetails, getPlacePhotos, getPlaceDetailsWithPhotos } from "../controllers/General.js";
import express from 'express';
const router = express.Router();

//auto complete search destinations
router.get('/autocompleteSearch', autocompleteSearch);
router.get('/getPlaceDetails', getPlaceDetailsWithPhotos);
router.get('/getPlacePhotos', getPlacePhotos);

export default router;