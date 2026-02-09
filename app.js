const platformCatalog = {
  'Airbnb': {
    logo: 'https://logo.clearbit.com/airbnb.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes`;
      const params = new URLSearchParams();
      if (checkIn) params.set('checkin', checkIn);
      if (checkOut) params.set('checkout', checkOut);
      if (guests) params.set('adults', guests);
      const query = params.toString();
      return query ? `${base}?${query}` : base;
    }
  },
  'Booking.com': {
    logo: 'https://logo.clearbit.com/booking.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = 'https://www.booking.com/searchresults.es.html';
      const params = new URLSearchParams({
        ss: city,
        group_adults: guests || 1,
        checkin: checkIn,
        checkout: checkOut
      });
      return `${base}?${params.toString()}`;
    }
  },
  Expedia: {
    logo: 'https://logo.clearbit.com/expedia.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = 'https://www.expedia.com/Hotel-Search';
      const params = new URLSearchParams({
        destination: city,
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        adults: guests || 1
      });
      return `${base}?${params.toString()}`;
    }
  },
  Vrbo: {
    logo: 'https://logo.clearbit.com/vrbo.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = `https://www.vrbo.com/search/keywords:${encodeURIComponent(city)}`;
      const params = new URLSearchParams();
      if (checkIn) params.set('checkin', checkIn);
      if (checkOut) params.set('checkout', checkOut);
      if (guests) params.set('adults', guests);
      const query = params.toString();
      return query ? `${base}?${query}` : base;
    }
  },
  Agoda: {
    logo: 'https://logo.clearbit.com/agoda.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = 'https://www.agoda.com/search';
      const params = new URLSearchParams({
        city: city,
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        rooms: 1,
        adults: guests || 1
      });
      return `${base}?${params.toString()}`;
    }
  },
  TripAdvisor: {
    logo: 'https://logo.clearbit.com/tripadvisor.com',
    buildUrl: ({ city }) =>
      `https://www.tripadvisor.es/Search?q=${encodeURIComponent(`${city} alojamiento`)}`
  },
  Trivago: {
    logo: 'https://logo.clearbit.com/trivago.com',
    buildUrl: ({ city }) => `https://www.trivago.com/?s=${encodeURIComponent(city)}`
  },
  'Google Travel': {
    logo: 'https://logo.clearbit.com/google.com',
    buildUrl: ({ city }) => `https://www.google.com/travel/hotels/${encodeURIComponent(city)}?hl=es`
  },
  'Google Hotels': {
    logo: 'https://logo.clearbit.com/google.com',
    buildUrl: ({ city }) => `https://www.google.com/travel/hotels/${encodeURIComponent(city)}?hl=es`
  },
  Hostelworld: {
    logo: 'https://logo.clearbit.com/hostelworld.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = 'https://www.hostelworld.com/findabed.php';
      const params = new URLSearchParams({
        searchterms: city,
        datefrom: checkIn || '',
        dateto: checkOut || '',
        persons: guests || 1
      });
      return `${base}?${params.toString()}`;
    }
  },
  Couchsurfing: {
    logo: 'https://logo.clearbit.com/couchsurfing.com',
    buildUrl: ({ city }) => `https://www.couchsurfing.com/places/${encodeURIComponent(city)}`
  },
  Spotahome: {
    logo: 'https://logo.clearbit.com/spotahome.com',
    buildUrl: ({ city, checkIn }) => {
      const base = `https://www.spotahome.com/s/${encodeURIComponent(city)}`;
      if (!checkIn) return base;
      const params = new URLSearchParams({ move_in: checkIn });
      return `${base}?${params.toString()}`;
    }
  },
  'misterb&b': {
    logo: 'https://logo.clearbit.com/misterbandb.com',
    buildUrl: ({ city, checkIn, checkOut, guests }) => {
      const base = 'https://www.misterbandb.com/s';
      const params = new URLSearchParams({
        location: city,
        check_in: checkIn || '',
        check_out: checkOut || '',
        guests: guests || 1
      });
      return `${base}?${params.toString()}`;
    }
  }
};

const priceAdjustments = {
  Airbnb: -5,
  'Booking.com': 0,
  Expedia: 3,
  Vrbo: 2,
  Agoda: 1,
  TripAdvisor: -2,
  Trivago: -1,
  'Google Travel': -3,
  'Google Hotels': -3,
  Hostelworld: -10,
  Couchsurfing: -45,
  Spotahome: -6,
  'misterb&b': 5
};

