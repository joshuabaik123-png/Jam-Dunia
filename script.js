let cities = [
  { id: 1, name: "London", timeZone: "Europe/London" },
  { id: 2, name: "Kuala Lumpur", timeZone: "Asia/Kuala_Lumpur" },
  { id: 3, name: "Paris", timeZone: "Europe/Paris" },
];

const jamEl = document.getElementById("myclock");
const addForm = document.getElementById("add-city-form");
const btnCancelEdit = document.getElementById("btn-cancel-edit");
const editModal = document.getElementById("edit-modal");
const editCityModal = document.getElementById("edit-city-form");

function formatTime(timezone, now) {
  // "Europe/London"
  return Intl.DateTimeFormat("id-ID", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(now)
    .replace(".", ":");
}

function getOffset(targetTimezone) {
  const now = new Date();
  const jkt = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));;
  const targetTz = new Date(
    now.toLocaleString("en-US", { timeZone: targetTimezone }),
  );
  const getDiffHours = Math.round((targetTz - jkt) / (1000 * 60 * 60));
  const dayDiff = targetTz.getDate() - jkt.getDate();

  if (getDiffHours === 0) {
    return `Today, 0h`;
  }

  const sign = getDiffHours > 0 ? "+" : "";
  return `Today, ${sign}${getDiffHours}h`;
}

function renderWorldClock(now) {
  const cityListElement = document.getElementById("city-list");
  cityListElement.innerHTML = "";
  cities.forEach((city) => {
    // looping 1
    // { name: "London", timeZone: "Europe/London" },
    // city.timeZone => "Europe/London"
    // city.name =>  "London"

    // looping 2
    // { name: "Kuala Lumpur", timeZone: "Asia/Kuala_Lumpur" },
    // city.timeZone => "Asia/Kuala_Lumpur"
    const timeText = formatTime(city.timeZone, now); // 13:46
    const offset = getOffset(city.timeZone);
    const cityItem = document.createElement("div");
    cityItem.className = "clock-card city-item";
    cityItem.innerHTML = `
              <div class="city-info">
                <div class="city-name-wrap">
                  <span class="city-name">${city.name}</span>
                  <span class="offset-text">${offset}</span>
                  <span class="offset-text">${city.timeZone}</span>
                </div>
                <div class="city-time">${timeText}</div>
              </div>
              <div class="card-actions">
        <button class="btn btn-edit" onclick="openEditModal(${city.id})">Edit</button>
        <button class="btn btn-delete" onclick="deleteCity(${city.id})">Hapus</button>
      </div>
    `;

    cityListElement.appendChild(cityItem);
  });
}

addForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById('city-name');
  const tzInput = document.getElementById('city-timezone');

  const newCity = {
    id: Date.now(),
    name: nameInput.value.trim(),
    timeZone: tzInput.value.trim()
  }

  cities.unshift(newCity);
  nameInput.value = "";
  tzInput.value = "";
  renderWorldClock(new Date());
})

function openEditModal(id) {
  console.log(id);
  const city = cities.find(c => c.id === id)
  if (!city) return;

  document.getElementById('edit-city-id').value = city.id
  document.getElementById('edit-city-name').value = city.name
  document.getElementById('edit-city-timezone').value = city.timeZone

  editModal.classList.add('active');
}

editCityModal.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById('edit-city-id').value;
  const name = document.getElementById('edit-city-name').value;
  const tz = document.getElementById('edit-city-timezone').value;

  cities = cities.map((city) => city.id == id ? { ...city, name, timeZone: tz } : city);

  editModal.classList.remove('active');
  renderWorldClock(new Date());
})

btnCancelEdit.addEventListener("click", function () {
  editModal.classList.remove('active')
})

function deleteCity(id) {
  cities = cities.filter((city) => city.id !== id)
  renderWorldClock(new Date());
}

function init() {
  const now = new Date();
  const jam = now.getHours();
  const menit = now.getMinutes();
  const detik = now.getSeconds();

  const formatJam = String(jam).padStart(2, "0");
  const formatMenit = String(menit).padStart(2, "0");
  const formatDetik = String(detik).padStart(2, "0");

  jamEl.textContent = `${formatJam}:${formatMenit}:${formatDetik}`;
  renderWorldClock(now);
}

// Panggil Fungsi init
init();

setInterval(init, 1000);