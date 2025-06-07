import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/react';
import { Icon } from '@iconify/react';

interface HeaderProps {
  onOpenModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Главная", href: "/" },
    { label: "Курсы", href: "/courses" },
    { label: "Блог", href: "/blog" },
    { label: "О нас", href: "/about-us" },
  ];

  return (
    <Navbar 
      className="bg-white border-b border-divider py-3"
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="flex gap-2 items-center">
          <Icon icon="lucide:graduation-cap" width={32} height={32} className="text-primary" />
          <p className="font-bold text-xl">Munificent School</p>
        </NavbarBrand>
      </NavbarContent>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* ИСПРАВЛЕНИЕ 1: Ссылка "Преподаватели" заменена на "Главная" */}
        <NavbarItem>
          <Link color="foreground" href="/" className="font-medium">
            Главная
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/courses" className="font-medium">
            Курсы
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
        {/* ИСПРАВЛЕНИЕ 2: Созданы две версии кнопки для разных экранов */}
        <NavbarItem className="hidden sm:flex">
          <Button color="primary" onPress={onOpenModal} className="font-medium">
            Оставить заявку
          </Button>
        </NavbarItem>
        <NavbarItem className="flex sm:hidden">
          <Button isIconOnly color="primary" onPress={onOpenModal} aria-label="Оставить заявку">
            <Icon icon="lucide:send" width={20} />
          </Button>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link className="w-full" color="foreground" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link className="w-full" color="foreground" href="/login" size="lg">
            Войти
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;