import React, { useState, useEffect } from 'react';
import { Card, CardBody, Avatar, Spinner } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { Review } from '../types';
// --- Типы и константы ---


const SECTION_CONTENT = {
  title: 'Им уже не страшно. Скоро и тебе не будет.',
};

// --- Под-компонент для карточки отзыва ---
const ReviewCard: React.FC<{ review: Review; index: number }> = ({ review, index }) => {
  const authorName = review.author.split(',')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardBody className="p-6 flex flex-col">
          <div className="mb-4 text-primary">
            <Icon icon="lucide:quote" width={32} height={32} />
          </div>
          <p className="mb-6 italic text-foreground-700 grow">"{review.text}"</p>
          <div className="flex items-center mt-auto">
            <Avatar
              name={authorName}
              size="md"
              color="primary"
            />
            <div className='ml-4'>
              <h4 className="font-semibold">{review.author}</h4>
              <p className="text-sm text-success font-medium">{review.scoreInfo}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// --- Основной компонент ---
export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.get<Review[]>('/reviews/');
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-20 bg-content1">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {SECTION_CONTENT.title}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;