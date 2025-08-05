<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Kechow API Backend</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #ff4b2b;
            --primary-hover: #ff416c;
            --secondary: #7c3aed;
            --dark-bg: #0f2027;
            --dark-bg2: #203a43;
            --dark-bg3: #2c5364;
            --text-light: #d1d5db;
            --card-bg: #1e293b;
            --accent-yellow: #fbbf24;
            --accent-blue: #60a5fa;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, var(--dark-bg), var(--dark-bg2), var(--dark-bg3));
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
            position: relative;
            overflow-x: hidden;
        }

        body::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,75,43,0.1) 0%, transparent 70%);
            animation: float 15s infinite linear;
            z-index: 0;
        }

        .container {
            position: relative;
            z-index: 2;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            margin-bottom: 1.5rem;
            line-height: 1.2;
            background: linear-gradient(90deg, var(--primary-hover), var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: fadeInUp 0.8s ease forwards;
            opacity: 0;
            text-shadow: 0 2px 10px rgba(255, 65, 108, 0.3);
        }

        .subtitle {
            font-size: clamp(1rem, 2vw, 1.5rem);
            margin-bottom: 3rem;
            max-width: 600px;
            line-height: 1.6;
            color: var(--text-light);
            animation: fadeInUp 1s ease forwards;
            opacity: 0;
            margin-left: auto;
            margin-right: auto;
        }

        .btn-group {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        }

        .api-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 1;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(255, 75, 43, 0.4);
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        .api-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, var(--primary), var(--primary-hover));
            z-index: -1;
            transition: opacity 0.3s ease;
            opacity: 1;
        }

        .api-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(255, 75, 43, 0.6);
        }

        .api-btn:hover::before {
            opacity: 0.9;
        }

        .api-btn.secondary {
            background: transparent;
            border: 2px solid var(--secondary);
            color: white;
            box-shadow: none;
        }

        .api-btn.secondary::before {
            background: linear-gradient(45deg, var(--secondary), #9f7aea);
        }

        .api-btn.secondary:hover {
            box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }

        /* Features Section */
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
            justify-content: center;
            max-width: 1100px;
            z-index: 1;
            position: relative;
        }

        .feature {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 2rem 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: fadeInUp 0.8s ease forwards;
            opacity: 0;
            color: var(--accent-yellow);
            font-weight: 600;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
        }

        .feature::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), transparent);
            z-index: -1;
        }

        .feature:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 12px 40px rgba(124, 58, 237, 0.3);
            color: var(--accent-blue);
            border-color: rgba(124, 58, 237, 0.3);
        }

        .feature h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: inherit;
        }

        .feature p {
            font-size: 1rem;
            color: var(--text-light);
            margin-top: 0;
            line-height: 1.6;
            font-weight: 400;
        }

        .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(124, 58, 237, 0.1);
            border-radius: 50%;
            font-size: 2.5rem;
            color: var(--secondary);
            transition: all 0.3s ease;
        }

        .feature:hover .feature-icon {
            background: rgba(96, 165, 250, 0.2);
            color: var(--accent-blue);
            transform: rotate(10deg) scale(1.1);
        }

        footer {
            margin-top: auto;
            padding: 2rem 0 1rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.6);
            user-select: none;
            animation: fadeInUp 1.2s ease forwards;
            opacity: 0;
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }

        .social-links a {
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.2rem;
            transition: color 0.3s ease;
        }

        .social-links a:hover {
            color: var(--primary);
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
            0% { transform: translate(0, 0); }
            25% { transform: translate(5%, 5%); }
            50% { transform: translate(10%, 0); }
            75% { transform: translate(5%, -5%); }
            100% { transform: translate(0, 0); }
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .features {
                grid-template-columns: 1fr;
                max-width: 400px;
            }

            .btn-group {
                flex-direction: column;
                align-items: center;
            }

            .api-btn {
                width: 100%;
                max-width: 250px;
            }
        }

        /* Animation delays */
        .feature:nth-child(1) { animation-delay: 0.2s; }
        .feature:nth-child(2) { animation-delay: 0.4s; }
        .feature:nth-child(3) { animation-delay: 0.6s; }
        .feature:nth-child(4) { animation-delay: 0.8s; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Kechow API Backend</h1>
        <p class="subtitle">El motor que impulsa la plataforma de entrega de comida Kechow con tecnología moderna y escalable.</p>

        <div class="btn-group">
            <a href="http://localhost:8000/api/documentation/" class="api-btn" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-code"></i> Ver Documentación API
            </a>
            <a href="#" class="api-btn secondary">
                <i class="fas fa-book"></i> Documentación Técnica
            </a>
        </div>

        <section class="features" aria-label="Características principales">
            <article class="feature" tabindex="0">
                <div class="feature-icon">
                    <i class="fas fa-server"></i>
                </div>
                <h3>API RESTful</h3>
                <p>Interfaz robusta para consumir y gestionar datos fácilmente con endpoints bien documentados.</p>
            </article>

            <article class="feature" tabindex="0">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Seguridad Avanzada</h3>
                <p>Autenticación JWT y autorización por roles para proteger tus datos y transacciones.</p>
            </article>

            <article class="feature" tabindex="0">
                <div class="feature-icon">
                    <i class="fas fa-tachometer-alt"></i>
                </div>
                <h3>Alto Rendimiento</h3>
                <p>Optimizado para manejar miles de solicitudes por segundo con tiempos de respuesta mínimos.</p>
            </article>

            <article class="feature" tabindex="0">
                <div class="feature-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <h3>Monitoreo en Tiempo Real</h3>
                <p>Dashboard completo para visualizar métricas y rendimiento de la plataforma.</p>
            </article>
        </section>
    </div>

    <footer>
        <p>© 2023 Tecnologías Kechow. Todos los derechos reservados.</p>
        <div class="social-links">
            <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
            <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
            <a href="#" aria-label="Documentación"><i class="fas fa-book"></i></a>
        </div>
    </footer>
</body>
</html>
