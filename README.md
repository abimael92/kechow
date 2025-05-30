# Kechow

Kechow conecta a la raza con los mejores taquitos, antojitos y comida local, rápido y sin complicaciones.  
Inspirado en la energía de los cachorros, la cultura mexicana y el amor por la buena comida.

---

## ¿Por qué Kechow?

- Entregas rápidas como un perro lujurioso en tu pierna 🐕‍🔥  
- Apoya negocios locales y comida con sabor auténtico 🌯  
- App ligera, fácil para todos en Jiménez  
- Backend en Laravel para un rendimiento sólido y seguro  
- Frontend moderno con Vue 3 + Vite + TypeScript

---

## Estructura

```
kechow-main/
├── kechow-server/ # API backend Laravel
├── kechow-client/ # Frontend Vue 3 + Vite + TS
├── package.json # Scripts para levantar backend y frontend
```

---

## Arrancando el proyecto

# Clona el repositorio principal
```bash
git clone https://github.com/abimael92/kechow.git
```
# Entra al directorio del proyecto
```bash
cd kechow-main
```
# Instala dependencias backend (Laravel)
```bash
composer install --working-dir=kechow-server
```
# Instala dependencias frontend (Vue 3 + Vite)
```bash
npm install --prefix kechow-client
```
# Instala dependencias raíz 
```bash
npm install
```
# Ejecuta backend y frontend simultáneamente
```bash
cd..
npm run start
```


## Configura tus archivos .env en backend y frontend

# Corre migraciones backend:
php kechow-server/artisan migrate --seed

# Corre backend y frontend juntos:
npm run start
