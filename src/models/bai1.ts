import { useState } from 'react';

export default function bai1Model() {
    // Random number between 1 and 100
    const [targetNumber, setTargetNumber] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
    const [attempts, setAttempts] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
    const [history, setHistory] = useState<string[]>([]);

    const resetGame = () => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setAttempts(0);
        setMessage('');
        setGameState('PLAYING');
        setHistory([]);
    };

    const checkGuess = (guess: number) => {
        if (gameState !== 'PLAYING') return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        let currentMsg = '';
        if (guess === targetNumber) {
            currentMsg = 'Chúc mừng! Bạn đã đoán đúng!';
            setGameState('WON');
        } else if (guess < targetNumber) {
            currentMsg = 'Bạn đoán quá thấp!';
        } else {
            currentMsg = 'Bạn đoán quá cao!';
        }

        if (guess !== targetNumber && newAttempts >= 10) {
            currentMsg = `Bạn đã hết lượt! Số đúng là ${targetNumber}.`;
            setGameState('LOST');
        }

        setMessage(currentMsg);
        setHistory((prev) => [...prev, `Lần ${newAttempts}: ${guess} - ${currentMsg}`]);
    };

    return {
        targetNumber,
        attempts,
        message,
        gameState,
        history,
        checkGuess,
        resetGame,
    };
};
