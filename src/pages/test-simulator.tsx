import React, { useEffect, useReducer } from 'react';
import { Button, Card, CardBody, RadioGroup, Radio, Progress } from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { testQuestions } from '../data/mock-data';

// --- Типы и Конфигурация ---
type Screen = 'select' | 'test' | 'results';
type Action =
  | { type: 'START_TEST'; payload: string }
  | { type: 'ANSWER'; payload: { questionIndex: number; answerIndex: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_TEST' }
  | { type: 'RESTART' }
  | { type: 'TICK' };

interface State {
  screen: Screen;
  subject: string | null;
  questions: typeof testQuestions[string];
  currentIndex: number;
  answers: Record<number, number>;
  timer: number;
  result: { correct: number; total: number };
}

const TEST_DURATION = 3600; // 60 минут
const CONTENT = {
  title: "Пробные тесты ЕНТ",
  subtitle: "Выберите предмет, по которому хотите пройти тестирование.",
  questionLabel: "Вопрос",
  fromLabel: "из",
  nextButton: "Следующий вопрос",
  finishButton: "Завершить тест",
  resultsTitle: "Тест завершен!",
  correctAnswers: "Правильных ответов",
  restartButton: "Вернуться к тестам"
};

const getResultInfo = (percentage: number) => {
  if (percentage >= 80) return { color: 'success', message: 'Отличный результат!', icon: 'lucide:award' };
  if (percentage >= 60) return { color: 'primary', message: 'Хороший результат!', icon: 'lucide:award' };
  if (percentage >= 40) return { color: 'warning', message: 'Есть над чем поработать', icon: 'lucide:clipboard-check' };
  return { color: 'danger', message: 'Требуется серьезная подготовка', icon: 'lucide:clipboard-check' };
};


// --- Редьюсер для управления состоянием ---
const initialState: State = {
  screen: 'select',
  subject: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  timer: TEST_DURATION,
  result: { correct: 0, total: 0 },
};

function testReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_TEST':
      return { ...initialState, screen: 'test', subject: action.payload, questions: testQuestions[action.payload] };
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.payload.questionIndex]: action.payload.answerIndex } };
    case 'NEXT_QUESTION':
      if (state.currentIndex < state.questions.length - 1) {
        return { ...state, currentIndex: state.currentIndex + 1 };
      }
      return state; // Не изменяем состояние, если это последний вопрос
    case 'FINISH_TEST': {
      let correctCount = 0;
      Object.entries(state.answers).forEach(([qIdx, aIdx]) => {
        if (state.questions[parseInt(qIdx)].correctOptionIndex === aIdx) {
          correctCount++;
        }
      });
      return { ...state, screen: 'results', result: { correct: correctCount, total: state.questions.length } };
    }
    case 'RESTART':
      return initialState;
    case 'TICK':
      return { ...state, timer: state.timer > 0 ? state.timer - 1 : 0 };
    default:
      return state;
  }
}

// --- Компоненты Экранов ---

const SubjectSelectionScreen: React.FC<{ dispatch: React.Dispatch<Action> }> = ({ dispatch }) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-4">{CONTENT.title}</h1>
      <p className="text-foreground-500">{CONTENT.subtitle}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Object.keys(testQuestions).map((subject, index) => (
        <motion.div key={subject} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
          <Card isPressable isHoverable onPress={() => dispatch({ type: 'START_TEST', payload: subject })} className="h-full">
            <CardBody className="flex flex-col items-center justify-center p-6 text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Icon icon={subject === 'Математика' ? 'lucide:calculator' : 'lucide:atom'} width={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{subject}</h3>
              <p className="text-foreground-500 mt-2">{testQuestions[subject].length} вопросов • {TEST_DURATION / 60} минут</p>
            </CardBody>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const TestInProgressScreen: React.FC<{ state: State; dispatch: React.Dispatch<Action> }> = ({ state, dispatch }) => {
  const { subject, questions, currentIndex, timer, answers } = state;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      dispatch({ type: 'FINISH_TEST' });
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{subject}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1 bg-content2 rounded-full">
            <Icon icon="lucide:clock" width={18} className="text-foreground-500" />
            <span className={`font-medium ${timer < 300 ? 'text-danger' : ''}`}>{`${Math.floor(timer / 60).toString().padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1 bg-content2 rounded-full">
            <span className="font-medium text-primary">{CONTENT.questionLabel} {currentIndex + 1} {CONTENT.fromLabel} {questions.length}</span>
          </div>
        </div>
      </div>
      <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2 mb-8" color="primary" />
      <Card>
        <CardBody className="p-6">
          <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
          <RadioGroup value={answers[currentIndex]?.toString()} onValueChange={(v) => dispatch({ type: 'ANSWER', payload: { questionIndex: currentIndex, answerIndex: parseInt(v) } })} className="gap-4">
            {currentQuestion.options.map((option, index) => <Radio key={index} value={index.toString()}>{option}</Radio>)}
          </RadioGroup>
          <div className="mt-8 flex justify-end">
            <Button color="primary" onPress={handleNext} endContent={<Icon icon="lucide:arrow-right" />} isDisabled={answers[currentIndex] === undefined}>
              {isLastQuestion ? CONTENT.finishButton : CONTENT.nextButton}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const ResultsScreen: React.FC<{ state: State; dispatch: React.Dispatch<Action> }> = ({ state, dispatch }) => {
  const { result } = state;
  const percentage = (result.correct / result.total) * 100;
  const { color, message, icon } = getResultInfo(percentage);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-lg mx-auto">
      <Card>
        <CardBody className="p-8 text-center">
          <div className="mb-4">
            <Icon icon={icon} width={64} height={64} className={`text-${color} mx-auto`} />
          </div>
          <h1 className="text-3xl font-bold mb-2">{CONTENT.resultsTitle}</h1>
          <p className="text-foreground-500 mb-6">{message}</p>
          <div className="mb-8">
            <div className="text-4xl font-bold text-foreground mb-2">{result.correct} / {result.total}</div>
            <p className="text-foreground-500">{CONTENT.correctAnswers}</p>
          </div>
          <Button color="primary" size="lg" onPress={() => dispatch({ type: 'RESTART' })} startContent={<Icon icon="lucide:rotate-ccw" />}>
            {CONTENT.restartButton}
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// --- Основной компонент ---
const TestSimulator: React.FC = () => {
  const [state, dispatch] = useReducer(testReducer, initialState);

  useEffect(() => {
    if (state.screen !== 'test' || state.timer <= 0) return;
    const timerId = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(timerId);
  }, [state.screen, state.timer]);

  useEffect(() => {
    if(state.timer === 0 && state.screen === 'test') {
      dispatch({ type: 'FINISH_TEST' });
    }
  }, [state.timer, state.screen]);

  const renderScreen = () => {
    switch (state.screen) {
      case 'select': return <SubjectSelectionScreen dispatch={dispatch} />;
      case 'test': return <TestInProgressScreen state={state} dispatch={dispatch} />;
      case 'results': return <ResultsScreen state={state} dispatch={dispatch} />;
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="pb-8">
      {renderScreen()}
    </motion.div>
  );
};

export default TestSimulator;