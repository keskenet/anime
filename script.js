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

// Initialize anime data from localStorage or use default
let animeData = JSON.parse(localStorage.getItem('animeData')) || defaultAnimeData;

// Save anime data to localStorage
function saveAnimeData() {
  localStorage.setItem('animeData', JSON.stringify(animeData));
}

// Additional anime data for search
const allAnime = [
  ...animeData.watching,
  ...animeData.completed,
  ...animeData.plan,
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

// Delete anime function
function deleteAnime(status, index) {
  animeData[status].splice(index, 1);
  saveAnimeData();
  loadAnimeList(status);
}

// Edit anime function
function editAnime(status, index) {
  const anime = animeData[status][index];
  
  // Fill form with anime data
  document.getElementById('animeTitle').value = anime.title;
  document.getElementById('animeEpisodes').value = anime.episodes;
  document.getElementById('animeCover').value = anime.cover;
  document.getElementById('animeVideo').value = anime.videoUrl;
  document.getElementById('animeStatus').value = status;
  
  // Add edit mode data
  addAnimeForm.dataset.editMode = 'true';
  addAnimeForm.dataset.editStatus = status;
  addAnimeForm.dataset.editIndex = index;
  
  // Show modal
  modal.classList.add('active');
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

addAnimeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newAnime = {
    title: document.getElementById('animeTitle').value,
    episodes: document.getElementById('animeEpisodes').value,
    cover: document.getElementById('animeCover').value,
    videoUrl: document.getElementById('animeVideo').value,
    rating: 0
  };
  
  const status = document.getElementById('animeStatus').value;
  
  if (addAnimeForm.dataset.editMode === 'true') {
    // Update existing anime
    const oldStatus = addAnimeForm.dataset.editStatus;
    const index = parseInt(addAnimeForm.dataset.editIndex);
    
    if (oldStatus === status) {
      // Update in same status
      animeData[status][index] = newAnime;
    } else {
      // Move to new status
      animeData[oldStatus].splice(index, 1);
      animeData[status].push(newAnime);
    }
  } else {
    // Add new anime
    animeData[status].push(newAnime);
  }
  
  // Save changes
  saveAnimeData();
  
  // Update display
  loadAnimeList(status);
  
  // Reset form and close modal
  addAnimeForm.reset();
  delete addAnimeForm.dataset.editMode;
  delete addAnimeForm.dataset.editStatus;
  delete addAnimeForm.dataset.editIndex;
  modal.classList.remove('active');
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  if (searchTerm.length < 2) {
    searchResults.classList.remove('active');
    return;
  }
  
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
    
    resultItem.addEventListener('click', () => {
      // Find the anime in the lists
      let found = false;
      ['watching', 'completed', 'plan'].forEach(status => {
        const index = animeData[status].findIndex(a => a.title === anime.title);
        if (index !== -1) {
          // Switch to the correct tab
          document.querySelector(`[data-tab="${status}"]`).click();
          
          // Find and highlight the anime card
          setTimeout(() => {
            const cards = document.querySelectorAll('.anime-card');
            // Ensure cards[index] exists before trying to scroll/style
            if (cards[index]) {
              cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
              cards[index].style.transform = 'scale(1.05)';
              cards[index].style.boxShadow = '0 0 20px var(--accent-color)';
              
              // Remove highlight after 2 seconds
              setTimeout(() => {
                cards[index].style.transform = '';
                cards[index].style.boxShadow = '';
              }, 2000);
            }
          }, 100);
          found = true;
        }
      });
      
      // If not found, show message
      if (!found) {
        alert('Це аніме ще не додано до вашого списку');
      }
      
      // Clear search
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
      // Спеціальна обробка для розділу "Кабінет"
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
  const animeList = document.getElementById('animeList');
  animeList.innerHTML = '';
  
  animeData[status].forEach((anime, index) => {
    const card = createAnimeCard(anime, status, index);
    animeList.appendChild(card);
  });
}

// Create anime card from template
function createAnimeCard(anime, status, index) {
  const template = document.getElementById('animeCardTemplate');
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
    star.addEventListener('click', () => {
      const rating = i + 1;
      updateRating(stars, rating);
      anime.rating = rating;
      saveAnimeData();
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


// --- Логіка для реєстрації/входу (без Node.js, дані в localStorage) ---
const authModal = document.getElementById('authModal');
const authCloseModal = document.querySelector('.auth-close-modal');
const authTabButtons = document.querySelectorAll('.auth-tab-btn');
const authForms = document.querySelectorAll('.auth-form');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

const profileSection = document.getElementById('profile'); // Отримуємо секцію "КАБІНЕТ"
let loggedInUser = localStorage.getItem('loggedInUser'); // Змінна для зберігання імені увійшовшого користувача

// Функція для отримання користувачів з localStorage
function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : {};
}

// Функція для збереження користувачів у localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Функція для відображення розділу "Кабінет" в залежності від статусу входу
function updateProfileSection() {
    profileSection.innerHTML = ''; // Очищаємо вміст секції
    const currentUser = localStorage.getItem('loggedInUser'); // Отримуємо поточного увійшовшого користувача

    if (currentUser) {
        // Користувач увійшов
        profileSection.innerHTML = `
            <div class="profile-content">
                <h2>Вітаємо, ${currentUser}!</h2>
                <p>Це ваш особистий кабінет. Тут буде персоналізований контент.</p>
                <button id="logoutBtn" class="submit-btn" style="background-color: #ff3333; width: auto; padding: 10px 20px;">Вийти</button>
            </div>
        `;
        // Переконайтеся, що кнопка "Вийти" існує, перш ніж додавати слухача подій
        const logoutButton = document.getElementById('logoutBtn');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }
    } else {
        // Користувач не увійшов
        // Просто показуємо модальне вікно авторизації
        authModal.classList.add('active');
        activateAuthTab('login'); // Автоматично активуємо вкладку "Вхід"
    }
}

// Функція для виходу користувача
function logout() {
    localStorage.removeItem('loggedInUser'); // Видаляємо статус входу
    loggedInUser = null; // Оновлюємо змінну
    alert('Ви успішно вийшли з облікового запису.');
    updateProfileSection(); // Оновлюємо розділ "Кабінет"
    
    // Переходимо на головну сторінку, якщо це потрібно
    document.querySelector('.menu-item[data-section="home"]').click(); 
}


// Обробка натискання на "КАБІНЕТ" 
document.querySelector('.menu-item[data-section="profile"]').addEventListener('click', (e) => {
    e.preventDefault();
    // Активуємо пункт меню "КАБІНЕТ"
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.classList.remove('active');
    });
    e.currentTarget.classList.add('active');

    // Показуємо секцію "Кабінет"
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('profile').classList.add('active');

    // Оновлюємо вміст секції "Кабінет" (або показуємо модалку, якщо не увійшов)
    updateProfileSection();
});


// Закриття модального вікна авторизації
authCloseModal.addEventListener('click', () => {
    authModal.classList.remove('active');
    clearAuthMessages();
});

// Закриття модального вікна авторизації при кліку поза ним
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
        clearAuthMessages();
    }
});

