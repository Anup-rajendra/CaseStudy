import * as React from 'react';
import { useQuery } from '@apollo/client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

import { Link } from 'react-router-dom';
import { GET_CATEGORIES } from '../Apollo/queries';

const CategoryNavigation = () => {
  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_CATEGORIES);
  console.log(categoriesData);

  if (categoriesError) return <h1>error</h1>;
  if (categoriesLoading) return <h1></h1>;
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categoriesData.categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            {' '}
            {/* Add a key to each list item */}
            <Link to="/categories" state={{ category }}>
              {' '}
              {/* Use react-router-dom Link */}
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
