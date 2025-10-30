import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const SUPPORTED_PROVIDERS = new Set([
  'airbnb',
  'booking.com',
  'expedia',
  'vrbo',
  'agoda',
  'tripadvisor',
  'trivago',
  'google travel',
  'google hotels',
  'hostelworld',
  'couchsurfing',
  'spotahome',
  'misterb&b'
]);

const PORT = process.env.PORT || 3000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const parsePrice = (value) => {
  if (!value) return null;
  const normalized = String(value).replace(/[,\s]/g, '');
  const match = normalized.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return null;
  const amount = Number(match[1]);
  return Number.isFinite(amount) ? amount : null;
};

const mapBookingLinks = (links = []) =>
  links
    .filter((link) => {
      if (!link?.name) return false;
      const normalizedName = String(link.name).toLowerCase();
      return SUPPORTED_PROVIDERS.has(normalizedName);
    })
    .map((link) => {
      const priceDisplay = link.price || link.price_per_night || link.price_total || null;
      return {
        platform: link.name,
        link: link.link,
        priceDisplay,
        priceAmount:
          parsePrice(link.price_amount) ??
          parsePrice(priceDisplay) ??
          null
      };
    })
    .filter((link) => link.link && (link.priceDisplay || link.priceAmount !== null));

const buildSerpApiUrl = ({ city, checkIn, checkOut, guests }) => {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    hl: 'es',
    gl: 'es',
    currency: 'USD',
    q: city,
    adults: guests ? String(guests) : '1',
    api_key: SERPAPI_KEY
  });

  if (checkIn) params.set('check_in_date', checkIn);
  if (checkOut) params.set('check_out_date', checkOut);

  return `${SERPAPI_BASE_URL}?${params.toString()}`;
};

const fetchHotelResults = async (searchParams) => {
  const url = buildSerpApiUrl(searchParams);
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SerpAPI respondió con estado ${response.status}: ${errorText}`);
  }

  const payload = await response.json();

  const hotels = (payload.hotels_results || []).map((hotel) => ({
    name: hotel.name,
    address: hotel.address,
    rating: hotel.rating,
    reviews: hotel.reviews,
    thumbnail: hotel.thumbnail,
    totalPrice: hotel.total_price,
    bookingOptions: mapBookingLinks(hotel.booking_links)
  }));

  return hotels.filter((hotel) => hotel.bookingOptions.length > 0);
};

app.get('/api/search', async (req, res) => {
  if (!SERPAPI_KEY) {
    return res.status(500).json({
      error: 'Falta la clave de SERPAPI. Define la variable de entorno SERPAPI_KEY antes de iniciar el servidor.'
    });
  }

  const { city, checkIn, checkOut, guests } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'El parámetro "city" es obligatorio.' });
  }

  try {
    const results = await fetchHotelResults({ city, checkIn, checkOut, guests });
    return res.json({
      city,
      checkIn,
      checkOut,
      guests: guests ? Number(guests) : undefined,
      results
    });
  } catch (error) {
    console.error(error);
    return res.status(502).json({
      error: 'No se pudieron obtener resultados en tiempo real.',
      details: error.message
    });
  }
});

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
