// js/pages/Achievements.js

export default {
    name: 'Achievements',
    data() {
        return {
            isAdmin: sessionStorage.getItem('is_admin') === 'true',
            searchQuery: '',
            selectedTag: 'ALL',

            // Drag and drop для баннера при создании
            isDragging: false,

            // Индексы для перетаскивания карточек рекордов
            draggedIndex: null,

            newRecord: {
                title: '',
                player: '',
                flag: 'ru',
                date: '',
                tags: ['Level', 'Progress'],
                banner: '',
                video: ''
            },

            availableTags: [
                'Level',
                'Challenge',
                'Low Hertz',
                'Progress',
                'Consistency',
                'Verified',
                'Rated',
                'Tentative',
                'Noclip',
                'Speedhack',
                'Mobile',
                '2 Player',
                'Miscellaneous',
                'Outdated Version',
                'Pending Removal',
                'Variant'
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

        // --- Drag and Drop карточек (сортировка мест) ---
        onCardDragStart(index) {
            if (!this.isAdmin) return;
            this.draggedIndex = index;
        },

        onCardDragOver(index) {
            if (!this.isAdmin || this.draggedIndex === null || this.draggedIndex === index) return;
            
            // Меняем местами элементы в массиве
            const movedItem = this.records.splice(this.draggedIndex, 1)[0];
            this.records.splice(index, 0, movedItem);
            
            // Обновляем позицию перетаскиваемого
            this.draggedIndex = index;

            // Пересчитываем #ранг для всех
            this.updateRanks();
            this.saveToStorage();
        },

        onCardDragEnd() {
            this.draggedIndex = null;
        },

        updateRanks() {
            this.records.forEach((rec, idx) => {
                rec.rank = `#${this.records.length - idx}`;
            });
        },

        // --- Drag and Drop изображения баннера ---
        handleFileUpload(file) {
            if (!file || !file.type.startsWith('image/')) {
                alert('Пожалуйста, загрузите изображение!');
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

            this.updateRanks();
            this.saveToStorage();

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
                this.updateRanks();
                this.saveToStorage();
            }
        }
    },
    template: `
        <div class="gdl-achievements-page">
            
            <div class="achievements-feed">
                
                <!-- Админ-панель -->
                <div v-if="isAdmin" class="admin-panel-card">
                    <div class="admin-card-title">⚡ АДМИН-ПАНЕЛЬ: ДОБАВИТЬ ЗАПИСЬ</div>
                    <form @submit.prevent="addRecord" class="admin-form">
                        <div class="admin-grid">
                            <input type="text" v-model="newRecord.title" placeholder="Название + Прогресс (напр. Tidal Wave 100%)" required>
                            <input type="text" v-model="newRecord.player" placeholder="Игрок (напр. NaR1)" required>
                            <input type="text" v-model="newRecord.flag" placeholder="Флаг (ru, ua, kz)">
                            <input type="text" v-model="newRecord.date" placeholder="Дата (напр. 22 JUL 26)">
                            <input type="url" v-model="newRecord.banner" placeholder="URL баннера или используйте Drag & Drop ниже">
                            <input type="url" v-model="newRecord.video" placeholder="URL видео (YouTube)">
                        </div>

                        <!-- Drag & Drop Зона для загрузки файла баннера -->
                        <div 
                            class="drop-zone"
                            :class="{ 'dragging': isDragging }"
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="onDropBanner"
                            @click="$refs.fileInput.click()"
                        >
                            <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" style="display: none;">
                            <span v-if="!newRecord.banner">Перетащите сюда картинку уровня или кликните для выбора</span>
                            <span v-else class="drop-preview-success">✓ Картинка загружена! (кликните для замены)</span>
                        </div>

                        <!-- Выбор тегов -->
                        <div class="tag-selector">
                            <span class="tag-selector-label">Теги:</span>
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

                <!-- Список плашек (С поддержкой Drag-and-Drop перетаскивания мест) -->
                <div class="entries-list">
                    <div 
                        v-for="(item, index) in filteredRecords" 
                        :key="item.id" 
                        class="entry-card"
                        :class="{ 'draggable-card': isAdmin, 'is-dragging-card': draggedIndex === index }"
                        :draggable="isAdmin"
                        @dragstart="onCardDragStart(index)"
                        @dragover.prevent="onCardDragOver(index)"
                        @dragend="onCardDragEnd"
                    >
                        
                        <img :src="item.banner" class="entry-full-bg" alt="Banner">

                        <div class="entry-gradient-overlay"></div>

                        <div class="entry-content">
                            <div class="entry-meta">
                                <div class="entry-header">
                                    <span v-if="isAdmin" class="drag-handle-icon" title="Зажми и тащи для смены места">☰</span>
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

                            <div class="entry-actions">
                                <a v-if="item.video && item.video !== '#'" :href="item.video" target="_blank" class="banner-video-link" title="Смотреть">▶</a>
                                <button v-if="isAdmin" @click.stop="deleteRecord(item.id)" class="banner-delete-btn" title="Удалить">🗑️</button>
                            </div>
                        </div>

                    </div>

                    <div v-if="filteredRecords.length === 0" class="empty-feed">
                        Записи отсутствуют
                    </div>
                </div>

            </div>

            <!-- Сайдбар
