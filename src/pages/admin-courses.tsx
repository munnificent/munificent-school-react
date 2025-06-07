import React from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input,
  Divider,
  Chip
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { courses } from '../data/mock-data';

const AdminCourses: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Курсы</h1>
        <p className="text-foreground-500 mt-2">
          Управление курсами и учебными программами
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Поиск курсов..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
            clearable
          />
        </div>
        
        <Button color="primary" startContent={<Icon icon="lucide:plus" width={16} height={16} />}>
          Добавить курс
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} isPressable>
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-foreground-500">{course.teacher.name}</p>
                </div>
                <Button isIconOnly size="sm" variant="light">
                  <Icon icon="lucide:more-vertical" width={16} height={16} />
                </Button>
              </div>
              
              <Divider className="my-3" />
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:users" width={14} height={14} className="text-foreground-500" />
                  <span>12 учеников</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:calendar" width={14} height={14} className="text-foreground-500" />
                  <span>8 уроков</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminCourses;