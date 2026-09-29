export default {
    name: 'Home',
    template: `
        <div class="home-container">
            <!-- ВСТРОЕННЫЕ СТИЛИ ДЛЯ ИСПРАВЛЕНИЯ СЕТКИ И ТЕКСТОВ -->
            <style scoped>
                .home-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    color: #e2e8f0;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                /* HERO SECTION */
                .crc-hero {
                    text-align: center;
                    padding: 40px 20px;
                    background: rgba(15, 23, 42, 0.6);
                    border-radius: 16px;
                    border: 1px solid #1e293b;
                    margin-bottom: 30px;
                }
                .hero-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(59, 130, 246, 0.15);
                    color: #60a5fa;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                .hero-title {
                    font-size: 38px;
                    font-weight: 900;
                    margin: 0 0 10px 0;
                    color: #ffffff;
                    letter-spacing: 1px;
                }
                .hero-subtitle {
                    color: #94a3b8;
                    font-size: 15px;
                    margin: 0 0 24px 0;
                }
                .hero-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                /* ЛЕНТА И ШАПКА */
                .events-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .events-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-bottom: 1px solid #1e293b;
                    padding-bottom: 16px;
                }
                .section-title {
                    font-size: 24px;
                    font-weight: 800;
                    margin: 0 0 6px 0;
                    color: #ffffff;
                    line-height: 1.2;
                }
                .section-desc {
                    font-size: 14px;
                    color: #94a3b8;
                    margin: 0;
                    line-height: 1.2;
                }

                /* СЕТКА КАРТОЧЕК */
                .activity-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                }

                /* КАРТОЧКА */
                .activity-card {
                    position: relative;
                    background: #0f172a;
                    border: 1px solid #1e293b;
                    border-left: 4px solid #3b82f6;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
                }

                .card-delete-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: rgba(239, 68, 68, 0.15);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    width: 26px;
                    height: 26px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    transition: 0.2s;
                }
                .card-delete-btn:hover {
                    background: #ef4444;
                    color: #ffffff;
                }

                .card-header-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-right: 28px;
                }
                .player-nick {
                    font-weight: 800;
                    font-size: 16px;
                    color: #38bdf8;
                }
                .event-time {
                    font-size: 12px;
                    color: #64748b;
                }

                .card-body-content {
                    display: flex;
                    gap: 14px;
                }
                .preview-frame {
                    width: 120px;
                    height: 75px;
                    background: #1e293b;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                    flex-shrink: 0;
                    border: 1px solid #334155;
                }
                .preview-frame img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .rank-tag {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    background: rgba(0, 0, 0, 0.85);
                    color: #f59e0b;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .level-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 4px;
                    min-width: 0;
                }
                .level-name {
                    font-size: 16px;
                    font-weight: 800;
                    margin: 0;
                    color: #ffffff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .location-info {
                    font-size: 12px;
                    color: #94a3b8;
                    display: flex;
                    gap: 6px;
                }
                .progress-pill {
                    align-self: flex-start;
                    font-size: 11px;
                    font-weight: 800;
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.15);
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .card-action-bar {
                    border-top: 1px dashed #1e293b;
                    padding-top: 10px;
                    text-align: right;
                }
                .watch-link {
                    color: #f43f5e;
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                .watch-link:hover {
                    text-decoration: underline;
                }

                /* КНОПКИ И МОДАЛКА */
                .crc-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .btn-accent { background: #3b82f6; color: #fff; }
                .btn-surface { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; }
                .btn-success { background: #10b981; color: #fff; }

                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 1000;
                }
                .modal-window {
                    background: #0f172a;
                    border: 1px solid #1e293b;
                    padding: 24px;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 460px;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .modal-header h3 { margin: 0; color: #fff; }
                .close-btn { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; }
                .modal-form { display: flex; flex-direction: column; gap: 12px; }
                .form-row, .form-grid-2, .form-grid-3 { display: flex; flex-direction: column; gap: 6px; }
                .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
                .modal-form label { font-size: 12px; color: #94a3b8; }
                .modal-form input {
                    background: #1e293b;
                    border: 1px solid #334155;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 6px;
                    outline: none;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 12px;
                }
            </style>

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
                    <router-link to="/leaderboard" class="crc-btn btn-surface">🏆 Топ игроков</router-link>
                </div>
            </header>

            <!-- СОБЫТИЯ -->
            <main class="events-wrapper">
                <div class="events-head">
                    <div>
                        <h2 class="section-title">Лента активности</h2>
                        <p class="section-desc">Прохождения игроков из крыма за последний месяц</p>
                    </div>

                    <div class="events-tools">
                        <button v-if="isAdmin" @click="showModal = true" class="crc-btn btn-success">+ Новое событие</button>
                    </div>
                </div>

                <!-- СЕТКА КАРТОЧЕК -->
                <div class="activity-grid">
                    <article v-for="(event, index) in events" :key="index" class="activity-card">
                        <!-- Кнопка удаления только для админа -->
                        <button v-if="isAdmin" @click="removeEvent(index)" class="card-delete-btn" title="Удалить карточку">
                            ✕
                        </button>

                        <div class="card-header-bar">
                            <div class="player-info">
                                <span class="player-nick">{{ event.playerName }}</span>
                            </div>
                            <time class="event-time">{{ event.date }}</time>
                        </div>

                        <div class="card-body-content">
                            <div class="preview-frame">
                                <span class="rank-tag">#{{ event.rank }}</span>
                                <img :src="event.thumb || 'https://via.placeholder.com/300x160/1a202c/ffffff?text=No+Image'" alt="Preview">
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
                        <div class="form-row">
                            <label>Игрок:</label>
                            <input v-model="newEvent.playerName" type="text" required placeholder="Player">
                        </div>
                        <div class="form-grid-2">
                            <div>
                                <label>Город:</label>
                                <input v-model="newEvent.location" type="text" required placeholder="Симферополь">
                            </div>
                            <div>
                                <label>Флаг:</label>
                                <input v-model="newEvent.flag" type="text" placeholder="🏴">
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
            events: [
                {
                    playerName: 'SubtropikiGMD',
                    date: '27 сен.',
                    rank: 320,
                    levelName: 'Femboy Fantasy',
                    location: 'Севастополь',
                    flag: '🏴',
                    percent: '100%',
                    thumb: '',
                    videoUrl: 'https://youtube.com'
                },
                {
                    playerName: 'pinum',
                    date: '27 сен.',
                    rank: 254,
                    levelName: 'MY SONG',
                    location: 'Ялта',
                    flag: '🏴',
                    percent: '100%',
                    thumb: '',
                    videoUrl: 'https://youtube.com'
                }
            ],
            newEvent: {
                levelName: '',
                playerName: '',
                location: '',
                flag: '🏴',
                rank: '',
                percent: '100%',
                date: '',
                thumb: '',
                videoUrl: ''
            }
        };
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
            this.newEvent = { levelName: '', playerName: '', location: '', flag: '🏴', rank: '', percent: '100%', date: '', thumb: '', videoUrl: '' };
        },
        removeEvent(index) {
            if (confirm("Удалить эту карточку из ленты?")) {
                this.events.splice(index, 1);
            }
        }
    }
};
