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

const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const yearElement = document.getElementById('year');
const overlay = document.getElementById('searchOverlay');
const overlayCity = document.getElementById('overlayCity');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');

yearElement.textContent = new Date().getFullYear();

const formatInputDate = (date) => date.toISOString().split('T')[0];

if (checkInInput && checkOutInput) {
  const today = new Date();
  const defaultCheckIn = new Date(today);
  const defaultCheckOut = new Date(today);
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 7);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 10);
  checkInInput.value = formatInputDate(defaultCheckIn);
  checkOutInput.value = formatInputDate(defaultCheckOut);
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

const buildPlatformUrl = (platform, params) => {
  const entry = platformCatalog[platform];
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

const getPlatformLogo = (platform) => platformCatalog[platform]?.logo ?? 'https://logo.clearbit.com/google.com';

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

const renderListings = (items, searchParams = {}) => {
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
          <span class="badge">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
          <span>${item.city}</span>
          <span>Hasta ${item.capacity} personas</span>
        </div>
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

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const rawCity = event.target.city.value.trim();
  const city = rawCity.toLowerCase();
  const guests = Number(event.target.guests.value);
  const selectedTypes = Array.from(event.target.types.selectedOptions).map((option) => option.value);
  const checkIn = event.target.checkIn.value;
  const checkOut = event.target.checkOut.value;

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

  const filtered = listings.filter((listing) => {
    const matchesCity = listing.city.toLowerCase().includes(city);
    const matchesGuests = listing.capacity >= guests;
    const matchesType = selectedTypes.length ? selectedTypes.includes(listing.type) : true;

    return matchesCity && matchesGuests && matchesType;
  });
  const displayCity = rawCity || 'tu destino';

  toggleOverlay(true, displayCity);

  window.setTimeout(() => {
    toggleOverlay(false);
    renderListings(filtered, {
      city: rawCity,
      guests,
      checkIn,
      checkOut
    });
  }, 1200);
});

const initialCheckIn = checkInInput ? checkInInput.value : '';
const initialCheckOut = checkOutInput ? checkOutInput.value : '';

renderListings(listings.slice(0, 3), {
  city: '',
  guests: 2,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut
});
