import React from 'react';
import { Card, CardBody, Select, SelectItem, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { classOptions, subjectOptions, lessonCountOptions } from '../data/mock-data';

interface CalculatorProps {
  onOpenModal: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onOpenModal }) => {
  const [selectedEducationType, setSelectedEducationType] = React.useState(new Set([]));
  const [selectedClass, setSelectedClass] = React.useState(new Set([]));
  const [selectedSubjects, setSelectedSubjects] = React.useState<Set<string>>(new Set([]));
  const [selectedLessonCount, setSelectedLessonCount] = React.useState(new Set([]));
  
  // Calculate price based on selections
  const calculatedPrice = React.useMemo(() => {
    if (selectedEducationType.size === 0 || selectedClass.size === 0 || selectedSubjects.size === 0 || selectedLessonCount.size === 0) {
      return null;
    }
    
    const basePrice = 3750; // Base price per lesson
    const lessonCount = Number(Array.from(selectedLessonCount)[0]);
    const subjectCount = selectedSubjects.size;
    const educationType = Array.from(selectedEducationType)[0];
    
    // Apply multipliers based on education type
    let multiplier = 1;
    if (educationType === 'ент') {
      multiplier = 1.2; // ENT preparation costs 20% more
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
                    placeholder="Выберите тип обучения" 
                    selectedKeys={selectedEducationType}
                    onSelectionChange={setSelectedEducationType as any}
                  >
                    <SelectItem key="школа" value="школа">Школьная программа (1-11 класс)</SelectItem>
                    <SelectItem key="ент" value="ент">Подготовка к ЕНТ</SelectItem>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 2: Выберите класс</h3>
                  <Select 
                    placeholder="Выберите класс" 
                    selectedKeys={selectedClass}
                    onSelectionChange={setSelectedClass as any}
                    isDisabled={selectedEducationType.size === 0}
                  >
                    {classOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Шаг 3: Выберите предметы</h3>
                  <Select 
                    placeholder="Выберите предметы"
                    selectedKeys={selectedSubjects}
                    onSelectionChange={setSelectedSubjects as any}
                    isDisabled={selectedClass.size === 0}
                    selectionMode="multiple"
                    classNames={{
                      value: "line-clamp-1"
                    }}
                  >
                    {subjectOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
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
                    placeholder="Выберите количество занятий"
                    selectedKeys={selectedLessonCount}
                    onSelectionChange={setSelectedLessonCount as any}
                    isDisabled={selectedSubjects.size === 0}
                  >
                    {lessonCountOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
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