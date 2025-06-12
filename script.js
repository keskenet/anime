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
      videoUrl: "https://example.com/watch/fullmetal-alchemist"
    }
  ]
};

// New releases data
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
    animeData: { watching: [], completed: [], plan: [] },
    users: {},
    loggedInUser: null
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

// --- Клас для менеджменту аніме та користувачів ---
class AnimeManager {
  constructor() {
    this.animeData = { watching: [], completed: [], plan: [] };
    this.users = {};
    this.loggedInUser = null;
  }

  async loadAllData() {
    const storage = await getStorage();
    this.animeData = storage.animeData || { watching: [], completed: [], plan: [] };
    this.users = storage.users || {};
    this.loggedInUser = storage.loggedInUser || null;
  }

  async saveAllData() {
    await saveStorage({
      animeData: this.animeData,
      users: this.users,
      loggedInUser: this.loggedInUser
    });
  }

  async addOrEditAnime(newAnime, status, editMode, oldStatus, index) {
    await this.loadAllData();
    if (editMode) {
      if (oldStatus === status) {
        this.animeData[status][index] = newAnime;
      } else {
        this.animeData[oldStatus].splice(index, 1);
        this.animeData[status].push(newAnime);
      }
    } else {
      this.animeData[status].push(newAnime);
    }
    await this.saveAllData();
  }

  async deleteAnime(status, index) {
    await this.loadAllData();
    this.animeData[status].splice(index, 1);
    await this.saveAllData();
  }

