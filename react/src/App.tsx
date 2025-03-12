// src/App.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// Определение типов для закладок
interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string;
}

// Типы для мутаций
interface CreateBookmarkResponse {
  createBookmark: {
    bookmark: Bookmark;
    errors: string[];
  };
}

interface DeleteBookmarkResponse {
  deleteBookmark: {
    success: boolean;
    errors: string[];
  };
}

const GET_BOOKMARKS = gql`
  query GetBookmarks {
    bookmarks {
      id
      title
      url
      createdAt
    }
  }
`;

const CREATE_BOOKMARK = gql`
  mutation CreateBookmark($input: CreateBookmarkInput!) {
    createBookmark(input: $input) {
      bookmark {
        id
        title
        url
      }
      errors
    }
  }
`;

const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($input: DeleteBookmarkInput!) {
    deleteBookmark(input: $input) {
      success
      errors
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<{ bookmarks: Bookmark[] }>(GET_BOOKMARKS);
  const [createBookmark] = useMutation<CreateBookmarkResponse>(CREATE_BOOKMARK);
  const [deleteBookmark] = useMutation<DeleteBookmarkResponse>(DELETE_BOOKMARK);

  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  const handleAddBookmark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createBookmark({
        variables: { input: { title, url } },
      });
      if (result.data?.createBookmark.errors.length === 0) {
        setTitle('');
        setUrl('');
        refetch();
      } else {
        console.error(result.data?.createBookmark.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const result = await deleteBookmark({
        variables: { input: { id } },
      });
      if (result.data?.deleteBookmark.success) {
        refetch();
      } else {
        console.error(result.data?.deleteBookmark.errors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ margin: '20px' }}>
      <h1>Закладки</h1>
      <form onSubmit={handleAddBookmark} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Добавить</button>
      </form>
      <ul>
        {data?.bookmarks.map((bookmark) => (
          <li key={bookmark.id} style={{ marginBottom: '10px' }}>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              {bookmark.title}
            </a>
            <button
              onClick={() => handleDeleteBookmark(bookmark.id)}
              style={{ marginLeft: '10px' }}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
