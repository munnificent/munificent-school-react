import React, { useState, useEffect, useCallback } from 'react';
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
  Input,
  Button,
  Select,
  SelectItem,
  Spinner,
  addToast
} from '@heroui/react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import apiClient from '../api/apiClient';
import { useDebounce } from '../hooks/useDebounce';

interface Application {
  id: number;
  name: string;
  phone: string;
  student_class: string;
  subject: string;
  created_at: string;
  status: 'new' | 'contacted' | 'registered' | 'archived';
}

const AdminRequests: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const response = await apiClient.get<Application[]>(`/applications/?${params.toString()}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      addToast({ title: "Ошибка", description: "Не удалось загрузить заявки", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await apiClient.patch(`/applications/${id}/`, { status: newStatus });
      addToast({ title: "Успешно", description: "Статус заявки обновлен", color: "success" });
      fetchApplications();
    } catch (error) {
      addToast({ title: "Ошибка", description: "Не удалось обновить статус", color: "danger" });
    }
  };
  
  const getStatusChip = (status: string) => {
    let color: "primary" | "warning" | "success" | "default" = "default";
    let label = "";
    
    switch(status) {
      case "new": color = "primary"; label = "Новая"; break;
      case "contacted": color = "warning"; label = "На связи"; break;
      case "registered": color = "success"; label = "Оформлен"; break;
      case "archived": color = "default"; label = "В архиве"; break;
    }
    
    return <Chip color={color} variant="flat" size="sm">{label}</Chip>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Заявки</h1>
        <p className="text-foreground-500 mt-2">Управление заявками на обучение</p>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <Input
              placeholder="Поиск по имени, телефону, предмету..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" width={16} height={16} className="text-foreground-500" />}
              isClearable
              className="flex-1 max-w-md"
            />
            <Select 
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys as Set<string>)[0])}
              className="w-full sm:w-40"
            >
              <SelectItem key="all">Все статусы</SelectItem>
              <SelectItem key="new">Новые</SelectItem>
              <SelectItem key="contacted">На связи</SelectItem>
              <SelectItem key="registered">Оформленные</SelectItem>
              <SelectItem key="archived">В архиве</SelectItem>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : (
            <Table aria-label="Таблица заявок" removeWrapper>
              <TableHeader>
                <TableColumn>ИМЯ</TableColumn>
                <TableColumn>ТЕЛЕФОН</TableColumn>
                <TableColumn>ПРЕДМЕТ</TableColumn>
                <TableColumn>ДАТА</TableColumn>
                <TableColumn>СТАТУС</TableColumn>
                <TableColumn>ДЕЙСТВИЯ</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Заявки не найдены.">
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{app.subject || "Не указан"}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>{getStatusChip(app.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="flat" onPress={() => updateStatus(app.id, 'contacted')}>Взят в работу</Button>
                        <Button size="sm" variant="flat" color="success" onPress={() => updateStatus(app.id, 'registered')}>Оформлен</Button>
                      </div>
                    </TableCell>
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

export default AdminRequests;