import { FaStar } from "react-icons/fa";
import { HiMapPin } from "react-icons/hi2";
import { BsFillTelephoneFill } from "react-icons/bs";
import "./Oficina_Oficina.css";

interface Propriedades {
  oficina: {
    id: string;
    imagem1: string;
    nome: string;
    localizacao: string;
    referência: string;
    telefone: string;
    CEP: string;
    atendimento: string;
    oficinaServices: { services: string[] }[];
  };
  onOficinaClick: (id: string) => void;
}

const Oficina_Oficina = (props: Propriedades) => {
  const handleClick = () => {
    props.onOficinaClick(props.oficina.id);
  };
  return (
    <>
      <button
        type="button"
        className="oficina"
        role="button"
        tabIndex={3}
        aria-label={`Detalhes da oficina ${props.oficina.nome}`}
        onClick={handleClick}
      >
        <img
          src={props.oficina.imagem1}
          alt={props.oficina.nome}
          title={props.oficina.nome}
        />
        <div className="oficina_infos">
          <div className="oficina_info_titu">
            <h2>{props.oficina.nome}</h2>
            <div>
              <p>
                <FaStar color="#FF912B" size={13} />
                4,9 (201)
              </p>
              <p>
                <HiMapPin color="#2B66FF" size={13} />
                1,2 Km
              </p>
            </div>
          </div>
          <div>
            <button>Ver Detalhes</button>
            <button className="button2">
              <BsFillTelephoneFill />
            </button>
          </div>
        </div>
      </button>
    </>
  );
};

export default Oficina_Oficina;
