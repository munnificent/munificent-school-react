import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/header';
import HeroBanner from '../components/hero-banner';
import Advantages from '../components/advantages';
import TeachersSection from '../components/teachers-section';
import Calculator from '../components/calculator';
import ReviewsSection from '../components/reviews-section';
import Footer from '../components/footer';
import RequestFormModal from '../components/request-form-modal';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  return (
    <>
      {/* Header */}
      <Header onOpenModal={() => setIsModalOpen(true)} />
      
      {/* Hero Section */}
      <HeroBanner onOpenModal={() => setIsModalOpen(true)} />
      
      {/* Advantages Section */}
      <Advantages />
      
      {/* Teachers Section */}
      <TeachersSection />
      
      {/* Calculator Section */}
      <Calculator onOpenModal={() => setIsModalOpen(true)} />
      
      {/* Reviews Section */}
      <ReviewsSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Request Form Modal */}
      <RequestFormModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

export default LandingPage;