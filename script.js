// создается псевдомассив из всех кнопок
const buttons = document.querySelectorAll('.calculator-main_btn');
// вывод в result
const screen = document.querySelector('.calculator-main_result');

// выводится в консоль по нажатию
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        const current = screen.textContent;

        if (value === 'C') {
            screen.textContent = '0';
        } else if (value === '=') {
            const expression = screen.textContent;
            const result = calculate(expression);
            screen.textContent = result;
        } else if (
            current === 'Ошибка' ||
            current === 'Деление на 0' ||
            current === 'Result' ||
            current === '0'
        ) {
            screen.textContent = value;
        } else {
            screen.textContent += value;
        }
    });
});

function calculate(expression) {
    console.log('calculate called with:', expression);

    // Разбиваем выражение на токены: числа (возможно с минусом) и операторы
    const tokens = expression.match(/-?\d+\.?\d*|[+\-*/]/g);
    console.log('tokens:', tokens);
    if (!tokens) return 'Ошибка';

    // Обработка унарного минуса
    const parsedTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (
            token === '-' &&
            (i === 0 || ['+', '-', '*', '/'].includes(tokens[i - 1]))
        ) {
            const next = tokens[i + 1];
            parsedTokens.push(token + next); // объединяем в "-5"
            i++;
        } else {
            parsedTokens.push(token);
        }
    }

    // Преобразуем числа из строк в числа, оставляем операторы строками
    const parsed = parsedTokens.map(token =>
        isNaN(token) ? token : parseFloat(token)
    );
    console.log('parsed:', parsed);

    // Обрабатываем * и /
    for (let i = 0; i < parsed.length; i++) {
        if (parsed[i] === '*' || parsed[i] === '/') {
            const operator = parsed[i];
            const left = parsed[i - 1];
            const right = parsed[i + 1];

            if (operator === '/' && right === 0) return 'Деление на 0';

            const result = operator === '*' ? left * right : left / right;
            parsed.splice(i - 1, 3, result);
            i -= 1;
        }
    }

    // Обрабатываем + и -
    let result = parsed[0];
    for (let i = 1; i < parsed.length; i += 2) {
        const operator = parsed[i];
        const nextNumber = parsed[i + 1];

        if (typeof nextNumber !== 'number') return 'Ошибка';

        if (operator === '+') result += nextNumber;
        else if (operator === '-') result -= nextNumber;
        else return 'Ошибка';
    }

    return result;
}
