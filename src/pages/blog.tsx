// Adding a Blog page for completeness

import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Link as RouteLink } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import RequestFormModal from '../components/request-form-modal';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

const Blog: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 эффективных способов подготовки к ЕНТ",
      excerpt: "Изучите проверенные методики, которые помогут вам максимально эффективно подготовиться к ЕНТ и получить высокие баллы.",
      author: "Айгерим Нурсултанова",
      date: "15 сентября 2023",
      category: "подготовка к ЕНТ",
      imageUrl: "https://img.heroui.chat/image/book?w=800&h=500&u=1",
      readTime: "7 мин"
    },
    {
      id: 2,
      title: "Как развить навыки критического мышления у школьников",
      excerpt: "Критическое мышление — один из ключевых навыков XXI века. Узнайте, как помочь ребенку развить его.",
      author: "Данияр Серикулы",
      date: "10 сентября 2023",
      category: "педагогика",
      imageUrl: "https://img.heroui.chat/image/ai?w=800&h=500&u=2",
      readTime: "5 мин"
    },
    {
      id: 3,
      title: "Математика вокруг нас: как объяснить ребенку сложные концепции через повседневные примеры",
      excerpt: "Практические советы, как превратить изучение математики в увлекательное исследование окружающего мира.",
      author: "Асель Кенжебаева",
      date: "5 сентября 2023",
      category: "математика",
      imageUrl: "https://img.heroui.chat/image/ai?w=800&h=500&u=3",
      readTime: "6 мин"
    },
    {
      id: 4,
      title: "5 причин, почему онлайн-обучение эффективнее традиционного",
      excerpt: "Разбираемся в преимуществах онлайн-формата и почему он может быть более подходящим для современных школьников.",
      author: "Арман Токаев",
      date: "1 сентября 2023",
      category: "образование",
      imageUrl: "https://img.heroui.chat/image/ai?w=800&h=500&u=4",
      readTime: "8 мин"
    },
    {
      id: 5,
      title: "Как правильно составить план подготовки к экзаменам",
      excerpt: "Структурированный подход к подготовке поможет избежать стресса и достичь лучших результатов.",
      author: "Алия Касымова",
      date: "25 августа 2023",
      category: "методика",
      imageUrl: "https://img.heroui.chat/image/ai?w=800&h=500&u=5",
      readTime: "6 мин"
    },
    {
      id: 6,
      title: "Неврологические основы обучения: как работает наш мозг",
      excerpt: "Понимание принципов работы мозга поможет оптимизировать процесс обучения и повысить его эффективность.",
      author: "Бауыржан Темиров",
      date: "20 августа 2023",
      category: "нейронаука",
      imageUrl: "https://img.heroui.chat/image/ai?w=800&h=500&u=6",
      readTime: "9 мин"
    }
  ];
  
  const categories = ["Все", "подготовка к ЕНТ", "педагогика", "математика", "образование", "методика", "нейронаука"];
  
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
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Наш блог</h1>
              <p className="text-lg text-foreground-600 mb-8">
                Полезные статьи о современных методиках обучения, советы по подготовке к экзаменам
                и другие образовательные материалы от наших экспертов.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-8 bg-background border-b border-divider sticky top-0 z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Chip
                  key={index}
                  variant={index === 0 ? "solid" : "flat"}
                  color={index === 0 ? "primary" : "default"}
                  className="cursor-pointer"
                >
                  {category}
                </Chip>
              ))}
            </div>
          </div>
        </section>
        
        {/* Blog Posts Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card isPressable isHoverable className="h-full">
                    <CardBody className="p-0 flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <Chip 
                          className="absolute top-4 left-4" 
                          color="primary" 
                          variant="solid"
                          size="sm"
                        >
                          {post.category}
                        </Chip>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-foreground-500 mb-4 flex-1">{post.excerpt}</p>
                        <div className="flex justify-between items-center text-xs text-foreground-500 mt-2">
                          <div className="flex items-center">
                            <Icon icon="lucide:user" className="mr-1" width={14} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Icon icon="lucide:clock" className="mr-1" width={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-foreground-500">{post.date}</span>
                          <Button
                            as={RouteLink}
                            to={`/blog/${post.id}`}
                            variant="light"
                            color="primary"
                            endContent={<Icon icon="lucide:arrow-right" width={16} />}
                            size="sm"
                          >
                            Читать
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                color="primary"
                variant="bordered" 
                size="lg"
              >
                Загрузить еще
              </Button>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-2xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Подпишитесь на нашу рассылку</h2>
              <p className="mb-8 opacity-90">
                Получайте свежие образовательные материалы, советы экспертов и новости школы прямо на вашу электронную почту.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="rounded-lg px-4 py-3 flex-1 text-foreground border-none focus:ring-2 focus:ring-white/50"
                />
                <Button color="secondary" className="text-foreground-800 font-medium">
                  Подписаться
                </Button>
              </div>
            </div>
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

export default Blog;