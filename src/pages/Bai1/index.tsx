import { Button, Card, Input, List, Typography, Space } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const { Title, Text } = Typography;

const Bai1 = () => {
    const { attempts, message, gameState, history, checkGuess, resetGame } = useModel('bai1');
    const [inputValue, setInputValue] = useState<string>('');

    const handleGuess = () => {
        const num = parseInt(inputValue, 10);
        if (isNaN(num)) return;
        checkGuess(num);
        setInputValue('');
    };

    const handleRestart = () => {
        resetGame();
        setInputValue('');
    };

    const isGameOver = gameState !== 'PLAYING';

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
            <Card title="Bài 1: Trò chơi đoán số" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Text>
                        Hệ thống đã sinh ra một số ngẫu nhiên từ 1 đến 100. Bạn có 10 lượt đoán.
                    </Text>

                    <Space>
                        <Input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập số dự đoán"
                            disabled={isGameOver}
                            onPressEnter={handleGuess}
                            style={{ width: 200 }}
                        />
                        <Button type="primary" onClick={handleGuess} disabled={isGameOver || !inputValue}>
                            Đoán
                        </Button>
                        <Button onClick={handleRestart}>
                            Chơi lại
                        </Button>
                    </Space>

                    {message && (
                        <div style={{
                            padding: 12,
                            background: gameState === 'WON' ? '#f6ffed' : gameState === 'LOST' ? '#fff1f0' : '#e6f7ff',
                            border: `1px solid ${gameState === 'WON' ? '#b7eb8f' : gameState === 'LOST' ? '#ffa39e' : '#91d5ff'}`,
                            borderRadius: 4
                        }}>
                            <Text strong type={gameState === 'WON' ? 'success' : gameState === 'LOST' ? 'danger' : undefined}>
                                {message}
                            </Text>
                        </div>
                    )}

                    <div style={{ marginTop: 16 }}>
                        <Text strong>Lịch sử đoán ({attempts}/10):</Text>
                        <List
                            size="small"
                            bordered
                            dataSource={history}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                            style={{ marginTop: 8 }}
                        />
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default Bai1;