const createComparisons = (basePrice, platforms) =>
  platforms.map((platform) => ({
    platform,
    price: Math.max(Math.round(basePrice + (priceAdjustments[platform] ?? 0)), Math.round(basePrice * 0.45))
  }));

const formatTypeLabel = (value) => {
  if (!value) return '';
  const stringValue = value.toString();
  return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
};

const createListing = (city, type, capacity, name, basePrice, platforms) => ({
  city,
  type,
  capacity,
  name,
  comparisons: createComparisons(basePrice, platforms)
});

const listings = [
  createListing('Madrid', 'hotel', 2, 'Hotel Gran Vía', 120, [
    'Booking.com',
    'Airbnb',
    'Expedia',
    'Agoda',
    'TripAdvisor',
    'Trivago',
    'Google Travel',
    'Hostelworld'
  ]),
  createListing('Madrid', 'departamento', 4, 'Apartamento Sol', 102, [
    'Airbnb',
    'Booking.com',
    'Vrbo',
    'Spotahome',
    'TripAdvisor',
    'Google Travel',
    'Couchsurfing',
    'Expedia'
  ]),
  createListing('Buenos Aires', 'cabaña', 5, 'Cabaña Palermo', 92, [
    'Airbnb',
    'Booking.com',
    'Expedia',
    'Vrbo',
    'TripAdvisor',
    'Trivago',
    'Google Travel',
    'Spotahome'
  ]),
  createListing('Buenos Aires', 'hotel', 2, 'Hotel Recoleta', 138, [
    'Booking.com',
    'Airbnb',
    'Expedia',
    'Agoda',
    'TripAdvisor',
    'Trivago',
    'Google Travel',
    'Hostelworld'
  ]),
  createListing('Santiago', 'departamento', 3, 'Loft Lastarria', 86, [
    'Airbnb',
    'Booking.com',
    'Spotahome',
    'Vrbo',
    'TripAdvisor',
    'Google Travel',
    'Couchsurfing',
    'Expedia'
  ]),
  createListing('Santiago', 'casa', 6, 'Casa Vitacura', 228, [
    'Airbnb',
    'Booking.com',
    'Vrbo',
    'TripAdvisor',
    'Google Travel',
    'Spotahome',
    'misterb&b',
    'Couchsurfing'
  ]),
  createListing('Ciudad de México', 'departamento', 2, 'Depto Condesa', 98, [
    'Airbnb',
    'Booking.com',
    'Spotahome',
    'Vrbo',
    'TripAdvisor',
    'Google Travel',
    'Couchsurfing',
    'Expedia'
  ]),
  createListing('Ciudad de México', 'hotel', 3, 'Hotel Reforma', 152, [
    'Booking.com',
    'Airbnb',
    'Expedia',
    'Agoda',
    'TripAdvisor',
    'Trivago',
    'Google Travel',
    'Hostelworld'
  ]),
  createListing('Barcelona', 'casa', 8, 'Casa Gràcia', 332, [
    'Airbnb',
    'Booking.com',
    'Vrbo',
    'TripAdvisor',
    'Google Travel',
    'Spotahome',
    'misterb&b',
    'Couchsurfing'
  ]),
  createListing('Barcelona', 'departamento', 4, 'Departamento Born', 168, [
    'Airbnb',
    'Booking.com',
    'Vrbo',
    'Spotahome',
    'TripAdvisor',
    'Google Travel',
    'Couchsurfing',
    'Expedia'
  ])
];

const fallbackTemplateCatalog = {
  hotel: {
    basePrice: 142,
    capacity: 2,
    extraGuestIncrement: 18,
    platforms: ['Booking.com', 'Airbnb', 'Expedia', 'Agoda', 'TripAdvisor', 'Trivago', 'Google Travel', 'Hostelworld'],
    label: (city) => `Hotel destacado en ${city}`
  },
  departamento: {
    basePrice: 118,
    capacity: 4,
    extraGuestIncrement: 15,
    platforms: ['Airbnb', 'Booking.com', 'Vrbo', 'Spotahome', 'TripAdvisor', 'Google Travel', 'Couchsurfing', 'Expedia'],
    label: (city) => `Departamento céntrico en ${city}`
  },
  casa: {
    basePrice: 236,
    capacity: 6,
    extraGuestIncrement: 22,
    platforms: ['Airbnb', 'Booking.com', 'Vrbo', 'TripAdvisor', 'Google Travel', 'Spotahome', 'misterb&b', 'Couchsurfing'],
    label: (city) => `Casa completa en ${city}`
  },
  'cabaña': {
    basePrice: 168,
    capacity: 5,
    extraGuestIncrement: 19,
    platforms: ['Airbnb', 'Booking.com', 'Expedia', 'Vrbo', 'TripAdvisor', 'Trivago', 'Google Travel', 'Spotahome'],
    label: (city) => `Cabaña acogedora en ${city}`
  }
};

