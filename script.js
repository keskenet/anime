// Sample anime data as default values
const defaultAnimeData = {
  watching: [
    {
      title: "Attack on Titan: Final Season",
      episodes: "Епізод 12 з 16",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 5,
      videoUrl: "https://example.com/watch/attack-on-titan"
    },
    {
      title: "Demon Slayer: Entertainment District Arc",
      episodes: "Епізод 8 з 11",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 4,
      videoUrl: "https://example.com/watch/demon-slayer"
    }
  ],
  completed: [
    {
      title: "Death Note",
      episodes: "37 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 5,
      videoUrl: "https://example.com/watch/death-note"
    }
  ],
  plan: [
    {
      title: "Fullmetal Alchemist: Brotherhood",
      episodes: "64 епізоди",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 0,
      videoUrl: "https://example.com/watch/fullmetal-alchemist",
      plannedDate: "2025-07-15"
    }
  ]
};

// New releases data (before user additions)
const newReleasesData = {
  "Зима 2025": [
    {
      title: "Solo Leveling",
      episodes: "12 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 4.8,
      videoUrl: "https://example.com/watch/solo-leveling"
    },
    {
      title: "Classroom of the Elite Season 3",
      episodes: "13 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 4.5,
      videoUrl: "https://example.com/watch/classroom-elite-s3"
    }
  ],
  "Весна 2025": [
    {
      title: "Spy x Family Season 2",
      episodes: "12 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 4.9,
      videoUrl: "https://example.com/watch/spy-family-s2"
    }
  ],
  "Літо 2025": [
    {
      title: "One Punch Man Season 3",
      episodes: "12 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 4.7,
      videoUrl: "https://example.com/watch/one-punch-man-s3"
    }
  ],
  "Осінь 2025": [
    {
      title: "Chainsaw Man Part 2",
      episodes: "12 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 4.6,
      videoUrl: "https://example.com/watch/chainsaw-man-p2"
    }
  ]
};

// --- STORAGE API ---
// Функції для роботи з localStorage
async function getStorage() {
  try {
    const data = localStorage.getItem('animeWorldStorage');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading storage:', error);
  }
  // Return default structure if storage can't be read or is empty
  return {
    animeData: defaultAnimeData,
    users: {},
    loggedInUser: null,
    userNewReleases: {} // Ініціалізуємо для нових релізів, доданих користувачем
  };
}

async function saveStorage(data) {
  try {
    localStorage.setItem('animeWorldStorage', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving storage:', error);
    alert('Помилка збереження даних. Спробуйте пізніше.');
    throw error;
  }
}

// --- Допоміжні функції для роботи з DOM ---
function getById(id) {
  return document.getElementById(id);
}
function getBySelector(selector) {
  return document.querySelector(selector);
}
function getAllBySelector(selector) {
  return document.querySelectorAll(selector);
}

// --- Функція для визначення сезону за датою ---
function getSeasonFromDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();

  let season = "";
  if (month >= 11 || month <= 1) { // Грудень, Січень, Лютий
    season = "Зима";
  } else if (month >= 2 && month <= 4) { // Березень, Квітень, Травень
    season = "Весна";
  } else if (month >= 5 && month <= 7) { // Червень, Липень, Серпень
    season = "Літо";
  } else { // Вересень, Жовтень, Листопад
    season = "Осінь";
  }
  return `${season} ${year}`;
}

// --- Клас для менеджменту аніме та користувачів ---
class AnimeManager {
  constructor() {
    this.animeData = { watching: [], completed: [], plan: [] };
    this.users = {};
    this.loggedInUser = null;
    this.userNewReleases = {}; // Для аніме, доданого користувачем до нових релізів
  }

  async loadAllData() {
    const storage = await getStorage();
    this.animeData = storage.animeData && Object.keys(storage.animeData).length > 0
      ? storage.animeData
      : defaultAnimeData;
    this.users = storage.users || {};
    this.loggedInUser = storage.loggedInUser || null;
    this.userNewReleases = storage.userNewReleases || {}; // Завантажуємо дані
  }

