# Bookmark App

## Описание проекта
Приложение для сохранения закладок на статьи. Позволяет добавлять, просматривать и удалять закладки. Backend реализован на Ruby on Rails с GraphQL, frontend на React с Apollo Client.

## Стек технологий
- **Backend:** Ruby 3.3.1, Ruby on Rails 7.2.2.1, graphql-ruby
- **Frontend:** React 19, Vite, Apollo Client
- **База данных:** Sqlite3
- **Стили:** Tailwind CSS

## Запуск проекта

### Backend (Rails API)
1. Перейдите в директорию `rails_api`:
   ```sh
   cd rails_api
   ```
2. Установите зависимости:
   ```sh
   bundle install
   ```
3. Настройте базу данных:
   ```sh
   rails db:create 
   rails db:migrate
   ```
4. Запустите сервер:
   ```sh
   rails s
   ```

### Frontend (React + Apollo)
1. Перейдите в директорию `react` и установите зависимости:
   ```sh
   cd react
   npm install
   ```
2. Запустите фронтенд:
   ```sh
   npm run dev
   ```

## API (GraphQL)

### Запрос списка закладок
```graphql
query {
  bookmarks {
    id
    title
    url
    createdAt
  }
}
```

### Добавление закладки
```graphql
mutation {
  createBookmark(input: { title: "Example", url: "https://example.com" }) {
    bookmark {
      id
      title
      url
    }
    errors
  }
}
```

### Удаление закладки
```graphql
mutation {
  deleteBookmark(input: { id: 5 }) {
    success
    errors
  }
}

```

### Редактирование закладки
```graphql
mutation {
  updateBookmark(input: { id: "10", title: "Обновленный заголовок", url: "https://new-url.com" }) {
    bookmark {
      id
      title
      url
    }
    errors
  }
}


```

## Возможные улучшения
Если бы было больше времени, можно было бы добавить:
- крестик для закрытия модалки
- адаптивы
- семантические теги
- сортировку
- пагинацию
- переводы
- фавиконку
- проверку на уникальность url/title чтобы не создавались одинаковые закладки
- фильтры по времени создания (например, записи сделанные в определенную дату)
- '...' на конце длинных записей
- а так же улучшить написанный код
## Контакты
Автор: Иван Гаевский

Telegram: https://t.me/Ivan_Ruby_Developer

