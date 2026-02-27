<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function success($data = null, string $message = '', array $meta = []): JsonResponse
    {
        $body = array_filter([
            'success' => true,
            'message' => $message ?: null,
            'data' => $data,
            'meta' => $meta ?: null,
        ], fn ($v) => $v !== null && $v !== []);

        return response()->json($body);
    }

    protected function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $body = [
            'success' => false,
            'message' => $message,
        ];
        if ($errors !== null) {
            $body['errors'] = $errors;
        }

        return response()->json($body, $code);
    }
}
