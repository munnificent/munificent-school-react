import React, { useState, useMemo } from 'react';
import { Card, CardBody, Select, SelectItem, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { classOptions, subjectOptions, lessonCountOptions } from '../data/mock-data';

interface CalculatorProps {
  onOpenModal: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onOpenModal }) => {
  const [selectedEducationType, setSelectedEducationType] = useState<Set<string>>(new Set([]));
  const [selectedClass, setSelectedClass] = useState<Set<string>>(new Set([]));
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set([]));
  const [selectedLessonCount, setSelectedLessonCount] = useState<Set<string>>(new Set([]));
  
  const calculatedPrice = useMemo(() => {
    if (selectedEducationType.size === 0 || selectedClass.size === 0 || selectedSubjects.size === 0 || selectedLessonCount.size === 0) {
      return null;
    }
    const basePrice = 3750;
    const lessonCount = Number(Array.from(selectedLessonCount)[0]);
    const subjectCount = selectedSubjects.size;
    const educationType = Array.from(selectedEducationType)[0];
    let multiplier = 1;
    if (educationType === 'ент') {
      multiplier = 1.2;
    }
    return basePrice * lessonCount * subjectCount * multiplier;
  }, [selectedEducationType, selectedClass, selectedSubjects, selectedLessonCount]);

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Собери свой идеальный план подготовки.
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardBody className="p-8">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 1: Выберите тип обучения</h3>
                  <Select
                    label="Тип обучения" // ИСПРАВЛЕНИЕ: Добавлен label
                    placeholder="Выберите тип обучения" 
                    selectedKeys={selectedEducationType}
                    onSelectionChange={(keys) => setSelectedEducationType(keys as Set<string>)}
                  >
                    <SelectItem key="школа" textValue="Школьная программа (1-11 класс)">Школьная программа (1-11 класс)</SelectItem>
                    <SelectItem key="ент" textValue="Подготовка к ЕНТ">Подготовка к ЕНТ</SelectItem>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 2: Выберите класс</h3>
                  <Select 
                    label="Класс" // ИСПРАВЛЕНИЕ: Добавлен label
                    placeholder="Выберите класс" 
                    selectedKeys={selectedClass}
                    onSelectionChange={(keys) => setSelectedClass(keys as Set<string>)}
                    isDisabled={selectedEducationType.size === 0}
                  >
                    {classOptions.map((option) => (
                      <SelectItem key={option} textValue={option}>{option}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 3: Выберите предметы</h3>
                  <Select 
                    label="Предметы" // ИСПРАВЛЕНИЕ: Добавлен label
                    placeholder="Выберите предметы"
                    selectedKeys={selectedSubjects}
                    onSelectionChange={(keys) => setSelectedSubjects(keys as Set<string>)}
                    isDisabled={selectedClass.size === 0}
                    selectionMode="multiple"
                  >
                    {subjectOptions.map((option) => (
                      <SelectItem key={option} textValue={option}>{option}</SelectItem>
                    ))}
                  </Select>
                  {selectedSubjects.size > 0 && (
                    <p className="text-xs text-foreground-500 mt-1">
                      Выбрано предметов: {selectedSubjects.size}
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 4: Количество занятий в месяц</h3>
                  <Select 
                    label="Количество занятий" // ИСПРАВЛЕНИЕ: Добавлен label
                    placeholder="Выберите количество занятий"
                    selectedKeys={selectedLessonCount}
                    onSelectionChange={(keys) => setSelectedLessonCount(keys as Set<string>)}
                    isDisabled={selectedSubjects.size === 0}
                  >
                    {lessonCountOptions.map((option) => (
                      <SelectItem key={option} textValue={String(option)}>{option}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div className="mt-4 p-6 bg-content2 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Итоговая стоимость:</h3>
                  <p className="text-3xl font-bold text-primary mb-4">
                    {calculatedPrice ? `${calculatedPrice.toLocaleString()} тг / мес` : '—'}
                  </p>
                  <Button 
                    color="secondary"
                    onPress={onOpenModal}
                    className="font-medium text-foreground-800"
                    size="lg"
                    isDisabled={!calculatedPrice}
                  >
                    Узнать подробнее
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Calculator;