"use client";

import "./Cabecalho.css";
import { TiPlus } from "react-icons/ti";

interface Propriedades {
  titulo: string;
  diagnostico?: boolean;
}

const Cabecalho = (props: Propriedades) => {
  const { diagnostico } = props;
  return (
    <>
      <div id="cabecalho" role="banner">
        <h1 className={diagnostico ? "diagnostico" : ""}>{props.titulo}</h1>

        {diagnostico && (
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            <TiPlus size={11} />
            Novo Diagnóstico
          </button>
        )}
      </div>
    </>
  );
};

export default Cabecalho;
