type MyButtonProps = {
  text: string;
  isSubmit?: boolean;
  isPrimary?: boolean;
  onPress?: () => void;
  
}
const MyButton: React.FC<MyButtonProps> = ({text, isSubmit, isPrimary, onPress})=>{
  const commonStyles = 'py-0.5 min-w-[120px] text-center border border-cyan-600 rounded focus:outline-none focus:ring cursor-pointer'
  const primary = 'text-white bg-cyan-600 active:text-cyan-500 hover:bg-transparent hover:text-cyan-600'
  const secondary = 'text-cyan-600 hover:bg-cyan-600 hover:text-white active:bg-cyan-500'
  return (
    <div className="flex gap-4 select-none">
      <button 
        className={`${commonStyles} ${(isPrimary ? primary : secondary)}`}
        onClick={onPress}
        type={isSubmit ? 'submit' : 'button'}
      >
        {text}
      </button>
    </div>
  )
}

export default MyButton