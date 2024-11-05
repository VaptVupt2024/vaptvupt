import { useRouter } from "next/navigation";
import Cabecalho from "../../Components/Cabecalho/Cabecalho";
import "./404.css";

const Erro404 = () => {
  const router = useRouter();

  return (
    <>
      <section>
        <Cabecalho titulo="Tente novamente" />
        <div className="Erro404">
          <img
            src="https://res.cloudinary.com/dr0nki74e/image/upload/f_auto,q_auto/v1/vapt-vupt/erro404/yxkck5km0hpa6y1sv3xq"
            alt="Imagem de Erro com ferramentas voando e um mecânico tentando pegalas, dando a sensação de caos."
          />
          <h1>Tivemos um problema por aqui.</h1>
          <p>Por favor, aguarde ou tente novamente.</p>
          <button onClick={() => router.push("/")}>Tentar novamente</button>
        </div>
      </section>
    </>
  );
};

export default Erro404;
