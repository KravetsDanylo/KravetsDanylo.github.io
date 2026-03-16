import './Profile.css'

function Profile() {
  return (
    <section className="profile-page">
      <h2 className="page-title">Мій профіль</h2>
      <div className="profile-layout">
        <div className="profile-info">
          <div className="avatar">D</div>
          <h3>Danylo</h3>
          <p className="profile-status">Статус: Постійний клієнт</p>
        </div>
        <div className="profile-details">
          <article className="history">
            <h4>Історія покупок</h4>
            <ul>
              <li>
                Килимок для йоги (12.01.2026) — <strong>Виконано</strong>
              </li>
              <li>
                Еспандер трубчастий (05.11.2025) — <strong>Виконано</strong>
              </li>
            </ul>
          </article>
          <article className="wishlist">
            <h4>Бажані товари</h4>
            <ul>
              <li>Фітнес-браслет Xiaomi Band 8</li>
              <li>Спортивна сумка Duffle</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Profile
