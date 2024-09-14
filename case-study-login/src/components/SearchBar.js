// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Importing the useNavigate hook
// import { ReactSearchAutocomplete } from 'react-search-autocomplete';
// import { useQuery } from '@apollo/client'; // Assuming you're using Apollo for GraphQL
// import { GET_PRODUCTS } from '../Apollo/queries'; // Importing the query for products
// function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const navigate = useNavigate(); // To navigate to another page
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
//    Debouncing the input to avoid multiple API calls
//    useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchTerm) {
//         setLoading(true);
//         fetchSuggestions(searchTerm); // Use searchString for suggestions
//         setOpen(true);
//       } else {
//         setOpen(false);
//       }
//     }, 300); // 300ms debounce

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm]);

//   const fetchSuggestions = (searchTerm) => {
//     if (productsData) {
//       Ensure searchTerm is at least 3 characters long
//       if (searchTerm.length < 3) {
//         setSuggestions([]); // Not enough characters to form a valid pattern
//         return;
//       }
  
//       Create a regex pattern to match any sequence of at least 3 consecutive characters from searchTerm
//       const minLength = 3;
//       const pattern = Array.from({ length: searchTerm.length - minLength + 1 }, (_, i) =>
//         searchTerm.slice(i, i + minLength)
//       ).join('|');
  
//       Regex to match any of the sequences
//       const regex = new RegExp(pattern, 'i');
  
//       Filter products based on regex pattern
//       const filteredSuggestions = productsData.products.filter(product => {
//         return regex.test(product.name); // Check if product name matches the regex
//       });
  
//       setSuggestions(filteredSuggestions); // Set the filtered products as suggestions
//       setLoading(false); // Stop loading once suggestions are fetched
//     }
//   };

//   const handleOnSearch = (value) => {
//     setSearchTerm(value);
//   };

//   const handleOnSelect = (item) => {
//     navigate('/searches', {
//       state: {
//         suggestions       // Pass the suggestions array
//       }
//     });
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       Navigate to the SearchedProducts page with the searchString and suggestions array as state
//       console.log("This is searchString:", searchTerm);
//       console.log("These are suggestions:", suggestions);
//       navigate('/searches', {
//         state: {
//           suggestions       // Pass the suggestions array
//         }
//       });
//     }
//   };

//   const handleOnHover = (item) => {
//     console.log('Hovered:', item);
//   };

//   const handleOnFocus = () => {
//     console.log('The search input is focused');
//   };

//   const handleOnClear = () => {
//     console.log('The search input is cleared');
//     setSuggestions([]);
//   };

//   console.log(loading);
//   if(productsLoading) return ( <h1>Loading</h1>);
//   if(productsError) return (<h1>Error fetching retry</h1>);

//   console.log("this is suggestions array",suggestions);
//   return (
//     <div style={{ width: 300 }}>
//       <ReactSearchAutocomplete
//         items={suggestions}
//         onSearch={handleOnSearch}
//         onSelect={handleOnSelect}
//         onHover={handleOnHover}
//         onFocus={handleOnFocus}
//         onKeyDown={handleKeyDown} // Handle Enter key press
//         value={searchTerm}
//         onClear={handleOnClear}
//         placeholder="Type to search"
//       />
//     </div>
//   );
// }

// export default SearchBar;



//-------------------------------------------------------------------------------------------------------------------------------------------
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
  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);

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
      const pattern = Array.from({ length: searchTerm.length - minLength + 1 }, (_, i) =>
        searchTerm.slice(i, i + minLength)
      ).join('|');
  
      // Regex to match any of the sequences
      const regex = new RegExp(pattern, 'i');
  
      // Filter products based on regex pattern
      const filteredSuggestions = productsData.products.filter(product => {
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
      console.log("This is searchString:", searchString);
      console.log("These are suggestions:", suggestions);
      
      navigate('/Searches', {
        state: {
          suggestions         // Pass the suggestions array
        }
      });
    }
  };

  if(productsLoading) return ( <h1>Loading</h1>);
  if(productsError) return (<h1>Error fetching retry</h1>);

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


//---------------------------------------------------------------------------------------------------------------------------------

// import { useState } from 'react';
// import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
// import { Input } from '@shadcn/ui';
// import { SearchIcon } from '@heroicons/react/solid'; // You can use HeroIcons or any other icon library
// import { useQuery } from '@apollo/client'; // Assuming you're using Apollo for GraphQL
// import { GET_PRODUCTS } from '../Apollo/queries'; // Importing the query for products

// function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
//   // Dummy fetch function for suggestions (replace this with your actual fetching logic)
//   const fetchSuggestions = (searchTerm) => {
//     if (productsData) {
//       // Ensure searchTerm is at least 3 characters long
//       if (searchTerm.length < 3) {
//         setSuggestions([]); // Not enough characters to form a valid pattern
//         return;
//       }
  
//       // Create a regex pattern to match any sequence of at least 3 consecutive characters from searchTerm
//       const minLength = 3;
//       const pattern = Array.from({ length: searchTerm.length - minLength + 1 }, (_, i) =>
//         searchTerm.slice(i, i + minLength)
//       ).join('|');
  
//       // Regex to match any of the sequences
//       const regex = new RegExp(pattern, 'i');
  
//       // Filter products based on regex pattern
//       const filteredSuggestions = productsData.products.filter(product => {
//         return regex.test(product.name); // Check if product name matches the regex
//       });
  
//       setSuggestions(filteredSuggestions); // Set the filtered products as suggestions
//       setLoading(false); // Stop loading once suggestions are fetched
//     }
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     fetchSuggestions(value); // Fetch suggestions based on the input
//   };

//   const handleSelect = (suggestion) => {
//     setSearchTerm(suggestion); // Set the selected suggestion
//     navigate('/Searches', {
//       state: {
//         suggestions         // Pass the suggestions array
//       }
//     });
//   };
  
//   if(productsLoading) return ( <h1>Loading</h1>);
//   if(productsError) return (<h1>Error fetching retry</h1>);
//   return (
//     <div className="relative w-full max-w-md mx-auto">
//       <div className="relative flex items-center">
//         {/* Input field */}
//         <Input
//           type="text"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           placeholder="Search..."
//           className="pr-10"
//         />
//         {/* Search Icon */}
//         <SearchIcon className="absolute right-2 h-5 w-5 text-gray-500" />
//       </div>

//       {/* Suggestions Popover */}
//       <Popover open={suggestions.length > 0}>
//         <PopoverTrigger asChild>
//           <div />
//         </PopoverTrigger>
//         <PopoverContent className="bg-white p-2 rounded-md shadow-md">
//           {suggestions.map((suggestion, index) => (
//             <div
//               key={index}
//               onClick={() => handleSelect(suggestion)}
//               className="p-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {suggestion}
//             </div>
//           ))}
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

// export default SearchBar;
