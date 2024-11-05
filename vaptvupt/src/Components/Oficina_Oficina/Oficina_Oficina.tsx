import { FaStar } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { BsFillTelephoneFill } from "react-icons/bs";
import "./Oficina_Oficina.css";

interface CarService {
  nome: string;
  telefone?: string | null;
  cep?: string | null;
  horario_funcionamento?: string[] | null;
  servicos?: string[] | null;
  estrelas?: number | null;
  avaliacoes?: number | null;
  endereco: google.maps.LatLngLiteral;
  endereco_original?: string | null;
  imagem_url?: string | null;
}

interface Propriedades {
  oficina: CarService;
  onOficinaClick: (oficina: CarService) => void;
  distancia?: number;
}

const Oficina_Oficina = (props: Propriedades) => {
  const handleClick = () => {
    props.onOficinaClick(props.oficina);
  };

  return (
    <button
      type="button"
      className="oficina"
      role="button"
      tabIndex={3}
      aria-label={`Detalhes da oficina ${props.oficina.nome}`}
      onClick={handleClick}
    >
      {props.oficina.imagem_url && (
        <img
          src={props.oficina.imagem_url}
          alt={props.oficina.nome}
          title={props.oficina.nome}
        />
      )}
      <div className="oficina_infos">
        <div className="oficina_info_titu">
          <h2>{props.oficina.nome}</h2>
          <div>
            {props.oficina.estrelas !== null && (
              <p>
                <FaStar color="#FF912B" size={13} />
                {props.oficina.estrelas?.toFixed(1) ?? "N/A"} (
                {props.oficina.avaliacoes ?? 0})
              </p>
            )}
            {props.distancia !== undefined && (
              <p>
                <HiMapPin color="#2B66FF" size={13} />
                {props.distancia.toFixed(1)} Km
              </p>
            )}
          </div>
        </div>
        <div>
          <button>Ver Detalhes</button>
          {props.oficina.telefone && (
            <a href={`tel:${props.oficina.telefone}`} className="button2">
              <BsFillTelephoneFill />
            </a>
          )}
        </div>
      </div>
    </button>
  );
};

export default Oficina_Oficina;
