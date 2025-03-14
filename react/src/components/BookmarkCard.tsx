import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import MyButton from "./MyButton";
import EditCreateModal from "./EditCreateModal";

type BookmarkCardProps = {
  title: string;
  url: string;
  setTitle: (val:string) => void;
  setUrl: (val:string) => void;
  
  onDelete: () => void;
  onEdit: () => Promise<void>;
};

const BookmarkCard: React.FC<BookmarkCardProps> = ({ title, url, setTitle, setUrl, onDelete, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const formData = {title, url, setTitle, setUrl}
  return (
    <div className="bg-neutral-200 shadow-md rounded-lg p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-950 hover:underline mt-2 block"
      >
        {url}
      </a>
      <div className="flex justify-end mt-4 gap-2">
        <MyButton
          text='Удалить'
          isPrimary={false}
          onPress={() => setIsModalOpen(true)}
        />
        <MyButton
          text='Изменить'
          isPrimary={true}
          onPress={() => setIsOpenEditModal(true)}
        />
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onDelete}
          title={`Удаление ${title}`}
          message="Вы уверены, что хотите удалить этот элемент?"
          confirmText="Удалить"
          cancelText="Отмена"
        />
        <EditCreateModal
          isOpen={isOpenEditModal}
          isEdit={true}
          params={formData}
          onConfirm={onEdit}
          onClose={() => setIsOpenEditModal(false)}
          confirmText='Подтвердить'
          cancelText= 'Отмена'
          message='Заполните поля ниже и нажмите кнопку "Подтвердить"'
        />
      </div>
    </div>
  );
};

export default BookmarkCard;
