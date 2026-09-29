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
                <h1 class="hero-title">ДВ СЛЕЕРСТВО</h1>
                <p class="hero-subtitle">
                    Центральный реестр лучших игроков и сложнейших демонов Дальнего Востока.
                </p>
                
                <div class="hero-actions">
                    <router-link to="/list" class="crc-btn btn-accent">📜 Топ уровней</router-link>
                    <router-link to="/leaderboard" class="crc-btn btn-surface">🏆 Топ игроков</router-link>
                    <a href="#" class="crc-btn btn-glow">📦 Geode Mod <span class="badge-v">v2.0</span></a>
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
                            <button :class="{ active: filterPlatform === 'PC' }" @click="filterPlatform = 'PC'">💻 PC</button>
                            <button :class="{ active: filterPlatform === 'Mobile' }" @click="filterPlatform = 'Mobile'">📱 Mobile</button>
                        </div>

                        <button v-if="isAdmin" @click="showModal = true" class="crc-btn btn-success">+ Новое событие</button>
                    </div>
                </div>

                <!-- СЕТКА КАРТОЧЕК -->
                <div class="activity-grid">
                    <article v-for="(event, index) in filteredEvents" :key="index" class="activity-card">
                        <!-- Кнопка удаления для админа -->
                        <button v-if="isAdmin" @click="removeEvent(index)" class="card-delete-btn" title="Удалить карточку">
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
                                    <span>📍 {{ event.location }}</span>
                                    <span>{{ event.flag }}</span>
                                </div>
                                <div class="progress-pill">{{ event.percent }}</div>
                            </div>
                        </div>

                        <div class="card-action-bar">
                            <a :href="event.videoUrl" target="_blank" class="watch-link">
                                <span>▶</span> Смотреть заезд
                            </a>
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
                            <input v-model="newEvent.levelName" type="text" required placeholder="Acheron">
                        </div>
                        <div class="form-grid-2">
                            <div>
                                <label>Игрок:</label>
                                <input v-model="newEvent.playerName" type="text" required placeholder="Player">
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
                                <input v-model="newEvent.location" type="text" required placeholder="Хабаровск">
                            </div>
                            <div>
                                <label>Флаг:</label>
                                <input v-model="newEvent.flag" type="text" placeholder="🇷🇺">
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
                                <input v-model="newEvent.date" type="text" placeholder="Сегодня">
                            </div>
                        </div>
                        <div class="form-row">
                            <label>Ссылка на превью (URL):</label>
                            <input v-model="newEvent.thumb" type="url" placeholder="https://...">
                        </div>
                        <div class="form-row">
                            <label>Ссылка на видео (YouTube):</label>
                            <input v-model="newEvent.videoUrl" type="url" placeholder="https://youtube.com/...">
                        </div>

                        <div class="modal-footer">
                            <button type="button" @click="showModal = false" class="crc-btn btn-surface">Отмена</button>
                            <button type="submit" class="crc-btn btn-accent">Опубликовать</button>
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
                    thumb: '',
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
                    thumb: '',
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
        },
        removeEvent(index) {
            if (confirm("Удалить эту карточку из ленты?")) {
                const targetEvent = this.filteredEvents[index];
                const realIndex = this.events.indexOf(targetEvent);
                if (realIndex !== -1) {
                    this.events.splice(realIndex, 1);
                }
            }
        }
    }
};
