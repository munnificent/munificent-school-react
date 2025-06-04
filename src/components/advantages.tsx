import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const Advantages: React.FC = () => {
  const advantages = [
    {
      id: 1,
      icon: "lucide:video",
      title: "Живые уроки, а не скучные записи",
      description: "Ты всегда можешь задать вопрос и получить ответ здесь и сейчас."
    },
    {
      id: 2,
      icon: "lucide:heart-handshake",
      title: "Преподы на одной волне",
      description: "Они поймут твои мемы и объяснят сложные темы простыми словами."
    },
    {
      id: 3,
      icon: "lucide:graduation-cap",
      title: "Поддержка для всех (5-11 класс)",
      description: "Помогаем подтянуть оценки, разобраться в сложной теме и подготовиться к ЕНТ."
    },
    {
      id: 4,
      icon: "lucide:target",
      title: "Никакой воды — только практика",
      description: "Решаем реальные тесты и задачи с первого занятия."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="advantages" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Учиться с нами — это эффективно и без стресса.
          </h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {advantages.map((advantage) => (
            <motion.div key={advantage.id} variants={itemVariants}>
              <Card className="h-full">
                <CardBody className="flex flex-col gap-4 items-center text-center p-6">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Icon icon={advantage.icon} width={28} height={28} />
                  </div>
                  <h3 className="text-xl font-semibold">{advantage.title}</h3>
                  <p className="text-foreground-500">{advantage.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Advantages;