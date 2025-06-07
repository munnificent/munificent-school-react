import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button, Divider, Card, CardBody, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import RequestFormModal from '../../components/request-form-modal';
import apiClient from '../../api/apiClient';
import { BlogPost } from '../../types';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/blog/posts/${id}/`);
        setPost(response.data);

        // Загружаем похожие статьи
        if (response.data.category) {
            const relatedResponse = await apiClient.get(`/blog/posts/?category=${response.data.category}&exclude_id=${id}`);
            setRelatedPosts(relatedResponse.data.slice(0, 3));
        }
      } catch (err) {
        setError("Статья не найдена или произошла ошибка.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Header onOpenModal={() => setIsModalOpen(true)} />
        <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" label="Загрузка статьи..." /></div>
        <Footer />
      </>
    );
  }
  
  if (error || !post) {
    return (
      <>
        <Header onOpenModal={() => setIsModalOpen(true)} />
        <div className="min-h-[60vh] flex items-center justify-center">
            {/* ... код для "Статья не найдена" ... */}
        </div>
        <Footer />
      </>
    );
  }
  
  // Статичный список категорий для сайдбара, как было в моковых данных
  const sidebarCategories = ['ЕНТ', 'Обучение', 'Родителям', 'Математика', 'Физика', 'Языки'];

  return (
    <>
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8"
            >
              <div className="flex items-center gap-2 text-sm mb-6">
                <RouterLink to="/" className="text-foreground-500 hover:text-primary">Главная</RouterLink>
                <Icon icon="lucide:chevron-right" width={14} height={14} className="text-foreground-400" />
                <RouterLink to="/blog" className="text-foreground-500 hover:text-primary">Блог</RouterLink>
                <Icon icon="lucide:chevron-right" width={14} height={14} className="text-foreground-400" />
                <span className="text-foreground-700">{post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}</span>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">{post.category_name}</span>
                  <span className="text-foreground-500 text-sm">{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon icon="lucide:user" width={20} height={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{post.author_name}</p>
                    <p className="text-sm text-foreground-500">Преподаватель</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden mb-8">
                <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover" />
              </div>
              
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <div className="mt-8">
                <Button as={RouterLink} to="/blog" variant="flat" color="primary" startContent={<Icon icon="lucide:arrow-left" width={16} height={16} />}>
                  Вернуться к блогу
                </Button>
              </div>
            </motion.div>
            
            {/* === ВОССТАНОВЛЕННЫЙ САЙДБАР === */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4"
            >
              <Card className="mb-8">
                <CardBody className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon icon="lucide:user" width={32} height={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{post.author_name}</h3>
                    <p className="text-primary font-medium text-sm mb-4">Преподаватель Munificent School</p>
                    <p className="text-sm text-foreground-600">Эксперт в области образования с многолетним опытом преподавания и подготовки к экзаменам.</p>
                  </div>
                </CardBody>
              </Card>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Похожие статьи</h3>
                <div className="space-y-4">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map(relatedPost => (
                      <div key={relatedPost.id} className="flex gap-3">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img src={relatedPost.image_url} alt={relatedPost.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <RouterLink to={`/blog/${relatedPost.id}`} className="font-medium hover:text-primary transition-colors line-clamp-2">{relatedPost.title}</RouterLink>
                          <p className="text-xs text-foreground-500 mt-1">{new Date(relatedPost.created_at).toLocaleDateString('ru-RU')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-foreground-500 text-sm">Похожих статей не найдено</p>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Категории</h3>
                <div className="flex flex-wrap gap-2">
                  {sidebarCategories.map(category => (
                    <RouterLink 
                      key={category} 
                      to={`/blog?category=${encodeURIComponent(category)}`}
                      className={`px-3 py-1 rounded-md text-sm ${category === post.category_name ? 'bg-primary text-primary-foreground' : 'bg-content2 text-foreground-700 hover:bg-content3'}`}
                    >
                      {category}
                    </RouterLink>
                  ))}
                </div>
              </div>
              
              <Card className="bg-primary text-primary-foreground">
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Нужна помощь с учебой?</h3>
                  <p className="mb-4 opacity-90">Наши преподаватели помогут разобраться в сложных темах и подготовиться к экзаменам.</p>
                  <Button onPress={() => setIsModalOpen(true)} color="secondary" className="w-full font-medium">
                    Оставить заявку
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
      <RequestFormModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default BlogDetail;