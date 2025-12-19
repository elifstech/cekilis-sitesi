document.addEventListener('DOMContentLoaded', function() {
    // Değişkenler
    let adminParticipants = [];
    let participants = [];
    let isWheelSpinning = false;
    let spinTimeout = null;
    let timerInterval = null;
    let seconds = 0;
    let winner = null;
    
    // HTML Elementleri
    const toggleAdminBtn = document.getElementById('toggleAdminBtn');
    const adminSection = document.getElementById('adminSection');
    const adminInput = document.getElementById('adminInput');
    const adminAddBtn = document.getElementById('adminAddBtn');
    const adminRandomBtn = document.getElementById('adminRandomBtn');
    const adminClearBtn = document.getElementById('adminClearBtn');
    const adminList = document.getElementById('adminList');
    const adminCount = document.getElementById('adminCount');
    
    const mainScreen = document.getElementById('mainScreen');
    const wheelScreen = document.getElementById('wheelScreen');
    
    const participantInput = document.getElementById('participantInput');
    const addBtn = document.getElementById('addBtn');
    const add10Btn = document.getElementById('add10Btn');
    const add50Btn = document.getElementById('add50Btn');
    const fillAllBtn = document.getElementById('fillAllBtn');
    const clearBtn = document.getElementById('clearBtn');
    const drawBtn = document.getElementById('drawBtn');
    
    const participantsGrid = document.getElementById('participantsGrid');
    const participantCount = document.getElementById('participantCount');
    const progressBar = document.getElementById('progressBar');
    
    const backBtn = document.getElementById('backBtn');
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const timerDisplay = document.getElementById('timer');
    const winnerDisplay = document.getElementById('winnerDisplay');
    const showWinnerBtn = document.getElementById('showWinnerBtn');
    
    const winnerModal = document.getElementById('winnerModal');
    const winnerName = document.getElementById('winnerName');
    const drawDate = document.getElementById('drawDate');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    // İsim Listeleri
    const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Ali", "Zeynep", "Mustafa", "Emre", "Elif", "Can", "Buse", "Kerem", "Selin", "Merve", "Okan", "Deniz", "Kaan", "Sude", "Cem", "Gizem"];
    const lastNames = ["Yılmaz", "Kaya", "Çelik", "Şahin", "Yıldız", "Öztürk", "Demir", "Arslan", "Doğan", "Koç", "Polat", "Korkmaz", "Avcı", "Erdoğan", "Akar", "Bulut", "Güneş", "Aslan", "Baş", "Çetin"];
    
    // ADMIN PANELİ İŞLEMLERİ
    toggleAdminBtn.addEventListener('click', () => {
        adminSection.classList.toggle('show');
    });
    
    adminAddBtn.addEventListener('click', addAdminParticipant);
    adminInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addAdminParticipant();
    });
    
    function addAdminParticipant() {
        const name = adminInput.value.trim();
        
        if (!name) {
            alert('Lütfen bir isim girin!');
            return;
        }
        
        if (adminParticipants.length >= 10) {
            alert('Maksimum 10 özel katılımcı ekleyebilirsiniz!');
            return;
        }
        
        if (adminParticipants.includes(name)) {
            alert('Bu isim zaten listede!');
            return;
        }
        
        adminParticipants.push(name);
        updateAdminList();
        adminInput.value = '';
        updateAdminCount();
    }
    
    adminRandomBtn.addEventListener('click', () => {
        if (adminParticipants.length >= 10) {
            alert('Maksimum 10 kişi ekleyebilirsiniz!');
            return;
        }
        
        const needed = 10 - adminParticipants.length;
        for (let i = 0; i < needed; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            
            if (!adminParticipants.includes(name)) {
                adminParticipants.push(name);
            } else {
                i--;
            }
        }
        
        updateAdminList();
        updateAdminCount();
    });
    
    adminClearBtn.addEventListener('click', () => {
        if (confirm('Özel listeyi temizlemek istediğinize emin misiniz?')) {
            adminParticipants = [];
            updateAdminList();
            updateAdminCount();
        }
    });
    
    function updateAdminList() {
        adminList.innerHTML = '';
        
        adminParticipants.forEach((name, index) => {
            const item = document.createElement('div');
            item.className = 'admin-list-item';
            item.innerHTML = `
                <span>${index + 1}. ${name}</span>
                <button class="remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            item.querySelector('.remove').addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remove').dataset.index);
                adminParticipants.splice(index, 1);
                updateAdminList();
                updateAdminCount();
            });
            
            adminList.appendChild(item);
        });
    }
    
    function updateAdminCount() {
        adminCount.textContent = `${adminParticipants.length}/10`;
        checkDrawButton();
    }
    
    // ANA EKRAN İŞLEMLERİ
    addBtn.addEventListener('click', addParticipant);
    participantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });
    
    function addParticipant() {
        const name = participantInput.value.trim();
        
        if (!name) {
            alert('Lütfen bir isim girin!');
            return;
        }
        
        if (participants.length >= 200) {
            alert('Maksimum 200 katılımcı ekleyebilirsiniz!');
            return;
        }
        
        if (participants.includes(name)) {
            alert('Bu isim zaten listede!');
            return;
        }
        
        participants.push(name);
        addParticipantCard(name);
        participantInput.value = '';
        updateStats();
        checkDrawButton();
    }
    
    function addParticipantCard(name) {
        const emptyState = participantsGrid.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
        
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.innerHTML = `
            <span class="name">${name}</span>
            <button class="remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        card.querySelector('.remove').addEventListener('click', () => {
            participants = participants.filter(p => p !== name);
            card.remove();
            
            if (participants.length === 0) {
                participantsGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-user-plus"></i>
                        <p>Henüz katılımcı yok. Yukarıdan ekleyin.</p>
                    </div>
                `;
            }
            
            updateStats();
            checkDrawButton();
        });
        
        participantsGrid.appendChild(card);
    }
    
    // Toplu Ekleme Butonları
    add10Btn.addEventListener('click', () => addRandomParticipants(10));
    add50Btn.addEventListener('click', () => addRandomParticipants(50));
    fillAllBtn.addEventListener('click', () => {
        const remaining = 200 - participants.length;
        if (remaining > 0) {
            addRandomParticipants(remaining);
        }
    });
    
    function addRandomParticipants(count) {
        const remaining = 200 - participants.length;
        const toAdd = Math.min(count, remaining);
        
        for (let i = 0; i < toAdd; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            
            if (!participants.includes(name)) {
                participants.push(name);
                addParticipantCard(name);
            } else {
                i--;
            }
        }
        
        updateStats();
        checkDrawButton();
    }
    
    clearBtn.addEventListener('click', () => {
        if (confirm('Tüm katılımcıları silmek istediğinize emin misiniz?')) {
            participants = [];
            participantsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-plus"></i>
                    <p>Henüz katılımcı yok. Yukarıdan ekleyin.</p>
                </div>
            `;
            updateStats();
            checkDrawButton();
        }
    });
    
    function updateStats() {
        const count = participants.length;
        const percentage = (count / 200) * 100;
        
        participantCount.textContent = `${count}/200`;
        progressBar.style.width = `${percentage}%`;
        
        // İlerleme çubuğu rengi
        if (percentage >= 100) {
            progressBar.style.background = 'linear-gradient(90deg, #48bb78, #38a169)';
        } else if (percentage >= 75) {
            progressBar.style.background = 'linear-gradient(90deg, #ecc94b, #d69e2e)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #4299e1, #3182ce)';
        }
    }
    
    function checkDrawButton() {
        const hasAdminParticipants = adminParticipants.length > 0;
        const hasAllParticipants = participants.length === 200;
        
        drawBtn.disabled = !(hasAdminParticipants && hasAllParticipants);
    }
    
    // ÇEKİLİŞİ BAŞLAT
    drawBtn.addEventListener('click', () => {
        if (adminParticipants.length === 0) {
            alert('Lütfen özel katılımcı ekleyin!');
            return;
        }
        
        if (participants.length !== 200) {
            alert('Tam 200 katılımcı eklemelisiniz!');
            return;
        }
        
        // Ekranı değiştir
        mainScreen.style.display = 'none';
        wheelScreen.classList.add('show');
        
        // Çarkı hazırla
        prepareWheel();
        resetTimer();
    });
    
    // GERİ BUTONU
    backBtn.addEventListener('click', () => {
        if (isWheelSpinning) {
            if (!confirm('Çekiliş devam ediyor. Ana ekrana dönmek istediğinize emin misiniz?')) {
                return;
            }
            stopWheel();
        }
        
        wheelScreen.classList.remove('show');
        mainScreen.style.display = 'block';
        adminSection.classList.remove('show');
    });
    
    // ÇARK İŞLEMLERİ
    function prepareWheel() {
        // Çark segmentlerini oluştur
        const segmentCount = Math.max(adminParticipants.length, 8);
        const colors = ['#4299e1', '#38b2ac', '#48bb78', '#ecc94b', '#ed8936', '#ed64a6', '#9f7aea', '#667eea'];
        
        wheel.innerHTML = '';
        
        for (let i = 0; i < segmentCount; i++) {
            const segment = document.createElement('div');
            segment.className = 'wheel-segment';
            segment.style.cssText = `
                position: absolute;
                width: 50%;
                height: 50%;
                left: 25%;
                top: 0;
                transform-origin: bottom center;
                transform: rotate(${i * (360 / segmentCount)}deg);
                background: ${colors[i % colors.length]};
                clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
                opacity: 0.8;
            `;
            wheel.appendChild(segment);
        }
        
        // Merkez
        const center = document.createElement('div');
        center.className = 'wheel-center';
        center.innerHTML = '<i class="fas fa-star"></i>';
        wheel.appendChild(center);
    }
    
    // ÇARKI DÖNDÜR
    spinBtn.addEventListener('click', spinWheel);
    
    function spinWheel() {
        if (isWheelSpinning) return;
        
        isWheelSpinning = true;
        spinBtn.disabled = true;
        winnerDisplay.textContent = 'Çark dönüyor...';
        winnerDisplay.classList.remove('winner');
        showWinnerBtn.style.display = 'none';
        
        // Timer'ı başlat
        startTimer();
        
        // Rastgele dönüş açısı (5-8 tur + biraz daha)
        const spins = 5 + Math.random() * 3;
        const extraDegrees = Math.random() * 360;
        const totalDegrees = (spins * 360) + extraDegrees;
        
        // Çarkı döndür
        wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
        wheel.style.transform = `rotate(${totalDegrees}deg)`;
        
        // Otomatik durma (4-6 saniye sonra)
        const stopTime = 4000 + Math.random() * 2000;
        
        spinTimeout = setTimeout(() => {
            stopWheel();
        }, stopTime);
    }
    
    function stopWheel() {
        if (!isWheelSpinning) return;
        
        clearTimeout(spinTimeout);
        isWheelSpinning = false;
        spinBtn.disabled = false;
        
        // Kazananı seç (adminParticipants arasından)
        const winnerIndex = Math.floor(Math.random() * adminParticipants.length);
        winner = adminParticipants[winnerIndex];
        
        // Sonucu göster
        setTimeout(() => {
            winnerDisplay.textContent = winner;
            winnerDisplay.classList.add('winner');
            showWinnerBtn.style.display = 'inline-flex';
            
            // Timer'ı durdur
            clearInterval(timerInterval);
            
            // Kazananı göster butonuna tıklama
            showWinnerBtn.onclick = showWinnerModal;
        }, 500);
    }
    
    // TIMER İŞLEMLERİ
    function startTimer() {
        seconds = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `${seconds}s`;
        }, 1000);
    }
    
    function resetTimer() {
        seconds = 0;
        timerDisplay.textContent = '0s';
        clearInterval(timerInterval);
    }
    
    // KAZANAN MODALI
    function showWinnerModal() {
        winnerName.textContent = winner;
        
        // Tarihi ayarla
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        drawDate.textContent = now.toLocaleDateString('tr-TR', options);
        
        // Modalı göster
        winnerModal.style.display = 'flex';
    }
    
    closeModalBtn.addEventListener('click', () => {
        winnerModal.style.display = 'none';
    });
    
    restartBtn.addEventListener('click', () => {
        winnerModal.style.display = 'none';
        
        // Ana ekrana dön
        wheelScreen.classList.remove('show');
        mainScreen.style.display = 'block';
        adminSection.classList.remove('show');
        
        // Çarkı sıfırla
        wheel.style.transform = 'rotate(0deg)';
        winnerDisplay.textContent = 'Çarkı döndürün...';
        winnerDisplay.classList.remove('winner');
        showWinnerBtn.style.display = 'none';
        resetTimer();
    });
    
    // BAŞLANGIÇ AYARLARI
    function init() {
        // Rastgele 5 admin katılımcısı ekle
        for (let i = 0; i < 5; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            
            if (!adminParticipants.includes(name)) {
                adminParticipants.push(name);
            }
        }
        
        updateAdminList();
        updateAdminCount();
        checkDrawButton();
    }
    
    init();
});