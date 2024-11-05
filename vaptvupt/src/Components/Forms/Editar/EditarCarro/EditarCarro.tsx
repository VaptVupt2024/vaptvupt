import "../../Forms.css";

const EditarCarro = ({
  setEtapa,
  etapa,
}: {
  setEtapa: (etapa: number) => void;
  etapa: number;
}) => {
  return (
    <>
      <div id="form" className={etapa == 2 ? "editar" : "editar_sai2"}>
        <h1>Editar dados | Usuário</h1>
        <form>
          <fieldset>
            <legend>Nome</legend>
            <input
              type="text"
              className="campo"
              name="nome"
              id="nome"
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
              name="tel"
              id="tel"
              required
              role="textbox"
              aria-label="Digite seu felefone"
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
              required
              role="textbox"
              aria-label="Digite seu endereço completo"
              aria-required="true"
            />
          </fieldset>
          <button type="submit" onClick={() => setEtapa(3)}>
            Próximo
          </button>
          <p onClick={() => setEtapa(0)}>Cancelar</p>
        </form>
      </div>
    </>
  );
};

export default EditarCarro;
