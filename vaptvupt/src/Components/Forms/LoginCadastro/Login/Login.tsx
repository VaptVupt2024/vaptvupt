import { useRouter } from "next/navigation";
import "../../Forms.css";

const Login = ({
  setEtapa,
  etapa,
}: {
  setEtapa: (etapa: number) => void;
  etapa: number;
}) => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const email = (document.getElementById("email_login") as HTMLInputElement)
      .value;
    const senha = (document.getElementById("senha_login") as HTMLInputElement)
      .value;

    try {
      const response = await fetch(
        `http://localhost:8080/api/rest/usuario/${email}?senha=${senha}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.setItem("logado", "true");
        localStorage.setItem("email", email);
        window.location.href = "/";
      } else {
        console.error("Login falhou");
        // Adicione lógica para lidar com falhas de login
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      // Adicione lógica para lidar com erros de rede
    }
  };

  return (
    <>
      <div id="form" className={etapa == 0 ? "ani_entra" : "ani_sai"}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Email</legend>
            <input
              type="email"
              className="campo"
              name="email"
              id="email_login"
              placeholder="exemplo@gmail.com"
              required
              role="textbox"
              aria-label="Digite seu email"
              aria-required="true"
            />
          </fieldset>
          <fieldset>
            <legend>Senha</legend>
            <input
              type="password"
              className="campo"
              name="senha"
              id="senha_login"
              required
              role="textbox"
              aria-label="Digite sua senha"
              aria-required="true"
            />
            <a
              href=""
              className="esqueceu"
              role="link"
              aria-label="Esqueceu sua senha?"
            >
              Esqueceu a senha?
            </a>
          </fieldset>
          <button type="submit">Entrar</button>
          <p onClick={() => setEtapa(1)}>
            Ainda não tem uma conta? | <span>Cadastre-se</span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
