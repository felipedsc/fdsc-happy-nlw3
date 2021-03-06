import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useHistory, useParams } from 'react-router-dom';
import mapMarkerImg from '../images/map-marker.svg';
import api from "../services/api";
import '../styles/pages/orphanage.css';
import { mapIcon } from "../utils/mapIcon";

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

export default function Orphanage() {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useHistory();

  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    api.get<Orphanage>(`orphanages/${id}`).then(response => {
      setOrphanage(response.data);
    });
  }, [id]);

  if (!orphanage) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="page-orphanage">
      <aside>
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={24} color="#FFF" />
          </button>
        </footer>
      </aside>

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].url} alt="Lar das meninas" />

          <div className="images">
            {orphanage.images.map((image, index) => {
              return (
                <button
                  className={index === activeImageIndex ? 'active' : ''}
                  type="button"
                  key={image.id}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={image.url} alt={orphanage.name} />
                </button>
              );
            })}
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={15}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  Ver rotas no Google Maps
                  </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                    Atendemos <br />
                    fim de semana
                </div>
              ) : (
                  <div className="open-on-weekends dont-open">
                    <FiInfo size={32} color="#FF669D" />
                      Não atendemos <br />
                      fim de semana
                  </div>
                )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}