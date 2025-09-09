<?php

return [
    'paths' => [
        'api/*',
        'login',
        'register',
        'logout',
        'sanctum/csrf-cookie',
        'user',
        'health'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://kechow-frontend.onrender.com',
        'http://localhost:3000',
        'http://localhost:5173' // Vite dev server
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // REQUIRED for Sanctum
];
