"use client";

import "./Confirmar.css";
import ReactDOM from "react-dom";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";

const Confirmar = ({
  setCerteza,
  isOpen,
}: {
  setCerteza: (certeza: boolean) => void;
  isOpen: boolean;
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fundo_confirmar">
      <div id="confirmar">
        <span>
          <TbAlertTriangleFilled />
        </span>
        <h1>Deseja Sair?</h1>
        <p>Você tem certeza que deseja sair?</p>
        <div>
          <button onClick={() => setCerteza(false)}>Cancelar</button>
          <button
            className="sair"
            onClick={() => {
              localStorage.clear();
              router.push("/loginCadastro");
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Confirmar;
