// src/entities/timer/store.ts
import { createStore, createEvent } from 'effector';

// Событие запуска таймера
export const timerStarted = createEvent();
// Событие сброса таймера
export const timerReset = createEvent();

// Стор для хранения прошедшего времени (в миллисекундах)
export const $timer = createStore<number>(0)
    .on(timerStarted, () => 0)  // при старте сбрасываем счетчик в 0
    .on(timerReset, () => 0);   // при сбросе тоже в 0

// Переменные для работы с реальным временем
let startTime = 0;
let timerIntervalId: number | null = null;

// При запуске таймера сохраняем текущее время и запускаем интервал
timerStarted.watch(() => {
    startTime = performance.now();
    $timer.setState(0);
    if (timerIntervalId !== null) {
        clearInterval(timerIntervalId);
    }
    // Обновляем стор каждую 1-ую миллисекунду (или по желанию с меньшим частотой)
    timerIntervalId = window.setInterval(() => {
        $timer.setState(Math.floor(performance.now() - startTime));
    }, 50);
});

// При сбросе просто обновляем стартовое время
timerReset.watch(() => {
    startTime = performance.now();
    $timer.setState(0);
});
