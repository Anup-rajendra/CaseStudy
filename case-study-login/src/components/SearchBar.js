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
import { useQuery } from '@apollo/client'; // Assuming you're using Apollo for GraphQL
import { GET_PRODUCTS } from '../Apollo/queries'; // Importing the query for products

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState(''); // Updated state name for search input
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate to another page

  // Fetch products
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCTS);

  // Function to fetch suggestions (mocked or replace with actual API call)
  const fetchSuggestions = (searchTerm) => {
    if (productsData) {
      // Ensure searchTerm is at least 3 characters long
      if (searchTerm.length < 3) {
        setSuggestions([]); // Not enough characters to form a valid pattern
        return;
      }

      // Create a regex pattern to match any sequence of at least 3 consecutive characters from searchTerm
      const minLength = 3;
      const pattern = Array.from(
        { length: searchTerm.length - minLength + 1 },
        (_, i) => searchTerm.slice(i, i + minLength)
      ).join('|');

      // Regex to match any of the sequences
      const regex = new RegExp(pattern, 'i');

      // Filter products based on regex pattern
      const filteredSuggestions = productsData.products.filter((product) => {
        return regex.test(product.name); // Check if product name matches the regex
      });

      setSuggestions(filteredSuggestions); // Set the filtered products as suggestions
      setLoading(false); // Stop loading once suggestions are fetched
    }
  };

  // Debouncing the input to avoid multiple API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchString) {
        setLoading(true);
        fetchSuggestions(searchString); // Use searchString for suggestions
        setOpen(true);
      } else {
        setOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchString]);

  const handleValueChange = (value) => {
    setSearchString(value); // Correct way to update the search string
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Navigate to the SearchedProducts page with the searchString and suggestions array as state
      console.log('This is searchString:', searchString);
      console.log('These are suggestions:', suggestions);

      navigate('/Searches', {
        state: {
          suggestions, // Pass the suggestions array
        },
      });
    }
  };

  if (productsLoading) return <h1>Loading</h1>;
  if (productsError) return <h1>Error fetching retry</h1>;

  return (
    <Command className="rounded-3xl border-none md:min-w-[450px] z-50">
      <CommandInput
        placeholder="Type a search..."
        onValueChange={handleValueChange} // Correct reference to the handler
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
                    {suggestions.map((suggestions, index) => (
                      <CommandItem key={index}>
                        <span>{suggestions.name}</span>
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
