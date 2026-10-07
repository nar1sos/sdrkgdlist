// js/pages/Achievements.js

export function renderAchievements() {
    return `
        <div class="leaderboard-container">
            <!-- Левая колонка: Профиль пользователя -->
            <aside class="profile-card">
                <div class="profile-header">
                    <div class="avatar-ring">
                        <img id="user-avatar" class="profile-avatar" src="https://via.placeholder.com/100" alt="Avatar">
                    </div>
                    <div class="profile-title">
                        <img id="user-flag" class="flag-img" src="https://flagcdn.com/w40/ru.png" alt="Flag">
                        <h1 id="user-name">Player</h1>
                    </div>
                </div>

                <div class="single-stat-container">
                    <div class="card-stat">
                        <span class="stat-icon">🏆</span>
                        <div class="stat-info">
                            <span class="val" id="total-records-count">3</span>
                            <span class="lbl">TOTAL SUBMISSIONS</span>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Правая колонка: Список прогрессов -->
            <section class="achievements-content" style="flex: 2; display: flex; flex-direction: column; gap: 14px;">
                <div class="achievements-header-bar" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; font-size: 1.4rem; font-weight: 900; color: #fff;">Achievements & Progress List</h2>
                    
                    <div class="search-input-wrapper" style="max-width: 280px;">
                        <input type="text" id="search-progress" class="gdl-input" placeholder="Поиск по нику или уровню..." style="padding: 8px 12px 8px 36px; font-size: 13px;">
                        <span class="search-icon" style="left: 10px;">🔍</span>
                    </div>
                </div>

                <div class="achievements-list-container" id="progress-list" style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                    <!-- Карточка 1 -->
                    <div class="progress-card" style="background: #121824; border: 1px solid #1b2436; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                        <div class="level-info-group" style="display: flex; align-items: center; gap: 14px;">
                            <img src="https://via.placeholder.com/80x48" class="level-thumb-mini" alt="Thumb" style="width: 80px; height: 48px; border-radius: 6px; object-fit: cover;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 800; font-size: 1.05rem; color: #fff;">Tidal Wave</span>
                                    <span class="status-pill status-approved" style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Одобрено</span>
                                </div>
                                <span style="font-size: 0.82rem; color: #8b9bb4; font-weight: 700;">
                                    Игрок: <strong style="color: #fff;">Player</strong> • Очки: <strong style="color: #38bdf8;">+120.5 AP</strong>
                                </span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <span class="progress-tag" style="font-size: 1.1rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; background: rgba(192, 132, 252, 0.15); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3);">36%</span>
                            <a href="https://youtube.com" target="_blank" class="record-video-btn">▶</a>
                        </div>
                    </div>

                    <!-- Карточка 2 -->
                    <div class="progress-card" style="background: #121824; border: 1px solid #1b2436; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                        <div class="level-info-group" style="display: flex; align-items: center; gap: 14px;">
                            <img src="https://via.placeholder.com/80x48" class="level-thumb-mini" alt="Thumb" style="width: 80px; height: 48px; border-radius: 6px; object-fit: cover;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 800; font-size: 1.05rem; color: #fff;">Kuzureta</span>
                                    <span class="status-pill status-approved" style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Одобрено</span>
                                </div>
                                <span style="font-size: 0.82rem; color: #8b9bb4; font-weight: 700;">
                                    Игрок: <strong style="color: #fff;">Player</strong> • Очки: <strong style="color: #38bdf8;">+85.0 AP</strong>
                                </span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <span class="progress-tag" style="font-size: 1.1rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; background: rgba(192, 132, 252, 0.15); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.3);">49%</span>
                            <a href="https://youtube.com" target="_blank" class="record-video-btn">▶</a>
                        </div>
                    </div>

                    <!-- Карточка 3 -->
                    <div class="progress-card" style="background: #121824; border: 1px solid #1b2436; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
                        <div class="level-info-group" style="display: flex; align-items: center; gap: 14px;">
                            <img src="https://via.placeholder.com/80x48" class="level-thumb-mini" alt="Thumb" style="width: 80px; height: 48px; border-radius: 6px; object-fit: cover;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 800; font-size: 1.05rem; color: #fff;">Astrahell</span>
                                    <span class="status-pill status-approved" style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Одобрено</span>
                                </div>
                                <span style="font-size: 0.82rem; color: #8b9bb4; font-weight: 700;">
                                    Игрок: <strong style="color: #fff;">Егор</strong> • Очки: <strong style="color: #38bdf8;">+310.0 AP</strong>
                                </span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <span class="progress-tag" style="font-size: 1.1rem; font-weight: 900; padding: 4px 10px; border-radius: 6px; background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3);">100%</span>
                            <a href="https://youtube.com" target="_blank" class="record-video-btn">▶</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

export function initAchievements() {
    // Слушатель для фильтрации поиска
    const searchInput = document.getElementById('search-progress');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.progress-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? 'flex' : 'none';
            });
        });
    }
}
