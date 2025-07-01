import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react';
import { Icon } from '@iconify/react';

// --- Данные для навигации ---
const MENU_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'Курсы', href: '/courses' },
  { label: 'Блог', href: '/blog' },
  { label: 'О нас', href: '/about-us' },
];

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
      isMenuOpen={isMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="sm:hidden"
        />
        <NavbarBrand className="flex gap-2 items-center">
          <Icon
            icon="lucide:graduation-cap"
            width={32}
            height={32}
            className="text-primary"
          />
          <p className="font-bold text-xl">Munificent School</p>
        </NavbarBrand>
      </NavbarContent>

      {/* --- Навигация для десктопа --- */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {MENU_ITEMS.map((item) => (
          <NavbarItem key={item.href}>
            <Link color="foreground" href={item.href} className="font-medium">
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* --- Кнопки действий --- */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="flat"
            className="font-medium mr-2"
          >
            Войти
          </Button>
          <Button color="primary" onPress={onOpenModal} className="font-medium">
            Оставить заявку
          </Button>
        </NavbarItem>
        <NavbarItem className="flex sm:hidden">
          <Button
            isIconOnly
            color="primary"
            onPress={onOpenModal}
            aria-label="Оставить заявку"
          >
            <Icon icon="lucide:send" width={20} />
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* --- Мобильное меню --- */}
      <NavbarMenu>
        {MENU_ITEMS.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              className="w-full"
              color="foreground"
              href={item.href}
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="foreground"
            href="/login"
            size="lg"
            onPress={() => setIsMenuOpen(false)}
          >
            Войти
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;