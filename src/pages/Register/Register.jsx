import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomContext } from '../../store/store'
import { toast } from 'react-toastify'
import eyeOpen from '/assets/eyeOpen.png'
import eyeClosed from '/assets/eyeClosed.png'

const Register = () => {
  const navigate = useNavigate()
  const { registerUser } = useContext(CustomContext)

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    registerUser(formData)
      .then(() => {
        toast.success('Регистрация прошла успешно! Не забывайте свои данные .')
        navigate(`/`)
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Ошибка регистрации')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="auth-page-wrapper">
      <form onSubmit={handleRegister} noValidate className="auth-form">
        <h1 className="auth-form-title">Создать аккаунт</h1>
        <p className="auth-form-subtitle">Заполните данные для регистрации</p>

        <div className="auth-form-group">
          <label className="auth-form-label">Полное имя</label>
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="auth-form-input"
            type="text"
            placeholder="ФИО"
            required
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-form-label">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="auth-form-input"
            type="email"
            placeholder="example@mail.com"
            required
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-form-label">Номер телефона</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="auth-form-input"
            type="tel"
            placeholder="+996XXXXXXXXX"
            required
          />
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
              required
            />
            <img
              src={showPassword ? eyeClosed : eyeOpen}
              alt="Toggle password"
              className="password-eye-icon"
              onClick={() => setShowPassword((p) => !p)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="auth-form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <p className="auth-form-switch-text">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="auth-form-link">
            Войти
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
