import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button, Divider, Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import RequestFormModal from '../../components/request-form-modal';
import { blogPosts } from '../../data/blog-data';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Find the blog post by ID
  const post = blogPosts.find(post => post.id === parseInt(id));
  
  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post?.category && p.id !== post?.id)
    .slice(0, 3);
  
  if (!post) {
    return (
      <>
        <Header onOpenModal={() => setIsModalOpen(true)} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Icon icon="lucide:file-x" width={64} height={64} className="text-foreground-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Статья не найдена</h1>
            <p className="text-foreground-500 mb-6">
              К сожалению, запрашиваемая статья не существует или была удалена.
            </p>
            <Button
              as={RouterLink}
              to="/blog"
              color="primary"
              variant="flat"
              startContent={<Icon icon="lucide:arrow-left" width={16} height={16} />}
            >
              Вернуться к списку статей
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      <main>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8"
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm mb-6">
                <RouterLink to="/" className="text-foreground-500 hover:text-primary">
                  Главная
                </RouterLink>
                <Icon icon="lucide:chevron-right" width={14} height={14} className="text-foreground-400" />
                <RouterLink to="/blog" className="text-foreground-500 hover:text-primary">
                  Блог
                </RouterLink>
                <Icon icon="lucide:chevron-right" width={14} height={14} className="text-foreground-400" />
                <span className="text-foreground-700">{post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}</span>
              </div>
              
              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-md">
                    {post.category}
                  </span>
                  <span className="text-foreground-500 text-sm">{post.date}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon icon="lucide:user" width={20} height={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-sm text-foreground-500">Преподаватель</p>
                  </div>
                </div>
              </div>
              
              {/* Featured Image */}
              <div className="rounded-lg overflow-hidden mb-8">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Article Content */}
              <div 
                className="prose max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground-700 prose-a:text-primary prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Share Links */}
              <div className="mt-12 pt-8 border-t border-divider">
                <p className="font-medium mb-3">Поделиться статьей:</p>
                <div className="flex gap-3">
                  <button className="p-2 rounded-full bg-content2 hover:bg-content3 transition-colors">
                    <Icon icon="lucide:facebook" width={20} height={20} className="text-foreground-700" />
                  </button>
                  <button className="p-2 rounded-full bg-content2 hover:bg-content3 transition-colors">
                    <Icon icon="lucide:twitter" width={20} height={20} className="text-foreground-700" />
                  </button>
                  <button className="p-2 rounded-full bg-content2 hover:bg-content3 transition-colors">
                    <Icon icon="lucide:linkedin" width={20} height={20} className="text-foreground-700" />
                  </button>
                  <button className="p-2 rounded-full bg-content2 hover:bg-content3 transition-colors">
                    <Icon icon="lucide:mail" width={20} height={20} className="text-foreground-700" />
                  </button>
                </div>
              </div>
              
              {/* Back Button */}
              <div className="mt-8">
                <Button
                  as={RouterLink}
                  to="/blog"
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:arrow-left" width={16} height={16} />}
                >
                  Вернуться к блогу
                </Button>
              </div>
            </motion.div>
            
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4"
            >
              {/* Author Card */}
              <Card className="mb-8">
                <CardBody className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon icon="lucide:user" width={32} height={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{post.author}</h3>
                    <p className="text-foreground-500 text-sm mb-4">Преподаватель Munificent School</p>
                    <p className="text-sm text-foreground-600">
                      Эксперт в области образования с многолетним опытом преподавания и подготовки к экзаменам.
                    </p>
                  </div>
                </CardBody>
              </Card>
              
              {/* Related Posts */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Похожие статьи</h3>
                <div className="space-y-4">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map(relatedPost => (
                      <div key={relatedPost.id} className="flex gap-3">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <img 
                            src={relatedPost.imageUrl} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <RouterLink 
                            to={`/blog/${relatedPost.id}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {relatedPost.title}
                          </RouterLink>
                          <p className="text-xs text-foreground-500 mt-1">{relatedPost.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-foreground-500 text-sm">Похожих статей не найдено</p>
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Категории</h3>
                <div className="flex flex-wrap gap-2">
                  {['ЕНТ', 'Обучение', 'Родителям', 'Математика', 'Физика', 'Языки'].map(category => (
                    <RouterLink 
                      key={category} 
                      to={`/blog?category=${encodeURIComponent(category)}`}
                      className={`px-3 py-1 rounded-md text-sm ${
                        category === post.category 
                          ? 'bg-primary text-white' 
                          : 'bg-content2 text-foreground-700 hover:bg-content3'
                      }`}
                    >
                      {category}
                    </RouterLink>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <Card className="bg-primary text-white">
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Нужна помощь с учебой?</h3>
                  <p className="mb-4 opacity-90">
                    Наши преподаватели помогут разобраться в сложных темах и подготовиться к экзаменам.
                  </p>
                  <Button 
                    onPress={() => setIsModalOpen(true)} 
                    color="secondary"
                    className="w-full font-medium"
                  >
                    Оставить заявку
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <RequestFormModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default BlogDetail;