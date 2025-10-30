const listings = [
  {
    city: 'Madrid',
    type: 'hotel',
    capacity: 2,
    name: 'Hotel Gran Vía',
    comparisons: [
      { platform: 'Booking', price: 120 },
      { platform: 'Airbnb', price: 115 },
      { platform: 'Expedia', price: 122 },
      { platform: 'Hotels.com', price: 118 }
    ]
  },
  {
    city: 'Madrid',
    type: 'departamento',
    capacity: 4,
    name: 'Apartamento Sol',
    comparisons: [
      { platform: 'Booking', price: 98 },
      { platform: 'Airbnb', price: 94 },
      { platform: 'Expedia', price: 100 },
      { platform: 'Hotels.com', price: 97 }
    ]
  },
  {
    city: 'Buenos Aires',
    type: 'cabaña',
    capacity: 5,
    name: 'Cabaña Palermo',
    comparisons: [
      { platform: 'Booking', price: 86 },
      { platform: 'Airbnb', price: 80 },
      { platform: 'Expedia', price: 89 },
      { platform: 'Hotels.com', price: 84 }
    ]
  },
  {
    city: 'Buenos Aires',
    type: 'hotel',
    capacity: 2,
    name: 'Hotel Recoleta',
    comparisons: [
      { platform: 'Booking', price: 130 },
      { platform: 'Airbnb', price: 128 },
      { platform: 'Expedia', price: 132 },
      { platform: 'Hotels.com', price: 129 }
    ]
  },
  {
    city: 'Santiago',
    type: 'departamento',
    capacity: 3,
    name: 'Loft Lastarria',
    comparisons: [
      { platform: 'Booking', price: 75 },
      { platform: 'Airbnb', price: 72 },
      { platform: 'Expedia', price: 78 },
      { platform: 'Hotels.com', price: 76 }
    ]
  },
  {
    city: 'Santiago',
    type: 'casa',
    capacity: 6,
    name: 'Casa Vitacura',
    comparisons: [
      { platform: 'Booking', price: 210 },
      { platform: 'Airbnb', price: 205 },
      { platform: 'Expedia', price: 218 },
      { platform: 'Hotels.com', price: 212 }
    ]
  },
  {
    city: 'Ciudad de México',
    type: 'departamento',
    capacity: 2,
    name: 'Depto Condesa',
    comparisons: [
      { platform: 'Booking', price: 88 },
      { platform: 'Airbnb', price: 82 },
      { platform: 'Expedia', price: 91 },
      { platform: 'Hotels.com', price: 89 }
    ]
  },
  {
    city: 'Ciudad de México',
    type: 'hotel',
    capacity: 3,
    name: 'Hotel Reforma',
    comparisons: [
      { platform: 'Booking', price: 140 },
      { platform: 'Airbnb', price: 138 },
      { platform: 'Expedia', price: 145 },
      { platform: 'Hotels.com', price: 142 }
    ]
  },
  {
    city: 'Barcelona',
    type: 'casa',
    capacity: 8,
    name: 'Casa Gràcia',
    comparisons: [
      { platform: 'Booking', price: 320 },
      { platform: 'Airbnb', price: 305 },
      { platform: 'Expedia', price: 330 },
      { platform: 'Hotels.com', price: 318 }
    ]
  },
  {
    city: 'Barcelona',
    type: 'departamento',
    capacity: 4,
    name: 'Departamento Born',
    comparisons: [
      { platform: 'Booking', price: 150 },
      { platform: 'Airbnb', price: 148 },
      { platform: 'Expedia', price: 155 },
      { platform: 'Hotels.com', price: 152 }
    ]
  }
];

const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const yearElement = document.getElementById('year');

yearElement.textContent = new Date().getFullYear();

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

const renderListings = (items) => {
  if (!items.length) {
    resultsContainer.innerHTML = '<p class="muted">No encontramos resultados con esos filtros. Intenta con otra ciudad, capacidad o tipo de alojamiento.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'result-card';

    const minPrice = Math.min(...item.comparisons.map((comparison) => comparison.price));

    card.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <div class="result-card__meta">
          <span class="badge">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
          <span>${item.city}</span>
          <span>Hasta ${item.capacity} personas</span>
        </div>
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
            .map(
              (comparison) => `
                <tr>
                  <td>${comparison.platform}</td>
                  <td>${formatCurrency(comparison.price)}</td>
                </tr>
              `
            )
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

  const city = event.target.city.value.trim().toLowerCase();
  const guests = Number(event.target.guests.value);
  const selectedTypes = Array.from(event.target.types.selectedOptions).map((option) => option.value);

  const filtered = listings.filter((listing) => {
    const matchesCity = listing.city.toLowerCase().includes(city);
    const matchesGuests = listing.capacity >= guests;
    const matchesType = selectedTypes.length ? selectedTypes.includes(listing.type) : true;

    return matchesCity && matchesGuests && matchesType;
  });

  renderListings(filtered);
});

renderListings(listings.slice(0, 3));
