// js/pages/Achievements.js

export default {
    name: 'Achievements',
    data() {
        return {
            searchQuery: '',
            isAdmin: sessionStorage.getItem('is_admin') === 'true',
            
            // Поля формы (видна только админу)
            newRecord: {
                level: '',
                player: '',
                flag: 'ru', // Двухбуквенный код страны (ru, ua, kz) или полная ссылка на картинку
                percent: null,
                thumb: '',
                video: ''
            },

            // Список рекордов (изначально пуст или загружается динамически)
            records: []
        };
    },
    computed: {
        filteredRecords() {
            if (!this.searchQuery) return this.records;
            const q = this.searchQuery.toLowerCase();
            return this.records.filter(r => 
                r.level.toLowerCase().includes(q) || 
                r.player.toLowerCase().includes(q)
            );
        }
    },
    mounted() {
        // Подписка на изменение статуса админа
        window.addEventListener('admin-state-changed', this.checkAdminStatus);
    },
    unmounted() {
        window.removeEventListener('admin-state-changed', this.checkAdminStatus);
    },
    methods: {
        checkAdminStatus() {
            this.isAdmin = sessionStorage.getItem('is_admin') === 'true';
        },

        getFlagUrl(flagInput) {
            if (!flagInput) return 'https://flagcdn.com/w40/un.png';
            if (flagInput.startsWith('http://') || flagInput.startsWith('https://')) {
                return flagInput;
            }
            return `https://flagcdn.com/w40/${flagInput.toLowerCase()}.png`;
        },

        addRecord() {
            if (!this.newRecord.level || !this.newRecord.player || !this.newRecord.percent) return;

            const recordData = {
                id: Date.now(),
                level: this.newRecord.level,
                player: this.newRecord.player,
                flag: this.getFlagUrl(this.newRecord.flag),
                percent: parseInt(this.newRecord.percent),
                thumb: this.newRecord.thumb || 'https://via.placeholder.com/80x48',
                video: this.newRecord.video || '#'
            };

            this.records.unshift(recordData);

            // Очистка формы
            this.newRecord.level = '';
            this.newRecord.player = '';
            this.newRecord.flag = 'ru';
            this.newRecord.percent = null;
            this.newRecord.thumb = '';
            this.newRecord.video = '';
        },

        deleteRecord(id) {
            if (confirm("Удалить этот рекорд?")) {
                this.records = this.records.filter(r => r.id !== id);
            }
        }
    },
    template: `
        <div class="achievements-container">
            
            <!-- Панель админа: Добавление рекорда (видна ТОЛЬКО админу) -->
            <div v-if="isAdmin" class="admin-add-box">
                <div class="admin-box-title">
                    <span>⚡ АДМИН-ПАНЕЛЬ: ДОБАВИТЬ РЕКОРД</span>
                </div>
                <form @submit.prevent="addRecord" class="admin-form-grid">
                    <div class="form-group">
                        <label>Уровень</label>
                        <input type="text" v-model="newRecord.level" placeholder="Например: Tidal Wave" required>
                    </div>

                    <div class="form-group">
                        <label>Игрок</label>
                        <input type="text" v-model="newRecord.player" placeholder="Никнейм игрока" required>
                    </div>

                    <div class="form-group">
                        <label>Код страны (ru, ua, kz) или URL флага</label>
                        <input type="text" v-model="newRecord.flag" placeholder="ru">
                    </div>

                    <div class="form-group">
                        <label>Прогресс (%)</label>
                        <input type="number" v-model="newRecord.percent" min="1" max="100" placeholder="100" required>
                    </div>

                    <div class="form-group">
                        <label>URL Превью уровня</label>
                        <input type="url" v-model="newRecord.thumb" placeholder="https://...">
                    </div>

                    <div class="form-group">
                        <label>URL Видео (пруф)</label>
                        <input type="url" v-model="newRecord.video" placeholder="https://youtube.com/...">
                    </div>

                    <button type="submit" class="admin-submit-btn">
                        Добавить рекорд в список
                    </button>
                </form>
            </div>

            <!-- Верхняя панель и поиск -->
            <div class="achievements-header-bar">
                <div class="title-block">
                    <h2>Achievements & Progresses</h2>
                    <span class="count-badge">{{ records.length }} записей</span>
                </div>
                
                <div class="achievements-search">
                    <input type="text" v-model="searchQuery" placeholder="Поиск по уровню или игроку...">
                    <span class="search-icon">🔍</span>
                </div>
            </div>

            <!-- Список рекордов -->
            <div class="achievements-list">
                <div v-for="item in filteredRecords" :key="item.id" class="progress-card">
                    <div class="level-info-group">
                        <img :src="item.thumb" class="level-thumb-mini" alt="Thumb">
                        <div class="level-details">
                            <div class="level-title-row">
                                <span class="level-name">{{ item.level }}</span>
                            </div>
                            <div class="player-info-row">
                                <img :src="item.flag" class="flag-img-small" alt="Flag">
                                <span class="player-name">{{ item.player }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="progress-right-group">
                        <span class="progress-tag" :class="item.percent === 100 ? 'progress-100' : 'progress-percent'">
                            {{ item.percent }}%
                        </span>
                        
                        <a v-if="item.video && item.video !== '#'" :href="item.video" target="_blank" class="record-video-btn" title="Смотреть прохождение">
                            ▶
                        </a>

                        <button v-if="isAdmin" @click="deleteRecord(item.id)" class="delete-record-btn" title="Удалить рекорд">
                            🗑️
                        </button>
                    </div>
                </div>

                <div v-if="filteredRecords.length === 0" class="empty-state">
                    Рекорды пока не добавлены
                </div>
            </div>
        </div>
    `
};
