<?php

return [
    'paths' => ['api/*', 'login', 'register', 'sanctum/csrf-cookie', 'user'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173', // local Vite dev
        'https://kechow-frontend.onrender.com' // production
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // needed for Sanctum
];

