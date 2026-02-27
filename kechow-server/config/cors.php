<?php

return [
    'paths' => ['api/*', 'login', 'register', 'sanctum/csrf-cookie', 'user'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,https://kechow-frontend.onrender.com'))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // needed for Sanctum
];

