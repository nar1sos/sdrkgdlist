// js/pages/Achievements.js

export default {
    name: 'Achievements',
    data() {
        return {
            isAdmin: sessionStorage.getItem('is_admin') === 'true',
            searchQuery: '',
            selectedTag: 'ALL',
            mode: 'Classic',

            isDragging: false,
            draggedIndex: null,

            newRecord: {
                title: '',
                player: '',
                flag: 'ru',
                levelId: '86407629',
                date: '',
                length: '3m 58s',
                ver: '2.2',
                tags: ['Level', 'Progress'],
                banner: '',
                video: ''
            },

            availableTags: [
                'Level', 'Challenge',
                'Low Hertz', 'Progress',
                'Consistency', 'Verified',
                'Rated', 'Tentative',
                'Noclip', 'Speedhack',
                'Mobile', '2 Player',
                'Miscellaneous', 'Outdated Version',
                'Pending Removal', 'Variant'
            ],

            records: JSON.parse(localStorage.getItem('achievements_records') || '[]')
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

        saveToStorage() {
            localStorage.setItem('achievements_records', JSON.stringify(this.records));
        },

        resetFilters() {
            this.searchQuery = '';
            this.selectedTag = 'ALL';
        },

        getFlagUrl(flagInput) {
            if (!flagInput) return 'https://flagcdn.com/w40/un.png';
            if (flagInput.startsWith('http://') || flagInput.startsWith('https://')) {
                return flagInput;
            }
            return `https://flagcdn.com/w40/${flagInput.toLowerCase()}.png`;
        },

        onCardDragStart(index) {
            if (!this.isAdmin) return;
            this.draggedIndex = index;
        },

        onCardDragOver(index) {
            if (!this.isAdmin || this.draggedIndex === null || this.draggedIndex === index) return;
            
            const movedItem = this.records.splice(this.draggedIndex, 1)[0];
            this.records.splice(index, 0, movedItem);
            this.draggedIndex = index;

            this.updateRanks();
            this.saveToStorage();
        },

        onCardDragEnd() {
            this.draggedIndex = null;
        },

        updateRanks() {
            this.records.forEach((rec, idx) => {
                rec.rank = `#${idx + 1}`;
            });
        },

        handleFileUpload(file) {
            if (!file || !file.type.startsWith('image/')) {
                alert('Загрузите изображение!');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                this.newRecord.banner = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        onFileSelect(e) {
            const file = e.target.files[0];
            this.handleFileUpload(file);
        },

        onDropBanner(e) {
            this.isDragging = false;
            const file = e.dataTransfer.files[0];
            this.handleFileUpload(file);
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

            this.records.push({
                id: Date.now(),
                rank: `#${this.records.length + 1}`,
                title: this.newRecord.title,
                player: this.newRecord.player,
                flag: this.getFlagUrl(this.newRecord.flag),
                levelId: this.newRecord.levelId || '86407629',
                date: this.newRecord.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'SHORT', year: '2-digit' }).toUpperCase(),
                length: this.newRecord.length || '3m 58s',
                ver: this.newRecord.ver || '2.2',
                tags: [...this.newRecord.tags],
                banner: this.newRecord.banner || 'https://via.placeholder.com/800x200/0d1117/3b82f6',
                video: this.newRecord.video || '#'
            });

            this.updateRanks();
            this.saveToStorage();

            this.newRecord.title = '';
            this.newRecord.player = '';
            this.newRecord.flag = 'ru';
            this.newRecord.banner = '';
            this.newRecord.video = '';
        },

        deleteRecord(id) {
            if (confirm("Удалить этот рекорд?")) {
                this.records = this.records.filter(r => r.id !== id);
                this.updateRanks();
                this.saveToStorage();
            }
        }
    },
    template: `
        <div class="thal-achievements-layout">
            
            <div class="thal-main-feed">
                
                <div class="feed-sub-header">
                    <span>{{ filteredRecords.length }} of {{ records.length }} entries</span>
                </div>

                <!-- Форма Админа -->
                <div v-if="isAdmin" class="thal-admin-box">
                    <div class="admin-title">⚡ АДМИН-ПАНЕЛЬ: ДОБАВИТЬ ЗАПИСЬ</div>
                    <form @submit.prevent="addRecord">
                        <div class="admin-inputs-grid">
                            <input type="text" v-model="newRecord.title" placeholder="Название + Прогресс (Tidal Wave 100%)" required>
                            <input type="text" v-model="newRecord.player" placeholder="Игрок (NaR1)" required>
                            <input type="text" v-model="newRecord.flag" placeholder="Флаг (ru, ua, us)">
                            <input type="text" v-model="newRecord.levelId" placeholder="ID уровня (86407629)">
                            <input type="text" v-model="newRecord.date" placeholder="Дата (5 AUG 26)">
                            <input type="url" v-model="newRecord.banner" placeholder="URL баннера уровня">
                            <input type="url" v-model="newRecord.video" placeholder="URL видео (YouTube)">
                        </div>

                        <div 
                            class="thal-dropzone"
                            :class="{ 'dragging': isDragging }"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="onDropBanner"
                            @click="$refs.fileInput.click()"
                        >
                            <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" style="display: none;">
                            <span v-if="!newRecord.banner">📁 Drag & Drop баннер уровня или кликни для выбора</span>
                            <span v-else style="color: #22c55e;">✓ Изображение загружено!</span>
                        </div>

                        <div class="admin-tags-picker">
                            <span class="picker-label">Теги:</span>
                            <button 
                                type="button" 
                                v-for="tag in availableTags" 
                                :key="tag"
                                :class="['admin-tag-btn', { active: newRecord.tags.includes(tag) }]"
                                @click="toggleTagInForm(tag)"
                            >
                                {{ tag }}
                            </button>
                        </div>

                        <button type="submit" class="admin-submit-btn">Сохранить рекорд</button>
                    </form>
                </div>

                <!-- Список карточек с фоновой картинкой на всю ширину и плавной маской -->
                <div class="thal-entries-list">
                    <div 
                        v-for="(item, index) in filteredRecords" 
                        :key="item.id" 
                        class="thal-card"
                        :class="{ 'draggable-card': isAdmin, 'is-dragging': draggedIndex === index }"
                        :draggable="isAdmin"
                        @dragstart="onCardDragStart(index)"
                        @dragover.prevent="onCardDragOver(index)"
                        @dragend="onCardDragEnd"
                    >
                        <!-- Картинка фоном на всю карточку -->
                        <img :src="item.banner" class="thal-card-bg-banner" alt="Banner">

                        <!-- Плавное темное затемнение слева -->
                        <div class="thal-card-overlay"></div>

                        <!-- Текстовый контент слева -->
                        <div class="thal-card-left">
                            <div class="card-rank">{{ item.rank }}</div>
                            <h3 class="card-title">{{ item.title }}</h3>
                            
                            <div class="card-author">
                                <span class="by-text">by</span>
                                <span class="author-name">{{ item.player }}</span>
                                <img :src="item.flag" class="author-flag" alt="flag">
                            </div>

                            <div class="card-stats-row">
                                <div class="stat-col"><span class="stat-lbl">ID</span><span class="stat-val">{{ item.levelId }}</span></div>
                                <div class="stat-col"><span class="stat-lbl">DATE</span><span class="stat-val">{{ item.date }}</span></div>
                                <div class="stat-col"><span class="stat-lbl">LEN</span><span class="stat-val">{{ item.length }}</span></div>
                                <div class="stat-col"><span class="stat-lbl">VER</span><span class="stat-val">{{ item.ver }}</span></div>
                            </div>

                            <div class="card-tags-row">
                                <span v-for="tag in item.tags" :key="tag" class="thal-tag">
                                    <span class="tag-star">★</span> {{ tag.toUpperCase() }}
                                </span>
                            </div>
                        </div>

                        <!-- Кнопки справа -->
                        <div class="thal-card-right-actions">
                            <a v-if="item.video && item.video !== '#'" :href="item.video" target="_blank" class="video-play-btn">▶</a>
                            <button v-if="isAdmin" @click.stop="deleteRecord(item.id)" class="admin-del-btn">🗑️</button>
                        </div>
                    </div>

                    <div v-if="filteredRecords.length === 0" class="thal-empty">
                        Записи не найдены
                    </div>
                </div>

            </div>

            <!-- Боковая панель -->
            <aside class="thal-sidebar">
                
                <div class="sidebar-mode-toggle">
                    <button :class="['mode-btn', { active: mode === 'Classic' }]" @click="mode = 'Classic'">★ Classic</button>
                    <button :class="['mode-btn', { active: mode === 'Platformer' }]" @click="mode = 'Platformer'">✦ Platformer</button>
                </div>

                <div class="sidebar-scale-box">
                    <div class="scale-row"><span>Scale Y</span><input type="range" min="1" max="100" value="50"></div>
                    <div class="scale-row"><span>Scale X</span><input type="range" min="1" max="100" value="50"></div>
                </div>

                <div class="sidebar-sort-box">
                    <div class="sort-label">SORT</div>
                    <div class="sort-selects">
                        <select class="thal-select"><option>Rank</option></select>
                        <select class="thal-select"><option>Ascending</option></select>
                    </div>
                    <label class="projected-check"><input type="checkbox"> Projected ranks</label>
                </div>

                <div class="sidebar-filter-box">
                    <div class="filter-header">
                        <span>FILTER</span>
                        <button @click="resetFilters" class="reset-lnk">Reset</button>
                    </div>

                    <div class="search-input-wrap">
                        <input type="text" v-model="searchQuery" placeholder="Search level or player...">
                    </div>

                    <div class="tags-grid-two-col">
                        <button 
                            v-for="tag in availableTags" 
                            :key="tag"
                            :class="['grid-tag-btn', { active: selectedTag === tag }]"
                            @click="selectedTag = (selectedTag === tag ? 'ALL' : tag)"
                        >
                            <span class="grid-tag-icon">⏹</span>
                            <span class="grid-tag-text">{{ tag }}</span>
                        </button>
                    </div>

                    <div class="show-all-tags">SHOW ALL TAGS</div>

                    <div class="range-fields">
                        <div class="range-row">
                            <span class="range-lbl">DATE</span>
                            <input type="text" placeholder="From" class="mini-in">
                            <span class="dash">-</span>
                            <input type="text" placeholder="To" class="mini-in">
                        </div>
                        <div class="range-row">
                            <span class="range-lbl">LENGTH</span>
                            <input type="text" placeholder="e.g. 3m" class="mini-in">
                            <span class="dash">-</span>
                            <input type="text" placeholder="e.g. 5m" class="mini-in">
                        </div>
                    </div>
                </div>

                <div class="hide-panel-btn">› HIDE PANEL</div>

            </aside>

        </div>
    `
};
