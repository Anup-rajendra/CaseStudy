import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing the useNavigate hook
// import axios from 'axios';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  //CommandSeparator,
} from './ui/command';

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchString, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate to another page

  // Function to handle API call for fetching suggestions
  

  // Debouncing the input to avoid multiple API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchString) {
        //fetchSuggestions(inputValue);
        setOpen(true);
      } else {
        setOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchString]);

  const handleValueChange = (value) => {
    setInputValue(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Navigate to the search results page with the inputValue as a query parameter
      console.log("this is searchstring",searchString);
      navigate(`/Searches`,{state: {searchString}});
    }
  };

  return (
    <Command className="rounded-3xl border-none md:min-w-[450px] z-50">
      <CommandInput
        placeholder="Type a search..."
        onValueChange={handleValueChange}
        onKeyDown={handleKeyDown} // Handle Enter key press
        className="rounded-full"
      />
      <CommandList className="bg-white rounded-lg z-50">
        {open && (
          <>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : (
              <>
                {suggestions.length === 0 ? (
                  <CommandEmpty>No results found.</CommandEmpty>
                ) : (
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((suggestion, index) => (
                      <CommandItem key={index}>
                        <span>{suggestion.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
};

export default SearchBar;
