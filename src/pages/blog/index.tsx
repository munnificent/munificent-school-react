import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardFooter, Button, Select, SelectItem, Spinner, Input } from '@heroui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import RequestFormModal from '../../components/request-form-modal';
import apiClient from '../../api/apiClient';
import { BlogPost, BlogCategory } from '../../types';

const Blog: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка постов при изменении фильтров
  const fetchPosts = useCallback(async () => {
    if (!selectedCategory) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "Все") {
        params.append('category__name', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      const postsResponse = await apiClient.get(`/blog/posts/?${params.toString()}`);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  // Загрузка категорий (один раз)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await apiClient.get('/blog/categories/');
        setCategories([{ id: 0, name: "Все", slug: "all" }, ...categoriesResponse.data]);
        setSelectedCategory("Все");
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Запускаем загрузку постов, когда меняются фильтры
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main>
        {/* Секция 1: Шапка страницы (Hero) */}
        <section className="bg-content1 pt-16 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Блог Munificent School</h1>
              <p className="text-lg text-foreground-600 mb-8">
                Полезные материалы, советы экспертов и новости из мира образования для учеников и родителей.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Секция 2: Список постов с фильтрами */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Фильтры и поиск */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 justify-between">
              <Select
                label="Категория"
                selectedKeys={selectedCategory ? new Set([selectedCategory]) : new Set()}
                onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                className="max-w-xs"
                isDisabled={categories.length === 0}
              >
                {categories.map((category) => (
                  <SelectItem key={category.name} textValue={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
              
              <Input
                  placeholder="Поиск статей..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Icon icon="lucide:search" width={18} height={18} className="text-foreground-500" />}
                  onClear={() => setSearchQuery("")}
                  isClearable
                  className="max-w-md w-full"
              />
            </div>
            
            {/* Сетка постов */}
            {isLoading ? (
              <div className="text-center py-16"><Spinner size="lg" label="Загрузка статей..." /></div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card isHoverable className="h-full">
                      <CardBody className="p-0">
                        <div className="relative h-48 overflow-hidden">
                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                            <div className="absolute top-2 left-2">
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">{post.category_name}</span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-semibold mb-2 line-clamp-2 flex-grow">{post.title}</h3>
                          <p className="text-foreground-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center gap-2 text-sm text-foreground-500 mt-auto">
                            <span>{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                            <span>•</span>
                            <span>{post.author_name}</span>
                          </div>
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0 pb-6 px-6">
                        <Button as={RouterLink} to={`/blog/${post.id}`} color="primary" variant="light" endContent={<Icon icon="lucide:arrow-right" width={16} height={16} />}>
                          Читать статью
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Icon icon="lucide:search-x" width={48} height={48} className="text-foreground-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Статьи не найдены</h3>
                <p className="text-foreground-500 mb-6">
                  По вашему запросу не найдено статей. Попробуйте изменить параметры поиска.
                </p>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedCategory("Все");
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Секция 3: Подписка на рассылку */}
        <section className="py-20 bg-content1">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6">Будьте в курсе новостей образования</h2>
                <p className="text-foreground-600 mb-8">
                  Подпишитесь на нашу рассылку и получайте новые статьи, советы экспертов и полезные материалы для учебы.
                </p>
                <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <Input
                    type="email"
                    placeholder="Ваш email"
                    aria-label="Email для подписки"
                  />
                  <Button type="submit" color="primary">
                    Подписаться
                  </Button>
                </form>
              </motion.div>
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