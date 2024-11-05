"use client";
import { useState } from "react";
import "./LoginCadastro.css";
import Login from "../../Components/Forms/LoginCadastro/Login/Login";
import Cadastro from "../../Components/Forms/LoginCadastro/Cadastro/Cadastro";
import CadastroUsuario from "../../Components/Forms/LoginCadastro/CadastroUsuario/CadastroUsuario";

const LoginCadastro = () => {
  const [etapa, setEtapa] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    nome: "",
    telefone: "",
    endereco: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/rest/usuario/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailUs: formData.email,
          senha: formData.senha,
          nome: formData.nome,
          telefone: formData.telefone,
          enderecoUs: formData.endereco,
        }),
      });
      if (response.ok) {
        console.log("User registered successfully");
        localStorage.setItem("logado", "true");
        localStorage.setItem("email", formData.email);
        window.location.href = "/";
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <main className="loginCadastro">
        <div className="intro">
          <a href="index.html" className="logo_menu">
            <img
              src="https://res.cloudinary.com/dr0nki74e/image/upload/v1730380033/vapt-vupt/LoginCadastro/i7khhvebuo95lorybpto.png"
              className="img_menu"
              alt="Logo do Vapt-Vupt - menu"
              title="Logo do Vapt-Vupt - menu"
              role="link"
              aria-label="Ir para a página de introdução"
            />
          </a>
          <a href="https://www.portoseguro.com.br/" className="logo_menu">
            <img
              src="https://res.cloudinary.com/dr0nki74e/image/upload/v1730380034/vapt-vupt/LoginCadastro/z3gvlhdoya6uob7is69w.png"
              className="img_menu2"
              alt="Logo da Porto Seguro - menu"
              title="Logo da Porto Seguro - menu"
              role="link"
              aria-label="Ir para o site da Porto Seguro"
            />
          </a>
        </div>
        <div className="campos">
          <Login setEtapa={setEtapa} etapa={etapa} />
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <Cadastro
              setEtapa={setEtapa}
              etapa={etapa}
              handleChange={handleChange}
              formData={formData}
            />
            <CadastroUsuario
              setEtapa={setEtapa}
              etapa={etapa}
              handleChange={handleChange}
              formData={formData}
            />
          </form>
        </div>
      </main>
    </>
  );
};

export default LoginCadastro;