const defaultFallbackOrder = Object.keys(fallbackTemplateCatalog);

const generateGenericFallbackListings = ({ city, guests = 1, types = [] }) => {
  const normalizedCity = city?.trim() ? city.trim() : 'tu destino';
  const requestedTypes = types.length ? types : defaultFallbackOrder;
  const uniqueTypes = Array.from(new Set(requestedTypes.length ? requestedTypes : defaultFallbackOrder));

  const listingsForCity = uniqueTypes
    .map((type) => {
      const template = fallbackTemplateCatalog[type] || fallbackTemplateCatalog.hotel;
      const capacity = Math.max(template.capacity, guests || 1);
      const extraGuests = Math.max(0, (guests || 1) - template.capacity);
      const price = template.basePrice + extraGuests * template.extraGuestIncrement;
      const labelFactory = template.label || ((cityName) => `${formatTypeLabel(type)} destacado en ${cityName}`);

      return createListing(
        normalizedCity,
        type,
        capacity,
        labelFactory(normalizedCity),
        price,
        template.platforms
      );
    })
    .filter(Boolean);

  if (listingsForCity.length) {
    return listingsForCity;
  }

  return defaultFallbackOrder.map((type) => {
    const template = fallbackTemplateCatalog[type];
    return createListing(
      normalizedCity,
      type,
      Math.max(template.capacity, guests || 1),
      template.label(normalizedCity),
      template.basePrice,
      template.platforms
    );
  });
};

const normalizeText = (value) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
    : '';

const cityNames = Array.from(new Set(listings.map((listing) => listing.city))).sort((a, b) =>
  a.localeCompare(b, 'es', { sensitivity: 'base' })
);

const remoteCitySuggestionCache = new Map();
let citySuggestionAbortController = null;
let citySuggestionRequestId = 0;
let citySuggestionDebounceId = null;

const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const yearElement = document.getElementById('year');
const overlay = document.getElementById('searchOverlay');
const overlayCity = document.getElementById('overlayCity');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const cityInput = document.getElementById('city');
const citySuggestions = document.getElementById('citySuggestions');
const tripDaysInput = document.getElementById('tripDays');
const plannerPreview = document.getElementById('plannerPreview');
const typesField = document.getElementById('types')?.closest('.field');

let activeCitySuggestion = -1;

const setCitySuggestionsBusy = (isBusy) => {
  if (!cityInput) return;
  if (isBusy) {
    cityInput.setAttribute('aria-busy', 'true');
  } else {
    cityInput.removeAttribute('aria-busy');
  }
};

const formatRemoteCitySuggestion = (entry) => {
  if (!entry?.name) return null;
  const parts = [entry.name];

  const normalizedName = normalizeText(entry.name);
  const normalizedAdmin = normalizeText(entry.admin1);

  if (entry.admin1 && normalizedAdmin && normalizedAdmin !== normalizedName) {
    parts.push(entry.admin1);
  }

  if (entry.country) {
    parts.push(entry.country);
  } else if (entry.country_code) {
    parts.push(entry.country_code);
  }

  const label = parts.filter(Boolean).join(', ');
  return label || null;
};

const fetchRemoteCitySuggestions = async (query, signal) => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const cacheKey = normalizeText(trimmed);
  if (remoteCitySuggestionCache.has(cacheKey)) {
    return remoteCitySuggestionCache.get(cacheKey);
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '6');
  url.searchParams.set('language', 'es');

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`No se pudieron obtener sugerencias (estado ${response.status}).`);
  }

  const payload = await response.json();
  const seen = new Set();
  const suggestions = (payload.results || [])
    .map((entry) => formatRemoteCitySuggestion(entry))
    .filter((value) => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });

  remoteCitySuggestionCache.set(cacheKey, suggestions);
  return suggestions;
};

