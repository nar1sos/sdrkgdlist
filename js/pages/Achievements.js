// js/pages/Achievements.js

export default {
    name: 'Achievements',
    data() {
        return {
            isAdmin: sessionStorage.getItem('is_admin') === 'true',
            searchQuery: '',
            selectedTag: 'ALL',

            // Поля формы админа
            newRecord: {
                title: '',
                player: '',
                flag: 'ru',
                date: '',
                tags: ['LEVEL', 'PROGRESS'],
                banner: '',
                video: ''
            },

            // Доступные теги
            availableTags: [
                'LEVEL', 
                'PROGRESS', 
                'CONSISTENCY', 
                'VERIFIED', 
                'NOCLIP', 
                'TENTATIVE', 
                '2 PLAYER'
            ],

            records: []
        };
    },
    computed: {
        filteredRecords() {
            return this.records.filter(r => {
                const matchesSearch = !this.searchQuery || 
                    r.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    r.player.toLowerCase().includes(this.searchQuery.toLowerCase());
                
                const matchesTag = this.selectedTag === 'ALL' || r.tags.includes(this.selectedTag);
                
                return matchesSearch && matchesTag;
            });
        }
    },
    mounted() {
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

        toggleTagInForm(tag) {
            const idx = this.newRecord.tags.indexOf(tag);
            if (idx > -1) {
                this.newRecord.tags.splice(idx, 1);
            } else {
                this.newRecord.tags.push(tag);
            }
        },

        addRecord() {
            if (!this.newRecord.title || !this.newRecord.player) return;

            this.records.unshift({
                id: Date.now(),
                rank: `#${this.records.length + 1}`,
                title: this.newRecord.title,
                player: this.newRecord.player,
                flag: this.getFlagUrl(this.newRecord.flag),
                date: this.newRecord.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'SHORT', year: '2-digit' }).toUpperCase(),
                tags: [...this.newRecord.tags],
                banner: this.newRecord.banner || 'https://via.placeholder.com/800x200/111319/3b82f6',
                video: this.newRecord.video || '#'
            });

            this.newRecord.title = '';
            this.newRecord.player = '';
            this.newRecord.flag = 'ru';
            this.newRecord.date = '';
            this.newRecord.banner = '';
            this.newRecord.video = '';
        },

        deleteRecord(id) {
            if (confirm("Удалить этот рекорд?")) {
                this.records = this.records.filter(r => r.id !== id);
            }
        }
    },
    template: `
        <div class="gdl-achievements-page">
            
            <!-- Левая колонка со списком рекордов -->
            <div class="achievements-feed">
                
                <!-- Админ-панель добавления -->
                <div v-if="isAdmin" class="admin-panel-card">
                    <div class="admin-card-title">⚡ АДМИН-ПАНЕЛЬ: ДОБАВИТЬ ЗАПИСЬ</div>
                    <form @submit.prevent="addRecord" class="admin-form">
                        <div class="admin-grid">
                            <input type="text" v-model="newRecord.title" placeholder="Название + Прогресс (напр. Tidal Wave 100%)" required>
                            <input type="text" v-model="newRecord.player" placeholder="Игрок (напр. NaR1)" required>
                            <input type="text" v-model="newRecord.flag" placeholder="Флаг (ru, ua, kz)">
                            <input type="text" v-model="newRecord.date" placeholder="Дата (напр. 22 JUL 26)">
                            <input type="url" v-model="newRecord.banner" placeholder="URL баннера уровния (16:9 или 21:9)">
                            <input type="url" v-model="newRecord.video" placeholder="URL видео (YouTube)">
                        </div>

                        <div class="tag-selector">
                            <span class="tag-selector-label">Выберите теги:</span>
                            <button 
                                type="button" 
                                v-for="tag in availableTags" 
                                :key="tag"
                                :class="['tag-toggle-btn', { active: newRecord.tags.includes(tag) }]"
                                @click="toggleTagInForm(tag)"
                            >
                                {{ tag }}
                            </button>
                        </div>

                        <button type="submit" class="admin-save-btn">Добавить в список</button>
                    </form>
                </div>

                <!-- Список плашек (Картинка 2) -->
                <div class="entries-list">
                    <div v-for="item in filteredRecords" :key="item.id" class="entry-card">
                        
                        <!-- Левая текстовая часть плашки -->
                        <div class="entry-meta">
                            <div class="entry-header">
                                <span class="entry-rank">{{ item.rank }}</span>
                                <h3 class="entry-title">{{ item.title }}</h3>
                            </div>

                            <div class="entry-player">
                                <img :src="item.flag" class="entry-flag" alt="flag">
                                <span class="entry-player-name">{{ item.player }}</span>
                            </div>

                            <div class="entry-subinfo">
                                <span class="entry-date">{{ item.date }}</span>
                            </div>

                            <div class="entry-tags">
                                <span v-for="tag in item.tags" :key="tag" class="orange-tag">
                                    ★ {{ tag }}
                                </span>
                            </div>
                        </div>

                        <!-- Правая часть — Баннер уровня -->
                        <div class="entry-banner-wrapper">
                            <img :src="item.banner" class="entry-banner" alt="Banner">
                            <a v-if="item.video && item.video !== '#'" :href="item.video" target="_blank" class="banner-video-link" title="Смотреть">▶</a>
                            <button v-if="isAdmin" @click="deleteRecord(item.id)" class="banner-delete-btn" title="Удалить">🗑️</button>
                        </div>

                    </div>

                    <div v-if="filteredRecords.length === 0" class="empty-feed">
                        Записи отсутствуют
                    </div>
                </div>

            </div>

            <!-- Правая боковая панель с фильтрами -->
            <aside class="sidebar-filters-panel">
                <div class="filter-box">
                    <div class="search-field">
                        <input type="text" v-model="searchQuery" placeholder="Поиск по уровню или игроку...">
                    </div>

                    <div class="filter-section">
                        <span class="filter-label">Фильтр по тегу</span>
                        <div class="tags-filter-list">
                            <button 
                                :class="['tag-filter-btn', { active: selectedTag === 'ALL' }]" 
                                @click="selectedTag = 'ALL'"
                            >
                                Все теги
                            </button>
                            <button 
                                v-for="tag in availableTags" 
                                :key="tag"
                                :class="['tag-filter-btn', { active: selectedTag === tag }]" 
                                @click="selectedTag = tag"
                            >
                                {{ tag }}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

        </div>
    `
};
