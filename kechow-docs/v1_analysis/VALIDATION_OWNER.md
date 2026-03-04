# Owner FormRequest Validation Rules

**Classes:** `App\Modules\Owner\Requests\StoreOwnerRequest`, `App\Modules\Owner\Requests\UpdateOwnerRequest`  
**Purpose:** Validate create and update of owners (users with role `owner`). Admin-only.  
**i18n:** Rules and attributes are commented for future multilingual support via `lang/validation.php` or `lang/owner/validation.php`.

---

## 1. Field Overview

| Field   | Create (Store) | Update (Update) | Type   | Notes                          |
|---------|----------------|-----------------|--------|--------------------------------|
| name    | Required       | Optional        | string | Max 255                         |
| email   | Required       | Optional        | string | Valid email, unique             |
| password| Required       | Optional        | string | Strong rules + confirmed        |
| role    | Required       | Optional        | string | Fixed to `owner`                |
| phone   | Optional       | Optional        | string | Nullable, max 50                |
| address | Optional       | Optional        | string | Nullable, max 500               |
| latitude| Optional       | Optional        | number | Nullable, -90 to 90             |
| longitude| Optional      | Optional        | number | Nullable, -180 to 180           |

---

## 2. StoreOwnerRequest (Create)

**Used by:** `POST /api/owners`

### Rules

| Attribute | Rules | i18n key (suggested) |
|-----------|--------|------------------------|
| **name** | `required\|string\|max:255` | `validation.required`, `validation.max.string` |
| **email** | `required\|string\|email\|max:255\|unique:users,email` | `validation.required`, `validation.email`, `validation.unique` |
| **password** | `required`, `confirmed`, `Password::min(8)->letters()->numbers()->mixedCase()` | `validation.password`, `validation.confirmed`, `validation.password.min` |
| **role** | `required\|in:owner` | `validation.required`, `validation.in` |
| **phone** | `nullable\|string\|max:50` | `validation.max.string` |
| **address** | `nullable\|string\|max:500` | `validation.max.string` |
| **latitude** | `nullable\|numeric\|between:-90,90` | `validation.numeric`, `validation.between.numeric` |
| **longitude** | `nullable\|numeric\|between:-180,180` | `validation.between.numeric` |

### Strong password (Laravel `Password` rule)

- **Minimum length:** 8 characters  
- **Letters:** At least one letter  
- **Numbers:** At least one digit  
- **Mixed case:** At least one uppercase and one lowercase  

Customize in code with: `Password::min(8)->letters()->numbers()->mixedCase()->symbols()` if symbols are required.

### Uniqueness

- **email:** Must be unique in `users.email`. 422 with `errors.email` if taken.

### Nullable fields

- **phone**, **address**, **latitude**, **longitude** may be omitted or sent as `null`.

---

## 3. UpdateOwnerRequest (Update)

**Used by:** `PUT /api/owners/{id}`, `PATCH /api/owners/{id}`

### Rules

| Attribute | Rules | i18n key (suggested) |
|-----------|--------|------------------------|
| **name** | `sometimes\|string\|max:255` | `validation.max.string` |
| **email** | `sometimes`, `string`, `email`, `max:255`, `Rule::unique('users','email')->ignore($id)` | `validation.unique` |
| **password** | `nullable`, `confirmed`, `Password::min(8)->letters()->numbers()->mixedCase()` | `validation.password`, `validation.confirmed` |
| **role** | `sometimes\|in:owner` | `validation.in` |
| **phone** | `nullable\|string\|max:50` | `validation.max.string` |
| **address** | `nullable\|string\|max:500` | `validation.max.string` |
| **latitude** | `nullable\|numeric\|between:-90,90` | `validation.between.numeric` |
| **longitude** | `nullable\|numeric\|between:-180,180` | `validation.between.numeric` |

### Differences from Store

- All fields **optional** (`sometimes` or `nullable`).  
- **email:** Unique excluding current user (`Rule::unique(...)->ignore($id)`).  
- **password:** If present, must pass strong rules and `password_confirmation`; omit to leave unchanged.

### Nullable fields

- **phone**, **address**, **latitude**, **longitude** may be omitted or `null`.  
- **password** may be omitted (no change).

---

## 4. Role fixed to owner

- **Create:** `role` is required and must be `in:owner`. Backend also sets `role = 'owner'` on the user.  
- **Update:** If `role` is sent, it must be `in:owner`. No other roles are allowed via these endpoints.

---

## 5. i18n support (future)

### Suggested lang structure

- **Global:** `lang/{locale}/validation.php` (Laravel default keys).  
- **Owner-specific:** `lang/{locale}/owner/validation.php`, `lang/{locale}/owner/attributes.php`.

### In FormRequests

- **attributes():** Return translated labels, e.g. `['name' => __('owner::attributes.name')]`.  
- **messages():** Return custom messages, e.g. `['email.unique' => __('owner::validation.email_taken')]`.  
- Rules are already commented in code with `// i18n: validation.xxx` for each rule.

### Example keys (owner namespace)

| Key | Example (en) |
|-----|----------------|
| `owner::attributes.name` | Name |
| `owner::attributes.email` | Email |
| `owner::attributes.password` | Password |
| `owner::validation.email_taken` | This email is already registered. |
| `owner::validation.password_min` | Password must be at least 8 characters and include letters and numbers. |
| `owner::validation.role_must_owner` | Role must be owner. |

---

## 6. Error response shape (422)

When validation fails, the API returns:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must contain at least one uppercase and one lowercase letter."]
  }
}
```

Replace message strings with translated values when i18n is enabled.

---

**Document version:** 1.0
