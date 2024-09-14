import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { useQuery} from '@apollo/client';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

import { Link } from 'react-router-dom';
import { GET_CATEGORIES } from '../Apollo/queries';
const components = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];


const CategoryNavigation = () => {

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_CATEGORIES);
  console.log(categoriesData);

  if(categoriesError) return(<h1>error</h1>);
  if(categoriesLoading) return (<h1>loading</h1>)
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categoriesData.categories.map((category) => (
          <NavigationMenuItem key={category.id}> {/* Add a key to each list item */}
            <Link to="/categories" state={{category}}
            
            > {/* Use react-router-dom Link */}
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {category.categoryName}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default CategoryNavigation;
