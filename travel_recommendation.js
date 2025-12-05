// travel_recommendation.js
// Updated to support JSON with { countries:[], temples:[], beaches:[] }

const API_PATH = "travel_recommendation_api.json";

let places = []; // will become ONE combined array

// DOM references
const results = document.getElementById('results');
const resultsTitle = document.getElementById('resultsTitle');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const navSearch = document.getElementById('navSearch');

const sections = {
  home: document.getElementById('home'),
  about: document.getElementById('about'),
  contact: document.getElementById('contact')
};

// Load JSON
fetch(API_PATH)
  .then(resp => resp.json())
  .then(data => {

    // Convert nested JSON into a single flat array ========================
    places = [

      // countries → cities
      ...data.countries.flatMap(country =>
        country.cities.map(city => ({
          ...city,
          country: country.name,
          category: "country"
        }))
      ),

      // temples
      ...data.temples.map(t => ({
        ...t,
        country: "Various",
        category: "temple"
      })),

      // beaches
      ...data.beaches.map(b => ({
        ...b,
        country: "Various",
        category: "beach"
      }))
    ];

    // Show some initial recommendations
    renderResults(places.slice(0, 3));

  })
  .catch(err => {
    console.error("JSON Load Error:", err);
    resultsTitle.textContent = "Failed to load data.";
  });

// Navigation
document.querySelectorAll('.nav-link, .brand').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.target || "home";
    showSection(target);
  });
});

function showSection(name) {
  Object.keys(sections).forEach(k => sections[k].classList.remove("active"));
  sections[name].classList.add("active");

  if (name === "home") navSearch.style.display = "flex";
  else navSearch.style.display = "none";
}

// Normalize user input
function normalizeKeyword(s) {
  if (!s) return "";
  s = s.trim().toLowerCase();

  const map = {
    beaches: "beach",
    beach: "beach",
    temples: "temple",
    temple: "temple"
  };

  return map[s] || s;
}

// Check if a place matches a keyword
function matchPlace(place, keyword) {
  keyword = keyword.toLowerCase();

  return (
    place.category.toLowerCase() === keyword ||
    place.country.toLowerCase().includes(keyword) ||
    place.name.toLowerCase().includes(keyword) ||
    (place.description && place.description.toLowerCase().includes(keyword))
  );
}

// Search
searchBtn.addEventListener("click", () => {
  const raw = searchInput.value.trim();
  const keyword = normalizeKeyword(raw);

  if (!keyword) {
    resultsTitle.textContent = "Please enter a keyword.";
    results.innerHTML = "";
    return;
  }

  const found = places.filter(p => matchPlace(p, keyword));

  if (found.length === 0) {
    resultsTitle.textContent = `No results found for "${raw}".`;
    results.innerHTML = "";
  } else {
    resultsTitle.textContent = `Results for "${raw}" (${found.length})`;
    renderResults(found);
  }
});

// Clear
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  resultsTitle.textContent = "Recommended places";
  renderResults(places.slice(0, 3));
});

// Render cards
function renderResults(items) {
  results.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.imageUrl || "";
    img.alt = item.name || "place image";

    const body = document.createElement("div");
    body.className = "body";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "muted";
    meta.textContent = `${item.category.toUpperCase()} • ${item.country}`;

    const desc = document.createElement("p");
    desc.className = "muted";
    desc.textContent = item.description;

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(desc);

    card.appendChild(img);
    card.appendChild(body);

    results.appendChild(card);
  });
}

// Contact form handler
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener("submit", () => {
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const msg = document.getElementById('contactMessage').value;
  const status = document.getElementById('contactStatus');

  if (!name || !email || !msg) {
    status.textContent = "Please fill all fields.";
    return;
  }

  status.textContent = `Thank you ${name}, your message was submitted!`;
  contactForm.reset();
});

// Hero button
document.getElementById("heroBook").addEventListener("click", () => {
  alert("Booking feature coming soon (demo).");
});
