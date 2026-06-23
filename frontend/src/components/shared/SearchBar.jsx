import { useEffect, useRef, useState } from "react";

const SearchBar = ({ value = "", onSearch }) => {
  const [input, setInput] = useState(value);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== value) onSearchRef.current(input);
    }, 450);
    return () => clearTimeout(t);
  }, [input, value]);

  return (
    <input
      className="form-control"
      placeholder="Search by title, company, skills..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default SearchBar;