  async saveAllData() {
    await saveStorage({
      animeData: this.animeData,
      users: this.users,
      loggedInUser: this.loggedInUser,
      userNewReleases: this.userNewReleases // Зберігаємо дані
    });
  }

  async addOrEditAnime(newAnime, status, editMode, oldStatus, index) {
    await this.loadAllData();

    // Визначаємо сезон на основі plannedDate, якщо він існує і статус 'plan'
    let seasonToAdd = null;
    if (status === 'plan' && newAnime.plannedDate) {
        seasonToAdd = getSeasonFromDate(newAnime.plannedDate);
    }

    if (editMode) {
      const oldAnime = this.animeData[oldStatus][index];

      if (oldStatus === status) {
        this.animeData[status][index] = newAnime;
      } else {
        this.animeData[oldStatus].splice(index, 1);
        this.animeData[status].push(newAnime);
      }

      // Оновлення userNewReleases: видаляємо стару версію
      if (oldAnime && oldAnime.title) {
        for (const s in this.userNewReleases) {
            this.userNewReleases[s] = this.userNewReleases[s].filter(a => a.title !== oldAnime.title);
        }
      }
      
      // Додаємо нову версію, якщо є сезон
      if (seasonToAdd) {
        if (!this.userNewReleases[seasonToAdd]) {
            this.userNewReleases[seasonToAdd] = [];
        }
        // Перевіряємо, чи аніме вже не існує в цьому сезоні, щоб уникнути дублікатів
        const isAlreadyInSeason = this.userNewReleases[seasonToAdd].some(a => a.title === newAnime.title);
        if (!isAlreadyInSeason) {
            this.userNewReleases[seasonToAdd].push(newAnime);
        }
      }

    } else { // Додавання нового аніме
      this.animeData[status].push(newAnime);
      
      // Додаємо до userNewReleases, якщо є сезон
      if (seasonToAdd) {
        if (!this.userNewReleases[seasonToAdd]) {
          this.userNewReleases[seasonToAdd] = [];
        }
        // Перевіряємо, чи аніме вже не існує в цьому сезоні, щоб уникнути дублікатів
        const isAlreadyInSeason = this.userNewReleases[seasonToAdd].some(a => a.title === newAnime.title);
        if (!isAlreadyInSeason) {
            this.userNewReleases[seasonToAdd].push(newAnime);
        }
      }
    }
    await this.saveAllData();
  }

  async deleteAnime(status, index) {
    await this.loadAllData();
    const animeToDelete = this.animeData[status][index];
    this.animeData[status].splice(index, 1);

    // Видаляємо також з userNewReleases, якщо воно там є
    if (animeToDelete && animeToDelete.title) {
        for (const s in this.userNewReleases) {
            this.userNewReleases[s] = this.userNewReleases[s].filter(a => a.title !== animeToDelete.title);
        }
    }
    await this.saveAllData();
  }

  // Нова функція для отримання всіх нових релізів (передзавантажених + користувацьких)
  async getCombinedNewReleases(season) {
      await this.loadAllData();
      const combined = [
          ...(newReleasesData[season] || []), // Передзавантажені дані
          ...(this.userNewReleases[season] || []) // Дані, додані користувачем
      ];
      // Забезпечуємо унікальність за назвою, якщо одне і те ж аніме є в обох списках
      const uniqueTitles = new Set();
      const uniqueReleases = [];
      for (const anime of combined) {
          if (!uniqueTitles.has(anime.title)) {
              uniqueTitles.add(anime.title);
              uniqueReleases.push(anime);
          }
      }
      return uniqueReleases;
  }