  getAnimeList(status) {
    return this.animeData[status];
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

// --- Глобальні змінні ---
var users = {};
var loggedInUser = null;

// ДОДАТИ ініціалізацію profileSection
const profileSection = document.getElementById('profile');

// ДОДАТИ ініціалізацію authModal, authTabButtons, activateAuthTab
const authModal = document.getElementById('authModal');
const authTabButtons = document.querySelectorAll('.auth-tab-btn');
function activateAuthTab(tabName) {
  authTabButtons.forEach(button => {
    if (button.dataset.authTab === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  document.querySelectorAll('.auth-form').forEach(form => {
    if (form.id.startsWith(tabName)) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
}

// --- Завантаження та збереження всіх даних ---
async function loadAllData() {
  const storage = await getStorage();
  animeManager.animeData = storage.animeData || { watching: [], completed: [], plan: [] };
  animeManager.users = storage.users || {};
  animeManager.loggedInUser = storage.loggedInUser || null;
}

async function saveAllData() {
  await saveStorage({
    animeData: animeManager.animeData,
    users: animeManager.users,
    loggedInUser: animeManager.loggedInUser
  });
}

// --- Додавання, редагування, видалення аніме ---
async function addOrEditAnime(newAnime, status, editMode, oldStatus, index) {
  await animeManager.addOrEditAnime(newAnime, status, editMode, oldStatus, index);
}

async function deleteAnime(status, index) {
  await animeManager.deleteAnime(status, index);
  loadAnimeList(status);
}

// Функція для редагування аніме
function fillAnimeForm(anime, status, index) {
  getById('animeTitle').value = anime.title;
  getById('animeEpisodes').value = anime.episodes;
  getById('animeCover').value = anime.cover;
  getById('animeVideo').value = anime.videoUrl;
  getById('animeStatus').value = status;
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

function editAnime(status, index) {
  const anime = animeManager.animeData[status][index];
  fillAnimeForm(anime, status, index);
  setAnimeFormButtonToEdit();
  openAnimeModal();
}

// --- Додавання, реєстрація, вхід користувача ---
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
        <button class="submit-btn" onclick="getBySelector('.menu-item[data-section=profile]').click()">
          Увійти / Зареєструватися
        </button>
      </div>
    `;
    authModal.classList.add('active');
    activateAuthTab('login');
  }
}

// Modal functionality
const modal = document.getElementById('addAnimeModal');
const addAnimeBtn = document.getElementById('addAnimeBtn');
const closeModal = document.querySelector('.close-modal');
const addAnimeForm = document.getElementById('addAnimeForm');

addAnimeBtn.addEventListener('click', () => {
  // Reset form and edit mode
  addAnimeForm.reset();
  delete addAnimeForm.dataset.editMode;
  delete addAnimeForm.dataset.editStatus;
  delete addAnimeForm.dataset.editIndex;
  
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

// Функція для валідації URL
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

// --- ОНОВИТИ додавання/редагування аніме ---
addAnimeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const coverUrl = document.getElementById('animeCover').value;
  const videoUrl = document.getElementById('animeVideo').value;
  const title = document.getElementById('animeTitle').value.trim();
  const episodes = document.getElementById('animeEpisodes').value.trim();
  
  // Валідація даних
  if (!title || !episodes) {
    alert('Будь ласка, заповніть всі поля');
    return;
  }
  
  if (!isValidUrl(coverUrl) || !isValidUrl(videoUrl)) {
    alert('Будь ласка, введіть коректні URL для обкладинки та відео');
    return;
  }
  
  const newAnime = {
    title,
    episodes,
    cover: coverUrl,
    videoUrl,
    rating: 0
  };
  
  const status = document.getElementById('animeStatus').value;
  const editMode = addAnimeForm.dataset.editMode === 'true';
  const oldStatus = addAnimeForm.dataset.editStatus;
  const index = parseInt(addAnimeForm.dataset.editIndex);
  
  try {
    await addOrEditAnime(newAnime, status, editMode, oldStatus, index);
    loadAnimeList(status);
    addAnimeForm.reset();
    delete addAnimeForm.dataset.editMode;
    delete addAnimeForm.dataset.editStatus;
    delete addAnimeForm.dataset.editIndex;
    modal.classList.remove('active');
  } catch (error) {
    console.error('Помилка при збереженні аніме:', error);
    alert('Сталася помилка при збереженні. Спробуйте пізніше.');
  }
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', async (e) => {
  const searchTerm = e.target.value.toLowerCase();
  if (searchTerm.length < 2) {
    searchResults.classList.remove('active');
    return;
  }
  const allAnime = await getAllAnime();
  const filteredAnime = allAnime.filter(anime => 
    anime.title.toLowerCase().includes(searchTerm)
  );
  displaySearchResults(filteredAnime);
});

// --- Оновлена функція displaySearchResults з використанням допоміжних функцій ---
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

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    searchResults.classList.remove('active');
  }
});

// Navigation functionality
document.querySelectorAll('.menu-item[data-section]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(menuItem => {
      menuItem.classList.remove('active');
    });
    item.classList.add('active');
      // Show corresponding section
    const sectionId = item.getAttribute('data-section');
    
    // Перевірка для розділу "Кабінет"
    if (sectionId === 'profile' && !animeManager.loggedInUser) {
      authModal.classList.add('active');
      activateAuthTab('login');
      return;
    }
    
    document.querySelectorAll('.section-content').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Load content if needed
    if (sectionId === 'home') {
      loadAnimeList('watching');
    } else if (sectionId === 'new') {
      loadNewReleases('Зима 2025');
    } else if (sectionId === 'profile') {
      updateProfileSection();
    }
  });
});

// Season selector functionality
document.querySelectorAll('.season-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadNewReleases(btn.textContent);
  });
});

// Load new releases
function loadNewReleases(season) {
  const newReleasesList = document.getElementById('newReleasesList');
  newReleasesList.innerHTML = '';
  
  newReleasesData[season].forEach(anime => {
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

// Функція для перевірки статусу входу
async function checkLoginStatusAndDisplayProfile() {
  await loadAllData();
  if (animeManager.loggedInUser) {
    document.querySelector('.menu-item[data-section="profile"]').click();
  }
}

// Splash screen functionality
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.querySelector('.splash-screen');
  
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    loadAnimeList('watching');
    loadNewReleases('Зима 2025');
    // Після завантаження сторінки перевіряємо, чи користувач вже увійшов
    checkLoginStatusAndDisplayProfile();
  }, 2000);
});

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Load corresponding anime list
    loadAnimeList(button.dataset.tab);
  });
});

// Load anime list based on status
function loadAnimeList(status) {
  const animeList = getById('animeList');
  animeList.innerHTML = '';
  
  animeManager.animeData[status].forEach((anime, index) => {
    const card = createAnimeCard(anime, status, index);
    animeList.appendChild(card);
  });
}

// Create anime card from template
function createAnimeCard(anime, status, index) {
  const template = getById('animeCardTemplate');
  const card = template.content.cloneNode(true);
  
  // Set anime data
  card.querySelector('.anime-title').textContent = anime.title;
  card.querySelector('.anime-episodes').textContent = anime.episodes;
  card.querySelector('.anime-cover img').src = anime.cover;
  card.querySelector('.anime-cover img').alt = anime.title;
  card.querySelector('.watch-btn').href = anime.videoUrl;
  
  // Add edit and delete buttons
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
  
  // Add event listeners for edit and delete
  actionButtons.querySelector('.edit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    editAnime(status, index);
  });
  
  actionButtons.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Ви впевнені, що хочете видалити це аніме?')) {
      deleteAnime(status, index);
    }
  });
  
  overlay.insertBefore(actionButtons, overlay.firstChild);
  
  // Set rating
  const stars = card.querySelectorAll('.rating i');
  updateRating(stars, anime.rating);
  
  // Add rating functionality
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

// Update rating display
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

// --- ВИДАЛИТИ старі функції та дублікати ---
// Видаляємо let animeData = JSON.parse(localStorage.getItem('animeData')) || defaultAnimeData;
// Видаляємо function saveAnimeData() { ... }
// Видаляємо стару функцію deleteAnime (яка не async)
// Видаляємо стару функцію editAnime (яка не async)
// Видаляємо стару функцію для ініціалізації даних аніме
// Видаляємо старі обробники подій для кнопок редагування та видалення аніме
// Видаляємо старі функції для роботи з localStorage
// Видаляємо стару функцію getAllAnime (яка не async)

// --- ОНОВИТИ додавання/редагування аніме ---
addAnimeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const coverUrl = document.getElementById('animeCover').value;
  const videoUrl = document.getElementById('animeVideo').value;
  const title = document.getElementById('animeTitle').value.trim();
  const episodes = document.getElementById('animeEpisodes').value.trim();
  
  // Валідація даних
  if (!title || !episodes) {
    alert('Будь ласка, заповніть всі поля');
    return;
  }
  
  if (!isValidUrl(coverUrl) || !isValidUrl(videoUrl)) {
    alert('Будь ласка, введіть коректні URL для обкладинки та відео');
    return;
  }
  
  const newAnime = {
    title,
    episodes,
    cover: coverUrl,
    videoUrl,
    rating: 0
  };
  
  const status = document.getElementById('animeStatus').value;
  const editMode = addAnimeForm.dataset.editMode === 'true';
  const oldStatus = addAnimeForm.dataset.editStatus;
  const index = parseInt(addAnimeForm.dataset.editIndex);
  
  try {
    await addOrEditAnime(newAnime, status, editMode, oldStatus, index);
    loadAnimeList(status);
    addAnimeForm.reset();
    delete addAnimeForm.dataset.editMode;
    delete addAnimeForm.dataset.editStatus;
    delete addAnimeForm.dataset.editIndex;
    modal.classList.remove('active');
  } catch (error) {
    console.error('Помилка при збереженні аніме:', error);
    alert('Сталася помилка при збереженні. Спробуйте пізніше.');
  }
});

// --- ОНОВИТИ рейтинг ---

// --- ОНОВИТИ пошук ---
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
      await loadAllData();
      ['watching', 'completed', 'plan'].forEach(status => {
        const index = animeManager.animeData[status].findIndex(a => a.title === anime.title);
        if (index !== -1) {
          document.querySelector(`[data-tab="${status}"]`).click();
          setTimeout(() => {
            const cards = document.querySelectorAll('.anime-card');
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

// --- ОНОВИТИ allAnime для пошуку ---
async function getAllAnime() {
  await animeManager.loadAllData();
  return [
    ...animeManager.animeData.watching,
    ...animeManager.animeData.completed,
    ...animeManager.animeData.plan,
    ...Object.values(newReleasesData).flat(),
    {
      title: "One Piece",
      episodes: "1000+ епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 0,
      videoUrl: "https://example.com/watch/one-piece"
    },
    {
      title: "Naruto Shippuden",
      episodes: "500 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 0,
      videoUrl: "https://example.com/watch/naruto"
    },
    {
      title: "My Hero Academia",
      episodes: "113 епізодів",
      cover: "https://images.pexels.com/photos/14940128/pexels-photo-14940128.jpeg",
      rating: 0,
      videoUrl: "https://example.com/watch/my-hero-academia"
    }
  ];
}

// --- Utility functions for form state ---
function setFormLoading(form, isLoading) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input');
  if (isLoading) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Зачекайте...';
    submitBtn.disabled = true;
    inputs.forEach(input => input.disabled = true);
  } else {
    submitBtn.innerHTML = form.id === 'loginForm' ? 'Увійти' : 'Зареєструватися';
    submitBtn.disabled = false;
    inputs.forEach(input => input.disabled = false);
  }
}

// Ініціалізація форм авторизації при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  // Форми
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const authModal = document.getElementById('authModal');
  const authTabButtons = document.querySelectorAll('.auth-tab-btn');
  const closeAuthModalButton = document.querySelector('.close-auth-modal');

  // Перемикання вкладок
  authTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      activateAuthTab(button.dataset.authTab);
    });
  });

  // Закриття модального вікна
  if (closeAuthModalButton) {
    closeAuthModalButton.addEventListener('click', () => {
      authModal.classList.remove('active');
    });
  }

  // Закриття при кліку поза модальним вікном
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.remove('active');
    }
  });

  // Обробка форми реєстрації
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormLoading(registerForm, true);
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;    if (!username || !password) {
      alert('Будь ласка, заповніть всі поля');
      setFormLoading(registerForm, false);
      return;
    }
    
    if (password.length < 6) {
      alert('Пароль повинен містити не менше 6 символів');
      setFormLoading(registerForm, false);
      return;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      alert('Ім\'я користувача може містити тільки літери та цифри');
      setFormLoading(registerForm, false);
      return;
    }

    try {
      const success = await registerUser(username, password);
      if (success) {
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        activateAuthTab('login');
        registerForm.reset();
      } else {
        alert('Користувач з таким ім\'ям вже існує!');
      }
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      alert('Сталася помилка під час реєстрації. Спробуйте пізніше.');
    } finally {
      setFormLoading(registerForm, false);
    }
  });

  // Обробка форми входу
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormLoading(loginForm, true);

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
      alert('Будь ласка, заповніть всі поля');
      setFormLoading(loginForm, false);
      return;
    }

    try {
      const success = await loginUser(username, password);
      if (success) {
        alert('Вхід успішний!');
        authModal.classList.remove('active');
        document.querySelector('.menu-item[data-section="profile"]').click();
        loginForm.reset();
      } else {
        alert('Невірне ім\'я користувача або пароль!');
      }
    } catch (error) {
      console.error('Помилка входу:', error);
      alert('Сталася помилка під час входу. Спробуйте пізніше.');
    } finally {
      setFormLoading(loginForm, false);
    }
  });
});

