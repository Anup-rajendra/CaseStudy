import React from 'react';
import { Button } from "../components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  
} from "../components/ui/sheet";

import NotificationComponent from "./NotificationComponent"

// SheetDemo.js
export default function SheetDemo({isOpen, onClose, notification}) {
    const handleSubmit = () => {
      onClose();
    };
  
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <NotificationComponent notification={notification} />
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleSubmit}>Continue Shopping</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
  
