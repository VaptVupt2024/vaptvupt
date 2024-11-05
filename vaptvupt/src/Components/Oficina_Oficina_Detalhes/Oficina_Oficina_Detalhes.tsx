import { useState } from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { HiMapPin } from "react-icons/hi2";
import { MdOutlineAccessTimeFilled, MdSchedule } from "react-icons/md";
import { PiPasswordFill } from "react-icons/pi";
import { RiArrowDropLeftLine } from "react-icons/ri";
import "./Oficina_Oficina_Detalhes.css";

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

const Oficina_Oficina_Detalhes = (props: Propriedades) => {
  const [abre_mais_info, setAbre_mais_info] = useState(false);

  const handleClick = () => {
    props.onOficinaClick(props.oficina);
  };

  const formatOpeningHours = (hours: string) => {
    const [day, time] = hours.split(": ");
    return { day, time };
  };

  return (
    <>
      <div
        className="oficina_detalhes"
        aria-label={`Detalhes da oficina ${props.oficina.nome}`}
      >
        {props.oficina.imagem_url && (
          <img src={props.oficina.imagem_url} alt="" />
        )}
        <div className="oficina_detalhes_textos">
          <button onClick={handleClick} className="btn_voltar">
            <RiArrowDropLeftLine size={20} />
            Voltar
          </button>
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
          </div>
          <div
            className="mais_infos"
            onClick={() => setAbre_mais_info(!abre_mais_info)}
          >
            <h3>Mais Informações</h3>
            <div
              className={abre_mais_info ? "abre_mais_info" : "fecha_mais_info"}
            >
              <a>
                <div>
                  <h4>
                    <FaLocationDot size={16} />
                    Endereço
                  </h4>
                  {props.oficina.endereco_original ? (
                    <p>{props.oficina.endereco_original}</p>
                  ) : (
                    <p>Esta oficina não informou a localização</p>
                  )}
                </div>
              </a>
              <a>
                <div>
                  <h4>
                    <BsFillTelephoneFill size={16} />
                    Telefone
                  </h4>
                  {props.oficina.telefone ? (
                    <p>{props.oficina.telefone}</p>
                  ) : (
                    <p>Esta oficina não informou o telefone</p>
                  )}
                </div>
              </a>
              <a>
                <div>
                  <h4>
                    <PiPasswordFill size={18} />
                    CEP
                  </h4>
                  {props.oficina.cep ? (
                    <p>{props.oficina.cep}</p>
                  ) : (
                    <p>Esta oficina não informou o CEP</p>
                  )}
                </div>
              </a>
              <a className="horario-funcionamento">
                <div>
                  <h4>
                    <MdOutlineAccessTimeFilled size={18} />
                    Horário de Funcionamento
                  </h4>
                  {props.oficina.horario_funcionamento ? (
                    <ul className="horario-lista">
                      {props.oficina.horario_funcionamento.map(
                        (horario, index) => {
                          const { day, time } = formatOpeningHours(horario);
                          return (
                            <li key={index}>
                              <span className="dia">{day}</span>
                              <span className="horario">
                                <MdSchedule size={14} /> {time}
                              </span>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  ) : (
                    <p>Esta oficina não informou o horário de funcionamento</p>
                  )}
                </div>
              </a>
            </div>
          </div>

          <div className="servicos_detalhes">
            <div className="busca_servicos_detalhes">
              <h3>Serviços</h3>
            </div>
            <div className="lista_servicos_detalhes">
              <ul role="list">
                {props.oficina.servicos?.map((service) => (
                  <li key={service}>{service}</li>
                )) ?? []}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Oficina_Oficina_Detalhes;
