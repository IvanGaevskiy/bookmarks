// src/App.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import BookmarkCard from './components/BookmarkCard';
import Search from './components/Search'
import SearchCheckbox from './components/SearchCheckbox';
import MyButton from './components/MyButton';
import EditCreateModal  from './components/EditCreateModal'

// Определение типов для закладок
type Bookmark = {
  id: string;
  title: string;
  url: string;
  createdAt?: string;
}

// Типы для мутаций
type CreateBookmarkResponse = {
  createBookmark: {
    bookmark: Bookmark;
    errors: string[];
  };
}

type DeleteBookmarkResponse = {
  deleteBookmark: {
    success: boolean;
    errors: string[];
  };
}

type UpdateBookmarkResponse = {
  updateBookmark: {
    bookmark: Bookmark;
    errors: string[];
  };
};



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

const UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark($input: UpdateBookmarkInput!) {
    updateBookmark(input: $input) {
      bookmark {
        id
        title
        url
      }
      errors
    }
  }
`;


const App: React.FC = () => {
  const { loading, error, data } = useQuery<{ bookmarks: Bookmark[] }>(GET_BOOKMARKS);
  
  const [search, setSearch] = useState("");
  const [searchByDomain, setSearchByDomain] = useState(false);
  
  const [createBookmark] = useMutation<CreateBookmarkResponse>(CREATE_BOOKMARK);
  const [deleteBookmark] = useMutation<DeleteBookmarkResponse>(DELETE_BOOKMARK);
  const [updateBookmark] = useMutation<UpdateBookmarkResponse>(UPDATE_BOOKMARK);


  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const formData = { title, setTitle, url, setUrl };
  
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)

  const handleAddBookmark = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    console.log('method handleAddBookmark запущен!')
    try {
      const newBookmark = {
        id: Math.random().toString(36).substr(2, 9), // Временный ID
        title,
        url,
        createdAt: new Date().toISOString(),
      };
  
      await createBookmark({
        variables: { input: { title, url } },
        optimisticResponse: {
          createBookmark: {
            bookmark: newBookmark,
            errors: [],
          },
        },
        update: (cache) => {
          const existingData = cache.readQuery<{ bookmarks: Bookmark[] }>({
            query: GET_BOOKMARKS,
          });
  
          if (!existingData) return;
  
          cache.writeQuery({
            query: GET_BOOKMARKS,
            data: {
              bookmarks: [...existingData.bookmarks, newBookmark],
            },
          });
        },
      });
  
      setTitle('');
      setUrl('');
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleDeleteBookmark = (id: string) => {
    deleteBookmark({
      variables: { input: { id } },
      optimisticResponse: {
        deleteBookmark: {
          success: true,
          errors: [],
        },
      },
      update: (cache) => {
        const existingData = cache.readQuery<{ bookmarks: Bookmark[] }>({
          query: GET_BOOKMARKS,
        });
  
        if (!existingData) return;
  
        cache.writeQuery({
          query: GET_BOOKMARKS,
          data: {
            bookmarks: existingData.bookmarks.filter((bookmark) => bookmark.id !== id),
          },
        });
      },
    }).catch((err) => {
      console.error(err);
    });
  };
  
  const handleEditBookmark = async (id: string, title: string, url: string) => {
    try {
      await updateBookmark({
        variables: { input: { id, title, url } },
        optimisticResponse: {
          updateBookmark: {
            bookmark: {
              id,
              title,
              url,
            },
            errors: [],
          },
        },
        update: (cache, { data }) => {
          if (!data?.updateBookmark.bookmark) return;
  
          const existingData = cache.readQuery<{ bookmarks: Bookmark[] }>({
            query: GET_BOOKMARKS,
          });
  
          if (!existingData) return;
  
          const updatedBookmarks = existingData.bookmarks.map((b) =>
            b.id === id ? { ...b, title, url } : b
          );
  
          cache.writeQuery({
            query: GET_BOOKMARKS,
            data: { bookmarks: updatedBookmarks },
          });
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  
  const filteredBookmarks = useMemo(() => {
    if (!data?.bookmarks) return [];

    return data.bookmarks.filter((bookmark) => {
      if (!search) return true;

      const searchField = searchByDomain
        ? new URL(bookmark.url).hostname // Извлекаем домен из URL
        : bookmark.title.toLowerCase();

      return searchField.includes(search.toLowerCase());
    });
  }, [data, search, searchByDomain]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='mx-80 mt-6'>
      <Search 
        search={search} 

        setSearch={setSearch}
      />
      <div className='flex gap-2 mb-4'>
        <SearchCheckbox
          text='Поиск по домену'
          searchByDomain={searchByDomain}
          setSearchByDomain={() => setSearchByDomain(!searchByDomain)}
        />
        <MyButton
          text='Создать'
          isPrimary={true}
          onPress={() => setIsOpenEditModal(true)}
        />
        <EditCreateModal
            isOpen={isOpenEditModal}
            isEdit={false}
            params={formData}
            onConfirm={handleAddBookmark}
            onClose={() => setIsOpenEditModal(false)}
            confirmText='Подтвердить'
            cancelText= 'Отмена'
            message='Заполните поля ниже и нажмите кнопку "Подтвердить"'
        />
      </div>
      {/* <form onSubmit={handleAddBookmark}>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">Добавить</button>
      </form> */}
      <ul>
        {filteredBookmarks.slice().reverse().map((bookmark) => (
          <div className="mb-2">
            <BookmarkCard
              {...bookmark}
              setTitle={setTitle}
              setUrl={setUrl}
              onDelete={() => handleDeleteBookmark(bookmark.id)}
              onEdit={() => handleEditBookmark(bookmark.id, bookmark.title, bookmark.url)}
            />
          </div>
          // <li key={bookmark.id}>
          //   <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
          //     {`${bookmark.title}: ${bookmark.url}`}
          //   </a>
          //   <button
          //     onClick={() => handleDeleteBookmark(bookmark.id)}
          //   >
          //     Удалить
          //   </button>
          //   <button
          //     onClick={() => {
          //       const newTitle = prompt('Введите новый заголовок', bookmark.title);
          //       const newUrl = prompt('Введите новый URL', bookmark.url);
          //       if (newTitle && newUrl) {
          //         handleEditBookmark(bookmark.id, newTitle, newUrl);
          //       }
          //     }}
          //   >
          //     Редактировать
          //   </button>
          // </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
