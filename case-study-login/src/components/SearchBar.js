import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing the useNavigate hook
import {
  Command,
  // CommandEmpty,
  //CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useQuery } from '@apollo/client'; // Assuming you're using Apollo for GraphQL
import { GET_PRODUCTS } from '../Apollo/queries'; // Importing the query for products

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState(''); // State for search input
  const [suggestions, setSuggestions] = useState([]);
  //const [selectSuggestio, setSelectSuggestion] = useState([]);
  const navigate = useNavigate(); // To navigate to another page

  // Fetch products from GraphQL
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCTS);

  // Function to fetch suggestions based on search term
  const fetchSuggestions = (searchTerm) => {
    if (productsData && searchTerm.length >= 2) {
      const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
      const filteredSuggestions = productsData.products.filter((product) =>
        regex.test(product.name)
      );
      if (searchTerm <= 2) {
        setSuggestions([]);
      }
      setSuggestions(filteredSuggestions); // Update suggestions based on the search term
      setOpen(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]); // Clear suggestions if search term is less than 2 characters
      setOpen(false);
    }
  };

  // Debounce search input to avoid multiple API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchString) {
        setOpen(true);
        fetchSuggestions(searchString);
      } else {
        setOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchString, productsData]);

  // Update searchString as user types
  const handleValueChange = (value) => {
    setSearchString(value);
  };

  // Handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior for Enter key
      if (suggestions.length > 0) {
        navigate('/Searches', {
          state: {
            suggestions, // Pass the suggestions array
          },
        });
      }
    }
  };

  // Handle click on a suggestion to navigate to product details
  const handleSuggestionClick = (product) => {
    console.log(product, 'inside onclick');
    navigate('/Searches', {
      state: {
        product, // Pass the suggestions array
      },
    });
  };

  if (productsLoading) return <h1>Loading...</h1>;
  if (productsError) return <h1>Error fetching products. Please retry.</h1>;
  console.log('Suggestion', suggestions);

  console.log(open);
  return (
    <Command
      className="rounded-3xl border-none md:min-w-[450px] z-50"
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Type a search..."
        value={searchString}
        onValueChange={handleValueChange} // Update search input
        onKeyDown={handleKeyDown} // Handle Enter key press
        className="rounded-full"
      />
      <CommandList className="bg-white rounded-lg z-50">
        {suggestions.map((suggestion) => (
          <CommandItem
            key={suggestion.id}
            onSelect={() => {
              console.log(suggestion);
              handleSuggestionClick(suggestion);
            }} // Handle suggestion click
          >
            {suggestion.name}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default SearchBar;
