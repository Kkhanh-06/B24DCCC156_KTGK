import { Button, Card, Input, List, Checkbox, Space, Typography, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
// import { Todo } from '../../models/bai2'; // Assuming types are exported or we can redefine/infer

const { Text } = Typography;

const Bai2 = () => {
    const { todos, addTodo, deleteTodo, editTodo, toggleTodo } = useModel('bai2');
    const [inputValue, setInputValue] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEditId, setCurrentEditId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleAdd = () => {
        if (!inputValue.trim()) return;
        addTodo(inputValue);
        setInputValue('');
    };

    const handleDelete = (id: number) => {
        deleteTodo(id);
    };

    const showEditModal = (id: number, text: string) => {
        setCurrentEditId(id);
        setEditValue(text);
        setIsModalVisible(true);
    };

    const handleEditOk = () => {
        if (currentEditId !== null && editValue.trim()) {
            editTodo(currentEditId, editValue);
            setIsModalVisible(false);
            setCurrentEditId(null);
        }
    };

    const handleEditCancel = () => {
        setIsModalVisible(false);
        setCurrentEditId(null);
    };

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
            <Card title="Bài 2: To-Do List" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Space style={{ width: '100%' }}>
                        <Input
                            placeholder="Nhập công việc mới"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleAdd}
                            style={{ flex: 1 }}
                        />
                        <Button type="primary" onClick={handleAdd}>
                            Thêm
                        </Button>
                    </Space>

                    <List
                        bordered
                        dataSource={todos}
                        renderItem={(item: any) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key="edit"
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => showEditModal(item.id, item.text)}
                                    />,
                                    <Button
                                        key="delete"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDelete(item.id)}
                                    />,
                                ]}
                            >
                                <Space>
                                    <Checkbox
                                        checked={item.completed}
                                        onChange={() => toggleTodo(item.id)}
                                    />
                                    <Text
                                        delete={item.completed}
                                        style={{ color: item.completed ? '#999' : 'inherit' }}
                                    >
                                        {item.text}
                                    </Text>
                                </Space>
                            </List.Item>
                        )}
                    />
                </Space>
            </Card>

            <Modal
                title="Chỉnh sửa công việc"
                visible={isModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onPressEnter={handleEditOk}
                />
            </Modal>
        </div>
    );
};

export default Bai2;
