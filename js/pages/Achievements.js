// js/pages/Achievements.js

export const Achievements = {
    name: 'Achievements',
    data() {
        return {
            searchQuery: '',
            // Поля формы для подачи нового прогресса
            newProgress: {
                level: '',
                percent: null
            },
            // Чистый массив без фейковых рекордов
            records: []
        };
    },
    computed: {
        filteredRecords() {
            if (!this.searchQuery) return this.records;
            const q = this.searchQuery.toLowerCase();
            return this.records.filter(r => r.level.toLowerCase().includes(q));
        }
    },
    methods: {
        submitProgress() {
            if (!this.newProgress.level || !this.newProgress.percent) return;

            this.records.unshift({
                id: Date.now(),
                level: this.newProgress.level,
                thumb: "https://via.placeholder.com/80x48",
                percent: parseInt(this.newProgress.percent),
                status: "pending"
            });

            // Очистка формы
            this.newProgress.level = '';
            this.newProgress.percent = null;
        }
    },
    template: `
        <div class="achievements-layout" style="display: flex; gap: 24px; align-items: flex-start;">
            
            <!-- Левая часть: Статистика и Форма подачи -->
            <aside style="width: 320px; display: flex; flex-direction: column; gap: 16px;">
                <div style="background: #141822; border: 1px solid #222938; border-radius: 12px; padding: 20px;">
                    <div style="background: #1a202e; border: 1px solid #283044; border-radius: 8px; padding: 12px; text-align: center;">
                        <span style="font-size: 0.75rem; color: #8a94a6; font-weight: 800; display: block; margin-bottom: 4px;">ВСЕГО ПРОГРЕССОВ</span>
                        <span style="font-size: 1.6rem; font-weight: 900; color: #3b82f6;">{{ records.length }}</span>
                    </div>
                </div>

                <!-- Форма добавления -->
                <div style="background: #141822; border: 1px solid #222938; border-radius: 12px; padding: 20px;">
                    <h3 style="font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 14px;">ПОДАТЬ ПРОГРЕСС</h3>
                    <form @submit.prevent="submitProgress" style="display: flex; flex-direction: column; gap: 12px;">
                        <div>
                            <label style="font-size: 0.75rem; color: #8a94a6; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 6px;">Уровень</label>
                            <input type="text" v-model="newProgress.level" placeholder="Название уровня" required>
                        </div>
                        <div>
                            <label style="font-size: 0.75rem; color: #8a94a6; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 6px;">Прогресс (%)</label>
                            <input type="number" v-model="newProgress.percent" min="1" max="100" placeholder="100" required>
                        </div>
                        <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 800; cursor: pointer; margin-top: 4px;">
                            Отправить
                        </button>
                    </form>
                </div>
            </aside>

            <!-- Правая часть: Список сдач -->
            <section class="achievements-content" style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
                <div class="achievements-header-bar" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="font-size: 1.4rem; font-weight: 900; color: #fff; margin: 0;">Achievements</h2>
                    
                    <div class="achievements-search" style="position: relative; width: 280px;">
                        <input type="text" v-model="searchQuery" placeholder="Поиск по уровню..." style="padding-left: 36px;">
                        <span class="search-icon" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); opacity: 0.6;">🔍</span>
                    </div>
                </div>

                <div class="achievements-list" style="display: flex; flex-direction: column; gap: 12px;">
                    <div v-for="item in filteredRecords" :key="item.id" class="progress-card">
                        <div class="level-info-group">
                            <img :src="item.thumb" class="level-thumb-mini" alt="Thumb">
                            <div class="level-details">
                                <div class="level-title-row">
                                    <span class="level-name">{{ item.level }}</span>
                                    <span :class="item.status === 'approved' ? 'status-approved' : 'status-pending'" class="status-pill">
                                        {{ item.status === 'approved' ? 'Одобрено' : 'На проверке' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="progress-right-group">
                            <span class="progress-tag" :class="item.percent === 100 ? 'progress-100' : 'progress-percent'">
                                {{ item.percent }}%
                            </span>
                        </div>
                    </div>

                    <div v-if="filteredRecords.length === 0" style="text-align: center; color: #8a94a6; padding: 20px; font-weight: 700;">
                        Записи отсутствуют
                    </div>
                </div>
            </section>
        </div>
    `
};
