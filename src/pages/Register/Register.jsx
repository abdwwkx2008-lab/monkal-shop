import React, { useState, useContext } from 'react';
import { CustomContext } from '../../store/store';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import eyeOpen from '/assets/eyeOpen.png';
import eyeClosed from '/assets/eyeClosed.png';

const Register = () => {
    const navigate = useNavigate();
    const { registerUser } = useContext(CustomContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [confirmationCodes, setConfirmationCodes] = useState({ phoneCode: '', emailCode: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullname) newErrors.fullname = 'Полное имя обязательно для заполнения';
        else if (formData.fullname.length < 5) newErrors.fullname = 'Введите полное имя, включая фамилию';

        const phoneRegex = /^\+996(50[0-9]|70[0-9]|55[0-9]|755|990|99[5-9]|77[0-9]|880|22[0-9])\d{6}$/;
        if (!formData.phone) newErrors.phone = 'Номер телефона обязателен';
        else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Неверный формат номера или код оператора Кыргызстана';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) newErrors.email = 'Email обязателен';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Некорректный формат email';

        if (!formData.password) newErrors.password = 'Пароль обязателен';
        else {
            if (formData.password.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов';
            else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
            else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Пароль должен содержать хотя бы одну цифру';
            else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) newErrors.password = 'Пароль должен содержать хотя бы один спецсимвол';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const phoneCode = Math.floor(1000 + Math.random() * 9000).toString();
            const emailCode = Math.floor(1000 + Math.random() * 9000).toString();

            console.log(`%cСИМУЛЯЦИЯ: Отправляем SMS с кодом ${phoneCode} на номер ${formData.phone}`, 'color: blue; font-weight: bold;');
            console.log(`%cСИМУЛЯЦИЯ: Отправляем письмо с кодом ${emailCode} на почту ${formData.email}`, 'color: green; font-weight: bold;');
            toast.info(`Коды подтверждения выведены в консоль (F12)`);

            setConfirmationCodes({ phoneCode, emailCode });
            setStep(2);
        }
    };

    const handleConfirmation = (e) => {
        e.preventDefault();
        const enteredPhoneCode = e.target.phoneCode.value;
        const enteredEmailCode = e.target.emailCode.value;

        if (enteredPhoneCode === confirmationCodes.phoneCode && enteredEmailCode === confirmationCodes.emailCode) {
            toast.success('Подтверждение успешно пройдено!');
            registerUser(formData, navigate);
        } else {
            toast.error('Введены неверные коды подтверждения.');
        }
    };

    if (step === 2) {
        return (
            <div className="auth-page-wrapper">
                <form onSubmit={handleConfirmation} className="auth-form">
                    <h1 className="auth-form-title">Подтверждение</h1>
                    <p className="auth-form-subtitle">Мы отправили коды на ваш телефон и email</p>
                    <div className="auth-form-group">
                        <label className="auth-form-label">Код из SMS</label>
                        <input name="phoneCode" className="auth-form-input" type="text" placeholder="1234" autoComplete="one-time-code" />
                    </div>
                    <div className="auth-form-group">
                        <label className="auth-form-label">Код из Email</label>
                        <input name="emailCode" className="auth-form-input" type="text" placeholder="5678" autoComplete="one-time-code" />
                    </div>
                    <button type="submit" className="auth-form-button">Завершить регистрацию</button>
                </form>
            </div>
        );
    }

    return (
        <div className="auth-page-wrapper">
            <form onSubmit={handleSubmit} noValidate className="auth-form">
                <h1 className="auth-form-title">Создать аккаунт</h1>

                <div className="auth-form-group">
                    <label className="auth-form-label">Полное имя</label>
                    <input name="fullname" value={formData.fullname} onChange={handleChange} className="auth-form-input" placeholder="Иванов Иван Иванович" />
                    {errors.fullname && <span className="auth-form-error">{errors.fullname}</span>}
                </div>

                <div className="auth-form-group">
                    <label className="auth-form-label">Номер телефона</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="auth-form-input" placeholder="+996..." />
                    {errors.phone && <span className="auth-form-error">{errors.phone}</span>}
                </div>

                <div className="auth-form-group">
                    <label className="auth-form-label">Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="auth-form-input" type="email" placeholder="example@mail.com" />
                    {errors.email && <span className="auth-form-error">{errors.email}</span>}
                </div>

                <div className="auth-form-group">
                    <label className="auth-form-label">Пароль</label>
                    <div className="password-input-wrapper">
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="auth-form-input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                        />
                        <img
                            src={showPassword ? eyeClosed : eyeOpen}
                            alt="Toggle password"
                            className="password-eye-icon"
                            onClick={() => setShowPassword(prev => !prev)}
                        />
                    </div>
                    {errors.password && <span className="auth-form-error">{errors.password}</span>}
                </div>

                <button type="submit" className="auth-form-button">Получить коды</button>

                <p className="auth-form-switch-text">
                    Уже есть аккаунт? <Link to="/login" className="auth-form-link">Войти</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;