  // Отримуємо всі унікальні сезони з передзавантажених та користувацьких даних
  async getAllUniqueSeasons() {
    await this.loadAllData();
    const allSeasons = new Set();

    // Додаємо сезони з передзавантажених даних
    for (const season in newReleasesData) {
      allSeasons.add(season);
    }

    // Додаємо сезони з даних користувача
    for (const season in this.userNewReleases) {
      allSeasons.add(season);
    }
    
    // Сортуємо сезони, щоб вони йшли в логічному порядку (наприклад, по року, потім по сезону)
    const sortedSeasons = Array.from(allSeasons).sort((a, b) => {
        const [seasonNameA, yearA] = a.split(' ');
        const [seasonNameB, yearB] = b.split(' ');
        
        if (parseInt(yearA) !== parseInt(yearB)) {
            return parseInt(yearA) - parseInt(yearB);
        }
        
        const seasonOrder = { "Зима": 1, "Весна": 2, "Літо": 3, "Осінь": 4 };
        return seasonOrder[seasonNameA] - seasonOrder[seasonNameB];
    });

    return sortedSeasons;
  }

  getAllAnime() {
    return [
      ...this.animeData.watching,
      ...this.animeData.completed,
      ...this.animeData.plan
    ];
  }

  async registerUser(username, password) {
    await this.loadAllData();
    if (this.users[username]) return false;
    this.users[username] = password;
    await this.saveAllData();
    return true;
  }

  async loginUser(username, password) {
    await this.loadAllData();
    if (this.users[username] && this.users[username] === password) {
      this.loggedInUser = username;
      await this.saveAllData();
      return true;
    }
    return false;
  }

  async logoutUser() {
    await this.loadAllData();
    this.loggedInUser = null;
    await this.saveAllData();
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }
}

// --- Створення глобального екземпляру менеджера ---
const animeManager = new AnimeManager();

const profileSection = getById('profile');

