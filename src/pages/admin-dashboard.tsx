import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Spinner,
  Button
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { useHistory } from 'react-router-dom';

// Типы для данных
interface Stats {
  students_count: number;
  teachers_count: number;
  courses_count: number;
  new_applications_count: number;
}

interface Application {
  id: number;
  name: string;
  phone: string;
  student_class: string;
  subject: string;
  created_at: string;
  status: 'new' | 'contacted' | 'registered' | 'archived';
}

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const [stats, setStats] = useState<Stats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, appsResponse] = await Promise.all([
          apiClient.get<Stats>('/users/admin-stats/'),
          apiClient.get<Application[]>('/applications/?limit=5') // Получаем 5 последних заявок
        ]);
        setStats(statsResponse.data);
        setApplications(appsResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusChip = (status: string) => {
    let color: "primary" | "warning" | "success" | "default" = "default";
    let label = "";

    switch (status) {
      case "new": color = "primary"; label = "Новая"; break;
      case "contacted": color = "warning"; label = "На связи"; break;
      case "registered": color = "success"; label = "Оформлен"; break;
      default: label = status;
    }

    return <Chip color={color} variant="flat" size="sm">{label}</Chip>;
  };
  
  const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: number | undefined, color: string }) => (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-${color}/10`}>
            <Icon icon={icon} width={24} height={24} className={`text-${color}`} />
          </div>
          <div>
            <p className="text-foreground-500 text-sm">{label}</p>
            <h3 className="text-2xl font-bold">{value ?? <Spinner size="sm" />}</h3>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-foreground-500 mt-2">Добро пожаловать в панель управления школой</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="lucide:users" label="Учеников" value={stats?.students_count} color="primary" />
        <StatCard icon="lucide:user-check" label="Преподавателей" value={stats?.teachers_count} color="success" />
        <StatCard icon="lucide:book-open" label="Курсов" value={stats?.courses_count} color="secondary" />
        <StatCard icon="lucide:file-text" label="Новых заявок" value={stats?.new_applications_count} color="warning" />
      </div>
      
      <Card>
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Последние заявки</h3>
            <Button variant="light" color="primary" onPress={() => history.push('/requests')}>
              Все заявки <Icon icon="lucide:arrow-right" />
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : (
            <Table aria-label="Таблица последних заявок" removeWrapper>
              <TableHeader>
                <TableColumn>ИМЯ</TableColumn>
                <TableColumn>ТЕЛЕФОН</TableColumn>
                <TableColumn>ПРЕДМЕТ</TableColumn>
                <TableColumn>ДАТА</TableColumn>
                <TableColumn>СТАТУС</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Новых заявок нет">
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{app.subject || 'Не указан'}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>{getStatusChip(app.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default AdminDashboard;