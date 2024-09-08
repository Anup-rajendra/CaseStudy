import React,{useState} from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "./ui/command"
const SearchBar=()=>{
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
  
    const handleValueChange = (value) => {
      setInputValue(value);
      setOpen(!!value);
      console.log(inputValue);
    };
  
    return(
    <>
<Command className="rounded-3xl border md:min-w-[450px] " >
      <CommandInput placeholder="Type a search..." onValueChange={handleValueChange} className="rounded-full"/>
      <CommandList className="rounded-lg">
      {open && (<>
        <CommandEmpty >No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
         
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
           
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
             
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
             
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        </>
    )}
      </CommandList>
   
    </Command>
  

    </>
    );
}
export default SearchBar;