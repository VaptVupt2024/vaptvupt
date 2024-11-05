import Cabecalho from "../Components/Cabecalho/Cabecalho";
import Diagnostico_Box from "../Components/Diagnostico_Box/Diagnostico_Box";

export default function Home() {
  return (
    <>
      <section style={{ overflow: "hidden" }}>
        <Cabecalho titulo="Diagnóstico" diagnostico={true} />
        <Diagnostico_Box />
      </section>
    </>
  );
}
