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

const normalize = (value) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()
    : '';

const TYPE_KEYWORDS = {
  hotel: ['hotel'],
  cabana: ['cabana', 'cabaña', 'cabin', 'lodge'],
  departamento: ['departamento', 'apartment', 'apartamento', 'flat', 'suite'],
  casa: ['casa', 'house', 'home', 'villa', 'chalet']
};

const buildQueryWithTypes = (city, types = []) => {
  if (!types.length) return city;
  const uniqueKeywords = new Set();
  types.forEach((type) => {
    const normalized = normalize(type);
    const keywords = TYPE_KEYWORDS[normalized] || [type];
    keywords.forEach((keyword) => uniqueKeywords.add(keyword));
  });

  const keywordPart = Array.from(uniqueKeywords)
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .join(' ');

  if (!keywordPart) return city;
  return `${keywordPart} ${city}`.trim();
};

const buildSerpApiUrl = ({ city, checkIn, checkOut, guests, types }) => {
  const params = new URLSearchParams({
    engine: 'google_hotels',
    hl: 'es',
    gl: 'es',
    currency: 'USD',
    q: buildQueryWithTypes(city, types),
    adults: guests ? String(guests) : '1',
    api_key: SERPAPI_KEY
  });

  if (checkIn) params.set('check_in_date', checkIn);
  if (checkOut) params.set('check_out_date', checkOut);

  return `${SERPAPI_BASE_URL}?${params.toString()}`;
};

const matchesPreferredTypes = (hotel, preferredTypes = []) => {
  if (!preferredTypes.length) return true;

  const normalizedPreferred = preferredTypes
    .map((type) => normalize(type))
    .filter(Boolean);

  if (!normalizedPreferred.length) return true;

  const hotelHints = [hotel.type, hotel.property_type, hotel.category, hotel.subtype, hotel.address]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => normalize(value))
    .filter(Boolean);

  if (!hotelHints.length) {
    return true;
  }

  return normalizedPreferred.some((type) => {
    const keywords = TYPE_KEYWORDS[type] || [type];
    return hotelHints.some((hint) => keywords.some((keyword) => hint.includes(normalize(keyword))));
  });
};


const buildGoogleFlightsExternalUrl = ({ origin, destination, departureDate, returnDate, adults, children }) => {
  const params = new URLSearchParams({ hl: 'es' });
  if (origin) params.set('f', origin);
  if (destination) params.set('t', destination);
  if (departureDate) params.set('d', departureDate);
  if (returnDate) params.set('r', returnDate);
  params.set('ad', String(Math.max(1, Number(adults) || 1)));
  const kids = Math.max(0, Number(children) || 0);
  if (kids > 0) params.set('ch', String(kids));
  return `https://www.google.com/travel/flights?${params.toString()}`;
};

const buildFlightsSerpApiUrl = ({ origin, destination, departureDate, returnDate, adults, children }) => {
  const params = new URLSearchParams({
    engine: 'google_flights',
    hl: 'es',
    gl: 'es',
    currency: 'USD',
    departure_id: origin || '',
    arrival_id: destination,
    outbound_date: departureDate,
    api_key: SERPAPI_KEY
  });

  if (returnDate) params.set('return_date', returnDate);
  params.set('adults', String(Math.max(1, Number(adults) || 1)));
  const kids = Math.max(0, Number(children) || 0);
  if (kids > 0) params.set('children', String(kids));

  return `${SERPAPI_BASE_URL}?${params.toString()}`;
};

const mapFlightResult = (flight) => {
  const flights = Array.isArray(flight.flights) ? flight.flights : [];
  const firstLeg = flights[0] || {};
  const lastLeg = flights[flights.length - 1] || {};
  const airline = firstLeg.airline || flight.airline || null;
  const route = firstLeg.departure_airport?.id && lastLeg.arrival_airport?.id
    ? `${firstLeg.departure_airport.id} → ${lastLeg.arrival_airport.id}`
    : null;

  return {
    airline,
    route,
    duration: flight.total_duration || flight.duration || null,
    priceDisplay: flight.price ? `$${flight.price}` : null,
    priceAmount: Number.isFinite(Number(flight.price)) ? Number(flight.price) : null
  };
};

const fetchFlightResults = async (searchParams) => {
  const url = buildFlightsSerpApiUrl(searchParams);
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SerpAPI (vuelos) respondió con estado ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  const outbound = Array.isArray(payload.best_flights) ? payload.best_flights : [];
  const alternatives = Array.isArray(payload.other_flights) ? payload.other_flights : [];

  const flights = [...outbound, ...alternatives].slice(0, 10).map(mapFlightResult);
  const numericPrices = flights
    .map((flight) => flight.priceAmount)
    .filter((value) => Number.isFinite(value));

  return {
    flights,
    bestPrice: numericPrices.length ? Math.min(...numericPrices) : null,
    googleFlightsUrl: buildGoogleFlightsExternalUrl(searchParams)
  };
};

const fetchHotelResults = async (searchParams) => {
  const url = buildSerpApiUrl(searchParams);
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SerpAPI respondió con estado ${response.status}: ${errorText}`);
  }

  const payload = await response.json();

  const hotels = (payload.hotels_results || [])
    .filter((hotel) => matchesPreferredTypes(hotel, searchParams.types))
    .map((hotel) => ({
      name: hotel.name,
      address: hotel.address,
      rating: hotel.rating,
      reviews: hotel.reviews,
      thumbnail: hotel.thumbnail,
      totalPrice: hotel.total_price,
      bookingOptions: mapBookingLinks(hotel.booking_links),
      type: hotel.type || hotel.property_type || null
    }));

  return hotels.filter((hotel) => hotel.bookingOptions.length > 0);
};


app.get('/api/flights', async (req, res) => {
  if (!SERPAPI_KEY) {
    return res.status(500).json({
      error: 'Falta la clave de SERPAPI. Define la variable de entorno SERPAPI_KEY antes de iniciar el servidor.'
    });
  }

  const { origin, destination, departureDate, returnDate, adults, children } = req.query;

  if (!destination) {
    return res.status(400).json({ error: 'El parámetro "destination" es obligatorio.' });
  }

  if (!departureDate) {
    return res.status(400).json({ error: 'El parámetro "departureDate" es obligatorio.' });
  }

  try {
    const results = await fetchFlightResults({
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children
    });

    return res.json({
      ...results,
      destination,
      origin: origin || null,
      departureDate,
      returnDate: returnDate || null,
      adults: Math.max(1, Number(adults) || 1),
      children: Math.max(0, Number(children) || 0)
    });
  } catch (error) {
    console.error(error);
    return res.status(502).json({
      error: 'No se pudieron obtener vuelos en tiempo real desde Google Flights.',
      details: error.message
    });
  }
});

app.get('/api/search', async (req, res) => {
  if (!SERPAPI_KEY) {
    return res.status(500).json({
      error: 'Falta la clave de SERPAPI. Define la variable de entorno SERPAPI_KEY antes de iniciar el servidor.'
    });
  }

  const { city, checkIn, checkOut, guests } = req.query;
  const types = typeof req.query.types === 'string' && req.query.types.length
    ? req.query.types.split(',').map((value) => value.trim()).filter(Boolean)
    : [];

  if (!city) {
    return res.status(400).json({ error: 'El parámetro "city" es obligatorio.' });
  }

  try {
    const results = await fetchHotelResults({ city, checkIn, checkOut, guests, types });
    return res.json({
      city,
      checkIn,
      checkOut,
      guests: guests ? Number(guests) : undefined,
      types,
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
