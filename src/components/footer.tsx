import React from 'react';
import { Link } from '@heroui/react';
import { Icon } from '@iconify/react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-content1 border-t border-divider py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo and social links */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:graduation-cap" width={32} height={32} className="text-primary" />
              <span className="font-bold text-xl">Munificent School</span>
            </div>
            <p className="text-foreground-500 mt-2">
              Помогаем с учебой в школе (5-11 класс) и готовим к ЕНТ.
            </p>
            <div className="flex gap-4 mt-4">
              <Link isExternal aria-label="Instagram" className="text-foreground-500 hover:text-primary">
                <Icon icon="lucide:instagram" width={24} height={24} />
              </Link>
              <Link isExternal aria-label="Facebook" className="text-foreground-500 hover:text-primary">
                <Icon icon="lucide:facebook" width={24} height={24} />
              </Link>
              <Link isExternal aria-label="YouTube" className="text-foreground-500 hover:text-primary">
                <Icon icon="lucide:youtube" width={24} height={24} />
              </Link>
              <Link isExternal aria-label="WhatsApp" className="text-foreground-500 hover:text-primary">
                <Icon icon="lucide:message-circle" width={24} height={24} />
              </Link>
            </div>
          </div>
          
          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Навигация</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link color="foreground" href="#courses" className="text-foreground-500 hover:text-primary">
                  Курсы
                </Link>
              </li>
              <li>
                <Link color="foreground" href="#teachers" className="text-foreground-500 hover:text-primary">
                  Преподаватели
                </Link>
              </li>
              <li>
                <Link color="foreground" href="#reviews" className="text-foreground-500 hover:text-primary">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link color="foreground" href="#about" className="text-foreground-500 hover:text-primary">
                  О нас
                </Link>
              </li>
              <li>
                <Link color="foreground" href="#" className="text-foreground-500 hover:text-primary">
                  Блог
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contacts */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Контакты</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2">
                <Icon icon="lucide:phone" className="text-foreground-500" />
                <Link isExternal href="tel:+77771234567" className="text-foreground-500 hover:text-primary">
                  +7 (777) 123-45-67
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:mail" className="text-foreground-500" />
                <Link isExternal href="mailto:info@munificentschool.kz" className="text-foreground-500 hover:text-primary">
                  info@munificentschool.kz
                </Link>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="lucide:map-pin" className="text-foreground-500 mt-1" />
                <span className="text-foreground-500">
                  г. Алматы, ул. Достык 132, 
                  <br />БЦ "Прогресс", офис 401
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-divider text-center text-foreground-500 text-sm">
          &copy; {new Date().getFullYear()} Munificent School. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;