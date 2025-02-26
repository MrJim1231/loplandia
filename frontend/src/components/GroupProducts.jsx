import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { LanguageContext } from '../context/LanguageContext'
import styles from './GroupProducts.module.css'

const GroupProducts = () => {
  const { groupId } = useParams()
  const { addToCart } = useContext(CartContext)
  const { language } = useContext(LanguageContext)
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedParam, setSelectedParam] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mainImage, setMainImage] = useState('')
  const [parentCategoryName, setParentCategoryName] = useState('')
  const [parentCategoryDiscount, setParentCategoryDiscount] = useState(null)
  const [parentCategoryId, setParentCategoryId] = useState('') // Новое состояние для parentCategoryId

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/group/${groupId}/products`)
        setProducts(response.data)

        const filtered = response.data.filter(
          (product) =>
            ![
              'Бязь (Кінцева вартість буде після прорахунків індивідуальних розмірів)',
              'Ранфорс (Кінцева вартість буде після прорахунків індивідуальних розмірів)',
              'Сатин (Кінцева вартість буде після прорахунків індивідуальних розмірів)',
              'Страйп сатин (Кінцева вартість буде після прорахунків індивідуальних розмірів)',
              'Полікотон (Кінцева вартість буде після прорахунків індивідуальних розмірів)',
              'Однотонна бязь (Кінцева вартість буде після прорахунків індивідуальних розмірів)',
            ].includes(product.param)
        )
        setFilteredProducts(filtered)
        if (filtered.length > 0) {
          setSelectedProduct(filtered[0])
          setSelectedParam(filtered[0].param)
          setMainImage(filtered[0].image[0])
        }
      } catch (err) {
        setError('Помилка при завантаженні продуктів')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [groupId])

  useEffect(() => {
    if (selectedProduct) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/categories')
          const category = response.data.find((cat) => cat._id === selectedProduct.categoryId)

          if (category) {
            // Теперь ищем родительскую категорию по полю "id"
            const parentCategory = response.data.find((cat) => cat.id === category.parentId)
            if (parentCategory) {
              setParentCategoryName(parentCategory.name)
              setParentCategoryDiscount(parentCategory.discount)
              setParentCategoryId(parentCategory._id) // Сохраняем _id родительской категории
            } else {
              setParentCategoryName('')
              setParentCategoryDiscount(null)
              setParentCategoryId('') // Сбросить _id, если родительская категория не найдена
            }
          } else {
            setParentCategoryName('')
            setParentCategoryDiscount(null)
            setParentCategoryId('') // Сбросить _id, если категория не найдена
          }
        } catch (err) {
          console.error('Ошибка при загрузке категорий:', err)
        }
      }

      fetchCategory()
    }
  }, [selectedProduct])

  const handleParamChange = (param) => {
    const newProduct = filteredProducts.find((product) => product.param === param)
    if (newProduct) {
      setSelectedProduct(newProduct)
      setSelectedParam(param)
      setMainImage(newProduct.image[0])
    }
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      // Вычисляем цену с учетом скидки
      const priceBeforeDiscount = selectedProduct.price
      const priceAfterDiscount = parentCategoryDiscount ? priceBeforeDiscount - parentCategoryDiscount : priceBeforeDiscount

      const productToAdd = {
        ...selectedProduct,
        price: priceAfterDiscount, // Цена с учетом скидки
      }

      addToCart(productToAdd)
    }
  }

  const handleImageClick = (image) => {
    setMainImage(image)
  }

  if (loading) return <div>Завантаження...</div>
  if (error) return <div>{error}</div>

  const priceBeforeDiscount = selectedProduct.price
  const priceAfterDiscount = parentCategoryDiscount ? priceBeforeDiscount - parentCategoryDiscount : priceBeforeDiscount

  return (
    <div>
      <div className={styles.navbar}>
        <Link to="/" className={styles.backToHomeLink}>
          {language === 'UA' ? 'Головна' : 'Главная'}
        </Link>{' '}
        /
        <Link to="/categories" className={styles.backToCategoriesLink}>
          {language === 'UA' ? 'Категорії' : 'Категории'}
        </Link>{' '}
        /
        {parentCategoryName && (
          <>
            <Link to={`/category/allproductsofsubcategories/${parentCategoryId}`} className={styles.categoryLink}>
              <span className={styles.parentCategory}>{language === 'UA' ? `${parentCategoryName} ` : `${parentCategoryName}`}</span>
            </Link>{' '}
          </>
        )}
      </div>

      <div className={styles.productContainer}>
        {selectedProduct && (
          <div className={styles.selectedProduct}>
            <div className={styles.productImageContainer}>
              <img src={mainImage} alt={`Продукт ${selectedProduct.name}`} className={styles.mainImage} loading="lazy" />
            </div>

            {selectedProduct.image.length > 1 && (
              <div className={styles.imageGallery}>
                {selectedProduct.image.slice(0, 6).map((image, index) => (
                  <img key={index} src={image} alt={`Тумбнейл ${index + 1}`} onClick={() => handleImageClick(image)} loading="lazy" />
                ))}
              </div>
            )}

            <div className={styles.productInfo}>
              <h3>{selectedProduct.name}</h3>
              <p>{language === 'UA' ? `Кількість на складі: ${selectedProduct.quantityInStock}` : `Количество на складе: ${selectedProduct.quantityInStock}`}</p>
              <label htmlFor="paramSelect">{language === 'UA' ? 'Оберіть розмір:' : 'Выберите размер:'}</label>
              <select id="paramSelect" value={selectedParam} onChange={(e) => handleParamChange(e.target.value)} className={styles.paramSelect}>
                {filteredProducts.map((product, index) => (
                  <option key={product.id || index} value={product.param}>
                    {product.param}
                  </option>
                ))}
              </select>
              <div className={styles.priceContainer}>
                {priceBeforeDiscount !== priceAfterDiscount && priceAfterDiscount > 0 ? (
                  <>
                    <p className={styles.priceBeforeDiscount}>{language === 'UA' ? `Ціна: ${priceBeforeDiscount} грн` : `Цена: ${priceBeforeDiscount} грн`}</p>
                    <p className={styles.priceAfterDiscount}>{language === 'UA' ? `Ціна: ${priceAfterDiscount.toFixed(2)} грн` : `Цена: ${priceAfterDiscount.toFixed(2)} грн`}</p>
                  </>
                ) : (
                  <p className={styles.priceAfterDiscount}>{language === 'UA' ? `Ціна: ${priceBeforeDiscount} грн` : `Цена: ${priceBeforeDiscount} грн`}</p>
                )}
              </div>

              {selectedProduct.discount && selectedProduct.discount > 0 && (
                <p className={styles.discount}>{language === 'UA' ? `Знижка: ${selectedProduct.discount} грн` : `Скидка: ${selectedProduct.discount} грн`}</p>
              )}
            </div>

            <button className={styles.addToCartButton} onClick={handleAddToCart}>
              {language === 'UA' ? 'Додати в кошик' : 'Добавить в корзину'}
            </button>
          </div>
        )}
        <div className={styles.additionalDescriptionCard}>
          <div className={styles.productDescription}>
            <h4>{language === 'UA' ? '1,5 спальне комплект:' : '1,5 спальный комплект:'}</h4>
            <ul>
              <li>
                {language === 'UA'
                  ? 'Простирадло: 160*220см - 1 шт (можливе пошиття простирадла на резинці +100грн за повну передоплату за комплект)'
                  : 'Простыня: 160*220см - 1 шт (возможно пошить простыню на резинке +100грн за полную предоплату за комплект)'}
              </li>
              <li>{language === 'UA' ? 'Підковдра: 150*220см - 1 шт' : 'Пододеяльник: 150*220см - 1 шт'}</li>
              <li>{language === 'UA' ? 'Наволочки: 70*70см чи 50*70см - 2 шт' : 'Наволочки: 70*70см или 50*70см - 2 шт'}</li>
            </ul>

            <h4>{language === 'UA' ? '2 спальне комплект:' : '2 спальный комплект:'}</h4>
            <ul>
              <li>
                {language === 'UA'
                  ? 'Простирадло: 200*220см - 1 шт (можливе пошиття простирадла на резинці +100грн за повну передоплату за комплект)'
                  : 'Простыня: 200*220см - 1 шт (возможно пошить простыню на резинке +100грн за полную предоплату за комплект)'}
              </li>
              <li>{language === 'UA' ? 'Підковдра: 180*220см - 1 шт' : 'Пододеяльник: 180*220см - 1 шт'}</li>
              <li>{language === 'UA' ? 'Наволочки: 70*70см або 50*70см - 2 шт' : 'Наволочки: 70*70см или 50*70см - 2 шт'}</li>
            </ul>

            <h4>{language === 'UA' ? 'Євро комплект:' : 'Евро комплект:'}</h4>
            <ul>
              <li>
                {language === 'UA'
                  ? 'Простирадло: 220*220см - 1 шт (можливе пошиття простирадла на резинці +100грн за повну передоплату за комплект)'
                  : 'Простыня: 220*220см - 1 шт (возможно пошить простыню на резинке +100грн за полную предоплату за комплект)'}
              </li>
              <li>{language === 'UA' ? 'Підковдра: 200*220см - 1 шт' : 'Пододеяльник: 200*220см - 1 шт'}</li>
              <li>{language === 'UA' ? 'Наволочки: 70*70см або 50*70см - 2 шт' : 'Наволочки: 70*70см или 50*70см - 2 шт'}</li>
            </ul>

            <h4>{language === 'UA' ? 'Сімейний комплект:' : 'Семейный комплект:'}</h4>
            <ul>
              <li>
                {language === 'UA'
                  ? 'Простирадло: 220*220см - 1 шт (можливе пошиття простирадла на резинці +100грн за повну передоплату за комплект)'
                  : 'Простыня: 220*220см - 1 шт (возможно пошить простыню на резинке +100грн за полную предоплату за комплект)'}
              </li>
              <li>{language === 'UA' ? 'Підковдра: 150*220см - 2 шт' : 'Пододеяльник: 150*220см - 2 шт'}</li>
              <li>{language === 'UA' ? 'Наволочки: 70*70см або 50*70см - 2 шт' : 'Наволочки: 70*70см или 50*70см - 2 шт'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupProducts
