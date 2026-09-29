document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('eventModal');
    const openBtn = document.getElementById('addEventBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('addEventForm');
    const eventsGrid = document.getElementById('eventsGrid');

    // Открытие/закрытие модального окна
    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const levelName = document.getElementById('levelName').value;
        const playerName = document.getElementById('playerName').value;
        const deviceType = document.getElementById('deviceType').value;
        const location = document.getElementById('location').value;
        const flagEmoji = document.getElementById('flagEmoji').value || '🏴';
        const rankNum = document.getElementById('rankNum').value || '1';
        const progressPercent = document.getElementById('progressPercent').value || '100%';
        const eventDate = document.getElementById('eventDate').value || 'Только что';
        const thumbUrl = document.getElementById('thumbUrl').value || 'https://via.placeholder.com/150x85';
        const videoUrl = document.getElementById('videoUrl').value || '#';

        // Создаем новую карточку
        const cardHtml = `
            <div class="event-card">
                <div class="card-top">
                    <div class="user-meta">
                        <span class="user-name">${playerName}</span>
                        <span class="device-tag">${deviceType === 'PC' ? '💻 PC' : '📱 Mobile'}</span>
                    </div>
                    <span class="event-date">${eventDate}</span>
                </div>

                <div class="card-main">
                    <div class="thumb-box">
                        <span class="rank-badge">#${rankNum}</span>
                        <img src="${thumbUrl}" alt="Preview">
                    </div>
                    <div class="card-details">
                        <h3 class="level-title">${levelName}</h3>
                        <div class="location-tag">📍 ${location} <span class="flag">${flagEmoji}</span></div>
                        <div class="percent-badge">${progressPercent}</div>
                    </div>
                </div>

                <div class="card-footer">
                    <a href="${videoUrl}" target="_blank" class="yt-link">▶ Смотреть видео</a>
                </div>
            </div>
        `;

        // Вставляем карточку в начало списка
        eventsGrid.insertAdjacentHTML('afterbegin', cardHtml);

        // Закрываем окно и сбрасываем форму
        modal.classList.remove('active');
        form.reset();
    });
});
