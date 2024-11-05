import React from "react";
import { LuSearch } from "react-icons/lu";
import "./Oficina_Barra_Busca.css";

interface Oficina_Barra_BuscaProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Oficina_Barra_Busca: React.FC<Oficina_Barra_BuscaProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div id="Oficina_Barra_Busca" aria-label="Buscar Oficinas">
      <label className="label_barra_busca" htmlFor="Busca">
        <LuSearch />
        <input
          type="text"
          id="Busca"
          placeholder="Busque"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </label>
    </div>
  );
};

export default Oficina_Barra_Busca;
