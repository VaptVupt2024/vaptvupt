import { useEffect, useState } from "react";
import "../../Forms.css";

interface Usuario {
  emailUs: string;
  nome: string;
  telefone: string;
  enderecoUs: string;
}

const EditarPessoais = ({
  setEtapa,
  etapa,
}: {
  setEtapa: (etapa: number) => void;
  etapa: number;
}) => {
  const [userData, setUserData] = useState<Usuario>({
    emailUs: "",
    nome: "",
    telefone: "",
    enderecoUs: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      try {
        const response = await fetch(
          `http://localhost:8080/api/rest/usuario/${email}`
        );
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    try {
      const response = await fetch(
        `http://localhost:8080/api/rest/usuario/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        alert("Dados atualizados com sucesso");
        setEtapa(0);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name === "endereco" ? "enderecoUs" : name]: value,
    }));
  };

  return (
    <>
      <div id="form" className={etapa == 1 ? "editar" : "editar_sai2"}>
        <h1>Editar meus dados</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Nome</legend>
            <input
              type="text"
              className="campo"
              name="nome"
              id="nome"
              value={userData.nome}
              onChange={handleChange}
              required
              role="textbox"
              aria-label="Digite seu nome completo"
              aria-required="true"
            />
          </fieldset>
          <fieldset>
            <legend>Telefone</legend>
            <input
              type="tel"
              className="campo"
              name="telefone"
              id="tel"
              value={userData.telefone}
              onChange={handleChange}
              required
              role="textbox"
              aria-label="Digite seu telefone"
              aria-required="true"
            />
          </fieldset>
          <fieldset>
            <legend>Endereço</legend>
            <input
              type="text"
              className="campo"
              name="endereco"
              id="endereco"
              value={userData.enderecoUs}
              onChange={handleChange}
              required
              role="textbox"
              aria-label="Digite seu endereço completo"
              aria-required="true"
            />
          </fieldset>
          <button type="submit">Atualizar</button>
          <p onClick={() => setEtapa(0)}>Cancelar</p>
        </form>
      </div>
    </>
  );
};

export default EditarPessoais;
