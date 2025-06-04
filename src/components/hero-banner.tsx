import React from 'react';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface HeroBannerProps {
  onOpenModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenModal }) => {
  return (
    <div className="relative bg-content1 overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-primary/5"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl py-24 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-foreground mb-6"
          >
            Отличные оценки сегодня — высокий балл на ЕНТ завтра.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-foreground-600 mb-8 mx-auto max-w-2xl"
          >
            Помогаем с учебой в школе (5-11 класс) и готовим к главному экзамену. 
            Разбираем сложные темы простыми словами и целенаправленно готовим к тестам.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg"
              color="secondary" 
              onPress={onOpenModal}
              className="font-medium text-foreground-800"
            >
              Записаться на консультацию
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;