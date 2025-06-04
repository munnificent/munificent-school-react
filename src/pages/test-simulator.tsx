import React from 'react';
import { 
  Button, 
  Card, 
  CardBody, 
  RadioGroup, 
  Radio, 
  Progress
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { testQuestions } from '../data/mock-data';

type TestSimulatorState = 'select' | 'test' | 'results';

const TestSimulator: React.FC = () => {
  const [state, setState] = React.useState<TestSimulatorState>('select');
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const [timer, setTimer] = React.useState(3600); // 60 minutes in seconds
  const [testResult, setTestResult] = React.useState({ correct: 0, total: 0 });
  
  // Timer functionality
  React.useEffect(() => {
    if (state !== 'test') return;
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Calculate results when time is up
          calculateResults();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setState('test');
    // Reset state for new test
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimer(3600);
  };
  
  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (selectedSubject ? testQuestions[selectedSubject].length - 1 : 0)) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };
  
  const calculateResults = () => {
    if (!selectedSubject) return;
    
    const questions = testQuestions[selectedSubject];
    let correctCount = 0;
    
    Object.entries(answers).forEach(([questionIdx, answerIdx]) => {
      const questionIndex = parseInt(questionIdx);
      const question = questions[questionIndex];
      
      if (question.correctOptionIndex === answerIdx) {
        correctCount++;
      }
    });
    
    setTestResult({
      correct: correctCount,
      total: questions.length
    });
    
    setState('results');
  };
  
  const restartTest = () => {
    setState('select');
    setSelectedSubject(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimer(3600);
  };
  
  // Render based on current state
  const renderContent = () => {
    switch (state) {
      case 'select':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Пробные тесты ЕНТ</h1>
              <p className="text-foreground-500">
                Выберите предмет, по которому хотите пройти тестирование.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(testQuestions).map((subject, index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    isPressable 
                    isHoverable
                    onPress={() => handleSubjectSelect(subject)}
                    className="h-full"
                  >
                    <CardBody className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="p-3 rounded-full bg-primary/10 mb-4">
                        <Icon 
                          icon={subject === 'Математика' ? 'lucide:calculator' : 'lucide:atom'} 
                          width={24} 
                          height={24} 
                          className="text-primary" 
                        />
                      </div>
                      <h3 className="text-xl font-semibold">{subject}</h3>
                      <p className="text-foreground-500 mt-2">
                        {testQuestions[subject].length} вопросов • 60 минут
                      </p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 'test':
        if (!selectedSubject) return null;
        
        const questions = testQuestions[selectedSubject];
        const currentQuestion = questions[currentQuestionIndex];
        
        return (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold">{selectedSubject}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1 bg-content2 rounded-full">
                  <Icon icon="lucide:clock" width={18} height={18} className="text-foreground-500" />
                  <span className={`font-medium ${timer < 300 ? 'text-danger' : ''}`}>
                    {formatTime(timer)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-1 bg-content2 rounded-full">
                  <span className="font-medium text-primary">
                    Вопрос {currentQuestionIndex + 1} из {questions.length}
                  </span>
                </div>
              </div>
            </div>
            
            <Progress 
              value={(currentQuestionIndex + 1) / questions.length * 100} 
              className="h-2 mb-8"
              color="primary"
            />
            
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
                
                <RadioGroup
                  value={answers[currentQuestionIndex]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="gap-4"
                >
                  {currentQuestion.options.map((option, index) => (
                    <Radio key={index} value={index.toString()}>
                      {option}
                    </Radio>
                  ))}
                </RadioGroup>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    color="primary"
                    onPress={handleNextQuestion}
                    endContent={<Icon icon="lucide:arrow-right" width={16} height={16} />}
                    isDisabled={answers[currentQuestionIndex] === undefined}
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        );
        
      case 'results':
        const percentage = (testResult.correct / testResult.total) * 100;
        let resultColor = 'danger';
        let resultMessage = 'Требуется серьезная подготовка';
        
        if (percentage >= 80) {
          resultColor = 'success';
          resultMessage = 'Отличный результат!';
        } else if (percentage >= 60) {
          resultColor = 'primary';
          resultMessage = 'Хороший результат!';
        } else if (percentage >= 40) {
          resultColor = 'warning';
          resultMessage = 'Есть над чем поработать';
        }
        
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <Card>
              <CardBody className="p-8 text-center">
                <div className="mb-4">
                  <Icon 
                    icon={percentage >= 60 ? "lucide:award" : "lucide:clipboard-check"} 
                    width={64} 
                    height={64} 
                    className={`text-${resultColor} mx-auto`} 
                  />
                </div>
                
                <h1 className="text-3xl font-bold mb-2">Тест завершен!</h1>
                <p className="text-foreground-500 mb-6">{resultMessage}</p>
                
                <div className="mb-8">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {testResult.correct} / {testResult.total}
                  </div>
                  <p className="text-foreground-500">Правильных ответов</p>
                </div>
                
                <Button 
                  color="primary" 
                  size="lg"
                  onPress={restartTest}
                  startContent={<Icon icon="lucide:rotate-ccw" width={18} height={18} />}
                >
                  Вернуться к тестам
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        );
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-8"
    >
      {renderContent()}
    </motion.div>
  );
};

export default TestSimulator;