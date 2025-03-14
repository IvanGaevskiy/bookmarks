type SearchCheckboxProps = {
  text: string;
  searchByDomain: boolean;
  setSearchByDomain: () => void;
};;

const SearchCheckbox: React.FC<SearchCheckboxProps> = ({text, searchByDomain, setSearchByDomain}) => {
  
  return (
    <label className='inline-flex items-center'>
      <input
        type="checkbox"
        checked={searchByDomain}
        onChange={setSearchByDomain}
        className='w-5 h-5 accent-cyan-600 rounded'
      />
      <span className='ml-2'>{text}</span>
    </label>
  );
};

export default SearchCheckbox;
