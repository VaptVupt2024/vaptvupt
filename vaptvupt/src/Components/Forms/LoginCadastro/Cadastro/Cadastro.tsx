import "../../Forms.css";

const Cadastro = ({
  setEtapa,
  etapa,
  handleChange,
  formData,
}: {
  setEtapa: (etapa: number) => void;
  etapa: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: { email: string; senha: string };
}) => {
  return (
    <>
      <div id="form" className={etapa == 1 ? "ani_entra" : "ani_sai"}>
        <h1>Cadastro</h1>
        <fieldset>
          <legend>Email</legend>
          <input
            type="email"
            className="campo"
            name="email"
            id="email"
            placeholder="exemplo@gmail.com"
            required
            role="textbox"
            aria-label="Digite seu email"
            aria-required="true"
            value={formData.email}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>Senha</legend>
          <input
            type="password"
            className="campo"
            name="senha"
            id="senha"
            required
            role="textbox"
            aria-label="Digite sua senha"
            aria-required="true"
            value={formData.senha}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <legend>Confirmar Senha</legend>
          <input
            type="password"
            className="campo"
            name="confirmarSenha"
            id="confirmarSenha"
            required
            role="textbox"
            aria-label="Confirme sua senha"
            aria-required="true"
          />
        </fieldset>
        <button type="button" onClick={() => setEtapa(2)}>
          Próximo
        </button>
        <p onClick={() => setEtapa(0)}>
          Já tem uma conta? | <span>Logar-me</span>
        </p>
      </div>
    </>
  );
};

export default Cadastro;