const updateCitySuggestionsActiveDescendant = (options) => {
  if (!cityInput) return;
  if (activeCitySuggestion >= 0 && options[activeCitySuggestion]) {
    const optionId = options[activeCitySuggestion].id;
    if (optionId) {
      cityInput.setAttribute('aria-activedescendant', optionId);
    }
  } else {
    cityInput.removeAttribute('aria-activedescendant');
  }
};

const hideCitySuggestions = () => {
  if (!citySuggestions || !cityInput) return;
  citySuggestions.hidden = true;
  citySuggestions.innerHTML = '';
  cityInput.setAttribute('aria-expanded', 'false');
  cityInput.removeAttribute('aria-activedescendant');
  activeCitySuggestion = -1;
  if (citySuggestionAbortController) {
    citySuggestionAbortController.abort();
    citySuggestionAbortController = null;
  }
  setCitySuggestionsBusy(false);
};

const showCitySuggestions = (items) => {
  if (!citySuggestions || !cityInput) return;
  if (!items.length) {
    hideCitySuggestions();
    return;
  }

  citySuggestions.innerHTML = '';

  items.forEach((city, index) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'autocomplete__option';
    option.textContent = city;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.dataset.value = city;
    option.id = `citySuggestion-${index}`;
    citySuggestions.appendChild(option);
  });

  citySuggestions.hidden = false;
  cityInput.setAttribute('aria-expanded', 'true');
  activeCitySuggestion = -1;
};

const updateActiveCitySuggestion = (nextIndex) => {
  if (!citySuggestions) return;
  const options = Array.from(citySuggestions.querySelectorAll('.autocomplete__option'));

  if (!options.length) return;

  if (nextIndex < 0) {
    nextIndex = options.length - 1;
  } else if (nextIndex >= options.length) {
    nextIndex = 0;
  }

  options.forEach((option, optionIndex) => {
    if (optionIndex === nextIndex) {
      option.classList.add('is-active');
      option.setAttribute('aria-selected', 'true');
    } else {
      option.classList.remove('is-active');
      option.setAttribute('aria-selected', 'false');
    }
  });

  activeCitySuggestion = nextIndex;
  updateCitySuggestionsActiveDescendant(options);
};

const selectCitySuggestion = (value) => {
  if (!cityInput) return;
  cityInput.value = value;
  cityInput.dispatchEvent(new Event('change', { bubbles: true }));
  hideCitySuggestions();
};

const filterCitySuggestions = (query) => {
  if (!cityInput || !citySuggestions) return;

  const trimmed = query.trim();
  const normalizedQuery = normalizeText(trimmed);

  const localResults = !normalizedQuery
    ? cityNames.slice(0, 6)
    : cityNames.filter((city) => normalizeText(city).includes(normalizedQuery)).slice(0, 6);

  if (localResults.length) {
    showCitySuggestions(localResults);
  } else if (!trimmed) {
    hideCitySuggestions();
  }

  if (!trimmed) {
    if (citySuggestionAbortController) {
      citySuggestionAbortController.abort();
      citySuggestionAbortController = null;
    }
    setCitySuggestionsBusy(false);
    return;
  }

  const cacheKey = normalizedQuery;
  if (remoteCitySuggestionCache.has(cacheKey)) {
    const cached = remoteCitySuggestionCache.get(cacheKey);
    if (cached.length) {
      showCitySuggestions(cached);
    } else if (!localResults.length) {
      hideCitySuggestions();
    }
    return;
  }

  if (citySuggestionAbortController) {
    citySuggestionAbortController.abort();
  }

  const controller = new AbortController();
  citySuggestionAbortController = controller;
  const { signal } = controller;
  const requestId = ++citySuggestionRequestId;

  setCitySuggestionsBusy(true);

  fetchRemoteCitySuggestions(trimmed, signal)
    .then((remoteResults) => {
      if (requestId !== citySuggestionRequestId) return;
      remoteCitySuggestionCache.set(cacheKey, remoteResults);
      if (remoteResults.length) {
        showCitySuggestions(remoteResults);
      } else if (!localResults.length) {
        hideCitySuggestions();
      }
    })
    .catch((error) => {
      if (error.name === 'AbortError') return;
      console.error('No se pudieron obtener sugerencias de ciudades:', error);
      if (requestId !== citySuggestionRequestId) return;
      if (!localResults.length) {
        hideCitySuggestions();
      }
    })
    .finally(() => {
      if (requestId === citySuggestionRequestId) {
        setCitySuggestionsBusy(false);
      }
      if (citySuggestionAbortController === controller) {
        citySuggestionAbortController = null;
      }
    });
};

