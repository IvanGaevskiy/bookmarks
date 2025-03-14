import MyButton from "./MyButton";

type FormData = {
  title: string;
  url: string;
  setTitle: (val:string) => void;
  setUrl: (val:string) => void;
}

type EditCreateModalProps = {
  isOpen: boolean;
  isEdit: boolean;
  params: FormData;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const EditCreateModal: React.FC<EditCreateModalProps> = ({
  isOpen,
  isEdit,
  params,
  onClose,
  onConfirm,
  message = "Вы уверены?",
  confirmText = "Да",
  cancelText = "Отмена",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-100 rounded-lg shadow-lg p-6 w-96 transform -translate-y-1/3">
        <h2 className="text-lg font-semibold mb-4">{isEdit ? `Редактированиt заметки ${params.title}` : 'Создание заметки'}</h2>
        <p className="text-gray-700 mb-2">{message}</p>
        <form onSubmit={onClose}>
          <input
          className='flex w-full h-10 border-2 border-gray-300 focus:border-cyan-600 focus:outline-none rounded-md mb-3 p-2'
          type="text"
          placeholder="Название"
          value={params.title}
          onChange={(e) => params.setTitle(e.target.value)}
          required
          />
          <input
          className='flex w-full h-10 border-2 border-gray-300 focus:border-cyan-600 focus:outline-none rounded-md mb-3 p-2'
          type="url"
          placeholder="URL"
          value={params.url}
          onChange={(e) => params.setUrl(e.target.value)}
          required
          />
          <div className="flex justify-between space-x-3 mt-6">
            <MyButton
              text={cancelText}
              isPrimary={false}
              onPress={onClose}
            />
            <MyButton
              text={confirmText}
              isSubmit={true}
              isPrimary={true}
              onPress={async () => {
                await onConfirm();
                onClose();
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCreateModal;