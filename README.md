# FILM!

## Deploy

http://frickmen17.nomorepartiessite.ru/

## Установка

### Docker Compose

Создайте `.env` файл в корне проекта из примера `.env.example`.

Запустите проект:

`docker compose up -d --build`

Приложение будет доступно по адресу `http://localhost`.

API доступно по адресу `http://localhost/api/afisha/films`.

### PostgreSQL

База данных запускается в контейнере `database`.

Тестовые данные загружаются автоматически из SQL-файлов:

- `backend/test/prac.init.sql`
- `backend/test/prac.films.sql`
- `backend/test/prac.schedules.sql`




