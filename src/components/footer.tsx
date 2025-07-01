import React from 'react';
import { Link } from '@heroui/react';
import { Icon } from '@iconify/react';

// --- Данные для ссылок ---
const NAV_LINKS = [
  { href: '/courses', label: 'Курсы' },
  { href: '#rteachers', label: 'Преподаватели' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '/about-us', label: 'О нас' },
  { href: '/blog', label: 'Блог' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram', icon: 'lucide:instagram' },
  { href: 'https://facebook.com', label: 'Facebook', icon: 'lucide:facebook' },
  { href: 'https://youtube.com', label: 'YouTube', icon: 'lucide:youtube' },
  { href: 'https://wa.me/77771234567', label: 'WhatsApp', icon: 'lucide:message-circle' },
];

const CONTACTS = [
    { 
        type: 'link', 
        href: 'tel:+77771234567', 
        text: '+7 (777) 123-45-67', 
        icon: 'lucide:phone' 
    },
    { 
        type: 'link', 
        href: 'mailto:info@munificentschool.kz', 
        text: 'info@munificentschool.kz', 
        icon: 'lucide:mail' 
    },
    { 
        type: 'text', 
        text: 'г. Алматы, ул. Достык 132, \nБЦ "Прогресс", офис 401', 
        icon: 'lucide:map-pin' 
    },
];


export const Footer: React.FC = () => {
  return (
    <footer className="bg-content1 border-t border-divider py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Колонка 1: Логотип и соцсети */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:graduation-cap" width={32} height={32} className="text-primary" />
              <span className="font-bold text-xl">Munificent School</span>
            </div>
            <p className="text-foreground-500 mt-2">
              Помогаем с учебой в школе (5-11 класс) и готовим к ЕНТ.
            </p>
            <div className="flex gap-4 mt-4">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <Link key={label} isExternal href={href} aria-label={label} className="text-foreground-500 hover:text-primary">
                  <Icon icon={icon} width={24} height={24} />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Колонка 2: Навигация */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Навигация</h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link color="foreground" href={href} className="text-foreground-500 hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Колонка 3: Контакты */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Контакты</h3>
            <ul className="flex flex-col gap-3">
              {CONTACTS.map(({ type, href, text, icon }) => (
                <li key={text} className="flex items-start gap-2">
                  <Icon icon={icon} className="text-foreground-500 mt-1" />
                  {type === 'link' ? (
                    <Link isExternal href={href} className="text-foreground-500 hover:text-primary">
                      {text}
                    </Link>
                  ) : (
                    <span className="text-foreground-500 whitespace-pre-line">{text}</span>
                  )}
                </li>
              ))}
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