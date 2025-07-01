import React from 'react';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

// --- Константы для контента и анимации ---
const BANNER_CONTENT = {
  title: 'Отличные оценки сегодня — высокий балл на ЕНТ завтра.',
  subtitle: 'Помогаем с учебой в школе (5-11 класс) и готовим к главному экзамену. Разбираем сложные темы простыми словами и целенаправленно готовим к тестам.',
  buttonText: 'Записаться на консультацию',
};

const FADE_IN_UP_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

interface HeroBannerProps {
  onOpenModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenModal }) => {
  return (
    <div className="relative bg-content1 overflow-hidden">
      {/* Абстрактные элементы на фоне */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-primary/5"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          <motion.h1
            {...FADE_IN_UP_ANIMATION}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground mb-6"
          >
            {BANNER_CONTENT.title}
          </motion.h1>
          
          <motion.p
            {...FADE_IN_UP_ANIMATION}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-foreground-600 mb-8 mx-auto max-w-2xl"
          >
            {BANNER_CONTENT.subtitle}
          </motion.p>
          
          <motion.div
            {...FADE_IN_UP_ANIMATION}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg"
              color="secondary" 
              onPress={onOpenModal}
              className="font-medium text-foreground-800"
            >
              {BANNER_CONTENT.buttonText}
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;