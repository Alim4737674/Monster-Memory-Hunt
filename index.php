<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Monster Memory Hunt</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="container">
    <header class="topbar">
      <h1>Monster Memory Hunt</h1>
      <button id="new-game-btn" type="button">Neues Spiel</button>
    </header>

    <section class="hud" aria-label="Spielstatus">
      <div class="hud-card">
        <span class="label">Leben</span>
        <strong id="life">100</strong>
      </div>
      <div class="hud-card">
        <span class="label">Punkte</span>
        <strong id="score">0</strong>
      </div>
      <div class="hud-card">
        <span class="label">Status</span>
        <strong id="status">Bereit</strong>
      </div>
    </section>

    <section class="board-wrapper">
      <div id="board" class="board" aria-label="Spielfeld"></div>
    </section>

    <section class="log-wrapper" aria-label="Event Log">
      <h2>Event-Log</h2>
      <ul id="log"></ul>
    </section>
  </main>

  <script src="game.js" defer></script>
</body>
</html>