// Перемикання вкладок Вхід/Реєстрація
authTabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.authTab;
        activateAuthTab(tab);
        clearAuthMessages();
    });
});

function activateAuthTab(tabName) {
    authTabButtons.forEach(button => {
        if (button.dataset.authTab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    authForms.forEach(form => {
        if (form.id.startsWith(tabName)) { // 'loginForm' for 'login', 'registerForm' for 'register'
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

function displayAuthMessage(element, message, type) {
    element.textContent = message;
    element.className = `auth-message ${type}`; // Add 'success' or 'error' class
}

function clearAuthMessages() {
    loginMessage.textContent = '';
    loginMessage.className = 'auth-message';
    registerMessage.textContent = '';
    registerMessage.className = 'auth-message';
}


// Обробка форми реєстрації
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAuthMessages();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !password) {
        displayAuthMessage(registerMessage, 'Будь ласка, вкажіть ім\'я користувача та пароль.', 'error');
        return;
    }

    let users = getUsers();

    if (users[username]) {
        displayAuthMessage(registerMessage, 'Користувач з таким ім\'ям вже існує.', 'error');
        return;
    }

    // Зберігаємо пароль без хешування для простоти (НЕБЕЗПЕЧНО для реальних проектів!)
    users[username] = password; 
    saveUsers(users);

    displayAuthMessage(registerMessage, 'Реєстрація успішна!', 'success');
    
    // Після успішної реєстрації можна автоматично переключити на вхід
    setTimeout(() => {
        activateAuthTab('login');
        document.getElementById('loginUsername').value = username; // Заповнити логін
        document.getElementById('loginPassword').value = ''; // Очистити пароль
        clearAuthMessages();
    }, 2000);
});

// Обробка форми входу
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAuthMessages();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        displayAuthMessage(loginMessage, 'Будь ласка, вкажіть ім\'я користувача та пароль.', 'error');
        return;
    }

    let users = getUsers();

    if (users[username] && users[username] === password) { // Перевірка пароля
        displayAuthMessage(loginMessage, 'Вхід успішний!', 'success');
        localStorage.setItem('loggedInUser', username); // Зберігаємо, що користувач увійшов
        loggedInUser = username; // Оновлюємо змінну
        
        setTimeout(() => {
            authModal.classList.remove('active'); // Закриваємо модалку після входу
            updateProfileSection(); // Оновлюємо розділ "Кабінет" з новим статусом
            document.getElementById('profile').classList.add('active'); // Показуємо секцію "Кабінет"
            document.querySelector('.menu-item[data-section="profile"]').classList.add('active'); // Активуємо пункт меню
        }, 1500);
    } else {
        displayAuthMessage(loginMessage, 'Неправильне ім\'я користувача або пароль.', 'error');
    }
});

// Додаємо функцію для перевірки статусу входу при завантаженні сторінки
function checkLoginStatusAndDisplayProfile() {
    loggedInUser = localStorage.getItem('loggedInUser'); // Отримуємо статус входу
    // Ця функція просто оновлює змінну `loggedInUser`, 
    // щоб інші частини коду знали поточний статус.
    // Вона НЕ ВІДОБРАЖАЄ розділ "Кабінет" автоматично при завантаженні.
    // Відображення відбувається при натисканні на пункт меню "КАБІНЕТ".
}