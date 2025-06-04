import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react';
import { Icon } from '@iconify/react';

interface HeaderProps {
  onOpenModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar 
      className="bg-white border-b border-divider py-3"
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      
      <NavbarBrand className="flex gap-2 items-center">
        <Icon icon="lucide:graduation-cap" width={32} height={32} className="text-primary" />
        <p className="font-bold text-xl">Munificent School</p>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/courses" className="font-medium">
            Курсы
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#teachers" className="font-medium">
            Преподаватели
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/blog" className="font-medium">
            Блог
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/about-us" className="font-medium">
            О нас
          </Link>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Button 
            color="primary" 
            variant="flat"
            as="a" 
            href="/login"
            className="font-medium mr-2"
          >
            Войти
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button 
            color="primary" 
            onPress={onOpenModal}
            className="font-medium text-nowrap"
            size="sm"
          >
            Оставить заявку
          </Button>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarMenu>
        <NavbarMenuItem>
          <Link 
            className="w-full" 
            color="foreground" 
            href="/courses"
            size="lg"
          >
            Курсы
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            className="w-full" 
            color="foreground" 
            href="#teachers"
            size="lg"
          >
            Преподаватели
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            className="w-full" 
            color="foreground" 
            href="/blog"
            size="lg"
          >
            Блог
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            className="w-full" 
            color="foreground" 
            href="/about-us"
            size="lg"
          >
            О нас
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link 
            className="w-full" 
            color="foreground" 
            href="/login"
            size="lg"
          >
            Войти
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;