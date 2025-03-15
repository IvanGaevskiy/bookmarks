// src/App.tsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Toaster, toast } from 'react-hot-toast';


import BookmarkCard from './components/BookmarkCard';
import Search from './components/Search'
import SearchCheckbox from './components/SearchCheckbox';
import EditCreateModal from './components/EditCreateModal'
import ConfirmModal from './components/ConfirmModal';
import MyButton from './components/MyButton';


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
  const { loading, error, data, refetch } = useQuery<{ bookmarks: Bookmark[] }>(GET_BOOKMARKS);


  const [search, setSearch] = useState("");
  const [searchByDomain, setSearchByDomain] = useState(false);


  const [createBookmark] = useMutation<CreateBookmarkResponse>(CREATE_BOOKMARK);
  const [deleteBookmark] = useMutation<DeleteBookmarkResponse>(DELETE_BOOKMARK);
  const [updateBookmark] = useMutation<UpdateBookmarkResponse>(UPDATE_BOOKMARK);


  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const formData = { title, setTitle, url, setUrl };


  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBookmarkId, setCurrentBookmarkId] = useState<string | null>(null);
  

  const handleAddBookmark = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    try {
      const result = await createBookmark({
        variables: { input: { title, url } },
      });
  
      if (result.data?.createBookmark.errors.length === 0) {
        setTitle('');
        setUrl('');
        refetch();
        toast.success('Закладка успешно добавлена!');

      } else {
        console.error(result.data?.createBookmark.errors);
        toast.error('Произошла ошибка при добавлении закладки!');

      }
    } catch (err) {
      console.error(err);
      toast.error('Произошла ошибка при добавлении закладки!');

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
    })
    .then(() => {
      toast.success('Закладка успешно удалена!');
    })
    .catch((err) => {
      console.error(err);
      toast.error(`Не удалось удалить элемент: ${err}`)
    });
  };


  const handleEditBookmark = async (id: string, title: string, url: string) => {
    try {
      const result = await updateBookmark({
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
      
      if (result.data?.updateBookmark.errors.length === 0) {
        toast.success('Закладка успешно обновлена!');
      } else {
        console.error(result.data?.updateBookmark.errors);
        toast.error('Ошибка при обновлении закладки!');
      }
      
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


  const handleOpenEditModalForEdit = (bookmark: Bookmark) => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setCurrentBookmarkId(bookmark.id);
    setIsEditMode(true);
    setIsOpenEditModal(true);
  };


  const handleOpenEditModalForCreate = () => {
    setTitle('');
    setUrl('');
    setIsEditMode(false);
    setIsOpenEditModal(true)
  };
  
  
  const handleOpenEditModalForDelete = (bookmark: Bookmark) => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setCurrentBookmarkId(bookmark.id);
    setIsOpenConfirmModal(true);
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='mx-80 mt-2'>
      <div className='sticky top-0 bg-white p-2 rounded'>
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
            text='+ Создать'
            isPrimary={true}
            onPress={handleOpenEditModalForCreate}
          />
        </div>
        
      </div>
      
      <div className=''>
        {filteredBookmarks.slice().reverse().map((bookmark) => (

        <div className="mb-2">
          <BookmarkCard
            {...bookmark}
            onDelete={() => handleOpenEditModalForDelete(bookmark)}
            onEdit={() => handleOpenEditModalForEdit(bookmark)}
          />
        </div>

        ))}
      </div>
      
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={() => setIsOpenConfirmModal(false)}
        onConfirm={() => {
          if (currentBookmarkId != null) {
            handleDeleteBookmark(currentBookmarkId)
          }
        }}
        title={`Удаление закладки ${title}`}
        message="Вы уверены, что хотите удалить этот элемент?"
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <EditCreateModal
        isOpen={isOpenEditModal}
        isEdit={isEditMode}
        params={formData}
        onConfirm={() => {
          if (isEditMode && currentBookmarkId) {
            handleEditBookmark(currentBookmarkId, title, url);
          } else {
            handleAddBookmark();
          }
          setIsOpenEditModal(false);
        }}
        onClose={() => setIsOpenEditModal(false)}
        confirmText='Подтвердить'
        cancelText='Отмена'
      />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            iconTheme: {
              primary: 'oklch(0.609 0.126 221.723)',
              secondary: 'white',
            },
            style: { background: "white", color: "oklch(0.609 0.126 221.723)", border: '2px solid oklch(0.609 0.126 221.723)' },
          },
        }}
      />
    </div>
  );
};

export default App;
