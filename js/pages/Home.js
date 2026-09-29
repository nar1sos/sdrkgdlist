export default {
    name: 'Home',
    template: `
        <div class="home-container">
            <!-- HERO SECTION -->
            <header class="crc-hero">
                <div class="hero-chip">
                    <span class="chip-pulse"></span>
                    CRC DEMONLIST
                </div>
                <h1 class="hero-title">КРК СЛЕЕРСТВО</h1>
                <p class="hero-subtitle">
                    Центральный реестр лучших игроков и сложнейших демонов Крыма.
                </p>
                
                <div class="hero-actions">
                    <router-link to="/list" class="crc-btn btn-accent">📜 Топ уровней</router-link>
                    <router-link to="/leaderboard" class="crc-btn btn-surface">🏆 Топ игроков</router-link
                </div>
            </header>

            <!-- СОБЫТИЯ -->
            <main class="events-wrapper">
                <div class="events-head">
                    <div>
                        <h2 class="section-title">Лента активности</h2>
                        <p class="section-desc">Последние подтверждённые прохождения региона</p>
                    </div>

                    <div class="events-tools">
                        <div class="filter-pill">
                            <button :class="{ active: filterPlatform === 'all' }" @click="filterPlatform = 'all'">Все</button>
                        </div>

                        <button v-if="isAdmin" @click="showModal = true" class="crc-btn btn-success">+ Новое событие</button>
                    </div>
                </div>

                <!-- СЕТКА КАРТОЧЕК -->
                <div class="activity-grid">
                    <article v-for="(event, index) in filteredEvents" :key="index" class="activity-card verified-card">
                        <!-- Кнопка удаления для админа -->
                        <button v-if="isAdmin" @click="removeEvent(event)" class="card-delete-btn" title="Удалить карточку">
                            ✕
                        </button>

                        <div class="card-header-bar">
                            <div class="player-info">
                                <span class="player-nick">{{ event.playerName }}</span>
                                <span class="plat-tag">{{ event.device === 'PC' ? 'PC' : 'Mobile' }}</span>
                            </div>
                            <time class="event-time">{{ event.date }}</time>
                        </div>

                        <div class="card-body-content">
                            <div class="preview-frame">
                                <span class="rank-tag">#{{ event.rank }}</span>
                                <img :src="event.thumb || 'https://via.placeholder.com/300x160/1a202c/ffffff?text=No+Image'" alt="Level Preview">
                            </div>

                            <div class="level-info">
                                <h3 class="level-name">{{ event.levelName }}</h3>
                                <div class="location-info">
                                    <span v-if="isUrl(event.flag)"><img :src="event.flag" class="flag-img" alt="flag"></span>
                                    <span v-else>{{ event.flag }}</span>
                                    <span>{{ event.location }}</span>
                                </div>
                                <div class="progress-pill">{{ event.percent }}</div>
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            <!-- МОДАЛКА ДОБАВЛЕНИЯ -->
            <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                <div class="modal-window">
                    <div class="modal-header">
                        <h3>Добавить запись в ленту</h3>
                        <button @click="showModal = false" class="close-btn">✕</button>
                    </div>
                    
                    <form @submit.prevent="addEvent" class="modal-form">
                        <div class="form-row">
                            <label>Уровень:</label>
                            <input v-model="newEvent.levelName" type="text" required placeholder="Tartarus">
                        </div>
                        <div class="form-grid-2">
                            <div>
                                <label>Игрок:</label>
                                <input v-model="newEvent.playerName" type="text" required placeholder="bembem">
                            </div>
                            <div>
                                <label>Платформа:</label>
                                <select v-model="newEvent.device">
                                    <option value="PC">PC</option>
                                    <option value="Mobile">Mobile</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-grid-2">
                            <div>
                                <label>Город:</label>
                                <input v-model="newEvent.location" type="text" required placeholder="Севастополь">
                            </div>
                            <div>
                                <label>Флаг (Эмодзи или URL картинки):</label>
                                <input v-model="newEvent.flag" type="text" placeholder="🇷🇺 или https://...">
                            </div>
                        </div>
                        <div class="form-grid-3">
                            <div>
                                <label>Ранг в топе (#):</label>
                                <input v-model="newEvent.rank" type="number" placeholder="15">
                            </div>
                            <div>
                                <label>Прогресс:</label>
                                <input v-model="newEvent.percent" type="text" placeholder="100%">
                            </div>
                            <div>
                                <label>Дата:</label>
                                <input v-model="newEvent.date" type="text" placeholder="29.09.2026">
                            </div>
                        </div>
                        <div class="form-row">
                            <label>Ссылка на превью уровня (URL):</label>
                            <input v-model="newEvent.thumb" type="url" placeholder="https://...">
                        </div>

                        <div class="modal-footer">
                            <button type="button" @click="showModal = false" class="crc-btn btn-surface">Отмена</button>
                            <button type="submit" class="crc-btn btn-verified">+ Добавить</button>
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
            events: [],
            newEvent: {
                levelName: '',
                playerName: '',
                device: 'PC',
                location: '',
                flag: '📍',
                rank: '',
                percent: '100%',
                date: '29.09.2026',
                thumb: ''
            }
        };
    },
    computed: {
        filteredEvents() {
            if (this.filterPlatform === 'all') return this.events;
            return this.events.filter(e => e.device === this.filterPlatform);
        }
    },
    created() {
        this.loadEvents();
    },
    mounted() {
        window.addEventListener('admin-state-changed', () => {
            this.isAdmin = sessionStorage.getItem('is_admin') === 'true';
        });
    },
    methods: {
        loadEvents() {
            const saved = localStorage.getItem('crc_events');
            if (saved) {
                try {
                    this.events = JSON.parse(saved);
                } catch (e) {
                    this.events = this.getDefaultEvents();
                }
            } else {
                this.events = this.getDefaultEvents();
                this.saveEvents();
            }
        },
        getDefaultEvents() {
            return [
                {
                    id: Date.now(),
                    playerName: 'bembem',
                    device: 'PC',
                    date: '29.09.2026',
                    rank: 15,
                    levelName: 'Tartarus',
                    location: 'Севастополь',
                    flag: '📍',
                    percent: '100%',
                    thumb: ''
                }
            ];
        },
        saveEvents() {
            localStorage.setItem('crc_events', JSON.stringify(this.events));
        },
        isUrl(str) {
            return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
        },
        addEvent() {
            const item = { ...this.newEvent, id: Date.now() };
            this.events.unshift(item);
            this.saveEvents();
            this.showModal = false;
            this.newEvent = { levelName: '', playerName: '', device: 'PC', location: '', flag: '📍', rank: '', percent: '100%', date: '29.09.2026', thumb: '' };
        },
        removeEvent(targetEvent) {
            if (confirm("Удалить эту карточку из ленты?")) {
                this.events = this.events.filter(e => e.id !== targetEvent.id && e !== targetEvent);
                this.saveEvents();
            }
        }
    }
};