const authModal = getById('authModal');
const authTabButtons = getAllBySelector('.auth-tab-btn');
function activateAuthTab(tabName) {
  authTabButtons.forEach(button => {
    if (button.dataset.authTab === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  getAllBySelector('.auth-form').forEach(form => {
    if (form.id.startsWith(tabName)) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
}

// Функція для редагування аніме
async function fillAnimeForm(anime, status, index) { // Додаємо async
  getById('animeTitle').value = anime.title;
  getById('animeEpisodes').value = anime.episodes;
  getById('animeCover').value = anime.cover;
  getById('animeVideo').value = anime.videoUrl;
  getById('animeStatus').value = status;
  const plannedDateInput = getById('animePlannedDate');
  const plannedDateGroup = getById('animePlannedDateGroup');

  if (status === 'plan' && anime.plannedDate) {
    plannedDateInput.value = anime.plannedDate;
    plannedDateGroup.style.display = 'block';
  } else {
    plannedDateInput.value = '';
    plannedDateGroup.style.display = 'none';
  }

  // Оновлюємо список сезонів у формі
  await updateSeasonSelectOptions();

  // Встановлюємо сезон, якщо аніме має plannedDate
  const animeSeasonSelect = getById('animeSeason');
  if (status === 'plan' && anime.plannedDate) {
      const season = getSeasonFromDate(anime.plannedDate);
      animeSeasonSelect.value = season;
  } else {
      animeSeasonSelect.value = ''; // Скидаємо вибір сезону, якщо не "Заплановано" або немає дати
  }

  const form = getById('addAnimeForm');
  form.dataset.editMode = 'true';
  form.dataset.editStatus = status;
  form.dataset.editIndex = index;
}

function setAnimeFormButtonToEdit() {
  const form = getById('addAnimeForm');
  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.textContent = 'Зберегти';
}

function openAnimeModal() {
  getById('addAnimeModal').classList.add('active');
}

async function editAnime(status, index) { // Додаємо async
  const anime = animeManager.animeData[status][index];
  await fillAnimeForm(anime, status, index); // Викликаємо async fillAnimeForm
  setAnimeFormButtonToEdit();
  openAnimeModal();
}

async function registerUser(username, password) {
  return await animeManager.registerUser(username, password);
}

async function loginUser(username, password) {
  return await animeManager.loginUser(username, password);
}

async function logoutUser() {
  await animeManager.logoutUser();
}

// --- Кабінет ---
async function updateProfileSection() {
  await animeManager.loadAllData();
  profileSection.innerHTML = '';
  if (animeManager.loggedInUser) {
    const totalWatching = animeManager.animeData.watching.length;
    const totalCompleted = animeManager.animeData.completed.length;
    const totalPlanned = animeManager.animeData.plan.length;
    profileSection.innerHTML = `
      <div class="profile-content">
        <h2>Вітаємо, ${animeManager.loggedInUser}!</h2>
        <div class="profile-stats">
          <div class="stat-item">
            <h3>Дивлюсь</h3>
            <p>${totalWatching}</p>
          </div>
          <div class="stat-item">
            <h3>Переглянуто</h3>
            <p>${totalCompleted}</p>
          </div>
          <div class="stat-item">
            <h3>Заплановано</h3>
            <p>${totalPlanned}</p>
          </div>
        </div>
        <button id="logoutBtn" class="submit-btn" style="background-color: #ff3333; width: auto; padding: 10px 20px; margin-top: 20px;">Вийти</button>
      </div>
    `;
    const logoutButton = getById('logoutBtn');
    if (logoutButton) {
      const newLogoutButton = logoutButton.cloneNode(true);
      logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
      newLogoutButton.addEventListener('click', async () => {
        if (confirm('Ви впевнені, що хочете вийти?')) {
          await logoutUser();
          getBySelector('.menu-item[data-section="home"]').click();
          profileSection.innerHTML = '';
          updateProfileSection();
        }
      });
    }
  } else {
    profileSection.innerHTML = `
      <div class="profile-content">
        <h2>Ласкаво просимо!</h2>
        <p style="text-align: center; margin: 20px 0;">Будь ласка, увійдіть або зареєструйтесь, щоб отримати доступ до свого кабінету.</p>
        <button class="submit-btn" onclick="openAuthModalAndShowLogin()">
          Увійти / Зареєструватися
        </button>
      </div>
    `;
  }
}

function openAuthModalAndShowLogin() {
  authModal.classList.add('active');
  activateAuthTab('login');
}

// Modal functionality
const modal = getById('addAnimeModal');
const addAnimeBtn = getById('addAnimeBtn');
const closeModal = getBySelector('.close-modal');
const addAnimeForm = getById('addAnimeForm');

const animeStatusSelect = getById('animeStatus');
const animePlannedDateGroup = getById('animePlannedDateGroup');
const animePlannedDateInput = getById('animePlannedDate');
const animeSeasonSelect = getById('animeSeason'); // Отримуємо елемент select для сезону

addAnimeBtn.addEventListener('click', async () => { // Додаємо async
  addAnimeForm.reset();
  delete addAnimeForm.dataset.editMode;
  delete addAnimeForm.dataset.editStatus;
  delete addAnimeForm.dataset.editIndex;

  animePlannedDateGroup.style.display = 'none';
  animePlannedDateInput.value = '';

  // Скидаємо вибір сезону при відкритті модалки і оновлюємо опції
  animeSeasonSelect.value = '';
  await updateSeasonSelectOptions();

  const submitBtn = addAnimeForm.querySelector('.submit-btn');
  if (submitBtn) submitBtn.textContent = 'Додати';

  modal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

animeStatusSelect.addEventListener('change', () => {
  if (animeStatusSelect.value === 'plan') {
    animePlannedDateGroup.style.display = 'block';
  } else {
    animePlannedDateGroup.style.display = 'none';
    animePlannedDateInput.value = '';
  }
});

// Обробник зміни дати для автоматичного вибору сезону
animePlannedDateInput.addEventListener('change', async () => {
  const selectedDate = animePlannedDateInput.value;
  if (selectedDate) {
    const season = getSeasonFromDate(selectedDate);
    // Перевіряємо, чи існує такий сезон у випадаючому списку, якщо ні - додаємо
    await updateSeasonSelectOptions(season);
    animeSeasonSelect.value = season;
  } else {
    animeSeasonSelect.value = '';
  }
});

// Функція для оновлення опцій у випадаючому списку сезонів
async function updateSeasonSelectOptions(highlightSeason = null) {
  const allUniqueSeasons = await animeManager.getAllUniqueSeasons();
  animeSeasonSelect.innerHTML = '<option value="">Не обрано</option>'; // Завжди починаємо з опції "Не обрано"

  // Додаємо всі унікальні сезони до випадаючого списку
  allUniqueSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season;
    option.textContent = season;
    animeSeasonSelect.appendChild(option);
  });

  // Якщо потрібно виділити певний сезон, і його немає в списку, додаємо його
  if (highlightSeason && !allUniqueSeasons.includes(highlightSeason)) {
      const newOption = document.createElement('option');
      newOption.value = highlightSeason;
      newOption.textContent = highlightSeason;
      animeSeasonSelect.appendChild(newOption);
  }
}


// Функція для валідації URL
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

addAnimeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const coverUrl = getById('animeCover').value;
  const videoUrl = getById('animeVideo').value;
  const title = getById('animeTitle').value.trim();
  const episodes = getById('animeEpisodes').value.trim();
  const status = getById('animeStatus').value;
  const plannedDate = status === 'plan' ? getById('animePlannedDate').value : '';
  // `selectedSeason` тепер не потрібен, оскільки сезон визначається автоматично з `plannedDate`
  // або не використовується, якщо статус не 'plan'

  if (!title || !episodes) {
    alert('Будь ласка, заповніть всі обов\'язкові поля');
    return;
  }

  if (!isValidUrl(coverUrl) || !isValidUrl(videoUrl)) {
    alert('Будь ласка, введіть коректні URL для обкладинки та відео');
    return;
  }

  if (status === 'plan' && !plannedDate) {
    alert('Будь ласка, оберіть заплановану дату перегляду.');
    return;
  }

  const newAnime = {
    title,
    episodes,
    cover: coverUrl,
    videoUrl,
    rating: 0,
    plannedDate: plannedDate
  };

  const editMode = addAnimeForm.dataset.editMode === 'true';
  const oldStatus = addAnimeForm.dataset.editStatus;
  const index = parseInt(addAnimeForm.dataset.editIndex);

  try {
    // animeManager.addOrEditAnime тепер сам визначає сезон на основі plannedDate
    await animeManager.addOrEditAnime(newAnime, status, editMode, oldStatus, index);
    loadAnimeList(status); // Перезавантажуємо список поточного статусу

    // Визначаємо поточний активний сезон, щоб завантажити його після додавання/редагування
    const currentActiveSeasonButton = getBySelector('.season-btn.active');
    const currentActiveSeason = currentActiveSeasonButton ? currentActiveSeasonButton.textContent : 'Зима 2025';
    await loadNewReleases(currentActiveSeason); // Перезавантажуємо нові релізи

    addAnimeForm.reset();
    delete addAnimeForm.dataset.editMode;
    delete addAnimeForm.dataset.editStatus;
    delete addAnimeForm.dataset.editIndex;
    modal.classList.remove('active');
    animePlannedDateGroup.style.display = 'none';
    animeSeasonSelect.value = ''; // Скидаємо вибір сезону
  } catch (error) {
    console.error('Помилка при збереженні аніме:', error);
    alert('Сталася помилка при збереженні. Спробуйте пізніше.');
  }
});

// Search functionality
const searchInput = getById('searchInput');
const searchResults = getById('searchResults');

searchInput.addEventListener('input', async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  if (searchTerm.length < 2) {
    searchResults.classList.remove('active');
    return;
  }
  const allAnime = animeManager.getAllAnime();
  const filteredAnime = allAnime.filter(anime =>
    anime.title.toLowerCase().includes(searchTerm)
  );
  displaySearchResults(filteredAnime);
});

function displaySearchResults(results) {
  searchResults.innerHTML = '';
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item">Нічого не знайдено</div>';
    searchResults.classList.add('active');
    return;
  }
  results.forEach(anime => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    resultItem.innerHTML = `
      <img src="${anime.cover}" alt="${anime.title}">
      <div>
        <div>${anime.title}</div>
        <small>${anime.episodes}</small>
      </div>
    `;
    resultItem.addEventListener('click', async () => {
      let found = false;
      await animeManager.loadAllData();
      ['watching', 'completed', 'plan'].forEach(status => {
        const index = animeManager.animeData[status].findIndex(a => a.title === anime.title);
        if (index !== -1) {
          getBySelector(`[data-tab="${status}"]`).click();
          setTimeout(() => {
            const cards = getAllBySelector('.anime-card');
            if (cards[index]) {
              cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
              cards[index].style.transform = 'scale(1.05)';
              cards[index].style.boxShadow = '0 0 20px var(--accent-color)';
              setTimeout(() => {
                cards[index].style.transform = '';
                cards[index].style.boxShadow = '';
              }, 2000);
            }
          }, 100);
          found = true;
        }
      });
      if (!found) {
        alert('Це аніме ще не додано до вашого списку');
      }
      searchResults.classList.remove('active');
      searchInput.value = '';
    });
    searchResults.appendChild(resultItem);
  });
  searchResults.classList.add('active');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    searchResults.classList.remove('active');
  }
});

