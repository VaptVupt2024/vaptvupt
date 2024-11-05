"use client";

import Cabecalho from "../../Components/Cabecalho/Cabecalho";
import { TbUserEdit } from "react-icons/tb";
import { PiCarSimpleBold } from "react-icons/pi";
import { MdOutlineLocationOn } from "react-icons/md";
import { RiQuestionLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import Opcao_config_perfil from "../../Components/Opcao_config_perfil/Opcao_config_perfil";
import Footer from "../../Components/Rodape/Rodape";
import { useState } from "react";
import EditarPessoais from "../../Components/Forms/Editar/EditarPessoais/EditarPessoais";
import "./Configuracoes.css";
import EditarCarro from "../../Components/Forms/Editar/EditarCarro/EditarCarro";
import Confirmar from "../../Components/Confimar/Confirmar";

const Configuracoes = () => {
  const handleLogout = () => {
    localStorage.setItem("logado", "false");
    window.location.href = "/LoginCadastro";
  };
  const [etapa, setEtapa] = useState(0);
  const [certeza, setCerteza] = useState(false);

  return (
    <>
      <section>
        <Cabecalho titulo="Configurações" />
        <div className={etapa == 0 ? "editar2" : "editar_sai"}>
          <p className="titulo_config_perfil">Editar dados</p>
          <Opcao_config_perfil
            nome="Editar dados Pessoais"
            icone={<TbUserEdit size={24} />}
            onClick={() => setEtapa(1)}
          />
          <Opcao_config_perfil
            nome="Editar dados do Carro"
            icone={<PiCarSimpleBold size={24} />}
            onClick={() => setEtapa(2)}
          />

          <p className="titulo_config_perfil">Ajuda</p>
          <Opcao_config_perfil
            nome="Help Center"
            icone={<RiQuestionLine size={24} />}
            onClick={() => {
              window.location.href = "/Ajuda";
            }}
          />

          <p className="titulo_config_perfil">Sair</p>
          <div onClick={() => setCerteza(true)}>
            <Opcao_config_perfil
              nome="Sair"
              icone={<FiLogOut size={24} />}
              sair
            />
          </div>
        </div>
        {etapa === 1 && <EditarPessoais setEtapa={setEtapa} etapa={etapa} />}
        {etapa === 2 && <EditarCarro setEtapa={setEtapa} etapa={etapa} />}
        {certeza && <Confirmar setCerteza={setCerteza} isOpen={certeza} />}
        <Footer />
      </section>
    </>
  );
};

export default Configuracoes;
