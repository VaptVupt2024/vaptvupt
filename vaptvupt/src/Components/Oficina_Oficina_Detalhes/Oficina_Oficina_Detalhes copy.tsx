import { useState } from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationArrow, FaLocationDot, FaStar } from "react-icons/fa6";
import { HiMapPin } from "react-icons/hi2";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { PiPasswordFill } from "react-icons/pi";
import { RiArrowDropLeftLine } from "react-icons/ri";
import "./Oficina_Oficina_Detalhes.css";

interface Propriedades {
  oficina: {
    id: string;
    nome: string;
    imagem1: string;
    localizacao: string;
    referência: string;
    telefone: string;
    CEP: string;
    atendimento: string;
    oficinaServices: { services: string[] }[];
  };
  onOficinaClick: (nome: string) => void;
}

const Oficina_Oficina_Detalhes = (props: Propriedades) => {
  const handleClick = () => {
    props.onOficinaClick(props.oficina.nome);
  };

  const [abre_mais_info, setAbre_mais_info] = useState(false);

  return (
    <>
      <div
        className="oficina_detalhes"
        aria-label={`Detalhes da oficina ${props.oficina.nome}`}
      >
        <img src={props.oficina.imagem1} alt="" />
        <div className="oficina_detalhes_textos">
          <button onClick={handleClick} className="btn_voltar">
            <RiArrowDropLeftLine size={20} />
            Voltar
          </button>
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
                <FaLocationDot size={18} />
                <div>
                  Endereço
                  {props.oficina.localizacao === "" ? (
                    <p>Esta oficina não informou a localização</p>
                  ) : (
                    <p>{props.oficina.localizacao}</p>
                  )}
                </div>
              </a>
              <a>
                <FaLocationArrow size={18} />
                <div>
                  Referência
                  {props.oficina.referência === "" ? (
                    <p>Esta oficina não informou a referência</p>
                  ) : (
                    <p>{props.oficina.referência}</p>
                  )}
                </div>
              </a>
              <a>
                <BsFillTelephoneFill size={18} />
                <div>
                  Telefone
                  {props.oficina.telefone === "" ? (
                    <p>Esta oficina não informou o telefone</p>
                  ) : (
                    <p>{props.oficina.telefone}</p>
                  )}
                </div>
              </a>
              <a>
                <PiPasswordFill size={18} />
                <div>
                  CEP
                  {props.oficina.CEP === "" ? (
                    <p>Esta oficina não informou o CEP</p>
                  ) : (
                    <p>{props.oficina.CEP}</p>
                  )}
                </div>
              </a>
              <a>
                <MdOutlineAccessTimeFilled size={20} />
                <div>
                  Atendimento
                  {props.oficina.atendimento === "" ? (
                    <p>Esta oficina não informou o atendimento</p>
                  ) : (
                    <p>{props.oficina.atendimento}</p>
                  )}
                </div>
              </a>
            </div>
          </div>

          <div className="servicos_detalhes">
            <div className="busca_servicos_detalhes">
              <h3>Serviços</h3>
              <form action="" aria-label="Buscar serviços">
                <label htmlFor="buscar_detalhes">
                  <input
                    type="text"
                    placeholder="Buscar"
                    id="buscar_detalhes"
                  />
                </label>
              </form>
            </div>
            <div className="lista_servicos_detalhes">
              <ul role="list">
                {props.oficina.oficinaServices
                  ?.flatMap((oficinaServices) => oficinaServices.services)
                  .map((services) => <li key={services}>{services}</li>) ?? []}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Oficina_Oficina_Detalhes;
