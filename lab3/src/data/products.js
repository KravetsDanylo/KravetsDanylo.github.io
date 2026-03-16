// Product data from Lab 2
export const products = [
  {
    id: 1,
    name: 'Кросівки бігові Pro',
    price: 3500,
    rating: 4.8,
    description: 'Легкі та дихаючі кросівки для професійного бігу по асфальту.',
    image: '/resources/snickers.jpg',
    inStock: true
  },
  {
    id: 2,
    name: 'Пляшка для води Eco',
    price: 450,
    rating: 4.2,
    description: 'Ергономічна пляшка об\'ємом 1 літр з безпечного пластику Tritan.',
    image: '/resources/bottle.jpg',
    inStock: true
  },
  {
    id: 3,
    name: 'Гантелі розбірні',
    price: 1800,
    rating: 4.9,
    description: 'Набір розбірних гантелей для домашніх тренувань.',
    image: '/resources/dumbbells.jpg',
    inStock: false
  }
]

export function getProductById(id) {
  return products.find(product => product.id === id)
}

export function getAllProducts() {
  return products
}