if (cityInput && citySuggestions) {
  cityInput.addEventListener('input', (event) => {
    window.clearTimeout(citySuggestionDebounceId);
    citySuggestionDebounceId = window.setTimeout(() => {
      filterCitySuggestions(event.target.value);
    }, 200);
  });

  cityInput.addEventListener('focus', () => {
    filterCitySuggestions(cityInput.value);
  });

  cityInput.addEventListener('blur', () => {
    window.requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (activeElement && citySuggestions.contains(activeElement)) return;
      hideCitySuggestions();
    });
  });

  cityInput.addEventListener('keydown', (event) => {
    if (citySuggestions.hidden) return;
    const options = Array.from(citySuggestions.querySelectorAll('.autocomplete__option'));
    if (!options.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        updateActiveCitySuggestion(activeCitySuggestion + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        updateActiveCitySuggestion(activeCitySuggestion - 1);
        break;
      case 'Enter':
        if (activeCitySuggestion >= 0 && options[activeCitySuggestion]) {
          event.preventDefault();
          selectCitySuggestion(options[activeCitySuggestion].dataset.value || options[activeCitySuggestion].textContent);
        }
        break;
      case 'Escape':
        hideCitySuggestions();
        break;
      default:
        break;
    }
  });

  citySuggestions.addEventListener('mousedown', (event) => {
    const option = event.target.closest('.autocomplete__option');
    if (!option) return;
    event.preventDefault();
    selectCitySuggestion(option.dataset.value || option.textContent);
  });

  document.addEventListener('click', (event) => {
    if (event.target === cityInput || citySuggestions.contains(event.target)) return;
    hideCitySuggestions();
  });

}

yearElement.textContent = new Date().getFullYear();

const formatInputDate = (date) => date.toISOString().split('T')[0];

const calculateTripDays = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end - start;
  if (!Number.isFinite(diff) || diff <= 0) return 1;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const syncTripDays = () => {
  if (!tripDaysInput || !checkInInput || !checkOutInput) return;
  tripDaysInput.value = String(calculateTripDays(checkInInput.value, checkOutInput.value));
};


const formatPlanningLabel = (value) => {
  const labels = {
    vuelos: 'Vuelos',
    hospedaje: 'Hospedaje',
    dias: 'Días'
  };
  return labels[value] || formatTypeLabel(value);
};

const getSelectedPlanningFields = () =>
  Array.from(searchForm.querySelectorAll('input[name="planningFields"]:checked')).map((input) => input.value);

const syncPlannerPreview = () => {
  if (!plannerPreview || !searchForm) return;
  const adults = Number(searchForm.adults?.value || 0);
  const children = Number(searchForm.children?.value || 0);
  const total = adults + children;
  const tripDays = calculateTripDays(checkInInput?.value, checkOutInput?.value);
  const planningFields = getSelectedPlanningFields();

  plannerPreview.innerHTML = `
    <div>Plan actual: <strong>${total || 0} viajero${total === 1 ? '' : 's'}</strong> · <strong>${tripDays} día${tripDays === 1 ? '' : 's'}</strong></div>
    <div class="planner-preview__chips">${planningFields.map((field) => `<span class="badge badge--ghost">${formatPlanningLabel(field)}</span>`).join('')}</div>
  `;

  if (typesField) {
    typesField.style.display = planningFields.includes('hospedaje') ? '' : 'none';
  }
};

if (checkInInput && checkOutInput) {
  const today = new Date();
  const defaultCheckIn = new Date(today);
  const defaultCheckOut = new Date(today);
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 7);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 10);
  checkInInput.value = formatInputDate(defaultCheckIn);
  checkOutInput.value = formatInputDate(defaultCheckOut);
  syncTripDays();
  checkInInput.addEventListener('change', syncTripDays);
  checkOutInput.addEventListener('change', syncTripDays);
  checkInInput.addEventListener('change', syncPlannerPreview);
  checkOutInput.addEventListener('change', syncPlannerPreview);
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

const formatDisplayDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
};

const formatDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '';
  return `${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}`;
};

const resolvePlatformEntry = (platform) => {
  if (platformCatalog[platform]) return platformCatalog[platform];
  const matchKey = Object.keys(platformCatalog).find(
    (key) => key.toLowerCase() === String(platform).toLowerCase()
  );
  return matchKey ? platformCatalog[matchKey] : undefined;
};

const buildPlatformUrl = (platform, params) => {
  const entry = resolvePlatformEntry(platform);
  const fallback = `https://www.google.com/search?q=${encodeURIComponent(`${platform} ${params.city} alojamiento`)}`;
  if (!entry || typeof entry.buildUrl !== 'function') {
    return fallback;
  }

  try {
    return entry.buildUrl(params) || fallback;
  } catch (error) {
    return fallback;
  }
};

const getPlatformLogo = (platform) => resolvePlatformEntry(platform)?.logo ?? 'https://logo.clearbit.com/google.com';

const toggleOverlay = (isVisible, city) => {
  if (!overlay) return;
  if (isVisible) {
    if (overlayCity) {
      overlayCity.textContent = city || 'tu destino';
    }
    overlay.hidden = false;
  } else {
    overlay.hidden = true;
  }
};

const renderFallbackListings = (items, searchParams = {}) => {
  if (!items.length) {
    resultsContainer.innerHTML = '<p class="muted">No encontramos resultados con esos filtros. Intenta con otra ciudad, capacidad o tipo de alojamiento.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'result-card';

    const minPrice = Math.min(...item.comparisons.map((comparison) => comparison.price));
    const stayDates = formatDateRange(searchParams.checkIn, searchParams.checkOut);
    const contextCity = searchParams.city || item.city;
    const guests = searchParams.guests || item.capacity;

    card.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <div class="result-card__meta">
          <span class="badge">${formatTypeLabel(item.type)}</span>
          <span>${item.city}</span>
          <span>Hasta ${item.capacity} personas</span>
        </div>
        ${searchParams.types?.length ? `<div class="result-card__preferences" aria-label="Tipo preferido">${searchParams.types
            .map((type) => `<span class="badge badge--ghost">${formatTypeLabel(type)}</span>`)
            .join('')}</div>` : ''}
        ${stayDates ? `<p class="result-card__dates">Fechas sugeridas: <strong>${stayDates}</strong> · ${guests} huésped${guests > 1 ? 'es' : ''}</p>` : ''}
      </div>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Buscador</th>
            <th>Precio por noche</th>
          </tr>
        </thead>
        <tbody>
          ${item.comparisons
            .map((comparison) => {
              const link = buildPlatformUrl(comparison.platform, {
                city: contextCity,
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                guests
              });
              const logo = getPlatformLogo(comparison.platform);
              const isBest = comparison.price === minPrice;

              return `
                <tr class="${isBest ? 'best-price' : ''}">
                  <td>
                    <a class="platform-link" href="${link}" target="_blank" rel="noopener noreferrer">
                      <img class="platform-logo" src="${logo}" alt="${comparison.platform}" loading="lazy" />
                      <span>${comparison.platform}</span>
                    </a>
                  </td>
                  <td>${formatCurrency(comparison.price)}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
      <p class="muted">Mejor precio encontrado: <strong>${formatCurrency(minPrice)}</strong></p>
    `;

    fragment.appendChild(card);
  });

  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(fragment);
};

const formatRealtimePrice = (option) => {
  if (option.priceDisplay) return option.priceDisplay;
  if (typeof option.priceAmount === 'number') return formatCurrency(option.priceAmount);
  return 'Ver detalle';
};

const renderRealtimeResults = (items, searchParams = {}, fallbackItems = []) => {
  if (!items.length) {
    const fallbackSource = fallbackItems.length ? fallbackItems : listings;
    renderFallbackListings(fallbackSource, searchParams);
    renderError('No encontramos resultados en tiempo real para tu búsqueda. Mostramos sugerencias aproximadas.');
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'result-card';

    const bookingOptions = item.bookingOptions || [];
    const priceCandidates = bookingOptions
      .map((option) => (typeof option.priceAmount === 'number' ? option.priceAmount : Number.POSITIVE_INFINITY))
      .filter((value) => Number.isFinite(value));
    const minPrice = priceCandidates.length ? Math.min(...priceCandidates) : null;
    const stayDates = formatDateRange(searchParams.checkIn, searchParams.checkOut);
    const detectedType = item.type ? `<span class="badge">${formatTypeLabel(item.type)}</span>` : '';
    const preferredTypes = searchParams.types?.length
      ? `<div class="result-card__preferences" aria-label="Tipos solicitados">${searchParams.types
          .map((type) => `<span class="badge badge--ghost">${formatTypeLabel(type)}</span>`)
          .join('')}</div>`
      : '';

    card.innerHTML = `
      <div class="result-card__header">
        <div>
          <h3>${item.name}</h3>
          <div class="result-card__meta">
            ${detectedType}
            ${item.address ? `<span>${item.address}</span>` : ''}
            ${item.rating ? `<span>⭐ ${item.rating} (${item.reviews || 'sin reseñas'})</span>` : ''}
          </div>
          ${preferredTypes}
          ${stayDates ? `<p class="result-card__dates">Fechas seleccionadas: <strong>${stayDates}</strong> · ${searchParams.guests || 1} huésped${(searchParams.guests || 1) > 1 ? 'es' : ''}</p>` : ''}
        </div>
        ${item.thumbnail ? `<img class="result-card__thumb" src="${item.thumbnail}" alt="${item.name}" loading="lazy" />` : ''}
      </div>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Buscador</th>
            <th>Precio estimado</th>
          </tr>
        </thead>
        <tbody>
          ${bookingOptions
            .map((comparison) => {
              const link = comparison.link
                ? comparison.link
                : buildPlatformUrl(comparison.platform, {
                    city: searchParams.city || item.name,
                    checkIn: searchParams.checkIn,
                    checkOut: searchParams.checkOut,
                    guests: searchParams.guests
                  });
              const logo = getPlatformLogo(comparison.platform);
              const isBest =
                minPrice !== null && typeof comparison.priceAmount === 'number' && comparison.priceAmount === minPrice;

              return `
                <tr class="${isBest ? 'best-price' : ''}">
                  <td>
                    <a class="platform-link" href="${link}" target="_blank" rel="noopener noreferrer">
                      <img class="platform-logo" src="${logo}" alt="${comparison.platform}" loading="lazy" />
                      <span>${comparison.platform}</span>
                    </a>
                  </td>
                  <td>${formatRealtimePrice(comparison)}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>
      ${minPrice !== null ? `<p class="muted">Mejor precio estimado: <strong>${formatCurrency(minPrice)}</strong></p>` : ''}
    `;

    fragment.appendChild(card);
  });

  resultsContainer.innerHTML = '';
  resultsContainer.appendChild(fragment);
};

const fetchRealtimeResults = async (params) => {
  const query = new URLSearchParams();
  query.set('city', params.city);
  if (params.checkIn) query.set('checkIn', params.checkIn);
  if (params.checkOut) query.set('checkOut', params.checkOut);
  if (params.guests) query.set('guests', String(params.guests));
  if (params.types?.length) query.set('types', params.types.join(','));

  const response = await fetch(`/api/search?${query.toString()}`, {
    headers: {
      Accept: 'application/json'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error || 'No se pudo completar la consulta en tiempo real.';
    throw new Error(errorMessage);
  }

  return data.results || [];
};

const renderError = (message) => {
  resultsContainer.querySelectorAll('.error').forEach((node) => node.remove());
  const paragraph = document.createElement('p');
  paragraph.className = 'muted error';
  paragraph.textContent = message;

  resultsContainer.prepend(paragraph);
};

const renderTripPlanSummary = ({ city, adults, children, tripDays, planningFields, checkIn, checkOut }) => {
  const summaryCard = document.createElement('article');
  summaryCard.className = 'result-card trip-plan-card';
  const totalTravelers = adults + children;
  const selectedPlanning = planningFields.length ? planningFields : ['hospedaje'];

  summaryCard.innerHTML = `
    <div>
      <h3>Tu plan de viaje</h3>
      <div class="result-card__meta">
        <span>${city || 'Destino a definir'}</span>
        <span>${totalTravelers} integrante${totalTravelers === 1 ? '' : 's'}</span>
        <span>${tripDays} día${tripDays === 1 ? '' : 's'}</span>
      </div>
      <p class="result-card__dates">Fechas: <strong>${formatDateRange(checkIn, checkOut) || 'pendientes'}</strong></p>
      <div class="result-card__preferences" aria-label="Campos de planificación">
        ${selectedPlanning.map((field) => `<span class="badge badge--ghost">${formatTypeLabel(field)}</span>`).join('')}
      </div>
    </div>
    <ul class="trip-plan-list">
      <li>Adultos: <strong>${adults}</strong></li>
      <li>Niños: <strong>${children}</strong></li>
      <li>Servicios elegidos: <strong>${selectedPlanning.join(', ')}</strong></li>
    </ul>
  `;

  resultsContainer.prepend(summaryCard);
};


if (searchForm) {
  searchForm.addEventListener('input', (event) => {
    if (event.target.matches('input[name="planningFields"], #adults, #children, #checkIn, #checkOut')) {
      syncPlannerPreview();
    }
  });
  syncPlannerPreview();
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const rawCity = event.target.city.value.trim();
  const city = rawCity.toLowerCase();
  const adults = Number(event.target.adults.value);
  const children = Number(event.target.children.value);
  const guests = adults + children;
  const selectedTypes = Array.from(event.target.types.selectedOptions).map((option) => option.value);
  const planningFields = getSelectedPlanningFields();
  const checkIn = event.target.checkIn.value;
  const checkOut = event.target.checkOut.value;
  const tripDays = calculateTripDays(checkIn, checkOut);

  if (!planningFields.length) {
    resultsContainer.innerHTML = '<p class="muted error">Selecciona al menos un campo para planificar el viaje (vuelos, hospedaje o días).</p>';
    return;
  }

  if (!Number.isFinite(adults) || adults < 1) {
    resultsContainer.innerHTML = '<p class="muted error">Debe haber al menos 1 adulto en el viaje.</p>';
    return;
  }

  if (!checkIn || !checkOut) {
    resultsContainer.innerHTML = '<p class="muted error">Por favor selecciona fechas de check-in y check-out.</p>';
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    resultsContainer.innerHTML = '<p class="muted error">La fecha de check-out debe ser posterior a la de check-in.</p>';
    return;
  }

  let filtered = listings.filter((listing) => {
    const matchesCity = listing.city.toLowerCase().includes(city);
    const matchesGuests = listing.capacity >= guests;
    const matchesType = selectedTypes.length ? selectedTypes.includes(listing.type) : true;

    return matchesCity && matchesGuests && matchesType;
  });
  if (!filtered.length) {
    filtered = generateGenericFallbackListings({ city: rawCity, guests, types: selectedTypes });
  }
  const displayCity = rawCity || 'tu destino';

  toggleOverlay(true, displayCity);

  try {
    const realtime = await fetchRealtimeResults({
      city: rawCity,
      guests,
      checkIn,
      checkOut,
      types: selectedTypes
    });

    toggleOverlay(false);

    if (realtime.length) {
      renderRealtimeResults(
        realtime,
        {
          city: rawCity,
          guests,
          adults,
          children,
          tripDays,
          checkIn,
          checkOut,
          types: selectedTypes
        },
        filtered
      );
      renderTripPlanSummary({
        city: rawCity,
        adults,
        children,
        tripDays,
        planningFields,
        checkIn,
        checkOut
      });
    } else {
      renderFallbackListings(filtered, {
        city: rawCity,
        guests,
        adults,
        children,
        tripDays,
        checkIn,
        checkOut,
        types: selectedTypes
      });
      renderTripPlanSummary({
        city: rawCity,
        adults,
        children,
        tripDays,
        planningFields,
        checkIn,
        checkOut
      });
    }
  } catch (error) {
    console.error(error);
    toggleOverlay(false);
    renderFallbackListings(filtered, {
      city: rawCity,
      guests,
      adults,
      children,
      tripDays,
      checkIn,
      checkOut,
      types: selectedTypes
    });
    renderTripPlanSummary({
      city: rawCity,
      adults,
      children,
      tripDays,
      planningFields,
      checkIn,
      checkOut
    });
    renderError('No pudimos conectar con los buscadores en tiempo real. Te mostramos referencias aproximadas.');
  }
});

resultsContainer.innerHTML =
  '<p class="muted">Introduce tu destino y fechas para consultar a los principales portales en tiempo real.</p>';
