import React from 'react';
import { Link } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Header from '../components/header';
import Footer from '../components/footer';
import RequestFormModal from '../components/request-form-modal';

const AboutUs: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const teamMembers = [
    {
      name: "Асан Тасанов",
      role: "Основатель и директор",
      bio: "Магистр педагогических наук, 15 лет опыта в образовании. Создал Munificent School с целью сделать качественное образование доступным для всех.",
      photoUrl: "https://img.heroui.chat/image/avatar?w=300&h=300&u=7"
    },
    {
      name: "Айгерим Нурсултанова",
      role: "Руководитель программ по математике",
      bio: "Выпускница КазНУ с отличием, автор учебных пособий по подготовке к ЕНТ по математике. Подготовила более 200 учеников, получивших высокие баллы.",
      photoUrl: "https://img.heroui.chat/image/avatar?w=300&h=300&u=1"
    },
    {
      name: "Данияр Серикулы",
      role: "Старший преподаватель физики",
      bio: "Участник и призер международных олимпиад по физике, увлеченный педагог, умеющий объяснять сложные концепции через понятные примеры.",
      photoUrl: "https://img.heroui.chat/image/avatar?w=300&h=300&u=2"
    },
    {
      name: "Алия Касымова",
      role: "Руководитель языковых программ",
      bio: "Магистр филологии, специалист по методикам преподавания языков. Разработала уникальную программу обучения казахскому и английскому языкам.",
      photoUrl: "https://img.heroui.chat/image/avatar?w=300&h=300&u=3"
    }
  ];
  
  const achievements = [
    { value: "97%", label: "учеников улучшили свои оценки" },
    { value: "88%", label: "выпускников поступили в топ-вузы" },
    { value: "1500+", label: "успешно обученных студентов" },
    { value: "25+", label: "квалифицированных преподавателей" }
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
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">О нашей школе</h1>
              <p className="text-lg text-foreground-600 mb-8">
                Наша миссия — помогать ученикам раскрывать свой потенциал и достигать академических высот через индивидуальный подход к обучению.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://img.heroui.chat/image/ai?w=600&h=400&u=school_building" 
                    alt="Здание Munificent School" 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-lg shadow-lg">
                  <p className="font-bold">Основана в 2015 году</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6">Наша история</h2>
                <div className="space-y-4 text-foreground-700">
                  <p>
                    Munificent School была основана в 2015 году группой единомышленников, которые верили в то, что образование должно быть не только эффективным, но и увлекательным. Мы начали с небольшой группы из 30 учеников, которым помогали подготовиться к важным экзаменам.
                  </p>
                  <p>
                    За эти годы мы выросли в полноценный образовательный центр, который предлагает поддержку ученикам с 5 по 11 класс по всем основным предметам школьной программы, а также специализированную подготовку к ЕНТ.
                  </p>
                  <p>
                    Наш подход, основанный на индивидуальной работе с каждым учеником, позволил нам достичь впечатляющих результатов: 97% учеников улучшают свои оценки, а 88% выпускников поступают в топовые вузы страны и зарубежья.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold mb-2">{item.value}</div>
                  <div className="opacity-80">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Наши ценности</h2>
              <p className="max-w-2xl mx-auto text-foreground-600">
                Эти принципы лежат в основе нашего подхода к образованию и определяют всё, что мы делаем.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-content1 p-6 rounded-lg text-center"
              >
                <div className="bg-primary/10 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Icon icon="lucide:heart" width={32} height={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Индивидуальный подход</h3>
                <p className="text-foreground-600">
                  Мы признаем уникальность каждого ученика и адаптируем наши методики обучения под его особенности, интересы и темп обучения.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-content1 p-6 rounded-lg text-center"
              >
                <div className="bg-primary/10 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Icon icon="lucide:lightbulb" width={32} height={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Инновационные методики</h3>
                <p className="text-foreground-600">
                  Мы постоянно совершенствуем наши учебные программы, внедряя современные технологии и научно обоснованные подходы к обучению.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-content1 p-6 rounded-lg text-center"
              >
                <div className="bg-primary/10 p-4 rounded-full inline-flex items-center justify-center mb-4">
                  <Icon icon="lucide:shield" width={32} height={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Поддержка и доверие</h3>
                <p className="text-foreground-600">
                  Мы создаем безопасную и поддерживающую среду, где ученики не боятся ошибаться и могут свободно выражать свои мысли.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 bg-content1">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Наша команда</h2>
              <p className="max-w-2xl mx-auto text-foreground-600">
                Познакомьтесь с профессионалами, которые ежедневно помогают ученикам достигать новых высот.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background p-6 rounded-lg text-center"
                >
                  <img 
                    src={member.photoUrl} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-foreground-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-white"
            >
              <h2 className="text-3xl font-bold mb-6">Готовы начать образовательное путешествие с нами?</h2>
              <p className="mb-8 opacity-90">
                Запишитесь на бесплатную консультацию и узнайте, как мы можем помочь вашему ребенку раскрыть свой потенциал.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-primary font-medium py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Оставить заявку
                </button>
                <Link 
                  href="/courses"
                  className="border border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Узнать о курсах
                </Link>
              </div>
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

export default AboutUs;