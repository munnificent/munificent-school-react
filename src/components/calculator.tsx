import React, { useState, useMemo } from 'react';
import { Card, CardBody, Select, SelectItem, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { classOptions, subjectOptions, lessonCountOptions } from '../data/mock-data';

// --- Конфигурация калькулятора ---
const CALCULATOR_CONFIG = {
  BASE_PRICE: 3750,
  ENT_MULTIPLIER: 1.2,
  EDUCATION_TYPES: {
    SCHOOL: 'school',
    ENT: 'ent',
  },
};

interface CalculatorProps {
  onOpenModal: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onOpenModal }) => {
  // Используем простые строки для одиночного выбора и Set для множественного
  const [educationType, setEducationType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState(new Set<string>());
  const [lessonCount, setLessonCount] = useState('');

  // Оптимизированная логика расчета цены
  const calculatedPrice = useMemo(() => {
    const lessonCountNum = Number(lessonCount);
    const subjectCount = selectedSubjects.size;

    if (!educationType || !selectedClass || subjectCount === 0 || !lessonCountNum) {
      return null;
    }

    const price = CALCULATOR_CONFIG.BASE_PRICE * lessonCountNum * subjectCount;
    const multiplier = educationType === CALCULATOR_CONFIG.EDUCATION_TYPES.ENT 
      ? CALCULATOR_CONFIG.ENT_MULTIPLIER 
      : 1;

    return price * multiplier;
  }, [educationType, selectedClass, selectedSubjects, lessonCount]);
  
  // Хендлеры для обновления состояния (извлекаем одно значение из Set)
  const handleSingleSelection = (setter: React.Dispatch<React.SetStateAction<string>>) => (keys: unknown) => {
    const value = Array.from(keys as Set<string>)[0] || '';
    setter(value);
  };

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
                
                {/* Шаг 1: Тип обучения */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 1: Выберите тип обучения</h3>
                  <Select
                    label="Тип обучения"
                    placeholder="Выберите тип обучения" 
                    selectedKeys={educationType ? [educationType] : []}
                    onSelectionChange={handleSingleSelection(setEducationType)}
                  >
                    <SelectItem key={CALCULATOR_CONFIG.EDUCATION_TYPES.SCHOOL}>Школьная программа (1-11 класс)</SelectItem>
                    <SelectItem key={CALCULATOR_CONFIG.EDUCATION_TYPES.ENT}>Подготовка к ЕНТ</SelectItem>
                  </Select>
                </div>
                
                {/* Шаг 2: Класс */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 2: Выберите класс</h3>
                  <Select 
                    label="Класс"
                    placeholder="Выберите класс" 
                    selectedKeys={selectedClass ? [selectedClass] : []}
                    onSelectionChange={handleSingleSelection(setSelectedClass)}
                    isDisabled={!educationType}
                  >
                    {classOptions.map((option) => (
                      <SelectItem key={option} textValue={option}>{option}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                {/* Шаг 3: Предметы */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 3: Выберите предметы</h3>
                  <Select 
                    label="Предметы"
                    placeholder="Выберите предметы"
                    selectedKeys={selectedSubjects}
                    onSelectionChange={(keys) => setSelectedSubjects(keys as Set<string>)}
                    isDisabled={!selectedClass}
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
                
                {/* Шаг 4: Количество занятий */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 4: Количество занятий в месяц</h3>
                  <Select 
                    label="Количество занятий"
                    placeholder="Выберите количество занятий"
                    selectedKeys={lessonCount ? [lessonCount] : []}
                    onSelectionChange={handleSingleSelection(setLessonCount)}
                    isDisabled={selectedSubjects.size === 0}
                  >
                    {lessonCountOptions.map((option) => (
                      <SelectItem key={option} textValue={String(option)}>{option}</SelectItem>
                    ))}
                  </Select>
                </div>
                
                {/* Итоговая стоимость */}
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