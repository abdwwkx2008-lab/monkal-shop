import React, { useState } from 'react';
import './Size.css';

const clothesData = [
    { international: 'S', russian: '44-46', height: { min: 164, max: 170 }, chest: { min: 88, max: 95 }, waist: { min: 76, max: 83 } },
    { international: 'M', russian: '48-50', height: { min: 171, max: 176 }, chest: { min: 96, max: 103 }, waist: { min: 84, max: 91 } },
    { international: 'L', russian: '52-54', height: { min: 177, max: 182 }, chest: { min: 104, max: 111 }, waist: { min: 92, max: 99 } },
    { international: 'XL', russian: '56-58', height: { min: 183, max: 188 }, chest: { min: 112, max: 119 }, waist: { min: 100, max: 107 } },
    { international: 'XXL', russian: '60-62', height: { min: 189, max: 195 }, chest: { min: 120, max: 126 }, waist: { min: 108, max: 115 } },
];

const shoesData = [
    { eu: 40, uk: 7, us: 8, cm: { min: 25.1, max: 25.8 } },
    { eu: 41, uk: 8, us: 9, cm: { min: 25.9, max: 26.7 } },
    { eu: 42, uk: 8.5, us: 9.5, cm: { min: 26.8, max: 27.2 } },
    { eu: 43, uk: 9.5, us: 10.5, cm: { min: 27.3, max: 28.0 } },
    { eu: 44, uk: 10, us: 11, cm: { min: 28.1, max: 28.8 } },
    { eu: 45, uk: 11, us: 12, cm: { min: 28.9, max: 29.6 } },
];

