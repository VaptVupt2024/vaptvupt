"use client";

import "./globals.css";
import Menu from "../Components/Menu/Menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginCadastro from "./LoginCadastro/page";
import Tela_Carregamento from "../Components/Tela_Carregamento/Tela_Carregamento";
import Tutorial from "../Components/Tutorial/Tutorial";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("logado") === "true";
      setIsLoggedIn(loggedIn);
      if (!loggedIn && window.location.pathname !== "/LoginCadastro") {
        router.push("/LoginCadastro");
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [router]);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark-mode");
    }
  }, []);

  useEffect(() => {
    const storedTutorialSeen = localStorage.getItem("tutorialSeen");
    if (storedTutorialSeen === "true") {
      setShowTutorial(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchData = new Promise((resolve) => {
          const intervalId = setInterval(() => {
            setProgress((prevProgress) => {
              const newProgress = prevProgress + 10;
              if (newProgress >= 100) {
                clearInterval(intervalId);
                resolve(true);
              }
              return newProgress;
            });
          }, 100);
        });

        await fetchData;
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error during loading:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (showTutorial) {
      localStorage.setItem("tutorialSeen", "true");
    }
  }, [showTutorial]);

  return (
    <html lang="pt-br">
      <body>
        <Tela_Carregamento loading={loading} progress={progress} />
        {!loading && (
          <>
            {showTutorial && <Tutorial />}
            {isLoggedIn ? (
              <>
                <Menu />
                <section className="section">{children}</section>
              </>
            ) : (
              <section className="section">
                <LoginCadastro />
              </section>
            )}
          </>
        )}
      </body>
    </html>
  );
}
