import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { CustomContext } from '../../store/CustomContext.js'
import eyeOpen from '/assets/eyeOpen.png'
import eyeClosed from '/assets/eyeClosed.png'

const ChangePassword = () => {
  const { changePassword } = useContext(CustomContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ mode: 'onBlur' })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data) => {
    setIsSubmitting(true)
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    })
      .then(() => {
        toast.success('Пароль успешно изменен!')
        reset()
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Произошла ошибка')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div>
      <h2 className="profile-content-title">Смена пароля</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        <div className="form-group">
          <label>Старый пароль</label>
          <div className="password-input-wrapper">
            <input
              {...register('oldPassword', { required: 'Это поле обязательно' })}
              type={showOldPassword ? 'text' : 'password'}
            />
            <img
              src={showOldPassword ? eyeClosed : eyeOpen}
              alt="Toggle password"
              className="password-eye-icon"
              onClick={() => setShowOldPassword((prev) => !prev)}
            />
          </div>
          {errors.oldPassword && (
            <p className="form-error-message">{errors.oldPassword.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Новый пароль</label>
          <div className="password-input-wrapper">
            <input
              {...register('newPassword', {
                required: 'Это поле обязательно',
                minLength: { value: 6, message: 'Минимум 6 символов' },
              })}
              type={showNewPassword ? 'text' : 'password'}
            />
            <img
              src={showNewPassword ? eyeClosed : eyeOpen}
              alt="Toggle password"
              className="password-eye-icon"
              onClick={() => setShowNewPassword((prev) => !prev)}
            />
          </div>
          {errors.newPassword && (
            <p className="form-error-message">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="form-group">
          <label>Повторите новый пароль</label>
          <div className="password-input-wrapper">
            <input
              {...register('confirmPassword', {
                required: 'Это поле обязательно',
                validate: (value) =>
                  value === watch('newPassword') || 'Пароли не совпадают',
              })}
              type={showConfirmPassword ? 'text' : 'password'}
            />
            <img
              src={showConfirmPassword ? eyeClosed : eyeOpen}
              alt="Toggle password"
              className="password-eye-icon"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>
          {errors.confirmPassword && (
            <p className="form-error-message">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="profile-form-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
