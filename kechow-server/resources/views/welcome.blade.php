<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Kechow API Backend</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
        }

        .api-btn {
            background: #ff4b2b;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s ease;
        }

        .api-btn:hover {
            background: #ff416c;
        }

        footer {
    position: fixed; /* fix to viewport bottom */
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.9rem;
    opacity: 0.6;
        }
    </style>
</head>
<body>
    <h1>Kechow Backend API</h1>
    <p>This will power the Kechow food delivery platform.</p>
    <a href="http://localhost:8000/api/documentation/" class="api-btn">
    View API
</a>

    <footer>© 2025 Kechow Technologies</footer>
</body>
</html>