function Size() {

    const [calculatorTab, setCalculatorTab] = useState('clothes');
    const [tableTab, setTableTab] = useState('clothes');
    const [inputs, setInputs] = useState({ height: '', chest: '', waist: '', foot: '' });
    const [result, setResult] = useState({ message: '', type: '' });

    function handleInputChange(e) {
        const name = e.target.name;
        const value = e.target.value;

        if (value === '' || parseFloat(value) >= 0) {
            const newInputs = { ...inputs, [name]: value };
            setInputs(newInputs);
        }
    };

    function handleCalculate() {
        if (calculatorTab === 'clothes') {
            const height = inputs.height;
            const chest = inputs.chest;
            const waist = inputs.waist;

            if (!height || !chest || !waist) {
                setResult({ message: 'Заполните все поля для одежды.', type: 'error' });
                return;
            }

            const found = clothesData.find(function(s) {
                const heightMatch = +height >= s.height.min && +height <= s.height.max;
                const chestMatch = +chest >= s.chest.min && +chest <= s.chest.max;
                const waistMatch = +waist >= s.waist.min && +waist <= s.waist.max;
                return heightMatch && chestMatch && waistMatch;
            });

            if (found) {
                const successMessage = `Ваш размер: ${found.international} (RU: ${found.russian})`;
                setResult({ message: successMessage, type: 'success' });
            } else {
                setResult({ message: 'Не удалось подобрать размер.', type: 'error' });
            }

        } else {
            const foot = inputs.foot;

            if (!foot) {
                setResult({ message: 'Заполните поле "Длина стопы".', type: 'error' });
                return;
            }

            const found = shoesData.find(function(s) {
                return +foot >= s.cm.min && +foot <= s.cm.max;
            });

            if (found) {
                const successMessage = `Ваш размер: EU ${found.eu} / UK ${found.uk} / US ${found.us}`;
                setResult({ message: successMessage, type: 'success' });
            } else {
                setResult({ message: 'Не удалось подобрать размер.', type: 'error' });
            }
        }
    };

    function switchCalculatorTab(tab) {
        setCalculatorTab(tab);
        setInputs({ height: '', chest: '', waist: '', foot: '' });
        setResult({ message: '', type: '' });
    };

    let calculatorFormContent;

    if (calculatorTab === 'clothes') {
        calculatorFormContent = (
            <React.Fragment>
                <input name="height" type="number" min="0" placeholder="Рост (см)" value={inputs.height} onChange={handleInputChange} />
                <input name="chest" type="number" min="0" placeholder="Обхват груди (см)" value={inputs.chest} onChange={handleInputChange} />
                <input name="waist" type="number" min="0" placeholder="Обхват талии (см)" value={inputs.waist} onChange={handleInputChange} />
            </React.Fragment>
        );
    } else {
        calculatorFormContent = (
            <input name="foot" type="number" min="0" placeholder="Длина стопы (см)" value={inputs.foot} onChange={handleInputChange} />
        );
    }

    let resultMessageContent = null;

    if (result.message) {
        let resultClassName = 'calculator-result';
        if (result.type) {
            resultClassName = `calculator-result ${result.type}`;
        }
        resultMessageContent = (
            <div className={resultClassName}>{result.message}</div>
        );
    }

    let tableContent;

    if (tableTab === 'clothes') {
        tableContent = (
            <table className="size-table">
                <thead>
                <tr>
                    <th>Международный</th>
                    <th>Русский</th>
                    <th>Рост (см)</th>
                    <th>Грудь (см)</th>
                    <th>Талия (см)</th>
                </tr>
                </thead>
                <tbody>
                {clothesData.map(function(r) {
                    return (
                        <tr key={r.international}>
                            <td>{r.international}</td>
                            <td>{r.russian}</td>
                            <td>{`${r.height.min}-${r.height.max}`}</td>
                            <td>{`${r.chest.min}-${r.chest.max}`}</td>
                            <td>{`${r.waist.min}-${r.waist.max}`}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    } else {
        tableContent = (
            <table className="size-table">
                <thead>
                <tr>
                    <th>EU</th>
                    <th>UK</th>
                    <th>USA</th>
                    <th>Длина стопы (см)</th>
                </tr>
                </thead>
                <tbody>
                {shoesData.map(function(r) {
                    return (
                        <tr key={r.eu}>
                            <td>{r.eu}</td>
                            <td>{r.uk}</td>
                            <td>{r.us}</td>
                            <td>{`${r.cm.min} - ${r.cm.max}`}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }

    let calcClothesTabClass = 'tab';
    if (calculatorTab === 'clothes') {
        calcClothesTabClass = 'tab active';
    }

    let calcShoesTabClass = 'tab';
    if (calculatorTab === 'shoes') {
        calcShoesTabClass = 'tab active';
    }

    let tableClothesTabClass = 'tab';
    if (tableTab === 'clothes') {
        tableClothesTabClass = 'tab active';
    }

    let tableShoesTabClass = 'tab';
    if (tableTab === 'shoes') {
        tableShoesTabClass = 'tab active';
    }

    return (
        <div className="size-guide-wrapper">
            <div className="size-guide-header">
                <div className="size-title-box">
                <h2 className='size-title'>Гайд по размерам</h2>
                <p className='size-subtitle'>Используйте калькулятор для точного подбора или сверьтесь с таблицами ниже.</p>
                </div>
            </div>

            <div className="main-layout">
                <aside className="how-to-measure-section">
                    <h3>Как правильно сделать замеры</h3>
                    <ul>
                        <li><strong>Обхват груди:</strong> Измерьте по самым выступающим точкам, горизонтально вокруг туловища.</li>
                        <li><strong>Обхват талии:</strong> Измерьте в самой узкой части, не затягивая ленту.</li>
                        <li><strong>Длина стопы:</strong> Поставьте ногу на лист бумаги и обведите контур от пятки до кончика большого пальца.</li>
                        <li className="important-note">
                            Пожалуйста введите свои точные размеры это очень важно !!!
                        </li>
                    </ul>
                </aside>

                <section className="size-calculator">
                    <h2>Калькулятор размера</h2>
                    <div className="tabs-container">
                        <button onClick={function() { switchCalculatorTab('clothes'); }} className={calcClothesTabClass}>Одежда</button>
                        <button onClick={function() { switchCalculatorTab('shoes'); }} className={calcShoesTabClass}>Обувь</button>
                    </div>

                    <div className="calculator-form">
                        {calculatorFormContent}
                        <button className="calculate-btn" onClick={handleCalculate}>Рассчитать</button>
                    </div>

                    {resultMessageContent}
                </section>
            </div>

            <section className="size-charts">
                <div className="charts-header">
                    <h3>Таблицы размеров</h3>
                    <div className="tabs-container">
                        <button onClick={function() { setTableTab('clothes'); }} className={tableClothesTabClass}>Одежда</button>
                        <button onClick={function() { setTableTab('shoes'); }} className={tableShoesTabClass}>Обувь</button>
                    </div>
                </div>
                {tableContent}
            </section>
        </div>
    );
};

export default Size;