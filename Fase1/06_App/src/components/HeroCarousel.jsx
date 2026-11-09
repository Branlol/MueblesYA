// Carrusel principal con promociones (componente Carousel de react-bootstrap).
import Carousel from 'react-bootstrap/Carousel';
import b1 from '../assets/images/banner1.svg';
import b2 from '../assets/images/banner2.svg';
import b3 from '../assets/images/banner3.svg';

const slides = [
  { img: b1, titulo: 'Ofertas de temporada', texto: 'Hasta 30% de descuento en salas seleccionadas.' },
  { img: b2, titulo: 'Estrena tu dormitorio', texto: 'Camas y closets con despacho a domicilio.' },
  { img: b3, titulo: 'Comedores para reunir a todos', texto: 'Maderas nobles y acabados duraderos.' },
];

export default function HeroCarousel() {
  return (
    <Carousel fade className="hero-carousel shadow-sm" aria-label="Promociones destacadas">
      {slides.map((s) => (
        <Carousel.Item key={s.titulo} interval={4000}>
          <img className="d-block w-100" src={s.img} alt={s.titulo} />
          <Carousel.Caption className="caption-bg">
            <h3>{s.titulo}</h3>
            <p>{s.texto}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
