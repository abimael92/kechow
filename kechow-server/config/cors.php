<?php

return [
    'paths' => ['api/*', 'login', 'register', 'sanctum/csrf-cookie', 'user'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // For development only
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
