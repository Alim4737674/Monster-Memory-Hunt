(() => {
  const boardEl = document.getElementById('board');
  const logEl = document.getElementById('log');
  const lifeEl = document.getElementById('life');
  const scoreEl = document.getElementById('score');
  const statusEl = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');

  const state = {
    life: 100,
    score: 0,
    grid: [],
    openedCount: 0,
    gameOver: false,
  };

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function addLog(text) {
    const item = document.createElement('li');
    item.textContent = text;
    logEl.prepend(item);
  }

  function updateHud() {
    lifeEl.textContent = String(state.life);
    scoreEl.textContent = String(state.score);

    if (state.gameOver) {
      statusEl.textContent = state.life <= 0 ? 'Verloren' : 'Gewonnen';
    } else {
      statusEl.textContent = 'Läuft';
    }
  }

  function endGame(win) {
    state.gameOver = true;
    const buttons = boardEl.querySelectorAll('button.tile');
    buttons.forEach((btn) => {
      btn.disabled = true;
    });

    addLog(win ? '🎉 Du hast alle Felder aufgedeckt!' : 'Keine Leben mehr. Spiel vorbei!');
    updateHud();
  }

  function applyEvent(field) {
    switch (field.type) {
      case 'monster': {
        state.life = Math.max(0, state.life - field.value);
        const monsterPoints = randomInt(15, 35);
        state.score += monsterPoints;
        addLog(
          `👾 Monster getroffen: -${field.value} Leben, +${monsterPoints} Punkte.`
        );
        break;
      }
      case 'treasure':
        state.score += field.value;
        addLog(`Schatz gefunden: +${field.value} Punkte.`);
        break;
      case 'potion':
        state.life = Math.min(100, state.life + field.value);
        addLog(`Trank genutzt: +${field.value} Leben.`);
        break;
      case 'trap':
        state.life = Math.max(0, state.life - field.value);
        addLog(`Falle aktiviert: -${field.value} Leben.`);
        break;
      default:
        addLog('Unbekanntes Event.');
    }

    if (state.life <= 0) {
      endGame(false);
      return;
    }

    if (state.openedCount >= state.grid.length) {
      endGame(true);
      return;
    }

    updateHud();
  }

  function openTile(button, field) {
    if (state.gameOver || button.classList.contains('open')) {
      return;
    }

    button.classList.add('open', `type-${field.type}`);
    button.disabled = true;
    state.openedCount += 1;

    applyEvent(field);
  }

  function fieldFrontContent(field) {
    const typeLabel = field.type.toUpperCase();
    const valuePrefix = field.type === 'trap' || field.type === 'monster' ? '-' : '+';

    let monsterImage = '';
    if (field.type === 'monster') {
      const image = field.image || 'https://via.placeholder.com/100?text=Monster';
      monsterImage = `<img src="${image}" alt="Monster" loading="lazy">`;
    }

    return `
      ${monsterImage}
      <strong>${typeLabel}</strong>
      <span class="value">${valuePrefix}${field.value}</span>
    `;
  }

  function renderBoard() {
    boardEl.innerHTML = '';

    state.grid.forEach((field) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tile';
      button.setAttribute('aria-label', `Feld ${field.id}`);
      button.innerHTML = `
        <div class="tile-inner">
          <div class="back">?</div>
          <div class="front">${fieldFrontContent(field)}</div>
        </div>
      `;

      button.addEventListener('click', () => openTile(button, field));
      boardEl.appendChild(button);
    });
  }

  async function startNewGame() {
    try {
      statusEl.textContent = 'Lade...';
      const response = await fetch('level.php', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.grid) || data.grid.length !== 16) {
        throw new Error('Ungültige Level-Daten');
      }

      state.life = 100;
      state.score = 0;
      state.openedCount = 0;
      state.gameOver = false;
      state.grid = data.grid;

      logEl.innerHTML = '';
      addLog('🕹️ Neues Spiel gestartet!');
      renderBoard();
      updateHud();
    } catch (error) {
      state.gameOver = true;
      statusEl.textContent = 'Fehler';
      addLog(`Konnte Level nicht laden: ${error.message}`);
    }
  }

  newGameBtn.addEventListener('click', startNewGame);
  updateHud();
})();