import MyButton from "./MyButton";


type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение",
  message = "Вы уверены?",
  confirmText = "Да",
  cancelText = "Отмена",
}) => {

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50 select-none">
      <div onClick={(e) => e.stopPropagation()} className="bg-neutral-100 rounded-lg shadow-lg p-6 w-96 transform -translate-y-3/4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-between space-x-3">
          <MyButton
            text={cancelText}
            isPrimary={false}
            onPress={onClose}
          />
          <MyButton
            text={confirmText}
            isPrimary
            onPress={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;