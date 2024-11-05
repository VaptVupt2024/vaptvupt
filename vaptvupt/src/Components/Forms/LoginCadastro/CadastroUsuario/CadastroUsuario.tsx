import "../../Forms.css";

const CadastroUsuario = ({
  setEtapa,
  etapa,
  handleChange,
  formData,
}: {
  setEtapa: (etapa: number) => void;
  etapa: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: { nome: string; telefone: string; endereco: string };
}) => {
  return (
    <>
      <div id="form" className={etapa == 2 ? "ani_entra" : "ani_sai"}>
        <h1>Cadastro | Usuário</h1>
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
            value={formData.nome}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>Telefone</legend>
          <input
            type="tel"
            className="campo"
            name="telefone"
            id="telefone"
            required
            role="textbox"
            aria-label="Digite seu telefone"
            aria-required="true"
            value={formData.telefone}
            onChange={handleChange}
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
            value={formData.endereco}
            onChange={handleChange}
          />
        </fieldset>
        <button type="submit">Cadastrar</button>
        <p onClick={() => setEtapa(0)}>
          Já tem uma conta? | <span>Logar-me</span>
        </p>
      </div>
    </>
  );
};

export default CadastroUsuario;
