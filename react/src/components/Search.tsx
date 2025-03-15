type SearchProps = {
  search: string;
  setSearch: (value: string) => void;  // Добавляем setSearch
};;

const Search: React.FC<SearchProps> = ({search, setSearch}) => {
  
  return (
    <div className='select-none'>
      <input
        type="text"
        placeholder="Поиск"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='flex w-full h-10 border-2 border-gray-300 focus:border-cyan-600 focus:outline-none rounded-md mb-2 p-2'
      />
    </div>
  );
};

export default Search;
