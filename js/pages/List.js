import * as ContentModule from "../content.js";
import Spinner from "../components/Spinner.js";

const GITHUB_USER = "nar1sos";
const GITHUB_REPO = "realdemonlist";
const GITHUB_BRANCH = "main";
const GITHUB_FILE_PATH = "data/_list.json";
const GITHUB_PLAYERS_PATH = "data/_leaderboard.json"; // Твой файл лидерборда

function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToUtf8(str) {
    const binary = atob(str.replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    const str = urlOrId.trim();
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = str.match(regExp);
    if (match && match[1]) {
        return match[1];
    }
    if (str.length === 11 && !str.includes('/') && !str.includes('.')) {
        return str;
    }
    return str;
}

export default {
    components: { Spinner },
    template: `
        <div class="gdl-wrapper">
            <Spinner v-if="loading" />

            <template v-else>
                <!-- 1. ПОИСК И КНОПКА СОХРАНЕНИЯ -->
                <div class="gdl-search-bar" style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px;">
                    <div class="search-input-wrapper" style="flex: 1;">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            placeholder="Поиск уровня..." 
                            class="gdl-input"
                        />
                        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
                    </div>

                    <button 
                        v-if="isAdmin" 
                        @click="saveListToGitHub" 
                        :style="{
                            background: hasUnsavedChanges ? '#eab308' : '#2563eb',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: hasUnsavedChanges ? '0 0 10px rgba(234, 179, 8, 0.5)' : 'none'
                        }"
                    >
                        💾 {{ hasUnsavedChanges ? 'Сохранить изменения *' : 'Сохранить изменения' }}
                    </button>
                </div>

                <!-- 2. СЕТКА КОНТЕНТА -->
                <div class="gdl-content-grid">
                    
                    <!-- ЛЕВАЯ КОЛОНКА -->
                    <div class="gdl-left-column">
                        <div class="gdl-meta-box">
                            <h3>Редакторы списка</h3>
                            <ul class="editors-list">
                                <li><span>👑</span> NaR1</li>
                                <li><span>🛡️</span> ThisIsTriscis</li>
                                <li><span>🛡️</span> itslafy</li>
                            </ul>
                            
                            <div class="rules-section">
                                <h3>Правила</h3>
                                <ul class="rules-list">
                                    <li><strong>1.</strong> Принимаются только рекорды из глобал демон листа (ВОЗМОЖНЫ ИСКЛЮЧЕНИЯ!)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- ЦЕНТРАЛЬНАЯ КОЛОНКА -->
                    <div class="gdl-cards-container">
                        <div v-if="isAdmin" style="margin-bottom: 10px;">
                            <button @click="openAddModal" style="width: 100%; padding: 10px; background: #22c55e; color: #fff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">
                                + Добавить новый уровень
                            </button>
                        </div>

                        <div 
                            v-for="(level, index) in filteredList" 
                            :key="level.name + index"
                            class="gdl-level-card"
                            :class="{ active: selectedLevel && selectedLevel.name === level.name }"
                            @click="openLevel(level)"
                            :draggable="isAdmin && !searchQuery"
                            @dragstart="onDragStart($event, index)"
                            @dragover.prevent
                            @drop="onDrop($event, index)"
                        >
                            <div class="gdl-card-thumb">
                                <span class="rank-badge">#{{ level.rank }}</span>
                                <img :src="getThumbnail(level)" alt="thumb" />
                            </div>

                            <div class="gdl-card-info">
                                <div class="card-header">
                                    <span class="rank-number">#{{ level.rank }}</span>
                                    <h4 class="level-title">{{ level.name }}</h4>
                                </div>
                                <div class="card-authors">
                                    от <span>{{ level.author }}</span>
                                </div>
                                
                                <div class="level-points" style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-top: 4px;">
                                    🏆 {{ getPoints(level.rank) }} pt
                                </div>

                                <div class="verifier-name" v-if="level.verifier">
                                    Верификатор: {{ level.verifier }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ПРАВАЯ КОЛОНКА (ИНФОРМАЦИЯ И АВТО-ВИКТОРЫ) -->
                    <div class="gdl-details-container">
                        <div v-if="selectedLevel" class="gdl-level-detail-box">
                            
                            <!-- Видео плейер -->
                            <div class="detail-video" v-if="extractYouTubeId(selectedLevel.ytid)">
                                <iframe 
                                    :src="'https://www.youtube.com/embed/' + extractYouTubeId(selectedLevel.ytid)" 
                                    frameborder="0" 
                                    allowfullscreen
                                    style="width: 100%; height: 210px; border-radius: 8px;"
                                ></iframe>
                            </div>

                            <!-- Информация об уровне -->
                            <div style="margin-top: 15px;">
                                <h2 style="font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px;">
                                    #{{ selectedLevel.rank }} - {{ selectedLevel.name }}
                                </h2>
                                <p style="color: #94a3b8; font-size: 14px;">
                                    Создатель: <strong style="color: #f3f4f6;">{{ selectedLevel.author }}</strong>
                                </p>
                                <p v-if="selectedLevel.verifier" style="color: #94a3b8; font-size: 14px; margin-top: 2px;">
                                    Верификатор: <strong style="color: #f3f4f6;">{{ selectedLevel.verifier }}</strong>
                                </p>
                                <p style="color: #38bdf8; font-weight: 700; margin-top: 6px;">
                                    Очки за прохождение: {{ getPoints(selectedLevel.rank) }} pt
                                </p>
                            </div>

                            <!-- Управление (Админ) -->
                            <div v-if="isAdmin" style="display: flex; gap: 8px; margin-top: 12px;">
                                <button @click="openEditModal(selectedLevel)" style="flex:1; padding: 6px 12px; background: #3b82f6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 12px;">
                                    ✏️ Изменить
                                </button>
                                <button @click="deleteLevel(selectedLevel)" style="flex:1; padding: 6px 12px; background: #ef4444; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 12px;">
                                    🗑️ Удалить
                                </button>
                            </div>

                            <hr style="border: 0; border-top: 1px solid #283044; margin: 18px 0;" />

                            <!-- СЕКЦИЯ ВИКТОРОВ (АВТОМАТИЧЕСКИ ИЗ _leaderboard.json) -->
                            <div class="victors-section">
                                <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                                    <span>🏆 Викторы</span>
                                    <span style="font-size: 12px; background: #1e293b; color: #94a3b8; padding: 2px 8px; border-radius: 12px;">
                                        {{ levelVictors.length }}
                                    </span>
                                </h3>

                                <div v-if="levelVictors.length > 0" class="victors-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 350px; overflow-y: auto; padding-right: 4px;">
                                    <div 
                                        v-for="(victor, idx) in levelVictors" 
                                        :key="idx" 
                                        style="display: flex; align-items: center; justify-content: space-between; background: #111827; padding: 8px 12px; border-radius: 8px; border: 1px solid #1f2937;"
                                    >
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <!-- Картинка флага из country -->
                                            <img 
                                                v-if="isUrl(victor.country)" 
                                                :src="victor.country" 
                                                alt="flag" 
                                                style="width: 20px; height: 14px; object-fit: cover; border-radius: 2px;"
                                            />
                                            <span v-else style="font-size: 16px;">🌐</span>

                                            <span style="color: #f3f4f6; font-weight: 600; font-size: 14px;">{{ victor.name }}</span>
                                        </div>

                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="color: #22c55e; font-weight: 800; font-size: 13px;">100%</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-else style="color: #64748b; font-size: 13px; font-style: italic; text-align: center; padding: 20px 0;">
                                    Пока нет записанных рекордов
                                </div>
                            </div>

                        </div>

                        <div v-else class="gdl-level-detail-box" style="display: flex; align-items: center; justify-content: center; min-height: 300px; color: #64748b;">
                            Выберите уровень для просмотра информации
                        </div>
                    </div>

                </div>
            </template>

            <!-- МОДАЛЬНОЕ ОКНО -->
            <div v-if="showLevelModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;" @click.self="showLevelModal = false">
                <div style="background: #161b26; border: 1px solid #283044; padding: 24px; border-radius: 12px; width: 100%; max-width: 450px; color: #fff;">
                    <h3 style="margin-bottom: 15px;">{{ isEditing ? 'Редактировать уровень' : 'Добавить новый уровень' }}</h3>
                    
                    <label style="display:block; margin-top:10px; font-size:12px; color:#94a3b8;">Название уровня:*</label>
                    <input type="text" v-model="levelForm.name" class="gdl-input" placeholder="Tidal Wave" style="margin-top:4px;" />

                    <label style="display:block; margin-top:10px; font-size:12px; color:#94a3b8;">Автор:*</label>
                    <input type="text" v-model="levelForm.author" class="gdl-input" placeholder="OniLink" style="margin-top:4px;" />

                    <label style="display:block; margin-top:10px; font-size:12px; color:#94a3b8;">Верификатор:</label>
                    <input type="text" v-model="levelForm.verifier" class="gdl-input" placeholder="Zoink" style="margin-top:4px;" />

                    <label style="display:block; margin-top:10px; font-size:12px; color:#94a3b8;">YouTube Video (ID или Полная ссылка):</label>
                    <input type="text" v-model="levelForm.ytid" class="gdl-input" placeholder="https://youtu.be/... или dQw4w9WgXcQ" style="margin-top:4px;" />

                    <label style="display:block; margin-top:10px; font-size:12px; color:#94a3b8;">Кастомная превью (необязательно):</label>
                    <input type="text" v-model="levelForm.thumbnail" class="gdl-input" placeholder="https://..." style="margin-top:4px;" />

                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button @click="saveLevel" style="flex:1; padding:10px; background:#22c55e; color:#fff; border:none; border-radius:8px; font-weight:800; cursor:pointer;">Применить</button>
                        <button @click="showLevelModal = false" style="flex:1; padding:10px; background:#475569; color:#fff; border:none; border-radius:8px; font-weight:800; cursor:pointer;">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `,

    data: () => ({
        GITHUB_USER,
        list: [],
        players: [], // Массив игроков из _leaderboard.json
        loading: true,
        selectedLevel: null,
        searchQuery: '',
        draggedIndex: null,
        fileSha: '',
        isAdmin: sessionStorage.getItem('is_admin') === 'true',
        hasUnsavedChanges: false,
        
        showLevelModal: false,
        isEditing: false,
        levelForm: { name: '', author: '', verifier: '', ytid: '', thumbnail: '' }
    }),

    computed: {
        filteredList() {
            if (!this.searchQuery) return this.list;
            const q = this.searchQuery.toLowerCase();
            return this.list.filter(item => 
                (item.name && item.name.toLowerCase().includes(q)) ||
                (item.author && item.author.toLowerCase().includes(q))
            );
        },

        // ДИНАМИЧЕСКИЙ ПОИСК ВИКТОРОВ ИЗ _leaderboard.json
        levelVictors() {
            if (!this.selectedLevel) return [];
            
            // 1. Проверяем локальные records в самом объекте уровня в _list.json
            const directRecords = this.selectedLevel.records || this.selectedLevel.victors || [];
            if (directRecords.length > 0) {
                return directRecords.map(r => ({
                    name: r.user || r.name || r.player || 'Unknown',
                    country: r.country || '',
                    percent: r.percent || 100
                }));
            }

            // 2. Поиск среди игроков из _leaderboard.json
            const matchedVictors = [];
            const currentLevelName = this.selectedLevel.name.toLowerCase().trim();

            this.players.forEach(player => {
                const playerRecords = player.records || [];
                
                // Массив records состоит из строк c названиями уровней
                const hasBeatenLevel = playerRecords.some(rec => {
                    if (typeof rec === 'string') {
                        return rec.toLowerCase().trim() === currentLevelName;
                    } else if (typeof rec === 'object' && rec !== null) {
                        const lvlName = rec.name || rec.level || '';
                        return lvlName.toLowerCase().trim() === currentLevelName;
                    }
                    return false;
                });

                if (hasBeatenLevel) {
                    matchedVictors.push({
                        name: player.user || player.name || 'Unknown',
                        country: player.country || ''
                    });
                }
            });

            return matchedVictors;
        }
    },

    async mounted() {
        window.addEventListener('admin-state-changed', this.updateAdminState);
        await this.loadAllData();
    },

    unmounted() {
        window.removeEventListener('admin-state-changed', this.updateAdminState);
    },

    methods: {
        extractYouTubeId,
        
        isUrl(str) {
            return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
        },

        openLevel(level) {
            if (!level) return;
            this.selectedLevel = level;
        },

        getPoints(rank) {
            if (!rank || rank <= 0) return 0;
            const maxPoints = 1000;
            const minPoints = 1;
            const totalLevels = this.list.length || 1;

            if (totalLevels === 1) return maxPoints;

            const score = maxPoints - (rank - 1) * ((maxPoints - minPoints) / (totalLevels - 1));
            return Math.round(score * 100) / 100;
        },

        updateAdminState() {
            this.isAdmin = sessionStorage.getItem('is_admin') === 'true';
        },

        async loadAllData() {
            try {
                // 1. Загрузка списка уровней (_list.json)
                let loadedList = [];
                try {
                    let resList = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`);
                    if (resList.ok) {
                        const data = await resList.json();
                        this.fileSha = data.sha;
                        const decodedContent = base64ToUtf8(data.content);
                        loadedList = JSON.parse(decodedContent);
                    }
                } catch (err) {
                    console.warn("GitHub list fetch error:", err);
                }

                if (!loadedList || loadedList.length === 0) {
                    const fetchListFn = ContentModule.fetchList || (async () => []);
                    loadedList = await fetchListFn();
                }

                if (Array.isArray(loadedList)) {
                    this.list = loadedList.map((item, index) => {
                        if (typeof item === 'string') {
                            return { name: item, author: 'Unknown', rank: index + 1, records: [] };
                        } else if (typeof item === 'object' && item !== null) {
                            return { ...item, rank: index + 1, records: item.records || item.victors || [] };
                        }
                        return { name: "Unknown", rank: index + 1, records: [] };
                    });
                } else {
                    this.list = [];
                }

                // 2. Загрузка лидерборда (_leaderboard.json)
                try {
                    let resPlayers = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_PLAYERS_PATH}?ref=${GITHUB_BRANCH}`);
                    if (resPlayers.ok) {
                        const pData = await resPlayers.json();
                        const decodedPlayers = base64ToUtf8(pData.content);
                        this.players = JSON.parse(decodedPlayers);
                    }
                } catch (err) {
                    console.warn("GitHub leaderboard fetch error:", err);
                }

                if (this.list.length > 0 && !this.selectedLevel) {
                    this.selectedLevel = this.list[0];
                }

                this.hasUnsavedChanges = false;
            } catch (e) {
                console.error("Data load error:", e);
            } finally {
                this.loading = false;
            }
        },

        getThumbnail(level) {
            if (level.thumbnail && level.thumbnail.trim() !== '') {
                return level.thumbnail;
            }
            const cleanId = extractYouTubeId(level.ytid);
            return cleanId ? `https://i.ytimg.com/vi/${cleanId}/hqdefault.jpg` : 'https://i.imgur.com/6VBx3io.png';
        },

        openAddModal() {
            this.isEditing = false;
            this.levelForm = { name: '', author: '', verifier: '', ytid: '', thumbnail: '' };
            this.showLevelModal = true;
        },

        openEditModal(level) {
            this.isEditing = true;
            this.levelForm = {
                name: level.name || '',
                author: level.author || '',
                verifier: level.verifier || '',
                ytid: level.ytid || '',
                thumbnail: level.thumbnail || ''
            };
            this.showLevelModal = true;
        },

        saveLevel() {
            if (!this.levelForm.name) return alert("Введите название уровня!");

            const cleanedYtid = extractYouTubeId(this.levelForm.ytid);

            if (this.isEditing && this.selectedLevel) {
                this.selectedLevel.name = this.levelForm.name;
                this.selectedLevel.author = this.levelForm.author;
                this.selectedLevel.verifier = this.levelForm.verifier;
                this.selectedLevel.ytid = cleanedYtid;
                this.selectedLevel.thumbnail = this.levelForm.thumbnail;
            } else {
                const newLvl = {
                    name: this.levelForm.name,
                    author: this.levelForm.author || 'Unknown',
                    verifier: this.levelForm.verifier || '',
                    ytid: cleanedYtid,
                    thumbnail: this.levelForm.thumbnail || '',
                    rank: this.list.length + 1,
                    records: []
                };
                this.list.push(newLvl);
                this.selectedLevel = newLvl;
            }

            this.showLevelModal = false;
            this.hasUnsavedChanges = true;
        },

        deleteLevel(level) {
            if (confirm(`Вы уверены, что хотите удалить уровень "${level.name}"?`)) {
                const idx = this.list.findIndex(item => item.name === level.name);
                if (idx !== -1) {
                    this.list.splice(idx, 1);
                    this.list.forEach((item, i) => {
                        item.rank = i + 1;
                    });
                    this.selectedLevel = this.list[0] || null;
                    this.hasUnsavedChanges = true;
                }
            }
        },

        onDragStart(event, filteredIndex) {
            if (!this.isAdmin || this.searchQuery) return;
            this.draggedIndex = filteredIndex;
            event.dataTransfer.effectAllowed = 'move';
        },

        onDrop(event, targetIndex) {
            if (!this.isAdmin || this.searchQuery || this.draggedIndex === null || this.draggedIndex === targetIndex) return;

            const movedItem = this.list.splice(this.draggedIndex, 1)[0];
            this.list.splice(targetIndex, 0, movedItem);

            this.list.forEach((item, idx) => {
                item.rank = idx + 1;
            });

            this.draggedIndex = null;
            this.hasUnsavedChanges = true;
        },

        async saveListToGitHub() {
            let token = localStorage.getItem("my_gh_token") || "";
            if (!token) {
                token = prompt("Введите ваш GitHub Token:");
                if (token) {
                    token = token.trim();
                    localStorage.setItem("my_gh_token", token);
                } else {
                    return alert("Без токена нельзя сохранить изменения!");
                }
            }

            try {
                const getFileRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}`, {
                    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
                });
                if (getFileRes.ok) {
                    const fileData = await getFileRes.json();
                    this.fileSha = fileData.sha;
                }

                const cleanData = this.list.map(item => ({
                    name: item.name,
                    author: item.author,
                    verifier: item.verifier,
                    ytid: extractYouTubeId(item.ytid),
                    thumbnail: item.thumbnail || '',
                    percentToQualify: item.percentToQualify || 100,
                    records: item.records || item.victors || []
                }));

                const jsonString = JSON.stringify(cleanData, null, 4);
                const contentEncoded = utf8ToBase64(jsonString);

                const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        message: 'Update demonlist via Admin Panel',
                        content: contentEncoded,
                        sha: this.fileSha,
                        branch: GITHUB_BRANCH
                    })
                });

                if (response.ok) {
                    const resData = await response.json();
                    this.fileSha = resData.content.sha;
                    this.hasUnsavedChanges = false;
                    alert("Успешно сохранено на GitHub!");
                } else {
                    const errData = await response.json();
                    alert(`Ошибка GitHub (${response.status}): ${errData.message || 'Проверьте токен'}`);
                }
            } catch (err) {
                alert("Ошибка сохранения: " + err.message);
            }
        }
    }
};
