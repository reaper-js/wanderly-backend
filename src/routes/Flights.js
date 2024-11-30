import { searchFlights } from "../controllers/Flights.js";
// import {searchkgmid} from "../controllers/Flights.js";
import express from "express";
const router = express.Router();

router.post("/lowest-flight-price", searchFlights);
// router.post('/search-kgmid', searchkgmid);

export default router;