// Navigation functionality
document.querySelectorAll('.menu-item[data-section]').forEach(item => {
  item.addEventListener('click', async (e) => {
    e.preventDefault();

    document.querySelectorAll('.menu-item').forEach(menuItem => {
      menuItem.classList.remove('active');
    });
    item.classList.add('active');

    const sectionId = item.getAttribute('data-section');

    await animeManager.loadAllData();
    if (sectionId === 'profile' && !animeManager.loggedInUser) {
      openAuthModalAndShowLogin();
      return;
    }

    document.querySelectorAll('.section-content').forEach(section => {
      section.classList.remove('active');
    });
    getById(sectionId).classList.add('active');

    if (sectionId === 'home') {
      loadAnimeList('watching');
    } else if (sectionId === 'new') {
      await updateSeasonButtons(); // Оновлюємо кнопки сезонів
      // Після оновлення кнопок, перевіряємо, чи є вже активна кнопка сезону
      const activeSeasonBtn = getBySelector('.season-selector .season-btn.active');
      let seasonToLoad = 'Зима 2025'; // Дефолтний сезон, якщо жодна кнопка не активна
      if (activeSeasonBtn) {
          seasonToLoad = activeSeasonBtn.textContent;
      } else if (document.querySelectorAll('.season-selector .season-btn').length > 0) {
          // Якщо активної кнопки немає, але кнопки є, активуємо першу
          const firstSeasonBtn = getBySelector('.season-selector .season-btn');
          firstSeasonBtn.classList.add('active');
          seasonToLoad = firstSeasonBtn.textContent;
      }
      loadNewReleases(seasonToLoad); // Завантажуємо поточний активний сезон
    } else if (sectionId === 'profile') {
      updateProfileSection();
    }
  });
});

