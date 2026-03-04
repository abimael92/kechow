# Monitoring & observability (optional)

## Log channels (already configured)

- **default:** `config/logging.php` — use `LOG_CHANNEL=stack` and `LOG_STACK=daily,error,delivery` in production.
- **delivery:** `storage/logs/delivery.log` (daily rotation) — do not log PII.
- **error:** `storage/logs/error.log` (daily rotation) — add the `error` channel in `config/logging.php` (already added).

## Laravel Telescope (dev only)

Telescope is in `composer.json` as a dev dependency. To install and run:

```bash
cd kechow-server
composer install
php artisan telescope:install
php artisan migrate
```

Then in `app/Providers/TelescopeServiceProvider.php` (created by install), ensure the `gate` method only allows access in local:

```php
protected function gate(): void
{
    if (app()->environment('local')) {
        return;
    }
    abort(403);
}
```

In production set `TELESCOPE_ENABLED=false` or do not install Telescope.

## Sentry (optional error tracking)

When you have a Sentry project:

1. `composer require sentry/sentry-laravel`
2. `php artisan sentry:publish --dsn=`
3. Add to `.env`: `SENTRY_LARAVEL_DSN=https://...@sentry.io/...`
4. Do not log PII in breadcrumbs (configure in `config/sentry.php`).

## Owner / external APIs

Sections that depend on Owner API or other external services are commented in the codebase or documented in the main reference. Enable them once API access is available.
