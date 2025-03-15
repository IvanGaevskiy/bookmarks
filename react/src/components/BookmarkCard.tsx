import MyButton from "./MyButton";

type BookmarkCardProps = {
  title: string;
  url: string;
  
  onDelete: () => void;
  onEdit: () => void;
};

const BookmarkCard: React.FC<BookmarkCardProps> = ({ title, url, onEdit, onDelete }) => {
  return (
    <div className="bg-neutral-200 shadow-md rounded-lg p-4 border border-gray-200 select-none">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-950 hover:underline"
      >
        {url}
      </a>
      <div className="flex justify-end mt-4 gap-2">
        <MyButton
          text='Удалить'
          isPrimary={false}
          onPress={onDelete}
        />
        <MyButton
          text='Изменить'
          isPrimary
          onPress={onEdit}
        />
      </div>
    </div>
  );
};

export default BookmarkCard;