// Функція для динамічного оновлення кнопок сезонів
async function updateSeasonButtons() {
    const seasonSelector = getBySelector('.season-selector');
    seasonSelector.innerHTML = ''; // Очищаємо існуючі кнопки

    const uniqueSeasons = await animeManager.getAllUniqueSeasons();
    
    let firstSeasonAdded = false;

    uniqueSeasons.forEach(season => {
        const button = document.createElement('button');
        button.classList.add('season-btn');
        button.textContent = season;
        
        // Активуємо першу кнопку, якщо ще немає активних
        if (!firstSeasonAdded) {
            button.classList.add('active');
            firstSeasonAdded = true;
        }

        button.addEventListener('click', () => {
            document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            loadNewReleases(button.textContent);
        });
        seasonSelector.appendChild(button);
    });
}

// Load new releases
async function loadNewReleases(season) {
  const newReleasesList = getById('newReleasesList');
  newReleasesList.innerHTML = '';

  const combinedReleases = await animeManager.getCombinedNewReleases(season);

  if (combinedReleases.length === 0) {
    newReleasesList.innerHTML = '<p style="text-align: center; margin-top: 20px;">Дані для цього сезону відсутні.</p>';
    return;
  }

  combinedReleases.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.innerHTML = `
      <div class="anime-cover">
        <img src="${anime.cover}" alt="${anime.title}">
        <div class="anime-overlay">
          <div class="rating">
            ${Array(5).fill().map((_, i) =>
              `<i class="${i < Math.floor(anime.rating) ? 'fas' : 'far'} fa-star"></i>`
            ).join('')}
          </div>
          <a href="${anime.videoUrl}" class="watch-btn" target="_blank">
            <i class="fas fa-play"></i> Дивитись
          </a>
        </div>
      </div>
      <div class="anime-info">
        <h3 class="anime-title">${anime.title}</h3>
        <p class="anime-episodes">${anime.episodes}</p>
      </div>
    `;
    newReleasesList.appendChild(card);
  });
}

