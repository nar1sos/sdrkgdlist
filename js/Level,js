import Spinner from "../components/Spinner.js";

const GITHUB_USER = "nar1sos";
const GITHUB_REPO = "realdemonlist";
const GITHUB_LEADERBOARD_PATH = "data/_leaderboard.json";

function extractYouTubeEmbedUrl(url) {
    if (!url) return null;
    let videoId = "";
    if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v");
    } else if (url.includes("youtube.com/embed/")) {
        videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default {
    components: { Spinner },
    props: {
        // Данные уровня, передаваемые из списка/_list.json или маршрутизатора
        levelData: {
            type: Object,
            required: true
        },
        // Массив всех уровней для расчета точных поинтов
        allLevels: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        loading: true,
        leaderboardData: [],
        victors: [],
        progresses: []
    }),

    computed: {
        embedVideoUrl() {
            return extractYouTubeEmbedUrl(this.levelData.video || this.levelData.youtube);
        },
        levelPoints() {
            if (!this.allLevels.length || !this.levelData.name) return 0;
            const rankIndex = this.allLevels.findIndex(
                item => (typeof item === 'string' ? item : item.name).toLowerCase() === this.levelData.name.toLowerCase()
            );
            if (rankIndex === -1) return 0;

            const N = this.allLevels.length;
            if (N === 1) return 1000;

            const maxPts = 1000;
            const minPts = 1;
            const pts = maxPts - (rankIndex / (N - 1)) * (maxPts - minPts);
            return parseFloat(pts.toFixed(2));
        }
    },

    async mounted() {
        await this.loadLeaderboardAndFilter();
    },

    methods: {
        async loadLeaderboardAndFilter() {
            try {
                const cacheBuster = `?_t=${Date.now()}`;
                const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_LEADERBOARD_PATH}${cacheBuster}`, {
                    headers: { 'Accept': 'application/vnd.github.v3+json' }
                });

                if (res.ok) {
                    const data = await res.json();
                    const binary = atob(data.content.replace(/\s/g, ''));
                    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
                    const decoded = new TextDecoder().decode(bytes);
                    this.leaderboardData = JSON.parse(decoded);
                } else {
                    this.leaderboardData = [];
                }

                this.parseVictorsAndProgresses();
            } catch (err) {
                console.error("Error loading leaderboard for level:", err);
            } finally {
                this.loading = false;
            }
        },

        parseVictorsAndProgresses() {
            const currentName = (this.levelData.name || "").toLowerCase();
            const victorsList = [];
            const progressesList = [];

            this.leaderboardData.forEach(player => {
                const playerName = player.user || player.name;
                const playerCountry = player.country || player.nationality || "";

                // Проверка обычных рекордов
                if (Array.isArray(player.records)) {
                    player.records.forEach(rec => {
                        const recName = typeof rec === 'string' ? rec : (rec.levelName || rec.level);
                        if (recName && recName.toLowerCase() === currentName) {
                            const percent = typeof rec === 'object' && rec.percent ? rec.percent : 100;
                            const recordEntry = {
                                name: playerName,
                                country: playerCountry,
                                percent: percent,
                                video: typeof rec === 'object' ? rec.video : null
                            };

                            if (percent >= 100) {
                                victorsList.push(recordEntry);
                            } else {
                                progressesList.push(recordEntry);
                            }
                        }
                    });
                }

                // Проверка верификаций
                const verifies = player.verified || player.verifies || [];
                if (Array.isArray(verifies)) {
                    verifies.forEach(v => {
                        const vName = typeof v === 'string' ? v : (v.levelName || v.level);
                        if (vName && vName.toLowerCase() === currentName) {
                            // Если игрока еще нет в списках викторов
                            if (!victorsList.some(v => v.name === playerName)) {
                                victorsList.push({
                                    name: playerName,
                                    country: playerCountry,
                                    percent: 100,
                                    isVerifier: true
                                });
                            }
                        }
                    });
                }
            });

            this.victors = victorsList;
            this.progresses = progressesList.sort((a, b) => b.percent - a.percent);
        },

        getFlagUrl(countryCode) {
            if (!countryCode) return null;
            if (countryCode.startsWith('http://') || countryCode.startsWith('https://')) return countryCode;
            return `https://flagcdn.com/w40/${countryCode.toLowerCase().slice(0, 2)}.png`;
        }
    },

    template: `
        <main v-if="loading" class="level-wrapper">
            <Spinner></Spinner>
        </main>

        <div v-else class="level-card-container" style="max-width: 650px; margin: 0 auto; background: #121824; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; color: #fff; font-family: sans-serif;">
            
            <!-- Заголовок уровня -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 28px; font-weight: 800; margin: 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <span v-if="levelData.rank" style="color: #3b82f6; font-size: 20px;">#{{ levelData.rank }}</span>
                    {{ levelData.name }}
                </h1>
            </div>

            <!-- YouTube Видео Плеер -->
            <div style="position: relative; width: 100%; padding-top: 56.25%; background: #000; border-radius: 12px; overflow: hidden; margin-bottom: 20px; border: 1px solid #1e293b;">
                <iframe 
                    v-if="embedVideoUrl"
                    :src="embedVideoUrl" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                <div v-else style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #64748b;">
                    Видео отсутствует
                </div>
            </div>

            <!-- Плашки с информацией -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                <!-- ВЕРИФИАТОР -->
                <div style="background: #1e293b; padding: 12px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Верификатор</div>
                    <div style="font-size: 15px; font-weight: 800; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ levelData.verifier || levelData.publisher || '—' }}
                    </div>
                </div>

                <!-- СОЗДАТЕЛЬ -->
                <div style="background: #1e293b; padding: 12px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Создатель</div>
                    <div style="font-size: 15px; font-weight: 800; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ levelData.author || levelData.creator || '—' }}
                    </div>
                </div>

                <!-- ПОИНТЫ -->
                <div style="background: #1e293b; padding: 12px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Поинты</div>
                    <div style="font-size: 15px; font-weight: 800; color: #f59e0b; margin-top: 4px;">
                        {{ levelPoints }} pt
                    </div>
                </div>
            </div>

            <!-- Список рекордов (Викторы и Прогрессы) -->
            <div style="background: #182030; border: 1px solid #1e293b; border-radius: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="font-weight: 800; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <span>🏆</span> Рекорды
                    </div>
                    <div style="font-size: 12px; color: #94a3b8;">
                        <b>{{ victors.length + progresses.length }}</b> записей ({{ victors.length }} 100%)
                    </div>
                </div>

                <div v-if="!victors.length && !progresses.length" style="text-align: center; color: #64748b; padding: 20px 0; font-size: 13px;">
                    Пока нет прохождений этого уровня
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Список 100% Викторов -->
                    <div 
                        v-for="(victor, idx) in victors" 
                        :key="'v-'+idx"
                        style="display: flex; align-items: center; justify-content: space-between; background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;"
                    >
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img v-if="getFlagUrl(victor.country)" :src="getFlagUrl(victor.country)" style="width: 20px; height: 14px; border-radius: 2px;" />
                            <span style="font-weight: 700; font-size: 14px;">{{ victor.name }}</span>
                        </div>
                        <span style="color: #22c55e; font-weight: 800; font-size: 13px;">100%</span>
                    </div>

                    <!-- Список Прогрессов (<100%) -->
                    <div 
                        v-for="(prog, idx) in progresses" 
                        :key="'p-'+idx"
                        style="display: flex; align-items: center; justify-content: space-between; background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;"
                    >
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img v-if="getFlagUrl(prog.country)" :src="getFlagUrl(prog.country)" style="width: 20px; height: 14px; border-radius: 2px;" />
                            <span style="font-weight: 600; font-size: 14px; color: #cbd5e1;">{{ prog.name }}</span>
                        </div>
                        <span style="color: #3b82f6; font-weight: 800; font-size: 13px;">{{ prog.percent }}%</span>
                    </div>
                </div>
            </div>

        </div>
    `
};
