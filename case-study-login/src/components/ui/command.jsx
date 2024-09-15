import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent } from "./dialog";

const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
      className
    )}
    {...props} />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 dark:[&_[cmdk-group-heading]]:text-slate-400">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400",
        className
      )}
      {...props} />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef(({ className, ...props }, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  React.useEffect(() => {
    if (selectedIndex === null && props.children.length > 0) {
      setSelectedIndex(-1); // Ensure no item is selected initially
    }
  }, [props.children, selectedIndex]);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, React.Children.count(props.children) - 1));
        event.preventDefault();
        break;
      case 'ArrowUp':
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        event.preventDefault();
        break;
      case 'Enter':
        if (selectedIndex !== null && props.children[selectedIndex]) {
          props.children[selectedIndex].props.onSelect(); // Trigger the onSelect handler of the selected item
        }
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn("max-h-[300px] overflow-x-hidden", className)}
      {...props}
      onKeyDown={handleKeyDown}
    >
      {React.Children.map(props.children, (child, index) =>
        React.cloneElement(child, {
          className: cn(child.props.className, {
            "bg-slate-100 text-slate-900": selectedIndex === index,
            "dark:bg-slate-800 dark:text-slate-50": selectedIndex === index,
          }),
          onMouseEnter: () => setSelectedIndex(index), // Set selectedIndex on hover
          onMouseLeave: () => setSelectedIndex(null), // Reset on mouse leave
        })
      )}
    </CommandPrimitive.List>
  );
});

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-slate-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500 dark:text-slate-50 dark:[&_[cmdk-group-heading]]:text-slate-400",
      className
    )}
    {...props} />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-slate-200 dark:bg-slate-800", className)}
    {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default items-center rounded-sm px-2 py-3 pl-[34px] text-sm outline-none data-[disabled=true]:pointer-events-none",
      className
    )}
    {...props} />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400",
        className
      )}
      {...props} />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