async function checkLoginStatusAndDisplayProfile() {
  await animeManager.loadAllData();
  if (animeManager.loggedInUser) {
    updateProfileSection();
  }
}

// Splash screen functionality
document.addEventListener('DOMContentLoaded', async () => { // Додаємо async
  const splashScreen = getBySelector('.splash-screen');

  await animeManager.loadAllData(); // Завантажуємо дані при старті
  await updateSeasonButtons(); // Оновлюємо кнопки сезонів одразу після завантаження даних

  setTimeout(async () => { // Додаємо async
    splashScreen.classList.add('hidden');
    loadAnimeList('watching');
    // Завантажуємо новинки для першого активного сезону (який буде першим у відсортованому списку)
    const firstActiveSeasonButton = getBySelector('.season-selector .season-btn.active');
    if (firstActiveSeasonButton) {
      loadNewReleases(firstActiveSeasonButton.textContent);
    } else {
      // Якщо з якоїсь причини кнопок ще немає, використовуємо дефолтний сезон
      loadNewReleases('Зима 2025');
    }
    checkLoginStatusAndDisplayProfile();
  }, 2000);
});

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    loadAnimeList(button.dataset.tab);
  });
});

async function loadAnimeList(status) {
  const animeList = getById('animeList');
  animeList.innerHTML = '';

  await animeManager.loadAllData();
  const currentList = animeManager.animeData[status] || [];

  currentList.forEach((anime, index) => {
    const card = createAnimeCard(anime, status, index);
    animeList.appendChild(card);
  });
}

function createAnimeCard(anime, status, index) {
  const template = getById('animeCardTemplate');
  const card = template.content.cloneNode(true);

  card.querySelector('.anime-title').textContent = anime.title;
  const episodesElement = card.querySelector('.anime-episodes');
  if (status === 'plan' && anime.plannedDate) {
    const date = new Date(anime.plannedDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    episodesElement.textContent = `Заплановано на: ${date.toLocaleDateString('uk-UA', options)}`;
  } else {
    episodesElement.textContent = anime.episodes;
  }

  card.querySelector('.anime-cover img').src = anime.cover;
  card.querySelector('.anime-cover img').alt = anime.title;
  card.querySelector('.watch-btn').href = anime.videoUrl;

  const overlay = card.querySelector('.anime-overlay');
  const actionButtons = document.createElement('div');
  actionButtons.className = 'action-buttons';
  actionButtons.innerHTML = `
    <button class="edit-btn" title="Редагувати">
      <i class="fas fa-edit"></i>
    </button>
    <button class="delete-btn" title="Видалити">
      <i class="fas fa-trash"></i>
    </button>
  `;

  actionButtons.querySelector('.edit-btn').addEventListener('click', async (e) => { // Додаємо async
    e.preventDefault();
    await editAnime(status, index); // Викликаємо async editAnime
  });

  actionButtons.querySelector('.delete-btn').addEventListener('click', async (e) => { // Додаємо async
    e.preventDefault();
    if (confirm('Ви впевнені, що хочете видалити це аніме?')) {
      await animeManager.deleteAnime(status, index); // Видаляємо аніме
      loadAnimeList(status); // Перезавантажуємо поточний список
      await updateSeasonButtons(); // Оновлюємо кнопки сезонів
      // Перезавантажуємо нові релізи для поточного активного сезону
      const currentActiveSeasonButton = getBySelector('.season-selector .season-btn.active');
      if (currentActiveSeasonButton) {
        loadNewReleases(currentActiveSeasonButton.textContent);
      } else {
        // Якщо немає активної кнопки, але є сезони, активуємо першу
        const firstSeasonBtn = getBySelector('.season-selector .season-btn');
        if (firstSeasonBtn) {
            firstSeasonBtn.classList.add('active');
            loadNewReleases(firstSeasonBtn.textContent);
        } else { // Якщо взагалі немає сезонів
            loadNewReleases(''); // Завантажуємо порожній список
        }
      }
    }
  });

  overlay.insertBefore(actionButtons, overlay.firstChild);

  const stars = card.querySelectorAll('.rating i');
  updateRating(stars, anime.rating);

  stars.forEach((star, i) => {
    star.addEventListener('click', async () => {
      const rating = i + 1;
      updateRating(stars, rating);
      anime.rating = rating;
      await animeManager.saveAllData();
    });
    star.addEventListener('mouseover', () => {
      updateRating(stars, i + 1, true);
    });
    star.addEventListener('mouseout', () => {
      updateRating(stars, anime.rating);
    });
  });

  return card;
}

function updateRating(stars, rating, hover = false) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove('far');
      star.classList.add('fas');
    } else {
      star.classList.remove('fas');
      star.classList.add('far');
    }
  });
}

