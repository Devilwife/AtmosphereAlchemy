import { Router, type Request, type Response } from 'express';

const router = Router();



// Import services
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

// POST: Retrieve weather data for a city and save it to search history
router.post('/weather', async (req: Request, res: Response) => {
   // Extract city name from request body
  const { city } = req.body;

  // Validate that a city is provided
  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City name is required and must be a string.' });
  }

  try {
    // Fetch weather data for the given city using WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save the city to search history using HistoryService
    await HistoryService.addCity(city);

    // Respond with the weather data
    return res.status(200).json({
      message: `Weather data for ${city} retrieved successfully.`,
      weatherData,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);

    // Handle specific error scenarios (e.g., city not found, API issues)
    if (error instanceof Error && error.message === 'City not found') {
      return res.status(404).json({ error: 'City not found. Please provide a valid city name.' });
    }

    // General error fallback
    return res.status(500).json({ error: 'An error occurred while retrieving weather data.' });
  }
});

// GET: Retrieve search history
router.get('/history', async (_: Request, res: Response) => {
  try {
    // Get search history using HistoryService
    const history = await HistoryService.getCities();

    // Return the search history
    res.status(200).json({
      message: 'Search history retrieved successfully.',
      history,
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});

// DELETE: Remove a city from search history
router.delete('/history', async (req: Request, res: Response) => {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'City ID is required.' });
  }

  try {
    // Delete city from search history using HistoryService
    const deletionResult = await HistoryService.removeCity(parseInt(id as string, 10));

    if (deletionResult !== undefined) {
      return res.status(200).json({ message: 'City deleted from search history.' });
    } else {
      return res.status(404).json({ error: 'City not found in search history.' });
    }
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    return res.status(500).json({ error: 'Failed to delete city from search history.' });
  }
});

export default router;


// TODO: POST Request with city name to retrieve weather data
// TODO: GET weather data from city name
  // TODO: save city to search history
 