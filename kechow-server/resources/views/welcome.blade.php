<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Kechow API Backend</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
            position: relative;
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



@keyframes pulse-gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

        p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            animation: fadeInDown 1.3s ease forwards;
            opacity: 0;
        }
        .api-btn {
    background: #ff4b2b;
    color: white;
    border: none;
    padding: 1.5rem 2rem;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    opacity: 1; /* Make visible immediately */
    animation-fill-mode: none; /* Remove fill mode */
}

        .api-btn:hover {
            background: #ff416c;
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
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 0 30px #7c3aedcc;
  color: #60a5fa;
}

.feature > div {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.feature p {
  font-size: 1rem;
  color: #ddd;
  margin-top: 0;
  line-height: 1.4;
  font-weight: 400;
  max-width: 240px;
}

.feature svg {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  fill: #fff;

  transform-origin: 50% 50%;
  transition: fill 0.3s ease;
}

.feature:hover svg {
  fill: #fbbf24;
  animation: wiggle 2s ease-in-out infinite;
  animation-duration: 1s;
}


@keyframes wiggle {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .features {
    flex-direction: column;
    width: 100%;
  }
  .feature {
    width: 90%;
    margin: 0 auto 1.5rem;
  }
}

        /* Animations */
        @keyframes fadeInDown {
            from {opacity: 0; transform: translateY(-15px);}
            to {opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInUp {
            from {opacity: 0; transform: translateY(15px);}
            to {opacity: 1; transform: translateY(0);}
        }
        @keyframes bounce {
            0%, 100% {transform: translateY(0);}
            50% {transform: translateY(-6px);}
        }
        @media (max-width: 600px) {
            .features {
                flex-direction: column;
                width: 100%;
            }
            .feature {
                width: 90%;
                margin: 0 auto;
            }
        }
    </style>
</head>
<body>
    <h1>Kechow <br /> API Backend</h1>
    <p>Esto impulsará la plataforma de entrega de comida Kechow.</p>
    <a href="http://localhost:8000/api/documentation/" class="api-btn" target="_blank" rel="noopener noreferrer">Ver API</a>

    <section class="features" aria-label="Características principales">
  <article class="feature" tabindex="0">
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="10" y="20" width="44" height="6" rx="2" ry="2"/>
      <rect x="10" y="34" width="44" height="6" rx="2" ry="2"/>
      <rect x="10" y="48" width="44" height="6" rx="2" ry="2"/>
    </svg>
    <div>API RESTful</div>
    <p>Interfaz robusta para consumir y gestionar datos fácilmente.</p>
  </article>
  <article class="feature" tabindex="0">
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="20" r="14" stroke="#8b5cf6" stroke-width="3" fill="none"/>
      <path d="M22 48h20v6H22z" fill="#8b5cf6"/>
    </svg>
    <div>Seguridad</div>
    <p>Autenticación moderna y autorización segura para proteger tus datos.</p>
  </article>
  <article class="feature" tabindex="0">
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="12" y="24" width="40" height="20" rx="4" ry="4" fill="none" stroke="#8b5cf6" stroke-width="3"/>
      <circle cx="32" cy="38" r="5" fill="#8b5cf6"/>
    </svg>
    <div>Gestión fácil</div>
    <p>Panel intuitivo para administrar pedidos, usuarios y productos sin complicaciones.</p>
  </article>
  <article class="feature" tabindex="0">
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6a26 26 0 1 0 0 52 26 26 0 0 0 0-52zm0 46a20 20 0 1 1 0-40 20 20 0 0 1 0 40z" fill="#8b5cf6"/>
      <circle cx="32" cy="32" r="10" fill="#3b82f6"/>
      <circle cx="32" cy="32" r="5" fill="#a78bfa"/>
    </svg>
    <div>Monitoreo</div>
    <p>Visualiza estadísticas y rendimiento de la plataforma en tiempo real.</p>
  </article>
</section>


    <footer>© {{ date('Y') }} Tecnologías Kechow</footer>
</body>
</html>