// --- Auth Modal Logic ---
const authCloseModal = getBySelector('.auth-close-modal');
const loginForm = getById('loginForm');
const registerForm = getById('registerForm');
const loginMessage = getById('loginMessage');
const registerMessage = getById('registerMessage');

authTabButtons.forEach(button => {
  button.addEventListener('click', () => {
    activateAuthTab(button.dataset.authTab);
  });
});

authCloseModal.addEventListener('click', () => {
  authModal.classList.remove('active');
  loginMessage.style.display = 'none';
  registerMessage.style.display = 'none';
  loginForm.reset();
  registerForm.reset();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = getById('loginUsername').value.trim();
  const password = getById('loginPassword').value.trim();

  loginMessage.style.display = 'none'; // Hide previous messages

  if (!username || !password) {
    loginMessage.textContent = 'Будь ласка, введіть ім\'я користувача та пароль.';
    loginMessage.classList.remove('success');
    loginMessage.classList.add('error');
    loginMessage.style.display = 'block';
    return;
  }

  const success = await loginUser(username, password);
  if (success) {
    loginMessage.textContent = `Ласкаво просимо, ${username}!`;
    loginMessage.classList.remove('error');
    loginMessage.classList.add('success');
    loginMessage.style.display = 'block';
    setTimeout(() => {
      authModal.classList.remove('active');
      updateProfileSection(); // Update profile section after successful login
    }, 1500);
  } else {
    loginMessage.textContent = 'Невірне ім\'я користувача або пароль.';
    loginMessage.classList.remove('success');
    loginMessage.classList.add('error');
    loginMessage.style.display = 'block';
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = getById('registerUsername').value.trim();
  const password = getById('registerPassword').value.trim();

  registerMessage.style.display = 'none'; // Hide previous messages

  if (!username || !password) {
    registerMessage.textContent = 'Будь ласка, введіть ім\'я користувача та пароль.';
    registerMessage.classList.remove('success');
    registerMessage.classList.add('error');
    registerMessage.style.display = 'block';
    return;
  }

  const success = await registerUser(username, password);
  if (success) {
    registerMessage.textContent = 'Реєстрація пройшла успішно! Тепер ви можете увійти.';
    registerMessage.classList.remove('error');
    registerMessage.classList.add('success');
    registerMessage.style.display = 'block';
    registerForm.reset();
    setTimeout(() => {
      activateAuthTab('login'); // Switch to login tab after successful registration
    }, 1500);
  } else {
    registerMessage.textContent = 'Користувач з таким ім\'ям вже існує.';
    registerMessage.classList.remove('success');
    registerMessage.classList.add('error');
    registerMessage.style.display = 'block';
  }
});