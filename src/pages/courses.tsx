import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Header from '../components/header';
import Footer from '../components/footer';
import RequestFormModal from '../components/request-form-modal';

interface CoursePackage {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: number;
  priceUnit: string;
  popular?: boolean;
  subjectCount: number;
  lessonsPerMonth: number;
  additionalFeatures?: string[];
}

const Courses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const packages: CoursePackage[] = [
    {
      id: 1,
      name: "Базовый",
      description: "Идеально для учеников, которым нужна помощь по одному предмету",
      features: ["Индивидуальный подход", "Доступ к записям уроков", "Регулярные домашние задания"],
      price: 15000,
      priceUnit: "тг/месяц",
      subjectCount: 1,
      lessonsPerMonth: 4
    },
    {
      id: 2,
      name: "Стандартный",
      description: "Наиболее популярный выбор для всестороннего развития",
      features: ["Индивидуальный подход", "Доступ к записям уроков", "Регулярные домашние задания", "Ежемесячное тестирование", "Консультации с методистом"],
      price: 25000,
      priceUnit: "тг/месяц",
      popular: true,
      subjectCount: 2,
      lessonsPerMonth: 8,
      additionalFeatures: ["Скидка 15% при оплате за семестр"]
    },
    {
      id: 3,
      name: "Премиум",
      description: "Комплексная подготовка для достижения высоких результатов",
      features: ["Индивидуальный подход", "Доступ к записям уроков", "Регулярные домашние задания", "Еженедельное тестирование", "Индивидуальные консультации", "Разработка персонального плана", "Приоритетная поддержка"],
      price: 45000,
      priceUnit: "тг/месяц",
      subjectCount: 3,
      lessonsPerMonth: 12,
      additionalFeatures: ["Скидка 20% при оплате за семестр", "Бесплатные пробные тесты ЕНТ"]
    }
  ];
  
  const promotions = [
    {
      title: "Приведи друга",
      description: "Приведите друга и получите скидку 10% на следующий месяц обучения.",
      icon: "lucide:users"
    },
    {
      title: "Раннее бронирование",
      description: "Оформите подписку на следующий учебный год до 1 августа и получите скидку 15%.",
      icon: "lucide:calendar"
    },
    {
      title: "Семейная скидка",
      description: "10% скидка на каждого ребенка при обучении двух и более детей из одной семьи.",
      icon: "lucide:heart"
    }
  ];
  
  return (
    <>
      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      <main>
        {/* Hero Section */}
        <section className="bg-content1 pt-16 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Наши курсы</h1>
              <p className="text-lg text-foreground-600 mb-8">
                Выберите подходящий формат обучения для достижения ваших образовательных целей. Мы предлагаем различные пакеты для учеников всех уровней.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card 
                    className={`h-full overflow-visible ${pkg.popular ? 'border-2 border-primary shadow-lg' : ''}`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-0 right-0 flex justify-center">
                        <Chip color="primary" variant="solid" className="shadow-md">
                          Популярный выбор
                        </Chip>
                      </div>
                    )}
                    <CardHeader className="flex flex-col gap-2 pb-0">
                      <h2 className="text-2xl font-bold">{pkg.name}</h2>
                      <p className="text-foreground-500">{pkg.description}</p>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">{pkg.price.toLocaleString()}</span>
                        <span className="text-foreground-500"> {pkg.priceUnit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-foreground-500 mt-1">
                        <span>До {pkg.subjectCount} предметов</span>
                        <span>•</span>
                        <span>{pkg.lessonsPerMonth} занятий в месяц</span>
                      </div>
                    </CardHeader>
                    <CardBody className="pb-6">
                      <div className="mt-4 mb-6">
                        <ul className="space-y-3">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Icon 
                                icon="lucide:check-circle" 
                                className="text-success mr-2 mt-0.5" 
                                width={16}
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {pkg.additionalFeatures && (
                          <div className="mt-4 pt-4 border-t border-divider">
                            <p className="font-medium mb-2">Дополнительно:</p>
                            <ul className="space-y-2">
                              {pkg.additionalFeatures.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <Icon 
                                    icon="lucide:star" 
                                    className="text-secondary mr-2 mt-0.5" 
                                    width={16}
                                  />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Button 
                        color={pkg.popular ? "primary" : "default"}
                        variant={pkg.popular ? "solid" : "bordered"}
                        onPress={() => setIsModalOpen(true)}
                        className="w-full"
                        size="lg"
                      >
                        Выбрать план
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Subjects Section */}
        <section className="py-20 bg-content1">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Доступные предметы</h2>
              <p className="max-w-2xl mx-auto text-foreground-600">
                Мы предлагаем обучение по всем основным школьным предметам. Наши преподаватели — эксперты в своих областях.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                {name: "Математика", icon: "lucide:calculator"},
    {name: "Физика", icon: "lucide:atom"},
    {name: "Химия", icon: "lucide:flask-conical"},
    {name: "Биология", icon: "lucide:microscope"},
    {name: "История", icon: "lucide:book-open"},
    {name: "География", icon: "lucide:globe"},
    {name: "Казахский язык", icon: "lucide:languages"},
    {name: "Русский язык", icon: "lucide:book-text"},
    {name: "Английский язык", icon: "lucide:languages"},
    {name: "Информатика", icon: "lucide:code"},
    {name: "Литература", icon: "lucide:book-marked"},
    {name: "Подготовка к ЕНТ", icon: "lucide:graduation-cap"}

                
              ].map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-background rounded-lg p-4 text-center"
                >
                  <Icon icon={subject.icon} className="text-primary mx-auto mb-3" width={32} height={32} />
                  <p className="font-medium">{subject.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Promotions Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Акции и специальные предложения</h2>
              <p className="max-w-2xl mx-auto text-foreground-600">
                Мы предлагаем различные скидки и специальные программы, чтобы сделать качественное образование более доступным.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {promotions.map((promo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardBody className="p-6 flex flex-col items-center text-center">
                      <div className="bg-secondary/10 p-4 rounded-full mb-4">
                        <Icon icon={promo.icon} width={32} height={32} className="text-secondary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{promo.title}</h3>
                      <p className="text-foreground-600">{promo.description}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-content1">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
              <p className="max-w-2xl mx-auto text-foreground-600">
                Ответы на самые распространенные вопросы о наших курсах и методике обучения.
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "Как проходят занятия?",
                  answer: "Занятия проходят онлайн через платформу Zoom. Каждое занятие длится 60-90 минут в зависимости от предмета и уровня сложности. Все уроки записываются, и у учеников есть доступ к этим записям для повторения материала."
                },
                {
                  question: "Могу ли я сменить преподавателя?",
                  answer: "Да, мы понимаем, что между учеником и учителем важно взаимопонимание. Если вы чувствуете, что текущий преподаватель вам не подходит, мы с радостью предложим другого специалиста."
                },
                {
                  question: "Как оценивается прогресс ученика?",
                  answer: "Мы регулярно проводим тестирования для оценки прогресса. Кроме того, преподаватели ведут подробную статистику по каждому ученику, отслеживая успехи и выявляя области, требующие дополнительного внимания."
                },
                {
                  question: "Можно ли заниматься только в определенные периоды (например, перед экзаменами)?",
                  answer: "Да, мы предлагаем гибкие варианты обучения. Вы можете выбрать как регулярные занятия в течение всего учебного года, так и интенсивные курсы в период подготовки к экзаменам или контрольным работам."
                },
                {
                  question: "Что делать, если я пропустил занятие?",
                  answer: "Все занятия записываются, и вы всегда можете просмотреть пропущенный урок. Кроме того, мы предлагаем дополнительные консультации для разбора вопросов по пропущенному материалу."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="mb-4">
                    <CardBody className="p-6">
                      <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                      <p className="text-foreground-600">{faq.answer}</p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-6">Готовы начать обучение?</h2>
              <p className="mb-8 opacity-90">
                Оставьте заявку сейчас и получите бесплатную консультацию с нашим методистом, который поможет выбрать оптимальную программу обучения.
              </p>
              <Button 
                color="secondary" 
                size="lg"
                onPress={() => setIsModalOpen(true)}
                // ИСПРАВЛЕНИЕ 2: Добавлены классы для переноса текста
                className="font-medium text-foreground-800 whitespace-normal h-auto"
              >
                Записаться на бесплатную консультацию
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <RequestFormModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default Courses;