<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Kechow API Backend</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
      overflow-x: hidden;
      position: relative;
    }

    /* Floating background shape */
    .floating-shape {
      position: fixed;
      top: 20%;
      right: -150px;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle at center, #ff4b2b88, transparent 70%);
      border-radius: 50%;
      filter: blur(100px);
      animation: float 6s ease-in-out infinite alternate;
      z-index: 0;
      pointer-events: none;
    }

    @keyframes float {
      0% { transform: translateY(0) translateX(0); }
      100% { transform: translateY(30px) translateX(-20px); }
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
      background: linear-gradient(90deg, #ff416c, #ff4b2b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: fadeInUp 1s ease forwards;
      opacity: 0;
    }

    p.description {
      font-size: 1.25rem;
      margin-bottom: 2.5rem;
      max-width: 480px;
      line-height: 1.5;
      color: #d1d5db;
      animation: fadeInUp 1.3s ease forwards;
      opacity: 0;
    }

    .api-btn {
      display: inline-block;
      background: #ff4b2b;
      color: #fff;
      font-weight: 600;
      padding: 0.75rem 2.5rem;
      font-size: 1.1rem;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 6px 15px rgba(255, 75, 43, 0.4);
      transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
      animation: bounce 2.5s infinite;
      opacity: 0;
      animation-delay: 1.6s;
      animation-fill-mode: forwards;
      user-select: none;
    }

    .api-btn:hover,
    .api-btn:focus {
      background: #ff416c;
      box-shadow: 0 8px 20px rgba(255, 65, 108, 0.6);
      transform: translateY(-3px);
      outline: none;
    }

    footer {
      margin-top: auto;
      padding: 1rem 0;
      font-size: 0.9rem;
      color: #999;
      user-select: none;
      animation: fadeInUp 1.8s ease forwards;
      opacity: 0;
    }

    /* Features Section */
    .features {
      display: flex;
      gap: 2.5rem;
      margin-top: 3rem;
      justify-content: center;
      flex-wrap: wrap;
      max-width: 900px;
      z-index: 1;
      position: relative;
    }

    .feature {
      background: #1e293b;
      border-radius: 16px;
      padding: 1.5rem 2rem;
      width: 260px;
      box-shadow: 0 6px 20px rgb(0 0 0 / 0.3);
      text-align: center;
      animation: fadeInUp 2s ease forwards;
      opacity: 0;
      color: #fbbf24;
      font-weight: 600;
      transition: transform 0.3s ease;
    }

    .feature:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 28px rgb(251 191 36 / 0.7);
      cursor: default;
    }

    .feature svg {
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      fill: #fbbf24;
      filter: drop-shadow(0 0 2px #fbbf24);
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-6px);
      }
    }

    @media (max-width: 900px) {
      .features {
        gap: 1.5rem;
      }
      .feature {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 2.5rem;
      }
      p.description {
        font-size: 1rem;
      }
      .api-btn {
        font-size: 1rem;
        padding: 0.65rem 2rem;
      }
    }
  </style>
</head>
<body>
  <div class="floating-shape" aria-hidden="true"></div>

  <h1>Kechow<br />API Backend</h1>
  <p class="description">Esto impulsará la plataforma de entrega de comida Kechow.</p>

  <a href="http://localhost:8000/api/documentation/" class="api-btn" target="_blank" rel="noopener noreferrer" aria-label="Ver documentación de la API">
    Ver API
  </a>

  <section class="features" aria-label="Características principales del backend Kechow">
    <article class="feature" tabindex="0">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M12 20h40v4H12zm0 12h40v4H12zm0 12h40v4H12z"/>
      </svg>
      <h3>API RESTful</h3>
      <p>Interfaz robusta para consumir y gestionar datos.</p>
    </article>

    <article class="feature" tabindex="0">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M32 2a14 14 0 1 0 0 28 14 14 0 0 0 0-28zm0 24a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"/>
        <path d="M14 50h36v6H14z"/>
      </svg>
      <h3>Seguridad</h3>
      <p>Autenticación y autorización modernas y seguras.</p>
    </article>

    <article class="feature" tabindex="0">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M52 24H12a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V28a4 4 0 0 0-4-4zm-3 14H15v-8h34z"/>
        <circle cx="32" cy="38" r="4"/>
      </svg>
      <h3>Gestión fácil</h3>
      <p>Panel intuitivo para administrar pedidos y usuarios.</p>
    </article>
  </section>

  <footer>© {{ date('Y') }} Tecnologías Kechow</footer>
</body>
</html>
