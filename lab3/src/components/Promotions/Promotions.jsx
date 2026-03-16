import './Promotions.css'

const promotions = [
  {
    id: 1,
    title: 'Зимовий розпродаж',
    description: 'Отримайте знижку на всі зимові куртки та термобілизну.',
    discount: '-30%'
  },
  {
    id: 2,
    title: '1+1 = 3',
    description: 'Купуйте дві пари шкарпеток для фітнесу та отримайте третю у подарунок!',
    discount: 'Подарунок'
  }
]

function Promotions() {
  return (
    <section className="promotions-section">
      <h2 className="page-title">Акції та спеціальні пропозиції</h2>
      <div className="promo-grid">
        {promotions.map((promo) => (
          <article key={promo.id} className="promo-block">
            <div className="promo-text">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
            </div>
            <div className="promo-discount">{promo.discount}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Promotions
