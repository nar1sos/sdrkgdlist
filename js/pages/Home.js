export default {
    name: 'Home',
    template: `
        <div>
            <!-- HERO SECTION -->
            <header class="hero-section">
                <div class="badge-tag">⚡ ОФИЦИАЛЬНЫЙ DEMONLIST</div>
                <h1 class="hero-title">КРК СЛЕЕРСТВО</h1>
                <p class="hero-subtitle">Лист сильнейших игроков Geometry Dash в Крыму. Добавляйте рекорды и летите вверх в топе лучших игроков крыма!</p>
                
                <div class="hero-actions">
                    <router-link to="/list" class="btn-home btn-primary-home">📜 Топ демонов</router-link>
                    <router-link to="/leaderboard" class="btn-home btn-secondary-home">🏆 Топ игроков</router-link>
                </div>
            </header>

            <!-- POSLEDNIE SOBYTIYA -->
            <main class="events-section">
                <div class="events-header">
                    <div class="events-title-block">
                        <h2>Последние события</h2>
                        <p>Свежие прохождения и подтверждённые рекорды игроков Дальнего Востока</p>
                    </div>

                    <div class="events-controls">
                        <div class="filter-group">
                            <button class="filter-btn" :class="{ active: filterPlatform === 'all' }" @click="filterPlatform = 'all'">Все</button>
                            <button class="filter-btn" :class="{ active: filterPlatform === 'PC' }" @click="filterPlatform = 'PC'">💻 ПК</button>
                            <button class="filter-btn" :class="{ active: filterPlatform === 'Mobile' }" @click="filterPlatform = 'Mobile'">📱 Мобайл</button>
                        </div>

                        <!-- Кнопка только для Админа -->
                        <button v-if="isAdmin" @click="showModal = true" class="btn-home btn-admin-home">+ Добавить событие</button>
                    </div>
                </div>

                <!-- Сетка событий -->
                <div class="events-grid">
                    <div v-for="(event, index) in filteredEvents" :key="index" class="event-card">
                        <div class="card-top">
                            <div class="user-meta">
                                <span class="user-name">{{ event.playerName }}</span>
                                <span class="device-tag">{{ event.device === 'PC' ? '💻 PC' : '📱 Mobile' }}</span>
                            </div>
                            <span class="event-date">{{ event.date }}</span>
                        </div>

                        <div class="card-main">
                            <div class="thumb-box">
                                <span class="rank-badge">#{{ event.rank }}</span>
                                <img :src="event.thumb || 'https://via.placeholder.com/150x85'" alt="Preview">
                            </div>
                            <div class="card-details">
                                <h3 class="level-title">{{ event.levelName }}</h3>
                                <div class="location-tag">📍 {{ event.location }} <span class="flag">{{ event.flag }}</span></div>
                                <div class="percent-badge">{{ event.percent }}</div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <a :href="event.videoUrl" target="_blank" class="yt-link">▶ Смотреть видео</a>
                        </div>
                    </div>
                </div>
            </main>

            <!-- МОДАЛЬНОЕ ОКНО АДМИНА -->
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-box">
                    <h3>Добавить новое событие</h3>
                    <form @submit.prevent="addEvent">
                        <div class="form-group">
                            <label>Название уровня:</label>
                            <input v-model="newEvent.levelName" type="text" required placeholder="например, Tidal Wave">
                        </div>
                        <div class="form-group grid-2">
                            <div>
                                <label>Ник игрока:</label>
                                <input v-model="newEvent.playerName" type="text" required placeholder="pinum">
                            </div>
                            <div>
                                <label>Платформа:</label>
                                <select v-model="newEvent.device">
                                    <option value="PC">💻 PC</option>
                                    <option value="Mobile">📱 Mobile</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group grid-2">
                            <div>
                                <label>Место прохождения:</label>
                                <input v-model="newEvent.location" type="text" required placeholder="Южно-Сахалинск">
                            </div>
                            <div>
                                <label>Флаг (эмодзи):</label>
                                <input v-model="newEvent.flag" type="text" placeholder="🇷🇺">
                            </div>
                        </div>
                        <div class="form-group grid-3">
                            <div>
                                <label>Ранг (#):</label>
                                <input v-model="newEvent.rank" type="number" placeholder="1">
                            </div>
                            <div>
                                <label>Процент (%):</label>
                                <input v-model="newEvent.percent" type="text" placeholder="100%">
                            </div>
                            <div>
                                <label>Дата:</label>
                                <input v-model="newEvent.date" type="text" placeholder="27 сен.">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Превью уровня (URL):</label>
                            <input v-model="newEvent.thumb" type="url" placeholder="https://...">
                        </div>
                        <div class="form-group">
                            <label>Видео (YouTube URL):</label>
                            <input v-model="newEvent.videoUrl" type="url" placeholder="https://youtube.com/...">
                        </div>

                        <div class="modal-actions">
                            <button type="button" @click="showModal = false" class="btn-home btn-secondary-home">Отмена</button>
                            <button type="submit" class="btn-home btn-primary-home">Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            isAdmin: sessionStorage.getItem('is_admin') === 'true',
            showModal: false,
            filterPlatform: 'all',
            events: [
                {
                    playerName: 'SubtropikiGMD',
                    device: 'PC',
                    date: '27 сен.',
                    rank: 320,
                    levelName: 'Femboy Fantasy',
                    location: 'Южно-Сахалинск',
                    flag: '🇷🇺',
                    percent: '100%',
                    thumb: 'https://via.placeholder.com/150x85',
                    videoUrl: 'https://youtube.com'
                },
                {
                    playerName: 'pinum',
                    device: 'PC',
                    date: '27 сен.',
                    rank: 254,
                    levelName: 'MY SONG',
                    location: 'Владивосток',
                    flag: '🇷🇺',
                    percent: '100%',
                    thumb: 'https://via.placeholder.com/150x85',
                    videoUrl: 'https://youtube.com'
                }
            ],
            newEvent: {
                levelName: '',
                playerName: '',
                device: 'PC',
                location: '',
                flag: '🇷🇺',
                rank: '',
                percent: '100%',
                date: '',
                thumb: '',
                videoUrl: ''
            }
        };
    },
    computed: {
        filteredEvents() {
            if (this.filterPlatform === 'all') return this.events;
            return this.events.filter(e => e.device === this.filterPlatform);
        }
    },
    mounted() {
        window.addEventListener('admin-state-changed', () => {
            this.isAdmin = sessionStorage.getItem('is_admin') === 'true';
        });
    },
    methods: {
        addEvent() {
            this.events.unshift({ ...this.newEvent });
            this.showModal = false;
            this.newEvent = { levelName: '', playerName: '', device: 'PC', location: '', flag: '🇷🇺', rank: '', percent: '100%', date: '', thumb: '', videoUrl: '' };
        }
    }
};
