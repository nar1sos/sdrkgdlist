export default {
    name: 'Home',
    template: `
        <div class="crc-main-wrapper">
            <!-- ДИНАМИЧЕСКИЙ БЭКГРАУНД И СЕТКА -->
            <div class="grid-overlay"></div>

            <!-- ГЛАВНЫЙ БАННЕР-МОНОЛИТ -->
            <header class="hero-monolith">
                <div class="monolith-badge">
                    <span class="status-dot"></span>
                    CRC SYSTEM ACTIVE
                </div>
                <h1 class="monolith-title">
                    <span class="glitch-text">КРК СЛЕЕРСТВО</span>
                </h1>
                <p class="monolith-sub">Единый реестр прохождений и рекордов Крыма</p>

                <!-- БЛОК СТАТИСТИКИ -->
                <div class="monolith-stats">
                    <div class="stat-node">
                        <span class="node-val">{{ events.length }}</span>
                        <span class="node-lbl">Всего прохождений</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-node">
                        <span class="node-val">#1</span>
                        <span class="node-lbl">Топ демон: Tartarus</span>
                    </div>
                </div>
            </header>

            <!-- ОРИГИНАЛЬНАЯ ИНТЕРАКТИВНАЯ ЛЕНТА -->
            <main class="feed-section">
                <div class="feed-header">
                    <div class="feed-title-block">
                        <span class="feed-accent-bar"></span>
                        <h2>ПОСЛЕДНИЕ РЕКОРДЫ</h2>
                    </div>

                    <div class="feed-controls">
                        <!-- Переключатель платформ -->
                        <div class="toggle-group">
                            <button :class="{ active: filterPlatform === 'all' }" @click="filterPlatform = 'all'">ВСЕ</button>
                            <button :class="{ active: filterPlatform === 'PC' }" @click="filterPlatform = 'PC'">PC</button>
                            <button :class="{ active: filterPlatform === 'Mobile' }" @click="filterPlatform = 'Mobile'">MOBILE</button>
                        </div>

                        <button v-if="isAdmin" @click="showModal = true" class="crc-btn-action">+ РЕКОРД</button>
                    </div>
                </div>

                <!-- ПОТОКОВОЕ ПРЕДСТАВЛЕНИЕ РЕКОРДОВ -->
                <div class="stream-container">
                    <div 
                        v-for="(event, index) in filteredEvents" 
                        :key="event.id || index" 
                        class="stream-item"
                    >
                        <div class="stream-rank">#{{ event.rank || '?' }}</div>

                        <div class="stream-preview">
                            <img :src="event.thumb || 'https://via.placeholder.com/160x90/131926/ffffff?text=Demon'" alt="Level">
                        </div>

                        <div class="stream-info">
                            <div class="stream-top-meta">
                                <span class="stream-player">{{ event.playerName }}</span>
                                <span class="stream-plat">{{ event.device }}</span>
                            </div>
                            <div class="stream-level-title">{{ event.levelName }}</div>
                            <div class="stream-sub-meta">
                                <span v-if="isUrl(event.flag)"><img :src="event.flag" class="flag-icon" alt="flag"></span>
                                <span v-else>{{ event.flag }}</span>
                                <span>{{ event.location }}</span>
                            </div>
                        </div>

                        <div class="stream-badge-zone">
                            <div class="verify-chip">
                                <span class="v-icon">✓</span>
                                <span>{{ event.percent }}</span>
                            </div>
                            <time class="stream-date">{{ event.date }}</time>
                        </div>

                        <button v-if="isAdmin" @click="removeEvent(event)" class="stream-delete" title="Удалить">
                            ✕
                        </button>
                    </div>
                </div>
            </main>

            <!-- МОДАЛКА ДОБАВЛЕНИЯ РЕКОРДА -->
            <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
                <div class="modal-window">
                    <div class="modal-header">
                        <h3>НОВЫЙ РЕКОРД</h3>
                        <button @click="showModal = false" class="close-btn">✕</button>
                    </div>
                    
                    <form @submit.prevent="addEvent" class="modal-form">
                        <div class="form-row">
                            <label>Название уровня:</label>
                            <input v-model="newEvent.levelName" type="text" required placeholder="Tartarus">
                        </div>
                        <div class="form-grid-2">
                            <div>
                                <label>Игрок (Слеер):</label>
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
                                <label>Город Крыма:</label>
                                <input v-model="newEvent.location" type="text" required placeholder="Севастополь">
                            </div>
                            <div>
                                <label>Флаг / Герб (Эмодзи или URL):</label>
                                <input v-model="newEvent.flag" type="text" placeholder="📍 или https://...">
                            </div>
                        </div>
                        <div class="form-grid-3">
                            <div>
                                <label>Ранг уровня (#):</label>
                                <input v-model="newEvent.rank" type="number" placeholder="15">
                            </div>
                            <div>
                                <label>Прогресс (%):</label>
                                <input v-model="newEvent.percent" type="text" placeholder="100%">
                            </div>
                            <div>
                                <label>Дата:</label>
                                <input v-model="newEvent.date" type="text" placeholder="29.09.2026">
                            </div>
                        </div>
                        <div class="form-row">
                            <label>Превью уровня (URL картинки):</label>
                            <input v-model="newEvent.thumb" type="url" placeholder="https://...">
                        </div>

                        <div class="modal-footer">
                            <button type="button" @click="showModal = false" class="btn-cancel">Отмена</button>
                            <button type="submit" class="btn-submit">Сохранить</button>
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
            if (confirm("Удалить этот рекорд?")) {
                this.events = this.events.filter(e => e.id !== targetEvent.id && e !== targetEvent);
                this.saveEvents();
            }
        }
    }
};
