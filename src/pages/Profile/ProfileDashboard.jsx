import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CustomContext, API_BASE_URL } from '../../store/CustomContext.js'
import { PersonIcon, ListIcon, StarIcon, ExitIcon, EditIcon } from './icons'
import axios from 'axios'
import './Profile.css'

const ProfileDashboard = () => {
  const { user, logOutUser, theme } = useContext(CustomContext)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (user && user.id) {
      axios(
        `${API_BASE_URL}/orders?user_id=${user.id}&_sort=created_at&_order=desc&_limit=5`
      )
        .then((res) => setOrders(res.data))
        .catch((err) =>
          console.error('Ошибка загрузки последних заказов:', err)
        )
    }
  }, [user])

  if (!user) {
    return <p>Загрузка...</p>
  }

  const iconColor = theme === 'dark' ? 'var(--text-color)' : '#34495e'

  return (
    <div>
      <h2 className="profile-greeting">Приветствуем, {user.fullname}!</h2>
      <div className="profile-quick-links">
        <Link to="/profile" className="quick-link-item">
          <PersonIcon color={iconColor} />
          <span>Мой аккаунт</span>
        </Link>
        <Link to="/profile/orders" className="quick-link-item">
          <ListIcon color={iconColor} />
          <span>Заказы</span>
        </Link>
        <Link to="/profile/edit" className="quick-link-item">
          <EditIcon color={iconColor} />
          <span>Редактировать профиль</span>
        </Link>
        <Link to="/favorites" className="quick-link-item">
          <StarIcon color={iconColor} />
          <span>Избранные товары</span>
        </Link>
        <div
          className="quick-link-item"
          onClick={logOutUser}
          style={{ cursor: 'pointer' }}
        >
          <ExitIcon color={iconColor} />
          <span>Выход</span>
        </div>
      </div>
      <div className="current-orders">
        <h3 className="current-orders-title">Последние заказы</h3>
        {orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>НОМЕР</th>
                <th>ДАТА</th>
                <th>СТАТУС</th>
                <th>ИТОГ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.order_code || order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.status || '—'}</td>
                  <td>{order.total_price?.toLocaleString() || 0} С</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>У вас пока нет заказов.</p>
        )}
      </div>
    </div>
  )
}

export default ProfileDashboard
