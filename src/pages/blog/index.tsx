import React from 'react';
import { Card, CardBody, CardFooter, Button, Select, SelectItem } from '@heroui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import RequestFormModal from '../../components/request-form-modal';
import { blogPosts, blogCategories } from '../../data/blog-data';

const Blog: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(new Set(["Все"]));
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Filter posts based on category and search query
  const filteredPosts = React.useMemo(() => {
    const category = Array.from(selectedCategory)[0];
    
    return blogPosts.filter(post => {
      // Filter by category
      const categoryMatch = category === "Все" || post.category === category;
      
      // Filter by search query
      const searchMatch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
        
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);
  
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
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Блог Munificent School</h1>
              <p className="text-lg text-foreground-600 mb-8">
                Полезные материалы, советы экспертов и новости из мира образования для учеников и родителей.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Blog Posts */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Filter and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 justify-between">
              <Select
                label="Категория"
                selectedKeys={selectedCategory}
                onSelectionChange={setSelectedCategory as any}
                className="max-w-xs"
              >
                {blogCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
              
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Поиск статей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Icon icon="lucide:search" width={18} height={18} className="text-foreground-500" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Icon icon="lucide:x" width={16} height={16} className="text-foreground-500" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Blog Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-md">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <CardBody className="p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-foreground-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-sm text-foreground-500 mt-auto">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0 pb-6 px-6">
                        <Button
                          as={RouterLink}
                          to={`/blog/${post.id}`}
                          color="primary"
                          variant="light"
                          endContent={<Icon icon="lucide:arrow-right" width={16} height={16} />}
                        >
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
                    setSelectedCategory(new Set(["Все"]));
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Subscribe Section */}
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
                
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Ваш email"
                    className="flex-grow px-4 py-2 rounded-lg border border-divider focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <Button color="primary">
                    Подписаться
                  </Button>
                </div>
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