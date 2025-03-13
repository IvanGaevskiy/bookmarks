import { useState } from "react";
import ConfirmModal from "./confirmModal";

type BookmarkCardProps = {
  title: string;
  url: string;
  onDelete: () => void;
  onEdit: () => void;
};

const BookmarkCard: React.FC<BookmarkCardProps> = ({ title, url, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="bg-blue-200 shadow-md rounded-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-950 hover:underline mt-2 block"
      >
        {url}
      </a>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-700 text-white px-3 py-1 rounded hover:bg-red-400 transition cursor-pointer mr-2"
        >
          Удалить
        </button>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onDelete}
          title={`Удаление ${title}`}
          message="Вы уверены, что хотите удалить этот элемент?"
          confirmText="Удалить"
          cancelText="Отмена"
        />
        <button
          onClick={onEdit}
          className="bg-cyan-700 text-white px-3 py-1 rounded hover:bg-cyan-300 transition cursor-pointer"
        >
          Редактировать
        </button>
      </div>
    </div>
  );
};

export default BookmarkCard;
