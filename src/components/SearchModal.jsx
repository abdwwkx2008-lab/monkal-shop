import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomContext } from '../store/CustomContext'
import './SearchModal.css'

const SearchModal = ({ isOpen, onClose }) => {
  const { products } = useContext(CustomContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [onClose])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowerCaseQuery) ||
        product.brand?.toLowerCase().includes(lowerCaseQuery)
    )
    setSearchResults(filtered)
  }, [searchQuery, products])

  function handleResultClick(id) {
    onClose()
    navigate(`/product/${id}`)
  }

  return (
    <div
      className={`search-modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
    >
      <div
        className={`search-modal-content ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-input-wrapper">
          <svg className="search-input-icon" viewBox="0 0 24 24">
            <path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" />
          </svg>
          <input
            type="text"
            className="search-modal-input"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="search-results-container">
          {searchQuery && searchResults.length === 0 && (
            <div className="no-results-message">
              <p>Ничего не найдено по запросу</p>
              <span>"{searchQuery}"</span>
            </div>
          )}
          {searchResults.map((product, index) => (
            <div
              key={product.id}
              className="search-result-item"
              onClick={() => handleResultClick(product.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="result-item-image"
              />
              <div className="result-item-info">
                <p className="result-item-brand">{product.brand}</p>
                <p className="result-item-name">{product.name}</p>
              </div>
              <p className="result-item-price">
                {product.price.toLocaleString()} C
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
