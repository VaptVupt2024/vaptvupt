"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./Oficinas.css";
import Oficina_Oficina from "../../Components/Oficina_Oficina/Oficina_Oficina";
import Oficina_Oficina_Detalhes from "../../Components/Oficina_Oficina_Detalhes/Oficina_Oficina_Detalhes";
import Oficina_Barra_Busca from "../../Components/Oficina_Barra_Busca/Oficina_Barra_Busca";

const API_KEY = "AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38";

interface CarService {
  nome: string;
  telefone?: string | null;
  cep?: string | null;
  horario_funcionamento?: string[] | null;
  servicos?: string[] | null;
  estrelas?: number | null;
  avaliacoes?: number | null;
  endereco: google.maps.LatLngLiteral;
  endereco_original?: string | null;
  imagem_url?: string | null; // Added this line
}

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212529",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#adb5bd",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212529",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#868e96",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#343a40",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ced4da",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#495057",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#adb5bd",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#1864ab",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#74c0fc",
      },
    ],
  },
];
const MapComponent: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  }, []);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [carServices, setCarServices] = useState<CarService[]>([]);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(
    null
  );
  const [visibleServices, setVisibleServices] = useState<CarService[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    estrelas: null as number | null,
    servicos: null as string | null,
    horario_funcionamento: null as string | null,
  });
  const [searchResults, setSearchResults] = useState<CarService[]>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [selectedService, setSelectedService] = useState<CarService | null>(
    null
  );
  const [clicouOficina, setClicouOficina] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // Fetch nearby car services when user location is available
    if (userLocation) {
      fetchNearbyCarServices();
    }
  }, [userLocation]);

  const fetchNearbyCarServices = async () => {
    const carServices: CarService[] = [
      {
        nome: "VR CAR SERVICOS AUTOMOTIVOS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6733025,
          lng: -46.71466040000001,
        },
        cep: "04764-080",
        endereco_original:
          "Rua MARCILIO DIAS, 204, SOCORRO, SAO PAULO - SP, 04764-080",
        telefone: "(11) 2924-0837",
        estrelas: 4.5,
        avaliacoes: 66,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNnNz9oevWJGpGkiM3O_6hngAKyKgiWFq1YRukuKFa0t_IabevJ97bi5N8BnRdWIMG-rjwlRNCkFR75Gq1g-VWqxNRoKyPR57OdJSyF-KWRcPCywW25fddIChN81oVYf3l6ra1ybPltgPIk-b0Kh--3Sp2ChVoWSNxYUseCkYd8j_Ih&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BAZUCAR",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -24.0064196,
          lng: -46.4231077,
        },
        cep: "11700-000",
        endereco_original:
          "JOSE MARTINS DE SOUZA, 122, JD GUILHERMINA, PRAIA GRANDE - SP, 11700-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "ELITE REPARADORA DE VEICULOS",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -24.007761,
          lng: -46.4345182,
        },
        cep: "11702-215",
        endereco_original:
          "ROBERTO DE ALMEIDA VINHAS, 2235, GUILHERMINA, PRAIA GRANDE - SP, 11702-215",
        telefone: "(13) 3395-1131",
        estrelas: 4.6,
        avaliacoes: 142,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOFB1isAImkK_uQNQh6B1tbuiUMC-s_dd1aFI3_2WTZwJm3BmuEol9565x-n970A3nzAttKS-3IgZxNm2EojVlA5pVND5K9E-GjaCgGlgXECI_nj0Sg_ckw8S_L1GY1_ouUqbVjTOcnIdUm1w9gRkt5Gh59hou1m6mFHCtxDrmzLJVJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CRV FUNILARIA",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.2144088,
          lng: -46.7913436,
        },
        cep: "13231-700",
        endereco_original:
          "Edgard Máximo Zambotto, 6519, Chácara Lagoa Branca, Campo Limpo Paulista - SP, 13231-700",
        telefone: "(11) 4893-0510",
        estrelas: 4.5,
        avaliacoes: 95,
        horario_funcionamento: [
          "Seg: 8:30 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOY9sKFvroWTFv-9lhe5HZenuVeCkbXsDmm3YQZg8dj3Dpj8gG1CFQgF2JukMSL_Yj1OykEpbiu2CPjifGNkNGXGfLaBtosDfmEestWUk2DvFyAMeDGuFxYmFImcSiLwt800S9A-XEL8TTvZlPvYkJmOFrFRbnXsZXpnbxXjvpjlsJE&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ANDER AUTO REPAIR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5303362,
          lng: -46.7851986,
        },
        cep: "06093-060",
        endereco_original:
          "Rua ALBINO DOS SANTOS, 132, CENTRO, OSASCO - SP, 06093-060",
        telefone: "(11) 2576-6838",
        estrelas: 4.6,
        avaliacoes: 384,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMSjbjTGEtzrG0gOSpeb05t1YE6iQ_eEPqONsYNuWaEGPixCep_RdXaMbG_Cf8o-uhJIdFMJWt6ULqEbkenwKCG5pztkmXJ3uKtxJq77paB5sp__hge3Rw8ZfFjcm91S3hvVNhSqiYdv9Q4AugrZensPpHdEhJtJy73EB-GAj-joBLG&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALTO GIRO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5169369,
          lng: -47.4679331,
        },
        cep: "18046-725",
        endereco_original:
          "BOLIVAR, 117, JARDIM AMERICA, SOROCABA - SP, 18046-725",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "BPR FUNILARIA E PINTURA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5486129,
          lng: -46.5469965,
        },
        cep: "03411-000",
        endereco_original:
          "ATUCURI, 439, CHACARA SANTO ANTONIO (ZONA LESTE), SAO PAULO - SP, 03411-000",
        telefone: "(11) 2295-4747",
        estrelas: 4.7,
        avaliacoes: 36,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMNXhZ0yl4fQKpRVw3yFwUzHAR9wDF9-ne2Lp_LYb-Ma1BP-XmbkA4xZmP2_y8RhmLqC2HryvZNrmd2txEZXxiC4kHJOuN_BsL7bmugpMI6cj6DbwQyUVCFTlTNNm6sdXH_ENvNKluIF4pLYL_sudBGjJLIKeFGTTHrnKeD0pT6kP-c&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GRIGOLI CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6028728,
          lng: -46.839863,
        },
        cep: "06711-250",
        endereco_original:
          "Avenida JOAO PAULO ABLAS, 701, JARDIM DA GLORIA, COTIA - SP, 06711-250",
        telefone: "(11) 3685-3594",
        estrelas: 4,
        avaliacoes: 113,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN29NiX5JpsU0v7Gf_Cg9uSmqgdQAeoYiL5nu2vuKrePmyBwogDbphTN9p24bPuuHPr7FBbbBFfG0dn5N62oW4cmCTxeAuwNbT6nLW2o5Xy9Fwdwp32xLIBG_X8mAvYTC-PCkZAvz7rKOLf5Y7HB2ha0dNdIwQ2Y_VnaHqTKtRqMVTW&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DM CAR",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6086524,
          lng: -46.7644897,
        },
        cep: "06763-015",
        endereco_original:
          "Avenida JOSE DINI, 150, CHACARA AGRINDUS, TABOAO DA SERRA - SP, 06763-015",
        telefone: "(11) 4701-5283",
        estrelas: 4.6,
        avaliacoes: 260,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNL0mwUys0AZnCP0NA-VtXhxKF5rkYNRSE6zG0JScr5MNRYfcap4fFGg1F92h4nY9L1u6CmEcJMPD11WlIbat8JV94tjljKF-tR8NvXPXtDiwoDFW3EGqM1g0JjltvY4yCW96FIap-lDdET2rh1B6BWx6DmOqNEnT34YfGpnl9gbgZt&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TORQUE ALPHA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4925982,
          lng: -46.8333147,
        },
        cep: "06460-010",
        endereco_original:
          "Avenida ARUANA, 671, TAMBORE, BARUERI - SP, 06460-010",
        telefone: "(11) 4195-4681",
        estrelas: 4.3,
        avaliacoes: 509,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNu0qDrZ6JchqnaoIXVNi4JU5XPSi3OycYlH6u6yj8V3CKtsTcYVm5_teFLAVAlg9OfQon8RCqY7m-Q0MHp5RAEN0Sau43G6vJi7_flW6yXGqJsGCQ2Fp3qI1secWPOWHRdtjvR1NLjU4ObrSW9jv_7SLr8sRnZHEXrP3GgK5i5eGdp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RIBEIRO & RIBEIRO",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.9471935,
          lng: -47.3096007,
        },
        cep: "13190-228",
        endereco_original:
          "CEZARIO DE PAULA PENTEADO, 161, CENTRO, MONTE MOR - SP, 13190-228",
        telefone: "(19) 3879-5876",
        estrelas: 4.6,
        avaliacoes: 40,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:30 PM",
          "Ter: 7:30 AM – 5:30 PM",
          "Qua: 7:30 AM – 5:30 PM",
          "Qui: 7:30 AM – 5:30 PM",
          "Sex: 7:30 AM – 5:30 PM",
          "Sab: 8:00 – 11:30 AM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO4jOYtlcM9Z2dDhkY3-R7UHi1_55IVXvAHD3fMf8swFZL5ZySfq_JmjxcbKwGM1NgHTvBO3b8Za-iEG1qGIsaNnjaHrXBBUiuvvhxtLcxvzqm33qPUVGXf_6Hj6YFkFz75qk9XXWdonYStU6FQAnwpcVJRYEO6Tze9F4ULQi_zyEeK&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NEW FENIX",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5190307,
          lng: -46.7922508,
        },
        cep: "06230-100",
        endereco_original:
          "AMADOR BUENO, 430, PIRATININGA, OSASCO - SP, 06230-100",
        telefone: "(11) 4376-4376",
        estrelas: 4.3,
        avaliacoes: 264,
        horario_funcionamento: [
          "Seg: 8:15 AM – 6:00 PM",
          "Ter: 8:15 AM – 6:00 PM",
          "Qua: 8:15 AM – 6:00 PM",
          "Qui: 8:15 AM – 6:00 PM",
          "Sex: 8:15 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOoXUx3U7w9tb8-ijcA6ux5RdwQBs4RPxMJKUf6W9qTo9FUeno8YMfz387rjimrZz3JdYv6uH12w_u_X4sWOwqN-Ux9Zyk-4m-x65ymAuhSnDwYZUquwnsgIr5wF_c7l6k_fzfnANPgwe04wF9vH0FZU9ObnBXVw-N3uA4z5In7iyh_&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MARTELINHO JUNDIAI",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.2150809,
          lng: -46.8830419,
        },
        cep: "13206-543",
        endereco_original: "MONTE MOR, 29, VILA AIELO, JUNDIAI - SP, 13206-543",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "ANARAFA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.0069123,
          lng: -46.8515406,
        },
        cep: "13256-510",
        endereco_original:
          "BENEDITO DA SILVEIRA CHRISPIN, 73, JARDIM IPE, ITATIBA - SP, 13256-510",
        telefone: "(11) 4538-5759",
        estrelas: 4.2,
        avaliacoes: 62,
        horario_funcionamento: [
          "Seg: 7:30 – 11:30 AM, 1:00 – 6:00 PM",
          "Ter: 7:30 – 11:30 AM, 1:00 – 6:00 PM",
          "Qua: 7:30 – 11:30 AM, 1:00 – 6:00 PM",
          "Qui: 7:30 – 11:30 AM, 1:00 – 6:00 PM",
          "Sex: 7:30 – 11:30 AM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMKxaQhQjHd7Kbrb1aVkePD5C8fx8ynChmJx2AjLQ9lJEsIod48oW6Cj_C-vq6rc_lYEnNVksDmdh2t6FJruSaqVCh_-i8zcKcc8a_3aODMa3v4vyo-WeuL_GNZkr0WWOT3pi76kelKJK6xXk8OkeIE3nd7ot8x__0f7dF3-qUZOtzr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PAPALEGUAS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5167134,
          lng: -47.4847115,
        },
        cep: "18045-000",
        endereco_original:
          "AMERICO DE CARVALHO, 557, JARDIM EUROPA, SOROCABA - SP, 18045-000",
        telefone: "(15) 3222-4337",
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "HOT ROD",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6007977,
          lng: -46.754477,
        },
        cep: "06753-000",
        endereco_original:
          "FRANCISCO ETTORE PEDRO MARI, 686, JARDIM CANER, TABOAO DA SERRA - SP, 06753-000",
        telefone: "(11) 95378-6718",
        estrelas: 5,
        avaliacoes: 248,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMoBXxeb6D4lUMM303mKfZ01fiNf893JP1De9eJsoKWbwF6YyEZTbnB8l_KU9FmktujRqQl1DuRkUM64nEL0BO4OBIZcISl2j80iz1kYJaLIUN1dWNScD6Cdlf7VGWzeupzqWN85FSx8fVoGiQ0UgyF7ZVvOP7u_26pz4CIRtYiW6Gm&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "EVOLUTION - REPAIR SOLUTION",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5238023,
          lng: -46.644144,
        },
        cep: "01131-000",
        endereco_original:
          "DOS ITALIANOS, 708, BOM RETIRO, SAO PAULO - SP, 01131-000",
        telefone: "(11) 3225-3200",
        estrelas: 4.3,
        avaliacoes: 243,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP8L8LP5DAI9yiCS9xHozA_4eD6CNMU2_smzIoW_No245aT8k0k8tQZJnuDNEDM-SJwW9dEtMjl6vWWz6OjuPU7le67zeqk03VR2zBi6XTVxPmnWQibtz34B-HK_bqGGyRKDosM8Gfh3SQ8WtSrdDjiXqxawecjLcCnUx0zY8XEOzlM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NEW CAR SP",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5460976,
          lng: -46.5494225,
        },
        cep: "03410-000",
        endereco_original:
          "NOVA JERUSALEM, 442, CHACARA SANTO ANTONIO (ZONA LESTE), SAO PAULO - SP, 03410-000",
        telefone: "(11) 2941-1112",
        estrelas: 4.5,
        avaliacoes: 184,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPK91j7i3h0c33YoT1J24C83hS5D_qICxypifiQ77sx9lhnTij9QBXFhmGLFnTWc-PM0d0S8TrHH0MP2vFgiGPgKEPlV45HKhBT1cRW3s1ZsHmfkrDij8fiVwHwYW2M-fjZmjtCkWM5EiqwCIEP4Dw9b79kE8KLdMYdJnrTdYRILuy_&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "REICAR REPARADORA DE VEICULOS LTDA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -24.0107862,
          lng: -46.4414525,
        },
        cep: "11702-605",
        endereco_original:
          "GUADALAJARA, 1537, AVIACAO, PRAIA GRANDE - SP, 11702-605",
        telefone: "(13) 3356-9909",
        estrelas: 4.3,
        avaliacoes: 201,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPSV6GpodydZyo57nnDMaDWEc9YBPrP83Sj3p4pFgCV-6vpJTZpLrdZ5cwuOXWRAoxNjarcYES-KuB3AFHyvVJgCGlFzGkpzUmnKD7YmmQfXqMhM4Yg-hlKCINCjdRcY_EZB68PY9IMwz5PXw7H7Gz91liIUU9AkxziQX98WPU6NqOO&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTOREPAROS ARICANDUVA",
        servicos: ["Vistoria por imagem", "Funilaria e pintura"],
        endereco: {
          lat: -23.5795031,
          lng: -46.4972868,
        },
        cep: "03930-010",
        endereco_original:
          "Rua Funilandia, 250, Jardim Sao Cristovao, Sao Paulo - SP, 03930-010",
        telefone: "(11) 2722-6701",
        estrelas: 4.1,
        avaliacoes: 35,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:45 PM",
          "Ter: 8:00 AM – 5:45 PM",
          "Qua: 8:00 AM – 5:45 PM",
          "Qui: 8:00 AM – 5:45 PM",
          "Sex: 8:00 AM – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNNMmCqUFKiORLK8AZJRHeTQ1m7ZOEL8wwG4MoRKlNmDj3wQ8PBhuE692CMrIClftCXHbZHr7A0HJiMwqPj3bAdrbdxHaqITyGf9RwpBZa3WQA9XYa6jmVAFH0ANIfR87OGBCG5_BsHP0WCuD0ZpB19cmERx6bP-DEIg3nE4c34VvDI&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GORDINHO GARAGEM",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.515628,
          lng: -47.1452004,
        },
        cep: "18132-520",
        endereco_original:
          "MARIA ANEZIA DE MELLO CARVALHO, 270, JARDIM GUACU, SAO ROQUE - SP, 18132-520",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "QUATRO RODAS PREMIUM",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.2836613,
          lng: -45.96475969999999,
        },
        cep: "12328-300",
        endereco_original:
          "Adhemar Pereira de Barros, 644, Jardim Santa Maria, Jacarei - SP, 12328-300",
        telefone: "(12) 3951-1718",
        estrelas: 4.5,
        avaliacoes: 265,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPYNAk_223g46_LXAb6wkv4ZNXUFl2jDmSrpL6gad98SJR5JNyZBPiyOaipEXs3wD21Pa0b8LMNjyxuIVQZvrSUiweDDUtklA6EVXPjy7E0qgbhT7QpppjsINhqYMSzIj2J720Jt9O50krTuYaCG88HwbyJCNnp5vTaQbAd7cCnbmKs&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FORT CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.943801,
          lng: -46.55034990000001,
        },
        cep: "12904-001",
        endereco_original:
          "SANTA CRUZ, 1005, VILA SANTA LIBANIA, BRAGANCA PAULISTA - SP, 12904-001",
        telefone: "(11) 4032-7035",
        estrelas: 4.5,
        avaliacoes: 158,
        horario_funcionamento: [
          "Seg: 7:30 AM – 6:00 PM",
          "Ter: 7:30 AM – 6:00 PM",
          "Qua: 7:30 AM – 6:00 PM",
          "Qui: 7:30 AM – 6:00 PM",
          "Sex: 7:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP8GPWnT-IEX8dj3J8qiSB5J8JGoOiMHapgS_boJtXoDOQp-epl0XIRWE_4-eRRkYuHXu-YxXr2qPelRPwuNRKY_7bfZJPJAIiqp6C_0NkEAXdVAqWAv2P3JDRXfIMdS6GYoZXsaQZh9_dkWwqfl57TInVk1M_D5rsbUNmExRyiEEMR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GUICAR FUNILARIA E P",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -24.2811295,
          lng: -46.9607584,
        },
        cep: "11750-000",
        endereco_original:
          "LUCIANO DE BONA, 6919, BALNEARIO SAO JOSE, PERUIBE - SP, 11750-000",
        telefone: "(13) 97403-6757",
        estrelas: 4.7,
        avaliacoes: 41,
        horario_funcionamento: [
          "Seg: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Ter: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Qua: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Qui: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Sex: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP_IeVrsx_Su_835RDYqEY8Xj7DgTdeJ5cfAc9y5WojWgZBH4qR0LWNmUPo_7y_0l6-aXxkLI7QWzGE3vH53gG3POXaPalZ27f4RZR0yeA05YMIn3XqYTefyGhYlVsp5eyqhZ51hlhiBDRe9gCr7PCB1DZxOlWCcw3XUwCRrAYOSnj-&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALPHAVILLE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.0260049,
          lng: -47.37347279999999,
        },
        cep: "13350-000",
        endereco_original:
          "Rua RUA MARIO BAPTISTA, 125, PQ BELA VISTA, ELIAS FAUSTO - SP, 13350-000",
        telefone: "(19) 99767-3111",
        estrelas: 4.8,
        avaliacoes: 88,
        horario_funcionamento: [
          "Seg: 7:30 AM – 6:00 PM",
          "Ter: 7:30 AM – 6:00 PM",
          "Qua: 7:30 AM – 6:00 PM",
          "Qui: 7:30 AM – 6:00 PM",
          "Sex: 7:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNVl4ZU5p5d8toOd1gm-s8TlPpIQhUpdfxGq6yrW98fvpET0hl3SmSmM73HJBjQUoqTU-Xf1tkIckQfhv4yfMZj0gAiGxsp5FIo7epBe3LfTmGMpZyr0wJNDYevhR3td3ZQcVNc5HMStW9GAIu6LGj-I_4qiG6G8n-htTj4A1XshI3O&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DEBELAK CAPITAL SP",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.4680231,
          lng: -46.5939677,
        },
        cep: "02313-000",
        endereco_original:
          "MANUEL GAYA, 63, VILA NOVA MAZZEI, SAO PAULO - SP, 02313-000",
        telefone: "(11) 2242-6869",
        estrelas: 4.4,
        avaliacoes: 281,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOcLI5Z0afsqSnkBIn3oKYHETlqsXuEtqZmv_gq6-6VAaLGY5jgIOdpVyD96rooDRveCpEGMm4WZYLtn4adF60ZasfJd3N7TKcj-qLV2AGnJ3_EP7Nu77VhbbohTuA6YLFmQ3WK6JJDNktEL9l32ubZJMBQ2WDbvmEUz-UxkoXmNz6p&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "R R J DE SANTOS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6479737,
          lng: -46.83911579999999,
        },
        cep: "06810-240",
        endereco_original:
          "ROTARY, 435, PARQUE PIRAJUSSARA, EMBU DAS ARTES - SP, 06810-240",
        telefone: "(11) 94903-5100",
        estrelas: 3.5,
        avaliacoes: 28,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMxmzj0E4125jofjKCs1VJmTk4e8xjzHDuGy-hX2JpPf2DlNAgQqUFPQ7Nt8yte9vjKpznGCKrvjyUZcZ_Am4-prf1JNQ1kdFrRKSAfxpEUY3RJtwtKUB64NU6F0Krr_frhT1OOTYWSCedfcu3uPkuTqR_lwDKvkueQt05PBRuOQ1B_&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "WAGNER FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5333923,
          lng: -47.4370827,
        },
        cep: "18112-055",
        endereco_original:
          "OCTAVIO AUGUSTO RANGEL, 1079, JARDIM TOLEDO, VOTORANTIM - SP, 18112-055",
        telefone: "(15) 98111-1260",
        estrelas: 4.6,
        avaliacoes: 82,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPSieM64Nbl4J0e8z0S-a8e5lxuQEF2aD3gWkRtyxmWXNrTUSWZyjmALd5svp7TsUT8MCzO0B6wt5rKECKT2yOQOvs-yw6FmbVOPaz5a1UeNeI1MZwwPhpnSi4z6wFlEFKb_hdgAm1SsmoBMD3e6Jr0uLOL9hYIv3gv7TiH-WLdLfNW&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA 4 RODAS MAIS GUARULHOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4647269,
          lng: -46.5089203,
        },
        cep: "07190-000",
        endereco_original:
          "MONTEIRO LOBATO, 2037, VILA MIRIAM, GUARULHOS - SP, 07190-000",
        telefone: "(11) 4378-3633",
        estrelas: 4.2,
        avaliacoes: 277,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPZZsInCIG3HHubz7HeEt5d_SZn1vZ2EbhtE9UYCfyk8x8JQXNtytLAUvCh9-u-G9BdBL9fztuKOUtQMJ1z9EH8QB0Oos7H9Oig4-5w5b3ZEZgTVzgtjBpvB8DI2WKFj3k9wLKZEm1IYHP7FvIiPWRvD1ePTtsr8gG9KAqIeNKnLz8Z&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RETOCAR - ARUJA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.3951827,
          lng: -46.3152929,
        },
        cep: "07402-295",
        endereco_original:
          "Rua MARINA DE LIMA SANTANGELO, 61, CHACARA SAO JOSE, ARUJA - SP, 07402-295",
        telefone: "(11) 91212-6161",
        estrelas: 4.5,
        avaliacoes: 307,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMx60uwx7O8C4cuH9NW7KjkzicWZ10lKogSw1UijsaAK1cHfrJAPrPrAKdgQHyvCjZXRdc5gw3BH8_GbMYHjQzZsrmT1V8_TmwyRXO2rbIdqWu1WeESGtAe8o7tNgCbH8CYVVg6m8u3vdafZzxj6Iozu135yH5QxRTOuW9-pyya8x-2&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DEBELAK ATIBAIA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.1115679,
          lng: -46.55760780000001,
        },
        cep: "12940-260",
        endereco_original: "São João, 551, Centro, Atibaia - SP, 12940-260",
        telefone: "(11) 2427-6255",
        estrelas: 5,
        avaliacoes: 40,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMAQge6hHMj2SL2Ew6aurqYXstE-PA8GEqlVOnQctXMQboktXBsq_xCUebJtGmxCyu40_eyYWsIBVXHL9Pqrkn5YaU0AU3_sfWqywXOZYbHHR5tIiOb_qy4_RGtK4MpJAnbQQ-SgysAmq8mqxrlaExRshh4iUQ9aG31NoSj40yfs4Ne&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CARANGO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.9466295,
          lng: -46.3294521,
        },
        cep: "11015-540",
        endereco_original:
          "JULIO CONCEICAO, 110, VILA MATHIAS, SANTOS - SP, 11015-540",
        telefone: "(13) 3221-7622",
        estrelas: 4.5,
        avaliacoes: 6,
        horario_funcionamento: [
          "Seg: 7:00 AM – 6:00 PM",
          "Ter: 7:00 AM – 6:00 PM",
          "Qua: 7:00 AM – 6:00 PM",
          "Qui: 7:00 AM – 6:00 PM",
          "Sex: 7:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "TOP CAR",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5171649,
          lng: -47.2510232,
        },
        cep: "18125-000",
        endereco_original:
          "ANTONIO LUIZ FERREIRA, 872, VILA PEDAGIO, ALUMINIO - SP, 18125-000",
        telefone: "(11) 4715-7079",
        estrelas: 5,
        avaliacoes: 18,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "MEC MAX",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5391005,
          lng: -46.7760607,
        },
        cep: "06018-180",
        endereco_original: "SALEM BECHARA, 111, CENTRO, OSASCO - SP, 06018-180",
        telefone: "(11) 3685-4099",
        estrelas: 3.1,
        avaliacoes: 133,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNeKxT-ssgMs0PL9_Am0IyYn_DLK07eF4TDQQfbSVDlGv7jzIRFqK_Et16jJf5Veam6_EyUIm4dGciNt8ur0tVql6Lka4pxUOOEtqFgQzH1xhHrLxO6s5XuRJbl3qkIX8kxIQYlScGL6BgXOZNfjR4nLV7Me6zp0cSrk1GbiiNFJuE-&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MEGA CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -24.1941195,
          lng: -46.81215419999999,
        },
        cep: "11740-000",
        endereco_original:
          "Avenida PEDRO AMÉRICO, 460, BELAS ARTES, ITANHAEM - SP, 11740-000",
        telefone: "(13) 3427-6874",
        estrelas: 4.3,
        avaliacoes: 89,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMtfh7v5tnv0tActXNJPBTweRlPWS7nDw5nredqNbdA4Z5moO2eoX3reB1_jMdZMQxENKdhH5_mY7e352TEHCqSaSNrAubQVF1977PNoIfMATId81-xauFPfBWUge_Ig9H110OGjttXzPB7_Q1XIBZCsnkLv9xhWXnof8eZlVxBeaSL&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CENTRO AUTOMOTIVO REGENTE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6024746,
          lng: -46.6101016,
        },
        cep: "04278-000",
        endereco_original:
          "Avenida DOUTOR GENTIL DE MOURA, 490, IPIRANGA, SAO PAULO - SP, 04278-000",
        telefone: "(11) 4329-6800",
        estrelas: 4.1,
        avaliacoes: 302,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO3tYfxtYVAOzJTiPuvl21EXQ4FFCe4lyIObIxNL_SnzubxplKy4ysr0frr30TU2ZcX5Co_3yhssYp2ag716VaImy_CtHV2UI5eLh4-jPp_m7Zppd1dTPOnGz0d8HuQI7zQ0N3uln3eTHKXwFvFSh6QINwkekVzG7rF-hoKRRkyBa8L&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUNILARIA E INDAIÁ",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.0852916,
          lng: -47.1867166,
        },
        cep: "13338-530",
        endereco_original:
          "HOMERO PAULO LOURENCO BARNABE, 55, PARQUE SAO LOURENCO, INDAIATUBA - SP, 13338-530",
        telefone: "(19) 3875-6412",
        estrelas: 4.7,
        avaliacoes: 306,
        horario_funcionamento: [
          "Seg: 7:45 AM – 6:00 PM",
          "Ter: 7:45 AM – 6:00 PM",
          "Qua: 7:45 AM – 6:00 PM",
          "Qui: 7:45 AM – 6:00 PM",
          "Sex: 7:45 AM – 6:00 PM",
          "Sab: 7:45 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPbbJCo19aFC8ORImnKmZNJIkhOGo_Bnv8pWctL-mUhe5X4xQlpntf949F-wbzLZMn8LDGN9u9xQvJ5FU44ls74xxw4MY4YaLmb0oWUCDURhzgnNWiVv1LgE6p_Awh3lZYZLgF-r2Ju2ig1oucFOkcYNiDXmqqzmNHR-Fbj6nE0lJDc&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RECUPERADORA ITARARE",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.771741,
          lng: -46.7926368,
        },
        cep: "06911-195",
        endereco_original:
          "CAROLINA DE LIMA GILIOLI, 82, COLIBRIS, EMBU-GUACU - SP, 06911-195",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "OFICINA 4 RODAS MOOCA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5564226,
          lng: -46.6036708,
        },
        cep: "03112-030",
        endereco_original:
          "Rua Orville Derby, 140, Mooca, Sao Paulo - SP, 03112-030",
        telefone: "(11) 2697-3057",
        estrelas: 4.5,
        avaliacoes: 25,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNFdCMaJcepOdaSYqnWq6rr5jcVDk9SSISTK3ZpBXe2hZo71u2BPPUl0_5KSpfhv-Qh4COm8OQTEO1fkCIScxFX7vleN9mdBY7yqz9SxFAJQMTaCAaeqxYGAAlXIB_KlL7t2KGbazhdxg2amzMe2f3G2dM3XsOyDR97g-3KE1wf4lob&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CARS REPAROS AUTOMOTIVOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.949406,
          lng: -46.3276539,
        },
        cep: "11075-300",
        endereco_original:
          "JOAQUIM TAVORA, 70, VILA MATHIAS, SANTOS - SP, 11075-300",
        telefone: "(13) 3326-3392",
        estrelas: 4.7,
        avaliacoes: 218,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOi7r15Osvp3ICV6T4xUvW37wkxp5GTDq0gfzXpscSt6sXPp1WivGiZpEi1HrjnoEP0Lc8XbYMncWwepmcoeo1m2bjizR0CRNUx0t_1ayqyFsVLE-mSO-yg_DzezlMQdWbV-nACekYDlLr-VqEgWh02wcZkcYZsMBtTnjouj5knHqIq&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MODELO SJ CAMPOS",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2274205,
          lng: -45.879419,
        },
        cep: "12231-720",
        endereco_original:
          "OSVALDO FARIA, 384, JARDIM SATELITE, SAO JOSE DOS CAMPOS - SP, 12231-720",
        telefone: "(12) 3934-2000",
        estrelas: 4.5,
        avaliacoes: 511,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNYG11mLyw9TRa1x1AY_sXV4CjAU_jgtGF9byhQG3Z-0daW04W906jpSiCmC0E77R4j0FrfppwBl4Pbwk6NurVxINvw-P6ftCB493WQu05O6JdXrsmsR4ayZpKBJrRupLsW38JZwTIPO2-lVqvwZeTdbQ6JMg02OO_GSF5zwWNVUyvc&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA QUATRO RODAS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.1809704,
          lng: -45.84486,
        },
        cep: "12220-000",
        endereco_original:
          "Avenida PRESIDENTE JUSCELINO KUBITSCHEK, 9250, VILA INDUSTRIAL, SAO JOSE DOS CAMPOS - SP, 12220-000",
        telefone: "(12) 3906-1400",
        estrelas: 4.3,
        avaliacoes: 2270,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:30 PM",
          "Ter: 8:00 AM – 6:30 PM",
          "Qua: 8:00 AM – 6:30 PM",
          "Qui: 8:00 AM – 6:30 PM",
          "Sex: 8:00 AM – 6:30 PM",
          "Sab: 9:00 AM – 5:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM5USX6LvPAryYmztxGFnqH1twSkgazWq9Hn9PsGFvLXy-VxLiqRCGCWC3pmI-Tm3QT2Ja_to87HLIBxiNPBGFHZNz-0r62ZSdPP0nGEgV9hCuY3oBkZZDDlnH9K_LaZ0pGX1xrMBMS2iZDGGWXypL6bfddqxMdN7DsXcN_yqPQCRT4&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ROMMA UNIVERSO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5090235,
          lng: -46.66174549999999,
        },
        cep: "02517-000",
        endereco_original:
          "RELIQUIA, 407, JARDIM DAS LARANJEIRAS, SAO PAULO - SP, 02517-000",
        telefone: "(11) 3955-0035",
        estrelas: 4.5,
        avaliacoes: 125,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMuW55rQ3jY1aCjnpxA3AMyOwX4rAu0InPgU6hlgyjJQqh7eQjUTDcrDXi5gZLV5mMxQ-Hcjc9LMru3q6eVY-YFcNWLbqcmn_0LbiqrA8TWBURp3BhP2e4TFqk45ZE5bYK6JL62trBnXSFqfjxk2aX4qDjjuHdezN94CNCvf0kJv-gP&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JD ANALIA TATUAPE PICKUPS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5300832,
          lng: -46.5544692,
        },
        cep: "03064-000",
        endereco_original:
          "Avenida CELSO GARCIA, 6076, TATUAPE, SAO PAULO - SP, 03064-000",
        telefone: "(11) 2028-9000",
        estrelas: 4.3,
        avaliacoes: 474,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNNpkSStXH6n3cgCLADQSe-YhZwkvqJiBsg6e4AOCFBfbHmNmaTpxQT_luDEIMEkwnpFZIx-vjZr4kUHBLTfwH_QBoUAEiVqywjBXRQFFffgmTmAT-Szfwq0czQkNWFBE4gnwtYHSd_fbmrdeoI_-6v2GSX_C1imo3jv0l7bTURavFw&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SEADRICCAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5004418,
          lng: -46.34497220000001,
        },
        cep: "08572-630",
        endereco_original:
          "BRASILIA, 195, VILA MIRANDA, ITAQUAQUECETUBA - SP, 08572-630",
        telefone: "(11) 94011-1804",
        estrelas: 5,
        avaliacoes: 7,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOg5o40L7um9yF4oaCEHA3XIK-s8mSPYd7EuITIleh9IAJoU1sHWtApViqsCKcbfK2Gux0Mw4O2xgm_UwclgiS22eeATzs0gZe2bvqzxnmaSQo3VnoOTmRDur4_SHPM6udO24VwQuinPbcEzZ6acVebnGFLv2zHm7edTqkk5OiqNaJ_&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VITORAUTO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5351333,
          lng: -46.5794421,
        },
        cep: "03064-000",
        endereco_original:
          "CELSO GARCIA, 3400, TATUAPE, SAO PAULO - SP, 03064-000",
        telefone: "(11) 3476-3703",
        estrelas: 4.7,
        avaliacoes: 142,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNvIm1gIScZyd4uPsBtwy0fmcPSnKg6SgDYKGZpaq0pZpvACe6jFYtJr_W3s05J3ptcKpf_r24lrrMQBXTELeKlegYN-1EjguxwW6gJejlIKL9-Rh3T1Wf5IpkrrEdth0Sr8epc9mUMAhEbmhELx5B9UKCNWKp0B2J7Omm0R0U9Zpox&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "B.A.R. AUTO SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6406736,
          lng: -46.717298,
        },
        cep: "04729-001",
        endereco_original:
          "Rua MISSIONARIOS, 449, SANTO AMARO, SAO PAULO - SP, 04729-001",
        telefone: "(11) 5641-4506",
        estrelas: 4.4,
        avaliacoes: 145,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN85hF-Q2O5t54Yh-eyqME7ZbMznlk4XEVOiAeQgYJVgMtrYwsey_tcHYmvj34wdvlDJYA3WaaziF3npcFRed3FWD7gOqZldWsDtA2z6qn2kHFrageo0d4N8H4nyhntTxwNNkVXYftPQaHWMF3zX5y263xHl3UQVJkEhGBTBhj9QxAJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GL CENTRO AUTOMOTIVO FUNILARIA E PINTURA",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.7056382,
          lng: -46.8443788,
        },
        cep: "06855-000",
        endereco_original:
          "ARY DOMINGUES MANDU, 325, EMBU MIRIM, ITAPECERICA DA SERRA - SP, 06855-000",
        telefone: "(11) 4668-1424",
        estrelas: 4.5,
        avaliacoes: 30,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMEoRJL--91hlZxxrg8o05kwEC8kqtlw8hXT0HFp5zzdhU3IeTY9wX56-f1US3AJyVdl4jnhuAujD7nxI1dDd06tCRedOHUD5K_k4oUUoOXuyDvVg9m-eYPbYdLSgYq6E3XLED1lbBd7N7K9P7BEmwyjx9_R_PPvJuLr5r-olCDJsAu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RJG CAR SERVICE",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.7203492,
          lng: -46.5497141,
        },
        cep: "09710-202",
        endereco_original:
          "Rua Marechal Deodoro, 2526, Centro, Sao Bernardo do Campo - SP, 09710-202",
        telefone: "(11) 3458-7300",
        estrelas: 4.2,
        avaliacoes: 200,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP5vWL3eLj4zs33HCP16_AC1heifVn3O1PiCaWesqCwBpc9Uuccjkumf9o4kTbFSSLdYCSFztTbbCH-KXJTkntk3sjyfbr-0j3j18pWBSyptaUc7q7P6lSoeHIGqp842tian9T2sO6M_Rx0H2CHCN1DNl49nrKGdfJ4rGry8hSDU85j&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CONSER T KAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.1753213,
          lng: -46.85197549999999,
        },
        cep: "13219-807",
        endereco_original:
          "COMENDADOR ANTONIO BORIN, 2685, JARDIM COLONIAL, JUNDIAÍ - SP, 13219-807",
        telefone: "(11) 4584-7939",
        estrelas: 4.9,
        avaliacoes: 25,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPmgNZhEJ32Bv7ujbASVHycHd6voifRWHoNU35sb37iXG1eDPQRpqiAVpdRlvuODVwt4fhk6GKByC6EjzwOJKsT12OSVpPbVfU_meHPu6HC9fIFE1POEyo1TSYh00odN85Fl0DUuoe-6vI0gN-OUqX2T0YxdYRiEjpFH7ie83xnuJki&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SP MAX",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5157907,
          lng: -46.7738542,
        },
        cep: "06286-000",
        endereco_original:
          "Avenida LUIZ RINK, 500, MUTINGA, OSASCO - SP, 06286-000",
        telefone: "(11) 3686-6457",
        estrelas: 4.5,
        avaliacoes: 60,
        horario_funcionamento: [
          "Seg: 8:30 AM – 5:00 PM",
          "Ter: 8:30 AM – 5:00 PM",
          "Qua: 8:30 AM – 5:00 PM",
          "Qui: 8:30 AM – 5:00 PM",
          "Sex: 8:30 AM – 4:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO8DqUBCvyKWyxT-qZXsbV9uJ4Z1nkETwl0-TN5o5KvOPAfdvdqs3tSPbDZ5XbO2mOrpyziu5xJqMTE03lDmw4ou0-Z3UNESSCpmJ33vLODnNhvQnMNhDbL_ur_degeCIvy6c-F_yi1a_c0QhWlOE3FxmZ5lWkRmBFh4yTkW0ka5p-z&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AGNUS REPARACAO AUTOMOTIVA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4737781,
          lng: -46.5249496,
        },
        cep: "07013-100",
        endereco_original:
          "Padre Celestino, 545, Centro, Guarulhos - SP, 07013-100",
        telefone: "(11) 2440-0511",
        estrelas: 4.5,
        avaliacoes: 267,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 5:30 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 5:30 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 5:30 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 5:30 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPuC-2UAi2elO_WGZ0TW6Y6b6wBbw1l0OZTy_k3c-byvVzuwsYzPJDfPkIJRehGYkw46sBjZKNUpMfxYV-tFesam_398qaHkn9qrIMg_MCo6a6vqahjB_wsxpxRKBXuGfDegWTxee-ZEwQgy923RCXPSsHyos3SIlyEaB3Yx1xE6AE0&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VOLARE SERVICOS AUTOMOTIVOS",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.589542,
          lng: -46.839481,
        },
        cep: "06708-415",
        endereco_original:
          "Rua JOSE FELIX DE OLIVEIRA, 473, VILA SANTO ANTONIO, COTIA - SP, 06708-415",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "REYCAR",
        servicos: [
          "Vistoria por imagem",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5552653,
          lng: -46.6222782,
        },
        cep: "03105-010",
        endereco_original:
          "Rua LUIS GAMA, 185, MOOCA, SAO PAULO - SP, 03105-010",
        telefone: "(11) 3209-1166",
        estrelas: 4.4,
        avaliacoes: 133,
        horario_funcionamento: [
          "Seg: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Ter: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Qua: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Qui: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sex: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNfvqRNmNts2E80_aq3WSLi2YOYLkhsJPN2I1NS17P-iDsg6LDdqbY0XtdEwQKLcGfzpSmexGHepAL4hpYCIvIzHPVWHSQGIW0dyLcN3W6-EIfI7skgdAg-9RsyRXNag8uwQ2UrX_Meswa9ztzkc6FgX-u53UbsVOadC2luLp7FuNuv&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JET CARS",
        servicos: ["Vistoria por imagem"],
        endereco: {
          lat: -23.7090708,
          lng: -46.5310703,
        },
        cep: "09771-001",
        endereco_original:
          "Rua PERY RONCHETTI, 1555, NOVA PETROPOLIS, SAO BERNARDO DO CAMPO - SP, 09771-001",
        telefone: null,
        estrelas: 4,
        avaliacoes: 5,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 6:00 PM",
          "Dom: 9:00 AM – 6:00 PM",
        ],
        imagem_url: null,
      },
      {
        nome: "INFINITY FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Martelinho de ouro"],
        endereco: {
          lat: -23.5259144,
          lng: -46.5523578,
        },
        cep: "03604-030",
        endereco_original:
          "FREI GERMANO, 210, PENHA DE FRANCA, SAO PAULO - SP, 03604-030",
        telefone: "(11) 99327-7545",
        estrelas: 4.7,
        avaliacoes: 165,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 5:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 5:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNnjx49FIP3GIvC8Wv8sDcN2aVwXs0hvgJEaqSHoMsx8Jumkg0FSIfKjW0cnYykox51_qbirmcwNcAp8YZYxYEE0RYhyeLPwv8Xpt77X_O9E9_LY5-CVBQvOxwkdYvaRh2BWL8Kp2LNVPzAno7ic9yzHW8ZUSI3KJe9nsDtLX3-MHhJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CLINICAR",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.8250448,
          lng: -46.1410835,
        },
        cep: "11250-000",
        endereco_original:
          "DEZENOVE DE MAIO, 490, JARDIM ALBATROZ I, BERTIOGA - SP, 11250-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "RR GARAGE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5991421,
          lng: -47.0247128,
        },
        cep: "06730-000",
        endereco_original:
          "BENEDITO A DE OLIVEIRA, 521, JD MADALENA, VARGEM GRANDE PAULISTA - SP, 06730-000",
        telefone: "(11) 4158-2828",
        estrelas: 1.7,
        avaliacoes: 6,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMmtTicshRDdoAcl-bUHxCUQCLPTR0f_2fcCDor-PlHSOXU0YQF9AE7i3Bihp-ieJFj3bu5VENFxKkrGlc4EVZ1qR8TD6FDXUHjJ7MvxGqTgSW-JBROOWM3-b49fYedF7ymBReHXJRajYabwLlT95w53OxiWlKmtwc9yC5Myhy0VuNP&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALPHA 2",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2669441,
          lng: -45.9503614,
        },
        cep: "12305-010",
        endereco_original:
          "GETULIO VARGAS, 2755, JARDIM CALIFORNIA, JACAREI - SP, 12305-010",
        telefone: "(12) 3962-6256",
        estrelas: 4.6,
        avaliacoes: 343,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO4GaaNBahfSy6xIRbCCQ6mphsavj6pm63ajQRYuP2PS3cFutIAIQsY-s7MfDakGL9lwt0jG9O-hoUDE__Cx7Se-utDcVnDYK6gqmG-Br_ZfGlOfgJHux6vqDCAFJ9DANzo5FUobUGYwwt4yoDw2zx88Y-DvUqt6K3juVQvASKlokWL&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FIXX REPAROS AUTOMOTIVOS - NÃO ACEITA GUINCHO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.8799533,
          lng: -47.0704576,
        },
        cep: "13073-068",
        endereco_original:
          "CONSELHEIRO ANTONIO PRADO, 146, VILA NOVA, CAMPINAS - SP, 13073-068",
        telefone: "(19) 3381-9560",
        estrelas: 4.5,
        avaliacoes: 91,
        horario_funcionamento: [
          "Seg: 8:00 – 11:00 AM, 1:00 – 5:45 PM",
          "Ter: 8:00 – 11:00 AM, 1:00 – 5:45 PM",
          "Qua: 8:00 – 11:00 AM, 1:00 – 5:45 PM",
          "Qui: 8:00 – 11:00 AM, 1:00 – 5:45 PM",
          "Sex: 8:00 – 11:00 AM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM7LxKCCe4MaE3HZhf-wVgSv4842F2zlI07LYgJtm0HURPHR_hNyiXfhGwXJzih3gb2Gb8SYkckYXdol5d4weDFKAAjg2rAWuPaJsoMpInqTxcJmCVdlrSjIhrQqEWY5hpNhX-kvU5rv3vi404i2QQ6zNjS26SOv47ct9Y8lGc3saZp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RC PRIME FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5259079,
          lng: -46.764925,
        },
        cep: "06210-103",
        endereco_original:
          "Rua HENRY FORD, 534, PRESIDENTE ALTINO, OSASCO - SP, 06210-103",
        telefone: "(11) 3681-2187",
        estrelas: 4.2,
        avaliacoes: 97,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 2:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO7TY85N-H7AxkSNLayu7YZX5pxBdV1wlbc03jqeoG6VUvCBla_zTZ7KxUb3oFuQwCTgRRyD5cxRa0tbI688dlIYDa45bSNvySjPHfjs0K1sh1v91yUUKiSSMCH8GkvI0ypFmQ419fKIkVDW_p0j6tTHKI_Yvo1ILrJBTQfHjrmKJ7e&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BLESS - RESTAURAÇÃO FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5192194,
          lng: -46.7953471,
        },
        cep: "06230-110",
        endereco_original:
          "Rua ANHANGUERA, 551, PIRATININGA, OSASCO - SP, 06230-110",
        telefone: "(11) 4565-0070",
        estrelas: 3.9,
        avaliacoes: 14,
        horario_funcionamento: [
          "Seg: 7:00 AM – 5:00 PM",
          "Ter: 7:00 AM – 5:00 PM",
          "Qua: 7:00 AM – 5:00 PM",
          "Qui: 7:00 AM – 5:00 PM",
          "Sex: 7:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMnY_01fklzy1zxqOJs09lJqxEK90PcSqmRbp9rQJbI0bxchtrFIPJN6why2ceOtbpg8H4NxqvOdpTjIzERlcsHSSnJ_L2lu-8lYFOYd4o9pZNOH9zsY3ReTwvGhQ1nYmRKu2GxQeQwCHoaDteOPSd19ZpLa6qCvBhUD_dMgMqahGeN&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MARCO CAR FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6191531,
          lng: -46.7880829,
        },
        cep: "06767-385",
        endereco_original:
          "Rua Joaquim Faustino de Camargo, 36, Jardim São Paulo, Taboão da Serra - SP, 06767-385",
        telefone: "(11) 4137-5560",
        estrelas: 5,
        avaliacoes: 6,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMrH3-JRZVsFcmoVyCHkaQIn_tEe3VAOpZQZLRTbp_gM2EImv1FY-Pr13qp-87-7KP0qU-bnLG1BbI2Zpe82wtfH7aRK7_CtOzCHpjTMdSUoAgADQknllYBq24yeHbk-9uRLJpxn7FeTiBmfV_GZHXsKMolGjB0HO29jUbuHuENOFNR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO REFLEXO FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4956067,
          lng: -46.8833328,
        },
        cep: "06412-140",
        endereco_original:
          "Rua Mar Vermelho, 1231, Jardim Regina Alice, Barueri - SP, 06412-140",
        telefone: "(11) 4198-2695",
        estrelas: 4.7,
        avaliacoes: 128,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMCGNHVGzOOdNjbSapwmL3YY6ailCC7SisQhUZ1w3vZuf6XRmtsmwjCQ7hIegyYHWxENlmHDdwXKB6s6oPXHxI05bpWPAUJ_eozpRNRdo81OU_TxY0AeZVBNt7lYywNYZQ8RTiSHHFRHrqRlLo6Txe2rzIeChap7FssLFOUGnhh7oue&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GN CAR SERVICE",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4370788,
          lng: -46.9433095,
        },
        cep: "06504-044",
        endereco_original:
          "Avenida Jordânia, 119, Chácaras São Luís, Santana de Parnaíba - SP, 06504-044",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "ARCOVERDE SERVICOS AUTOMOTIVOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5225778,
          lng: -46.73483539999999,
        },
        cep: "05089-000",
        endereco_original:
          "GUAIPA, 1347, VILA LEOPOLDINA, SAO PAULO - SP, 05089-000",
        telefone: "(11) 3088-8925",
        estrelas: 4.3,
        avaliacoes: 67,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMaz99EbPGXfLXn4D9d6k3Wwb-arjIeC3vmkj4AXRwiv-RIBY-aHxjUc756ZNKIPNpBAgmyWWfTrKiaB3QzheBM0bUXXmv3vdACwcb1-N_iQFmv6BVHFqojHMjURdKKznPU8R-KVXJHdj1_MhEPOVpXoFZjsBQ21chubuiUykiEBIqT&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NEW FENIX SP",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5109622,
          lng: -46.7452624,
        },
        cep: "05117-002",
        endereco_original:
          "Rua DOM PEDRO HENRIQUE DE ORLEANS E BRAGANCA, 892, VILA JAGUARA, SAO PAULO - SP, 05117-002",
        telefone: "(11) 3294-5583",
        estrelas: 4.5,
        avaliacoes: 38,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM8Q6NbSFE0DnIeX3GlfWsNbdGb9BvO_4MNBBgSui4ImCQvlpEyeZFt8_jMEsvZry1_8yvhqVsLEei4SvEZQIVS5g1J-VfL82kQvIvSsx6uDEd5ZRs5ynocsmrm72i3fr-ViDXG-JIzYcv7gjOFTS-vu6F4tP97t2OZyq_8a6bwVUOD&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SQUADRA AUTO CENTER",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5526671,
          lng: -46.60384759999999,
        },
        cep: "03168-005",
        endereco_original: "DOS TRILHOS, 603, MOOCA, SAO PAULO - SP, 03168-005",
        telefone: "(11) 2692-7138",
        estrelas: 4.6,
        avaliacoes: 229,
        horario_funcionamento: [
          "Seg: 8:15 AM – 6:00 PM",
          "Ter: 8:15 AM – 6:00 PM",
          "Qua: 8:15 AM – 6:00 PM",
          "Qui: 8:15 AM – 6:00 PM",
          "Sex: 8:15 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN4jHfMAKQmtXX_tqd3Q57ZxP2KrPg9gEOBAoPg-g7WQUfyIc-U8wzjIarg80gPz-XPGqgOhZ78Z0BaIXbQ0wcNbc23jjsO4XsTYLgeZJWtJy9FgjqIr3pxrPPOdSn73nXSJvVzUDa0OYslzphEsM42eo4QbnBR0FfE5awBT2cW75hn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DIASCAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4716456,
          lng: -46.6061645,
        },
        cep: "02306-001",
        endereco_original:
          "CORONEL SEZEFREDO FAGUNDES, 792, TUCURUVI, SAO PAULO - SP, 02306-001",
        telefone: "(11) 2203-9197",
        estrelas: 3.8,
        avaliacoes: 119,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOj94p1YD88A4X3dXlkSl10t0BgvXPCyqb0OwPW0IlBHl6j34dBYs-eO5pPl51De2IoWYoITMBwSoB0GdouSim1TLJfaX3hO53_qS_xh-vWkp9JosIxLvfL3d0WdIB3XzPLGn0WyHMf6Fy7YIvjRKLGfJxFWyED__cknYcwO9AeBtzr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RICMIL REPARACAO AUTOMOTIVA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4566271,
          lng: -46.5378064,
        },
        cep: "07094-000",
        endereco_original:
          "Avenida Doutor Timóteo Penteado, 966, Vila Hulda, Guarulhos - SP, 07094-000",
        telefone: "(11) 2468-9424",
        estrelas: 4.1,
        avaliacoes: 361,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPNldej5BZGsnWMNVkAolqhRE5351gI_hj0Q0FnlvwyrJzvjZUL75X1unig02l0EQSnj2bsx3ruump6YdDj_QqsbDP10sPH66L72DAM1dU3ZFO3twqq1_BAt4jb3XXbyr6YuesQbShT_SX_eY0IqlCf8v97rZMN_i5u6w5oiDn9Omsr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CHIC FUN PINT",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.9183715,
          lng: -47.05941079999999,
        },
        cep: "13041-304",
        endereco_original:
          "ENGENHEIRO MONLEVADE, 313, VILA JOAO JORGE, CAMPINAS - SP, 13041-304",
        telefone: "(19) 3231-9853",
        estrelas: 3,
        avaliacoes: 1,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "IPANEMA AUTO MEC",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6145628,
          lng: -46.6597749,
        },
        cep: "04083-002",
        endereco_original:
          "MOACI, 983, PLANALTO PAULISTA, SAO PAULO - SP, 04083-002",
        telefone: "(11) 5055-9061",
        estrelas: 4.6,
        avaliacoes: 52,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNn8vVPHKpPI-2Rj7-DlAAtQq6rtMiIFnrjA_yeoGVOGS0qz0fVSDmbPFgZwGvVbV2uaoG2GLaR4YxQ8wrskAkVrMzODpnPukSDZfK_luQD6RBLzXliKeyrj51HAT0brNfHDgmlHnPhlPFcq6Lc5_n66xOLZuhw6c4XRnbqtor_OCtM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "QUATRO RODAS SANTANA DE PARNAIBA",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.4073008,
          lng: -46.8739303,
        },
        cep: "06525-001",
        endereco_original:
          "TENENTE MARQUÊS, 5405, VILA POUPANCA, SANTANA DE PARNAIBA - SP, 06525-001",
        telefone: "(11) 4705-0499",
        estrelas: 5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "AUTO BRITE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5168766,
          lng: -47.4836769,
        },
        cep: "18045-000",
        endereco_original:
          "Avenida AMERICO DE CARVALHO, 692, JARDIM EUROPA, SOROCABA - SP, 18045-000",
        telefone: "(15) 3222-3425",
        estrelas: 4.2,
        avaliacoes: 209,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPMFyXxaWx-quAzsondh-81mhJ-qxh6aeInbh2nS1aue5eRKox5D1hwVflr47PCvv_9-bUv1drCzfHdAguauNkwz8IJxPcFe98jUi83ONdHfEVYcO9te51dRz0ZuzjNAeUBOrVA6bwXRjgD4y5v1bWVyDIrX9sf2u-mQwa_MmNqyLA&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "J.F MURARO",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.4975213,
          lng: -47.4954913,
        },
        cep: "18055-205",
        endereco_original:
          "DAS ACACIAS, 687, JARDIM SIMUS, SOROCABA - SP, 18055-205",
        telefone: "(15) 3202-4001",
        estrelas: 4.1,
        avaliacoes: 116,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 5:30 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 5:30 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 5:30 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMrgrasvZ7rqXoPsiJPQK-H5gDOBcB-RDTEMlL8sENTnu7rdlK5OeUCnZP5QjXe80ZurA84pmA60KlS1dP1MHg2jqaNGYJTZ3dEaT8f5hVpV4kSQoV-gp7BoApEz5j2L9sCvOsukVWXaScNrQyrrFgvIExV0uaqec_FT_7T4oIPiL9h&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PANTERA CARS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6697124,
          lng: -46.5831695,
        },
        cep: "09692-000",
        endereco_original:
          "Rua FRANCISCO ALVES, 294, PAULICEIA, SAO BERNARDO DO CAMPO - SP, 09692-000",
        telefone: "(11) 4178-6741",
        estrelas: 4.5,
        avaliacoes: 543,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNJFNvggnuOEhUONi6gMTGE0Kv0npQaco1UUENnaWcLSWrSCL4vzFiq_SKhol_mHkuv3hiLyPc7SrorPuXcLY-7f6k2lspFmO32ulvrNlOCfX-XItOZEV574NclDFFgNWkUGlC5Yem0bDP6RavVrW4OEbnag8HfZ1tyDtwVvJ-Edy4k&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SMS IMPORTS",
        servicos: [
          "Vistoria por imagem",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6243303,
          lng: -46.4633778,
        },
        cep: "08330-200",
        endereco_original:
          "Rua ILHA DO CARDOSO, 448, VILA ESTER, SAO PAULO - SP, 08330-200",
        telefone: "(11) 2013-3488",
        estrelas: 4.3,
        avaliacoes: 49,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNX-E3FCXg_SZyrBqsZbM7H9Aan5_Nz32OXYeTlxylngLNKyPXURGRI8d-0UZkPFds_ChAAXQ5LdmgaPTzIfBZ3bneSV2qnXsO7Nh7QuPQfSxzHdSOka-hX8YZz6PYAqeKJAXC9EHzh4aIg9a4vAHLQ5v9aK6_1TDnnWZBfjn2RscFI&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SANTS CAR - SBC",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7170473,
          lng: -46.5584739,
        },
        cep: "09720-460",
        endereco_original:
          "FRANCISCO ADAMO, 124, CENTRO, SAO BERNARDO DO CAMPO - SP, 09720-460",
        telefone: "(11) 4338-2900",
        estrelas: 4.3,
        avaliacoes: 129,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:45 PM",
          "Ter: 8:00 AM – 5:45 PM",
          "Qua: 8:00 AM – 5:45 PM",
          "Qui: 8:00 AM – 5:45 PM",
          "Sex: 8:00 AM – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNtk7PuUEkuK9MSgKfTvgDxoZ_7pyzPeIWZy7YsyP4VqgRLNUjmMOFHl-ZSzQy2CblpQ_fIgqa8fHf59DuBH_9K78w0I2Tsz-4tDMjGJj_uI55A6t73o6qGVCes2IbHRYpUe4OWxAY5YbsLdRDEoMRYGRAnEvSH0a-IZu7bmIwxSVMd&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CLUBCAR VEICULOS CAMBUCI",
        servicos: ["Vistoria por imagem", "Multimarcas", "Elétrica"],
        endereco: {
          lat: -23.5638151,
          lng: -46.6184446,
        },
        cep: "01523-000",
        endereco_original:
          "Rua CLIMACO BARBOSA, 191, CAMBUCI, SAO PAULO - SP, 01523-000",
        telefone: "(75) 99889-0672",
        estrelas: 1,
        avaliacoes: 1,
        horario_funcionamento: [
          "Seg: Open 24 hours",
          "Ter: Open 24 hours",
          "Qua: Open 24 hours",
          "Qui: Open 24 hours",
          "Sex: Open 24 hours",
          "Sab: Open 24 hours",
          "Dom: Open 24 hours",
        ],
        imagem_url: null,
      },
      {
        nome: "NEW SERVICE ALPHA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4987369,
          lng: -46.8565484,
        },
        cep: "06455-000",
        endereco_original:
          "Alameda ARAGUAIA, 532, ALPHAVILLE INDUSTRIAL, BARUERI - SP, 06455-000",
        telefone: "(11) 4193-2126",
        estrelas: 4.6,
        avaliacoes: 240,
        horario_funcionamento: [
          "Seg: 7:00 AM – 6:00 PM",
          "Ter: 7:00 AM – 6:00 PM",
          "Qua: 7:00 AM – 6:00 PM",
          "Qui: 7:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNNEBUGa07kwzvDAY9_wdMMTocAkcpWNlI7VTai9qo6G_ZCO-bi8x7xHzpxj_9d35zOcAKWKRRmtfYScTX8XL48f7WrvG7cBNTBqCmuY8iyLrhLFnWJ9VlgojU3KVeXxeHVt_sUQsY-EoiVfygx95rI2BfKp-M0Po35AMNddN1A-dEp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CONDE",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5982023,
          lng: -46.5960864,
        },
        cep: "04221-000",
        endereco_original: "AMADIS, 727, IPIRANGA, SAO PAULO - SP, 04221-000",
        telefone: "(11) 3728-6477",
        estrelas: 4.3,
        avaliacoes: 217,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPSb0ehlwSvl21m2-34gexeIWv6_oCt3MrDCZ--5GUVhF2Sj0hRX-6iJ3kZ9IqgKSCfJjI1co31mzUZMF_plIweJKbQP_hA-l6_SVc9dI7MLAE8FuwxIprmG0SLNZUTfT9CMSnt1fn6OrEwNQkv72gP4_04_SwH81J5G7xAbESiq3jA&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NEXEN FUNILARIA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.0807601,
          lng: -47.1972832,
        },
        cep: "13335-305",
        endereco_original:
          "Avenida CONCEIÇÃO, 1376, VILA MARIA HELENA, INDAIATUBA - SP, 13335-305",
        telefone: "(19) 99997-4474",
        estrelas: 5,
        avaliacoes: 1326,
        horario_funcionamento: [
          "Seg: 7:30 AM – 6:00 PM",
          "Ter: 7:30 AM – 6:00 PM",
          "Qua: 7:30 AM – 6:00 PM",
          "Qui: 7:30 AM – 6:00 PM",
          "Sex: 7:30 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP65862OgXhXnZ8ZCB-jNN0u4NgeL5vWzMjrvjHs1JW5e36K--rVt4STl4KQhXr3pcoiGA0zIKXYFM16Q5p1vgC5FSsLB5Guh2tlgGrRjjIQ6DsoHcJxAEf-sHkqeAmPvjWf0j-xuzuox6o4RZm0BNUdoZPgLj6me_p9t4OX__V6c0U&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ARCO IRIS CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5382459,
          lng: -46.299943,
        },
        cep: "08610-030",
        endereco_original:
          "Euclides Damiani, 341, Vila Amorim, Suzano - SP, 08610-030",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "SUPERVISAO MOOCA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5659992,
          lng: -46.5884468,
        },
        cep: "03117-000",
        endereco_original:
          "DO ORATORIO, 1667, MOOCA, SAO PAULO - SP, 03117-000",
        telefone: "(11) 2022-4440",
        estrelas: 3.9,
        avaliacoes: 85,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOoeITWoOrGP_lqGORX68g486cP3J1owMy_dhHN__PrFWyhh49UtKTjBYY7dJco68ZZDbPtsfbx-XVNLZ58NZMamxtzEupQhPl0Po4Tjs-W0wOtpvGKgQgZ4c_mS61AhE30BxrTyXIdYuvqA74c87YsQ47ZN8dQvJbXRjtGCiJyajuu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GOIAS CAR SAO CAETANO SERVICOS AUTOMOTIVOS LTDA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6162862,
          lng: -46.55342419999999,
        },
        cep: "09550-050",
        endereco_original:
          "Avenida GOIAS, 2323, BARCELONA, SAO CAETANO DO SUL - SP, 09550-050",
        telefone: "(11) 4226-1571",
        estrelas: 4.6,
        avaliacoes: 74,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 12:30 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMxHi3TxcrtJ1x2XQvC2PYmJSi2V0L7eRlaULZnWwIztF6EQ_q_yyT9ui9XolhqS21vQcRutd2LuYbtUjdEccZhnP-EnYIUbizWD3gJFmQbwvFAACFK2voJskmTCdg3tkfL8Et3XIzEbZttvNQUnv9PGa40HhT7Tc7gVGXaEbK-ohhN&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CARLAO DE SANTOS AUT",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
        ],
        endereco: {
          lat: -23.959101,
          lng: -46.3113044,
        },
        cep: "11015-230",
        endereco_original:
          "SANTOS DUMONT, 76, ESTUARIO, SANTOS - SP, 11015-230",
        telefone: "(13) 3234-7631",
        estrelas: 4.6,
        avaliacoes: 274,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMjV3aU68-43T9XcbfjXq_hmmWY8NcqxIhQrDF2sUdto8ZSKWPVpKVfObldPOxeVBxxDmb-Rxwx0dz8JUSbumy83seVEpuAKl18nN8OweN1ikPPVCjq1Aqur8GLJrru-zsPIw63d2kX6muAhxToLJX2_wYINYzgUqtLXD2YdJoWg4Sp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PREMIUM CAR SERVICE",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.9571332,
          lng: -46.54552100000001,
        },
        cep: "12900-510",
        endereco_original:
          "BOA VONTADE, 147, CENTRO, BRAGANCA PAULISTA - SP, 12900-510",
        telefone: "(11) 4032-2341",
        estrelas: 5,
        avaliacoes: 49,
        horario_funcionamento: [
          "Seg: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Ter: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Qua: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Qui: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Sex: 8:00 – 11:30 AM, 1:00 – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMzOXKk8vwuskBfNfAC1Sfqbe0BTqauRuJyAZ5hDtQ15oSZYJ1E1qYve-IJ5utGlroiUWw-ZHUvDKre93ShWj6C4DtEjS6WRiac-Un_q4miLpn3x31yhCMJnuPdGkP-NUCkRFLXON65VLP4vAJ3SP-S_5OxbRNfPQG-NffX_f-3zURc&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUNILARIA ROSSI",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.1940904,
          lng: -47.3059624,
        },
        cep: "13326-010",
        endereco_original:
          "ESCOCIA, 459, JARDIM ELIZABETH, SALTO - SP, 13326-010",
        telefone: "(11) 4029-2318",
        estrelas: 4.8,
        avaliacoes: 162,
        horario_funcionamento: [
          "Seg: 7:30 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Ter: 7:30 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Qua: 7:30 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Qui: 7:30 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Sex: 7:30 AM – 12:00 PM, 2:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPfHX0Eg41JiC_6Q9buDLAtitLAGE08jEd1FgGAuaWCoG_FATygpIGWf3-a8_vl2NNrzcbZh7gAllNkh2B_p7GHereO-_cmL6KtIbMftCLetbPwn8_I6johJ9jPPFcX6dn2-DsKbnMFpCUPZx8txGvoBe6MHtivg1s-Up_b8tQtDPOJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JETPRIME AUTOMOTIVE DETAILING",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6367071,
          lng: -46.5436612,
        },
        cep: "09080-111",
        endereco_original:
          "DOM PEDRO II, 2347, CAMPESTRE, SANTO ANDRE - SP, 09080-111",
        telefone: "(11) 4991-1093",
        estrelas: 4.2,
        avaliacoes: 87,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO2yGBlH9tQh00S623YmbkVixPuDM2WdAtY3tXGclnfCU5-YRRRNdw9E5_yB1AU-fv2xrWcbFzlW9EDT5SHuqrLhkzD7Hpa_e59oiW8UfAOPTe4QGoXH9FyebACouPqFU46NcKiTqwo9aQDXw_K3Z8AfGv-ebXTvjke_NOCoU2adLFO&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TOP SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5316519,
          lng: -46.7566215,
        },
        cep: "05323-002",
        endereco_original:
          "Avenida PRESIDENTE ALTINO, 2953, JAGUARE, SAO PAULO - SP, 05323-002",
        telefone: "(11) 3833-0978",
        estrelas: 4.3,
        avaliacoes: 171,
        horario_funcionamento: [
          "Seg: 7:45 AM – 5:30 PM",
          "Ter: 7:45 AM – 5:30 PM",
          "Qua: 7:45 AM – 5:30 PM",
          "Qui: 7:45 AM – 5:30 PM",
          "Sex: 7:45 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP4lA74_i5rYIYvTJsFs_aYAsfwydFxMEZeK3CTDqgx-uVE6WNe0A5hLuVyaVNUtvJeEs8FWevrU2kDrkkAkjoPvI5s2tezHPMWQpeA1W4DQ33N5JX-582wPBrfdqxK_tTUHxbtNDAhPUCv9rwMGMgatT-7DS9jvLwIiveGv3XOowtg&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "REPAIR FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4540092,
          lng: -46.5091332,
        },
        cep: "07196-100",
        endereco_original:
          "Rua Ribeirão das Neves, 133, Vila Barros, Guarulhos - SP, 07196-100",
        telefone: "(11) 2404-1666",
        estrelas: 4.7,
        avaliacoes: 174,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 2:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMnQVpG_XWlO19wbKcXFiH2Depkbin6bq09ZBZvs2UsdtE--4D9Po0h4crrCMLbUHoSjiqdaDCnv9Z8PLHsJQ6EKnVfxEQTl9MmRFeqZyLeNNpsh1PRQMmabxJ_8l3Y8vtQGhl1qqSb59Y0_6e0t4N_Q3DZE-ZdbBbvkpWOsYbsPQIG&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MARANATA FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4151648,
          lng: -46.0242353,
        },
        cep: "08900-000",
        endereco_original:
          "ANA AMELIA CARRICO, 17, ITAPEMA, GUARAREMA - SP, 08900-000",
        telefone: "(11) 4693-2334",
        estrelas: 4.5,
        avaliacoes: 27,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO7o-nuoYlPvTsZh0Yixpt8K_zrqsv5TyzwWeM4k18_pzpc20KZUF00a52294ySz68eJsjgEbBfypm_eB5Rv1GTrIPSDrySm_n2dSbybTaI_ZbHDY6iSboLOsXDfd8rOUpPUt61XQd0ZJrsujoA1OJ8ZWApYeWuWpWnAIkt-irB-3Ps&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SS RENOVADORA DE VEICULOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.0983085,
          lng: -47.2074715,
        },
        cep: "13343-540",
        endereco_original:
          "Rua SEBASTIAO ALVARENGA, 233, JARDIM MARINA, INDAIATUBA - SP, 13343-540",
        telefone: "(19) 3392-1608",
        estrelas: 4.5,
        avaliacoes: 19,
        horario_funcionamento: [
          "Seg: 7:42 AM – 6:00 PM",
          "Ter: 7:42 AM – 6:00 PM",
          "Qua: 7:42 AM – 6:00 PM",
          "Qui: 7:42 AM – 6:00 PM",
          "Sex: 7:42 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM_y456aNbgKRCN9ZiETvQKY5et7waDl5kUcEpsNDhWMyWOWvzzapdDXraaYzQL-p-mEEBbAQ1pJZ7Gz9Dgor0ikKGXReL9dUNJFjlhlAjU4anzGkBE5h4tRHu5EznrxYmVumJyA027bL0fr5G01hDrjpAbajS8G49K3C93heVuIic&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SANTSCAR SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6019075,
          lng: -46.6110605,
        },
        cep: "04278-080",
        endereco_original:
          "Avenida Doutor Gentil de Moura, 397, Ipiranga, São Paulo - SP, 04278-080",
        telefone: "(11) 91234-5678",
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "BRASIL CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.517793,
          lng: -46.3430513,
        },
        cep: "08557-000",
        endereco_original:
          "VITAL BRASIL, 235, VILA ACOREANA, POA - SP, 08557-000",
        telefone: "(11) 4636-6632",
        estrelas: 3.5,
        avaliacoes: 172,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO0iFcLYlDtC2HyLUVpOn71x2a1FzqZn_u6qHgzGcT6Ti4-ygVUBT6qn7rZwkbUiCXBpfxVQlEKR_Z2qJhSoOcd08mw06rgLkJtsqhm_k1BxP93nNpmdU6cAF2Q_KRbg8xQxwGNOzHylV7kMKfBMSIA_mDGqOo9EHi8cr20AF-eAleX&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTOTECH RESTAURADORA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2116442,
          lng: -46.8776902,
        },
        cep: "13206-235",
        endereco_original: "CICA, 1277, VILA RAMI, JUNDIAI - SP, 13206-235",
        telefone: "(11) 4587-7231",
        estrelas: 4.6,
        avaliacoes: 41,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP3NLzRzBiNIGF_GSakWH_evXtMRNYBTqK18c2rN-tj20Mv75aMQ6BMqYCno-MrEJ0886UnXiUlWatJSg1f275ucOpz2bi3JipnKMboyAbOIxUQczbDlIDUGFgplDPNawpfW-Ycfg4-VaQaaiXTOk7_KjAZzeqD3FsBZhgPrt5AjVff&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO COLLISION SERVIÇOS AUTOMOTIVOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5287447,
          lng: -46.5268491,
        },
        cep: "03648-000",
        endereco_original:
          "PADRES OLIVETANOS, 721, VILA ESPERANCA, SAO PAULO - SP, 03648-000",
        telefone: "(11) 2659-9467",
        estrelas: 4.7,
        avaliacoes: 73,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPACPxe0zmGntDni_ZWSCbmtXISRCg_1g6c1rUt3zsWNKnCM0a5MRVNVsVs4el4nuTTzRQmjraXpo6x8oXPCNKM_PxX0HAshBWe5X7xGNcZQ2xoG9o_nETRf9_lmSHgWbt1vJyIf6DKgX1pw2L8j7qoiwjGhPsXzFWgzwu3E_yJD9wM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PALACE VEICULOS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.9456546,
          lng: -46.3281939,
        },
        cep: "11075-201",
        endereco_original:
          "LUCAS FORTUNATO, 83, VILA MATHIAS, SANTOS - SP, 11075-201",
        telefone: "(13) 3235-4890",
        estrelas: 4.5,
        avaliacoes: 237,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:18 PM",
          "Ter: 8:00 AM – 6:18 PM",
          "Qua: 8:00 AM – 6:18 PM",
          "Qui: 8:00 AM – 6:18 PM",
          "Sex: 8:00 AM – 6:18 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMt8w9PtqwRWFH26g79dy-d9QG8N65LnKtAFG35IGnW2sSen5W6zmlih5nLM2H605vh3O-GsODdv6k1ADjn9lCHfb1X6vzbwhmBfLDhUF45eFu424zZgntZSydnzz-yFgmMeNDDa6UopCCTmQIeZMb6NQpnm1QJrkFSNiVqXFW7ajkn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FACCHINI",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6189471,
          lng: -46.5683912,
        },
        cep: "09541-150",
        endereco_original:
          "PIAUI, 311, SANTA PAULA, SAO CAETANO DO SUL - SP, 09541-150",
        telefone: "(11) 4224-3822",
        estrelas: 4.5,
        avaliacoes: 105,
        horario_funcionamento: [
          "Seg: 7:40 AM – 5:30 PM",
          "Ter: 7:40 AM – 5:30 PM",
          "Qua: 7:40 AM – 5:30 PM",
          "Qui: 7:40 AM – 5:30 PM",
          "Sex: 7:40 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOaDPwD_4kDP28PlOVRC8Z8GJrcJbBud8H8EaQOSpl3nmLsv5PUogKj4xLkuNhHPLwIAjNno7D1KYyJCdf-hfj_gwBUl9lr6rIpzsJBQ9syrAkupw9wYL2TpvjVV5FPKb6zzCnY2AH1Jl3mBWjbdZ1wA9N3dVUFTDaFw4ti6Z80x2Wm&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "9 CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6540972,
          lng: -46.7596996,
        },
        cep: "05835-005",
        endereco_original:
          "DE ITAPECERICA, 3023, VILA MARACANA, SAO PAULO - SP, 05835-005",
        telefone: "(11) 5511-9506",
        estrelas: 4.4,
        avaliacoes: 280,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 3:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNC6ik-YW9mfVGOHnmJ9g52Zr0GDQRQbKUNDdlWUVgITs0kqYT_SO1FvsMjjPCjccmHU9q9tvVaaV_g7NqCd-FpMr99MW7Sfft7QbAgKe9IGWwujEYXYKwI8jbfqA5JY0CDQfDyQmeKOFJ5Vv64kWJX-vz68R0bw7Nvg4WOoh2KzrkF&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "COMPANHIA DO CONSERTO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.67878,
          lng: -46.45956289999999,
        },
        cep: "09360-090",
        endereco_original:
          "CARLO DE CAMPO, 510, VILA NOSSA SENHORA DAS VITORIAS, MAUA - SP, 09360-090",
        telefone: "(11) 4555-1744",
        estrelas: 4.9,
        avaliacoes: 91,
        horario_funcionamento: [
          "Seg: 9:00 AM – 7:00 PM",
          "Ter: 9:00 AM – 7:00 PM",
          "Qua: 9:00 AM – 7:00 PM",
          "Qui: 9:00 AM – 7:00 PM",
          "Sex: 9:00 AM – 7:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPzb_lTuCqofbUVW31tIutPt5TozWNIuQ9ftHUU2c_oQCOOWZc29Rgo6Bc_17dbEvORyrL_x37jmeA-NlvrzL4n2Slus6h2E6H2bblvyBnoESbbZO5eTiJRa3uB3i8yPgtzJtuYhcZddvjchBv6MU02QpOjEaANBwLHv90DbSIL-sW-&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALPHAFIX REPARACAO AUTOMOTIVA LTDA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.1427891,
          lng: -47.2394955,
        },
        cep: "13347-613",
        endereco_original:
          "Avenida Vitória Rossi Martini, 549, Comercial Vitória Martini, Indaiatuba - SP, 13347-613",
        telefone: "(19) 2660-2129",
        estrelas: 4.8,
        avaliacoes: 115,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DORPEERqF3x-q2RfDGRZ5BA5ZcvCNSrovV-hH2Mw20rWQh-A5spUXFYiBRFJgYKEJV6oBGY9nLEwiURgti6lMgAvgGGBg7q7lA_tyYHoPnCBi3VmAI9V6TBOJOaldwC6TDNmwciG_84TvKwvC9i9gqoR7l3ElgIKUQaSCGIAlP6Ksx1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PIRAMIDE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5104104,
          lng: -46.142828,
        },
        cep: "13920-000",
        endereco_original:
          "PAPA JOAO XXIII, 770, JD. SAO PEDRO, PEDREIRA - SP, 13920-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "CORONATO AGUA BRANCA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5116367,
          lng: -46.6926754,
        },
        cep: "05036-001",
        endereco_original:
          "SANTA MARINA, 1520, AGUA BRANCA, SAO PAULO - SP, 05036-001",
        telefone: "(11) 3611-0934",
        estrelas: 4.4,
        avaliacoes: 198,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMGPJ_2V3AY-_fZrL46ZNLR2EpR3iwf9BkzLoq3X0pNV96s1fPN1ji3YDun2g3kCwO_v0-DIBJbQl5sUQf2vGkoP8J0LNKEoDPLA6E-tyHGnI9M-zb3Gsx3fc_LIAjvJ1ceJkuIuQrbpThWqxl5D011Gztpam2mgVflxQtaKNy_8P96&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CARANGOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6266233,
          lng: -46.6183993,
        },
        cep: "04161-050",
        endereco_original:
          "KITIZO UTIYAMA, 63, VILA BRASILINA, SAO PAULO - SP, 04161-050",
        telefone: "(11) 4178-1589",
        estrelas: 4.6,
        avaliacoes: 48,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:50 PM",
          "Ter: 8:00 AM – 5:50 PM",
          "Qua: 8:00 AM – 5:50 PM",
          "Qui: 8:00 AM – 5:50 PM",
          "Sex: 8:00 AM – 5:50 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN19VvmhZiVyuSCv8l_LOr2JWiSAKBMS3Bm8nE_8SS3QeGbo4e8sDtpkQbE4LNJNPMXtYxWr--3KOoQC3e2vI-NgCXBuLj35G9vWZP7ERkvGmuIS3MtUXjTFNOT8J4wum_30M2WfhIrnOqqd4ed6iuVIsh4qM3dFbNZlmJYmdvCDpI2&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "QUATROCENTOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6731984,
          lng: -46.7104603,
        },
        cep: "04764-050",
        endereco_original:
          "dos Inocentes, 537, Socorro, Sao Paulo - SP, 04764-050",
        telefone: "(11) 5681-5774",
        estrelas: 4.2,
        avaliacoes: 339,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:30 PM",
          "Ter: 7:30 AM – 5:30 PM",
          "Qua: 7:30 AM – 5:30 PM",
          "Qui: 7:30 AM – 5:30 PM",
          "Sex: 7:30 AM – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMcOqXaagq4cR_5dCMso3G8v1dSwXsmE81vOTdcD35FV7-GckKmKQ5_-9vwwc6WphxYs9y3jRST9tcVzXu5nk5Ax5PHsUTqcz4Y6WMZOZPYoDF04OPqRgik6B_zV3v1oriqn0V6KcRXs6PT_faliRh0M-PCUDSn7DfzCM6ytyyPUeGC&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LECAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6320825,
          lng: -46.5692045,
        },
        cep: "09540-204",
        endereco_original:
          "AMAZONAS, 2403, OSVALDO CRUZ, SAO CAETANO DO SUL - SP, 09540-204",
        telefone: "(11) 2786-4967",
        estrelas: 4.6,
        avaliacoes: 247,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM14dFIEJ3N7vZ1KpKn7gd00GXsX4TF63hAtg7EiaQQ0K9-IHdq-YKXHf2NGn_Z0NtzhgbGIgDam7Hm0nM3JbyS0La64m2_Dg1gPnYpkezhi9jlT5kiYXJBak-x5HYjKM0ovXTpyHOInzEaFVZwb7puF5faW76RRHpcxYIHUXg_DJw&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TONINHO FACHINI AUTO SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6216696,
          lng: -46.53086039999999,
        },
        cep: "09230-000",
        endereco_original: "SIDNEI, 715, UTINGA, SANTO ANDRE - SP, 09230-000",
        telefone: "(11) 7754-8554",
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "C CLEAN",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.4613612,
          lng: -46.52066199999999,
        },
        cep: "07113-000",
        endereco_original:
          "PAPA PIO XII, 937, MACEDO, GUARULHOS - SP, 07113-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "FASTCAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.1195316,
          lng: -47.22415280000001,
        },
        cep: "13347-404",
        endereco_original:
          "Rua SOLDADO ANTONIO LOPES PEREIRA, 685, DISTRITO INDUSTRIAL JOAO NAREZZI, INDAIATUBA - SP, 13347-404",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "DITO FUNILARIA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5136746,
          lng: -47.4302272,
        },
        cep: "18020-003",
        endereco_original:
          "CORONEL NOGUEIRA PADILHA, 2588, VILA HORTENCIA, SOROCABA - SP, 18020-003",
        telefone: "(15) 3237-3574",
        estrelas: 4.3,
        avaliacoes: 140,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMRa9KC9ohKvz5RD-SxI5XHVHZAhEJsVjpl98vdKee4nXDX74hzOJKp_4R_QigUdMP-QFlvJH-alzCMzRt2afNcb9AWy9_pF-mUIE0ig0giqy5evP6XQmbA2r69gI8qMA-rBbrdEH911t1ni8bt2eYbVOdTXdsOVgJZxfpaBstfe9J0&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA RN SERVICE CAR",
        servicos: ["Vistoria por imagem", "Funilaria e pintura"],
        endereco: {
          lat: -23.5352675,
          lng: -46.6452029,
        },
        cep: "01215-010",
        endereco_original:
          "Rua HELVETIA, 468, CAMPOS ELISEOS, SAO PAULO - SP, 01215-010",
        telefone: "(11) 99498-8795",
        estrelas: 4.9,
        avaliacoes: 663,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMeMRaoQQPJp2Sonnq2QlNXHoh5ZexrU5InkMgAkh7-7Qx_qKQ5nUZEg9v2tfcIifxXKpVsdSukVYHtcZYD8d03OKTh3xowIlUFqo-IU1Wa_XUu4jcQPY7mD6NkNbC03-rBEJ6oH1nog37zebji9EvCEIHCsGHUGGVDdf5kY2DSPXNV&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NICOLA GARAGE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5311412,
          lng: -46.65441910000001,
        },
        cep: "01152-000",
        endereco_original:
          "BARRA FUNDA, 308, BARRA FUNDA, SAO PAULO - SP, 01152-000",
        telefone: "(11) 96405-6107",
        estrelas: 4.9,
        avaliacoes: 12,
        horario_funcionamento: [
          "Seg: 7:00 AM – 5:30 PM",
          "Ter: 7:00 AM – 5:30 PM",
          "Qua: 7:00 AM – 5:30 PM",
          "Qui: 7:00 AM – 5:30 PM",
          "Sex: 7:00 AM – 5:30 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "BRASIL",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.216975,
          lng: -46.8465535,
        },
        cep: "13220-540",
        endereco_original:
          "JOSE RABELLO PORTELLA, 715, JARDIM MARIA DE FATIMA, VARZEA PAULISTA - SP, 13220-540",
        telefone: "(11) 4606-1927",
        estrelas: 4.5,
        avaliacoes: 66,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:50 PM",
          "Ter: 8:00 AM – 5:50 PM",
          "Qua: 8:00 AM – 5:50 PM",
          "Qui: 8:00 AM – 5:50 PM",
          "Sex: 8:00 AM – 5:50 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNJIECF-dDCmedTdFxhyuMegb92gDQVi13zuYd2OinfufKs46nN7oN7sz6CWZc5DvcxQAZNCBivVIal2i9d5c_mM-4mYAgykAwHmk8e0ySQIwlvxg0B-9YpHbeL4pyk_JdvFSmdCHxjTaLW8T-wt4hvUr5c9N-7Zr6Pl_ZBlh9ARsHY&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TC CAR SERVICOS AUTOMOTIVOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.9400004,
          lng: -46.3219567,
        },
        cep: "11013-350",
        endereco_original:
          "SETE DE SETEMBRO, 75, VILA NOVA, SANTOS - SP, 11013-350",
        telefone: "(13) 3222-8004",
        estrelas: 5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOsdQkZZ0e_lTnnNDpJJCnSMrzsUEHNj48e9ovZsW15LFoPYtjZglMZJAT2PLK108Z1BhKjGZRoWyZrUohWrISQf-QFNd5K_hFPW20sl2sKvxJKLnZ88UgZyDrBeLJ17Nz7Jyu93WwyQJjR3l_uzIp5pVLkB3gyS57pd3fG3sP51y58&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ANTI SHOCK SERVICOS AUTOMOTIVOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6616856,
          lng: -46.51645269999999,
        },
        cep: "09015-311",
        endereco_original:
          "Avenida QUEIROS DOS SANTOS, 1700, CASA BRANCA, SANTO ANDRE - SP, 09015-311",
        telefone: "(11) 4438-1212",
        estrelas: 4.8,
        avaliacoes: 545,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPwYM9-DmeAGRoGgbxsX-uKt4cSS0GFQzdsFl9olv5_l7q59fS3XTR0thRcyXv5g20uGUBNBr-RYlvf22e_jxhBROYWvq4T0E9aSB48MztLomQYW6-2dfkcTiKLlZAGI2rUSqJQhAuKFUYTW78dyrtxHcYUW88trzHB-oGSS6pgSLGN&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RUI IBIUNA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6583241,
          lng: -47.2113267,
        },
        cep: "18150-000",
        endereco_original: "MORAES, 597, LAVAL II, IBIUNA - SP, 18150-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "TIO CARLINHOS",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.0155257,
          lng: -46.8393112,
        },
        cep: "13255-180",
        endereco_original:
          "ANTONIO GALVAO DE CAMARGO, 530, JARDIM DE LUCCA, ITATIBA - SP, 13255-180",
        telefone: "(11) 4524-5107",
        estrelas: 4.5,
        avaliacoes: 216,
        horario_funcionamento: [
          "Seg: 7:45 AM – 5:30 PM",
          "Ter: 7:45 AM – 5:30 PM",
          "Qua: 7:45 AM – 5:30 PM",
          "Qui: 7:45 AM – 5:30 PM",
          "Sex: 7:45 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNvUxpL9we44EpS41HiCRm5C-uiVdKRzrSsbK69V3IFTlMXjalgJV2d-qv4JmgOyMrJ9rJwyaLqx8TSMj4VdD6NUdvFfjumeV4N3tkgsoDhdDGiZldgwoc3QvMg3jSbr0BKhaB_j5xO9Apai89PUUinBNOQn9BV7L5Uvnl3h2Dy6C00&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BASTOS CAR FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5589393,
          lng: -46.5952309,
        },
        cep: "03116-000",
        endereco_original:
          "Rua do Oratório, 630, Mooca, São Paulo - SP, 03116-000",
        telefone: "(11) 94790-0511",
        estrelas: 4.8,
        avaliacoes: 26,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 4:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOyks2S8IJtd6PlsieLJLPjeHJselR1TVg76OklP-CWB6zNxSuqHKgbehjEKgLsXS-3ojR5DL545d5UJJmZSKEma_mX3X2rraCSNAY4INYi8D0Vs665xwMQlOmw1HjM0JImSkH4RkhTI400Wp4jYUnOT0Bt4yG-mJBiWqR59-vcrx-d&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DUCAR REPAROS AUTOMOTIVOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.549826,
          lng: -46.5539958,
        },
        cep: "03312-052",
        endereco_original:
          "Rua PROFESSOR PEDREIRA DE FREITAS, 870, TATUAPE, SAO PAULO - SP, 03312-052",
        telefone: "(11) 3473-0532",
        estrelas: 4.2,
        avaliacoes: 84,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN_wLUtuZGXHPipIQpHn38aBef60WToIfmjC3M469qAONib6pRqJWS6A8kIqggLoPvCtLAH6sCmaLykqXaa9xMZAhnlUqRBIQ-5N_n14oFNnzbT67UoSb17BSoqVtE-bKTsOVZkFWTU9d_vc4WnO1jLPsd0A0Cneu0k85OsbvBQVR78&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALIANÇA CAR AUTO CENTER",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5621468,
          lng: -46.55117610000001,
        },
        cep: "03356-000",
        endereco_original:
          "Avenida Doutor Eduardo Cotching, 1037, Vila Formosa, Sao Paulo - SP, 03356-000",
        telefone: "(11) 94355-2825",
        estrelas: 4.5,
        avaliacoes: 220,
        horario_funcionamento: [
          "Seg: 8:00 AM – 8:00 PM",
          "Ter: 8:00 AM – 8:00 PM",
          "Qua: 8:00 AM – 8:00 PM",
          "Qui: 8:00 AM – 8:00 PM",
          "Sex: 8:00 AM – 8:00 PM",
          "Sab: 8:00 AM – 3:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO7XyU4FTj6cIuPHMxRWmUQGUUNq20_GFuYZ-qnqqT68_H4fkz8q7nSWworksBXDR29KGPGfnYBwFbdJ5ypV97XjJr2zsRJuYXwOL6JON6kccHO6t_omaAAodW__3cJII6Y0yfVirXLzT0wx9hs9ikhIggtI2V5RGwosVrGLG17g-w4&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MADRID SERVICOS AUTOMOTIVOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5689404,
          lng: -46.4770204,
        },
        cep: "08275-000",
        endereco_original:
          "Avenida Maria Luiza Americano, 1405, Cidade Líder, São Paulo - SP, 08275-000",
        telefone: "(11) 95882-8264",
        estrelas: 4.5,
        avaliacoes: 300,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMNrv3JVi48chANwqfVjQMNre70MHHOkjPx6oHjb1kVJmmk1ts0W2EsMkF7a9zk6RzKvY1HT6-bQ6CFoLq3UlND0xtkupqcNsHd1HgynGcTvSMMyFwAANmDx66QEznqnrvu11tPeUCd0tTSfs8D9-J68uJmELYG4KSPBYaPNH1mn2x9&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "APICE FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5386381,
          lng: -46.4577176,
        },
        cep: "08220-510",
        endereco_original:
          "Rua Padre Viegas de Menezes, 66, Itaquera, Sao Paulo - SP, 08220-510",
        telefone: "(11) 2554-2080",
        estrelas: 4.5,
        avaliacoes: 74,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOYBNXYcBmaKVpam8-Uj-UGaA2_wc9wlt6AWko0Yq0vDS1n6u49p2fxeEzdUj4iTAy-ZdGOSA8QQihMz4bz0-anJBLDHvQjgvv2wO9grKpBVG5XFsg_8u8ZIX_wgP0mh4rpPjdlZNDkRHCpYEzu9ztwy-0d4COyAx9PIOH1GHfs8Afi&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GRANCAR REPAROS E PINTURAS AUTOMOTIVAS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4973771,
          lng: -46.4421024,
        },
        cep: "08020-000",
        endereco_original:
          "Avenida Pires do Rio, 109, Vila Americana, São Paulo - SP, 08020-000",
        telefone: "(11) 4371-9640",
        estrelas: 4.6,
        avaliacoes: 93,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMt9F0RjQqjUFwvvFuU5IYJlKI_cyFqeTWzpYoCKmiouUVmn-KvQ3rEfvDkjji-y65X40XRxUilYvq6wsddjpMdLfXm3J_mxYypuJGfscGG35pbD6JDV1zQJNTjICIfMNyEGI1EDzJFNvBP1ao_QOtHyZVjfSvV-v36w_fBr-JjEMdI&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AJA REPAROS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5519959,
          lng: -46.3200871,
        },
        cep: "08673-000",
        endereco_original:
          "Avenida ARMANDO SALLES DE OLIVEIRA, 2300, PARQUE SUZANO, SUZANO - SP, 08673-000",
        telefone: "(11) 4743-3110",
        estrelas: 3.8,
        avaliacoes: 147,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMuyox3XoTe-y6ssFVXkr7BI-G35pNoUnRrxLh4YmGcaHz5yIu9BRbxwY3fx92SqoxRHvHkBoesn3oYhyEi3kBYCIWzJVBH61HB1NiAGaFQmvM_eDXXBZqKn0-1O5l4BNhfDsH2BDtybx883z8bS30LECS5yr0ZQ_J_hSbcufo6xYC8&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALEXANDRE E DIEGO MARTELINHO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.4830399,
          lng: -47.42595720000001,
        },
        cep: "18013-280",
        endereco_original:
          "Engenheiro Carlos Reinaldo Mendes, 2120, Além Ponte, Sorocaba - SP, 18013-280",
        telefone: "(15) 3237-5444",
        estrelas: 4.4,
        avaliacoes: 290,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNLao99oIXtcSwuB6m_D8wSKBsKUH_Bt7YcORqJnvLZSazINzhXNyffOwukt2ckE1mBzuA1yA7Xh3xlxWd59p0fnFvOdMO1A2SMNHQ60D8Pcdj5U1PPzsfkgHvjQemr2PutbdfPNkclddPKptpAKnQU_hZEQDTDL_Cd4kQGsiwT-eBV&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "STOP CAR BEM",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5532315,
          lng: -46.6144118,
        },
        cep: "03101-020",
        endereco_original:
          "Rua Doutor Freire, 192, Brás, São Paulo - SP, 03101-020",
        telefone: "(11) 2339-0356",
        estrelas: 4.3,
        avaliacoes: 15,
        horario_funcionamento: [
          "Seg: 8:00 AM – 7:00 PM",
          "Ter: 8:00 AM – 7:00 PM",
          "Qua: 8:00 AM – 7:00 PM",
          "Qui: 8:00 AM – 7:00 PM",
          "Sex: 8:00 AM – 7:00 PM",
          "Sab: 8:00 AM – 7:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "HIGHLIGHT AUTO SERVICE",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.593915,
          lng: -46.60141549999999,
        },
        cep: "04214-000",
        endereco_original:
          "Rua Labatut, 540, Ipiranga, Sao Paulo - SP, 04214-000",
        telefone: "(11) 2273-9060",
        estrelas: 5,
        avaliacoes: 90,
        horario_funcionamento: [
          "Seg: 8:30 AM – 7:00 PM",
          "Ter: 8:30 AM – 7:00 PM",
          "Qua: 8:30 AM – 7:00 PM",
          "Qui: 8:30 AM – 7:00 PM",
          "Sex: 8:30 AM – 7:00 PM",
          "Sab: 9:00 AM – 3:30 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP1kmiXwTRMkxRiUSKUVJNrowUDhm6ENK_3Q5G_ytmXwF29F9AVdVTKIzn-jpnoZoEJtGGZlQX0AVXTXln3aoQ4KAfcl6q__PxsqsUrfxLquaPXN_hFq_A4bvXDiFlb0IQiD0ll64EqVeX1JEYMuXb9I6YUEwf6oxPvm39j3Z6NjgEW&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ART SYSTENS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.550373,
          lng: -46.4968799,
        },
        cep: "03526-000",
        endereco_original:
          "Itaquera, 2803, Jardim Maringá, Sao Paulo - SP, 03526-000",
        telefone: "(11) 2217-5181",
        estrelas: 4.2,
        avaliacoes: 375,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 5:48 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 5:48 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 5:48 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 5:48 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:48 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPz_o7TGPaFyqV0DbYgoSeX9_fT0IEt2E4x3FGsdQuMoKFl3TGrNYTd4QmiKC7B-Ch9Qob4Nqos524IVx_u7R-_M5-n7ssFoznOWduu9mkweQINKvAxqb8M8qf-euq7zqFvR_l1-Vpy7L877o3uJTwBkSwkD0KI2BEDVawgSJDnNrRo&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RESTORE REPARACOES",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.877577,
          lng: -47.2077435,
        },
        cep: "13186-604",
        endereco_original:
          "CARLOS ROBERTO DE MELO, 220, PARQUE GABRIEL, HORTOLANDIA - SP, 13186-604",
        telefone: "(19) 99148-6529",
        estrelas: 4.6,
        avaliacoes: 118,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP8zzVkPVYAfOBVp1gko3xmCB_IfF9YHsOa7MFPQ0yNmbNKfZqs9TLtaanCA4maB271xQNzZG0OPzyFeeHqWAzBvIhT7IeEeKNGtqJsPV94wUZTwD6feJAr8E8kQkS79DT2NTE-qtAuO7dR8SWfRT2nodUWF7oh6GyNYSdubgI9UiAk&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NC FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.8653737,
          lng: -47.2077029,
        },
        cep: "13184-260",
        endereco_original:
          "Rua Luiz Camilo de Camargo, 1434, Remanso Campineiro, Hortolândia - SP, 13184-260",
        telefone: "(19) 99397-1837",
        estrelas: 5,
        avaliacoes: 104,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNlVf5BiAyFVuk8elYC5b7e4HZQJn17YD8bYkcvy1MIZVV1wHpYJclDCxs5zmPTFCY4wgeJmTuVuqn9xJQ50U0ykL2EyczEJxSdlw0ZYzCtN6ysNAKZAgFncb-Ll54m6mNdY4_QibcfMYi1t0RH7UgxXVaScY5mXFStjBaUVZrQb5bQ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO PERFECT",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5279166,
          lng: -46.6586529,
        },
        cep: "01152-000",
        endereco_original:
          "Rua BARRA FUNDA, 867, BARRA FUNDA, SAO PAULO - SP, 01152-000",
        telefone: "(11) 3660-2727",
        estrelas: 4.5,
        avaliacoes: 205,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMj0t0DSn19k6hjhCWcl6QRCxfj_fxhmmSz7gGNIZar9KCgZZbwVKX5YNekX5UuKgVTPmYB26EHviC98hh7q1VuxnetqUiUz0up6Cn5MK8NmO396soQWyCGh3F6LwwuHSwB9vf1oNs7NZF_tcLR1f84EYGELKC2D3WvdOuPsDg-KLMz&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FAMA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5047318,
          lng: -46.5920394,
        },
        cep: "02127-001",
        endereco_original:
          "Avenida ALBERTO BYINGTON, 1233, VILA MARIA, SAO PAULO - SP, 02127-001",
        telefone: "(11) 2634-7070",
        estrelas: 4.3,
        avaliacoes: 118,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 5:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 5:00 PM",
          "Sex: 8:00 AM – 4:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMzRE8dm1HuDa1IB9WpeiAYtIoDIFegsXfuuQB5yKm0mFqiIhB4U-wWepu9YJkXfo1an4muVCgz7cu-bPPF3cpfl-03ALlQpx5U8TwgU-8rI9Gqw2qOEN8Lub8GeLsq7K9yLF8Q4M2jiMEb_bQGqznE6ranb-BKCm69rqHU53zIIcAS&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FRISON",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4882522,
          lng: -46.7301109,
        },
        cep: "05154-000",
        endereco_original:
          "Avenida MUTINGA, 326, PIRITUBA, SAO PAULO - SP, 05154-000",
        telefone: "(11) 3906-1640",
        estrelas: 3.5,
        avaliacoes: 208,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMS6sRmhEA8wi593qF_2lyGeJ-eVOkrQD8sK8sspbzR89rrUAmTbz4LTddY8kU1hXlRLLX4WczIiBBTFQW9HPKOliXEUJ6VxyfgeyH4V_NBlomzNa09ETo0TAxsIxzb9tYqzw6omBDwBKiddAGJZ-boL7KfuFs6kdEUgo_OCgoFxmoM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAR SOLUTION EXPRESS",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.3896147,
          lng: -46.714028,
        },
        cep: "07739-050",
        endereco_original:
          "PAULICEIA, 1090, LARANJEIRAS, CAIEIRAS - SP, 07739-050",
        telefone: "(11) 4441-3160",
        estrelas: 4.5,
        avaliacoes: 128,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 4:00 PM",
          "Dom: 9:00 AM – 1:00 PM",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNhWFK3f1nize10ufPudNUfiZPt0DT_vRiVy4eIiPWr8M6fZygdwPOX3uaSOmCNNkEcMrveX99BDS_6DelqO_dJ2y_LDjWMgRDOU2_jSHGBvyIPpSbLvO_OY-5dJ4wS1o0vfcqhx6nPYGJgBodm-qTQ3jTPUzGeZQs3EoZk8fNf-pVV&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO REPARADORA SAO JORGE",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2857904,
          lng: -45.9487778,
        },
        cep: "12306-740",
        endereco_original:
          "Rua OCTAVIO MARTINS, 22, JARDIM ALTOS DE SANTANA I, JACAREI - SP, 12306-740",
        telefone: "(12) 99703-6108",
        estrelas: 4.8,
        avaliacoes: 14,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOCa2caFWMd52THvWWsBJExuY5v9rYZk5r0zsYbvPWsb-Sz5n0Km7t27cx0zLO48V_9_XkgC7HziN4UGVX_RJXZhhFYEZwXFBz5DlegersXV1wwpZHp7QotdWAPM21aPo9TFHrlFXr6jv8IYDxoM89oKIlCmCBSMBl9pa3KpzNZo3s0&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "REPAROS AUTOMOTIVOS CLAUDIO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2378135,
          lng: -45.9163091,
        },
        cep: "12237-640",
        endereco_original:
          "Avenida George Eastman, 415, Conjunto Residencial Trinta e Um de Março, São José dos Campos - SP, 12237-640",
        telefone: "(12) 3931-0827",
        estrelas: 4.8,
        avaliacoes: 198,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN38Nuj3A4lTUhX7w9hlRvN257D20N6Bk0CHDTI99bfBsVat80I8jJtWzV8LtdVuVWfkxsLPI7gNJ55hqUYXa5KSC9SDs2sVR5040iUPn-EmP1EYnylIHik80ETTfLQxJJkro4l0x4aEnITeVWvL5GazYSFgyeY6TXga17Jkol4D5wo&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUNIARTES - FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2102308,
          lng: -45.8880533,
        },
        cep: "12231-140",
        endereco_original:
          "Rua Noruega, 87, Jardim Aeroporto, São José dos Campos - SP, 12231-140",
        telefone: "(12) 97406-0933",
        estrelas: 4.9,
        avaliacoes: 23,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:30 PM",
          "Ter: 7:30 AM – 5:30 PM",
          "Qua: 7:30 AM – 5:30 PM",
          "Qui: 7:30 AM – 5:30 PM",
          "Sex: 7:30 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNaDRUg4M4GnUjBbmP3i4aWCL7eajk1x42OzuwV4sIPEBQ8XIrEmhgbkFDHQzzmXutW3KDf8FG7t3_INqSxiwFfl0R0El7iuuzZechlHb8sFbiD-IipRhofSF5PgQauWbanyJBoi5vCqv9ozOmNQGt5d4RTsU-4N9BZi3uSUA1FR6nU&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA GLOBO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -25.4930505,
          lng: -53.5982448,
        },
        cep: "85790-000",
        endereco_original:
          "ROD PRT 163, KM 59, 0, ZONA RURAL, Capitão Leônidas Marques - PR, 85790-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "CENTRAL SUL IMPORTS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6548698,
          lng: -46.6482955,
        },
        cep: "04330-070",
        endereco_original:
          "dos Marapés, 220, Vila Parque Jabaquara, São Paulo - SP, 04330-070",
        telefone: "(11) 5679-8169",
        estrelas: 4.5,
        avaliacoes: 106,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM6oduYDQ--Vdgdsi6bzPWpP3Lvzk_HQ14X5KDVNAy5NZbwzfSsILTe5xDaVoceIEC1pi8_kYEW7gBBn6OnisNm1cT1d_Whyo1Zj4WJTM6i_iC97vkOWPr2J7gLUYUxgxSRqGNnOY5hs5ZaynSsnlOgHB5XxuwPRhtLIqiSDqaW6oHR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "N VORZUG",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6402835,
          lng: -46.7160778,
        },
        cep: "04728-001",
        endereco_original:
          "Rua Laguna, 698, Jardim Caravelas, São Paulo - SP, 04728-001",
        telefone: "(11) 3841-9378",
        estrelas: 4.4,
        avaliacoes: 108,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOdN9hLx5-9fX-4uFWKI-e54K8TAxHGyYIfu4oEaFNQXMw4XHjgybK5DEtDb1ZKskKjaxhF4vJKMAtA7xppiEvTBN0lq71bIdLrh6RcmxoaSDwNwy-h_PFVN2OiqJdKgXgmnv1gXx2OKuqulqTB6jHLwJp-gBQkSZE8nq_INu8MjBsJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PERSONAL GARAGE",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5083359,
          lng: -46.8510728,
        },
        cep: "06465-120",
        endereco_original:
          "CEARA, 115, ALPHAVILLE EMPRESARI, BARUERI - SP, 06465-120",
        telefone: "(11) 4133-0660",
        estrelas: 4.3,
        avaliacoes: 322,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNR0wr8OUYGPzVHIVOjp0JL2vWbogH_DXwEme9CImZZpi8vkU9CiM1-o1vf6xAiSE_MROsIJO4zJujNd_AA6I8G4Xph0YidMCtRly7O9cEG2OZCT46m1D7KCGtjP-iBuiZcsL6-sk8ayDrRh38PujTSX6lc5dlkF0n1vxbl6Hr0Dlao&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA PASSARELLO",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.8301455,
          lng: -46.8181527,
        },
        cep: "06900-000",
        endereco_original:
          "CLOTILDE DE LOURO, 576, VILA LOURO, EMBU-GUACU - SP, 06900-000",
        telefone: "(11) 94750-2749",
        estrelas: 4.5,
        avaliacoes: 24,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPwghCddHzg5qEOT1BQN6gFMCUDQ3A8exV2kXrotlEp8nBse3j6jSH-GJSx5-vPJFfV-DlVy3jUeOraU5PAa1XQfAQWgekx5MKSDv62YshbxcW4tha3motmou3zD2GEbocwXZ9P8UFRKRYhiou-L9IbvnT1779WfAIKdD_P8bj8k7BR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SMART CAR STUDIO AUTOMOTIVO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5378845,
          lng: -46.6754099,
        },
        cep: "05010-000",
        endereco_original:
          "Rua Caiubi, 834, Perdizes, São Paulo - SP, 05010-000",
        telefone: "(11) 95838-6235",
        estrelas: 4.4,
        avaliacoes: 32,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPtTM-vY07qMTXs4USFNBS-xmHZ1xNNGD_cxvhTwtqyT1UUjnVpEr3iIHaD86be2vwsWY6hSTMFeRpTLZ3JQKDx4m5O4aGPfHHw3kmMwYZiL8DqpDgQHha5aESLlu-ehIv6Pk4AkjLVRn3oQbkbEAaVcZSD-plVl1uajejNyNGtrvlZ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GD MOTORS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5775154,
          lng: -46.7077799,
        },
        cep: "05513-000",
        endereco_original:
          "Avenida Professor Francisco Morato, 649, Butantã, São Paulo - SP, 05513-000",
        telefone: "(11) 99160-3214",
        estrelas: 5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP-hCjmDjFG6KHitGyjmZahAe8FQsDnQ7pqYINfILlmpjMXp8qqnWVtDjV4qJpW6MdYfZTm9je58bGd-hef-IJBHHny1u7oYOJ4jt_npOPpA8Us5RxWP4_PNkO4lS_DEqL1yMBpcQa_dpy6S41xqWURK96sghfuCKM5eiKDKOCWnQxf&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BFP-ALBERT EISNTEIN",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5992162,
          lng: -46.7189154,
        },
        cep: "05653-050",
        endereco_original:
          "JULES RIMET, 123, JARDIM LEONOR, SAO PAULO - SP, 05653-050",
        telefone: "(11) 4040-2330",
        estrelas: 4.9,
        avaliacoes: 130,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOPjQkTXFloZbQZg1C9YO6FQ7XmCfN8PhDYXEoDUGtYF2SYtsgeiJSvz_ucwJEfn9fBnp6Ir1ZSLh2iPPMpFbb420c4qxXhZtHGkflzMI44yQuXV2DTgpMC-FcfRVWV6y6jyGYCuRprmWZAySzx-Ei_fn4g-XVDmIxt397zlFJcfr9e&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TONIMEK",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.528069,
          lng: -46.740303,
        },
        cep: "05314-000",
        endereco_original:
          "Avenida Doutor Gastão Vidigal, 1078, Vila Leopoldina, São Paulo - SP, 05314-000",
        telefone: "(11) 3647-3360",
        estrelas: 4.4,
        avaliacoes: 897,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOv6JMZq4fO-_TN2KizbqBSV5CXsKiPj-Mcs_qtpBn541h0tT5wGbxKhttopuipI4Ak1xW7CFMft2SxX7xXbsWyJiuLyAtH-K0M3BUfnbRWCLg_9BUUVDPZr1S2yla1QefjxGPaoFEGLPnXUZeaEv3w7UZ5kz3UZ-4yl_kvUXt1JPQv&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GAZZANI FUNILARIA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6455389,
          lng: -46.4931235,
        },
        cep: "09271-000",
        endereco_original:
          "Avenida DAS NACOES, 2461, PARQUE CAPUAVA, SANTO ANDRE - SP, 09271-000",
        telefone: "(11) 4472-7788",
        estrelas: 4.8,
        avaliacoes: 58,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMxlMNQ5guegyXOJdXS0kTnzsrnbfZvh32dy8x6M6eQxU2Wxcmy2fdyDeHaASEM7uRhsiF4E2L1R-8EU2uukyqZf0TNOnxnzrE6plJPPehNxs7hhqTCsJuldpqV7RfnHQDgF3OkjUTAgCzA97edZqKl2jyqGZ86Ue1XAdpePLvLv4BO&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LV GARAGE",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.7020454,
          lng: -46.5505866,
        },
        cep: "09771-220",
        endereco_original:
          "ERNESTA PELOSINI, 102, NOVA PETROPOLIS, SAO BERNARDO DO CAMPO - SP, 09771-220",
        telefone: "(11) 4343-6459",
        estrelas: 4.9,
        avaliacoes: 611,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOdGKMoggoaH3KPCdYrgxNow8ysH2xJyHDQh2JtDuxT5tJG1zIWFiCW1xnFORA61zIpJbmYKddTDdyDjnyrQvp9nJ6eUEiEBdAWJE4qwsn382JWxVgV1Kd6525iRBj2gW_1hkJr_ryvOoEfa3lMxu2190l-0qxf-xYxbaOq99CxF588&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MARTELINHO DE OURO SB CAMPO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7202683,
          lng: -46.5802655,
        },
        cep: "09812-601",
        endereco_original:
          "CRISTIANO ANGELI, 1750, ASSUNCAO, SAO BERNARDO DO CAMPO - SP, 09812-601",
        telefone: "(11) 4109-8675",
        estrelas: 3.8,
        avaliacoes: 64,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:00 PM",
          "Ter: 7:30 AM – 5:00 PM",
          "Qua: 7:30 AM – 5:00 PM",
          "Qui: 7:30 AM – 5:00 PM",
          "Sex: 7:30 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMsX0Wfj4Bb4UsfsRnACxwQ9sjV25Be8Qwg9VQj-qPW5iddPV0qPI6qmO6HmoUdlYxHTwec_cwbo_lEK7wuT7c2wXDvhtHOvTiNMvuQq-t7Bb72mnh312dz9ngQ2P8MC0z8C-texnfXXiJRe96AZTp717058sbtX4iLNa5hwKb_47_P&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MAX FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2936701,
          lng: -46.7328894,
        },
        cep: "07998-100",
        endereco_original:
          "Estrada Ulisses Guimarães, 1225, Vila Guilherme, Francisco Morato - SP, 07998-100",
        telefone: "(11) 91360-4569",
        estrelas: 5,
        avaliacoes: 8,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNMj7CQOi4O20k5F2QZI9AAhaOYuWResbonalisXS3_fw43j8XjkvavePLjoSwtAwBZ2kD0m_EaA3GdGVU6Ho5NAxmQooZ3kCuFmj5cS435Q-I1suGUFsOL9xQZXF1CW_oxAUgQBylQQVcZ8wLSMbUuPUwiI10Odbln85PqaEwjx6Xu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CLUB CAR REPAROS AUTOMOTIVO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.3396528,
          lng: -46.836514,
        },
        cep: "07786-540",
        endereco_original:
          "Avenida Arnaldo Rojek, 611, Altos de Jordanésia Jordanésia, Cajamar - SP, 07786-540",
        telefone: "(11) 97450-2131",
        estrelas: 4.6,
        avaliacoes: 11,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMBbw9euFf4ZM0r3RwbiMMImYmpxISZB0gAAwMGulc4w5-1ucKoQEC7VTLFWvPYNcLHWCRm8ZAk0YEO1mlZeQZlTJYWUswUD2iaXgBjD_ZOM73yV_EGn3m5wt8lGp7idccwnys59-TuxBKLCdQ1z5NMcdBdHgCy3_d-eihXo8UPpZG3&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TRUCKSCAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2147232,
          lng: -46.8799434,
        },
        cep: "13206-500",
        endereco_original:
          "Rua São Francisco de Salles, 89, Vila Salermo, Jundiaí - SP, 13206-500",
        telefone: "(11) 3963-4284",
        estrelas: 4.5,
        avaliacoes: 14,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOCMB5fOCtAIMJPjwcZRUmUSlxxaUOzYIC8vxcOZWK6_J9LGE-gNl5gVoSbqGhjOjA--i8ab_MrEK0WwPGZRqb2naZQLjG4Hh3uisB0Sg5kQ0hKFmSeboi6WxpXAf9JR-6UDE1QLzEltDrNjPzLNx1aD5M4TLG_3ZSrMa_jtOwcZ_1G&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "A GRANDE FAMILIA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.9633747,
          lng: -46.3715532,
        },
        cep: "11380-500",
        endereco_original:
          "Avenida Monteiro Lobato, 454, Vila Valença, São Vicente - SP, 11380-500",
        telefone: "(13) 97411-8921",
        estrelas: 4.5,
        avaliacoes: 69,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMXnCdRYp8K2IKpaHA6qJPnJky0VQZgNr_A5O35se7ykJJTEdVSJjts8JNlBavKrsu6itFJxh05AIOuYK78wsFP2FFCupWmfMMDMpInfiUy3u3WPd91TR0jXaaRiiLY54UP7hnpiNyPD2OyZfyAYny5S89UOoPAO_jL_H2Uhn9xVfzl&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "F7 REPARACAO AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.1526615,
          lng: -47.05447350000001,
        },
        cep: "13295-000",
        endereco_original:
          "JOSÉ TONOLI, 176, JARDIM SAMAMBAIA, ITUPEVA - SP, 13295-000",
        telefone: "(11) 4496-3835",
        estrelas: 5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "GOODGUYS RESTAURACAO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.0099642,
          lng: -46.8360576,
        },
        cep: "13253-032",
        endereco_original:
          "Rua José Carbonari, 310, Jardim Tereza, Itatiba - SP, 13253-032",
        telefone: "(11) 97096-8281",
        estrelas: 4.9,
        avaliacoes: 16,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPFPU2vc-MbjoKgFGjs6NBwBz9xPsD8LYSfT8cKS7cJwKjGNFVMFqw1qwAxi2GzZcg27TzJfRvwRymnRG2-za6QJAcbeSD4cyJJserq6q_lOPFYbvBi0TfwSm9_OGopQWFgJusE8Lo39uCJMfqUoJMmWtvpA1H4TpI6jqPB-LLyQ-Y&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RIBEIRO",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5627147,
          lng: -46.6162307,
        },
        cep: "01523-030",
        endereco_original: "JOSE BENTO, 50, CAMBUCI, SAO PAULO - SP, 01523-030",
        telefone: "(11) 3209-2954",
        estrelas: 4.6,
        avaliacoes: 113,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOq16Z1Zdtx1RE_1iT3KuNUPkUNREL6Ezvlj7zkk1nAasE50h4XSDO9UmDXgAoQ-IWnPYIXNQR8esb40SEKC0UXYsmUqSXpdUTslWsFXtPOTy56tg0GIxQhlzzrrzEneQMyoovumBt6-iZbOOWxR63c5yLe9MWEXHJVl4VuXeZpRdjs&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MSFIX",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5362099,
          lng: -46.7269587,
        },
        cep: "05319-020",
        endereco_original:
          "BLUMENAU, 49, VILA LEOPOLDINA, SAO PAULO - SP, 05319-020",
        telefone: "(11) 3834-7777",
        estrelas: 4.8,
        avaliacoes: 41,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNFubiAllDi7c-DmZgcPVB-XW2jOJK6CHUpb-FJ1HoM3Mx9moW-92cW-hyWME3MKDDeurNKFYG7mnYnIswBceF0elxRs1350LcVboEri3ofRpBd2grG8FfxsKe3br8EgkeWUyJiudYGS1gRRcYvwOSp0yJ3J5iPYdDDXBFkT25Dmxi-&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO CRISTAL REPARADORA DE VEICULOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.9630623,
          lng: -46.5439419,
        },
        cep: "12902-000",
        endereco_original:
          "DOS IMIGRANTES, 919, JARDIM AMERICA, BRAGANCA PAULISTA - SP, 12902-000",
        telefone: "(11) 4032-5482",
        estrelas: 4.6,
        avaliacoes: 66,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO-8tMhMWHXKLOc2idVR9XbrykS78KUNWrf00Kh04FfSCzECqTZfWBs4mm4o3aMY2JklfbcRJs-6dHJLefrQhaqptE3P3f8n_ZyXWioNs443rdKNIlvY4pN51ilqPmBA4sqljKSt3XHPyg0K3b3CRUhMjF_fNptMLzeUE1xTlyDiE39&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AVA VIDROS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4806532,
          lng: -47.4464927,
        },
        cep: "18090-450",
        endereco_original:
          "Rua Nicolau Perrela, 222, Vila Progresso, Sorocaba - SP, 18090-450",
        telefone: "(15) 3233-5421",
        estrelas: 4.4,
        avaliacoes: 186,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOr8HsY2RWsMKEY4cT8TevXzWbGzrK7fGWulY62ZZOMpht-i9DeKftTLGBS0t5vOfFod2DC7FUe1xpWG8DgSC_Pfvjphuy07aWl3iD1mOW1OQOukh36BC6uEMHI1X6rCQP8XEoxDzhoVNVuvp5WD2MVyAxAgiLm4VLduQ-5v_T5uWyj&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JM FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4803003,
          lng: -47.4704803,
        },
        cep: "18075-000",
        endereco_original:
          "Rua Atanazio Soares, 575, VILA OLiMPIA, SOROCABA - SP, 18075-000",
        telefone: "(15) 99158-9950",
        estrelas: 4.9,
        avaliacoes: 61,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPlMkOs0L5lXqUxO8S8zy4WI06uhV9-Ds5irSJupX0loTiuxGencxbTinCVNe6s95WnNf-oeOhxSJCGfGZRnwErZpZrJTLUg1jCvfLGaJWx-1u2dQD4uqAWHA3WIhoABNEhnhI31bjeZpZ4jNErJHdCRxqsOGBi4OHunT2qK-kKLH5N&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VANDERCAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4611517,
          lng: -47.4812998,
        },
        cep: "18074-385",
        endereco_original:
          "Rua ATANAZIO SOARES, 2985, JARDIM MARIA EUGENIA, SOROCABA - SP, 18074-385",
        telefone: "(15) 3226-2871",
        estrelas: 4.7,
        avaliacoes: 94,
        horario_funcionamento: [
          "Seg: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Ter: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Qua: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Qui: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Sex: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOztFePWd17pEC3IsgqWbYsZ9M73jvWjO33ZUHsIyv7QgG_VWbwm31AWTAddDCy8zuJvY9LI0fy-I4zeQ2WaA_ed0rVVF524kF4pIAZm7ztY9iufpqPKILgasWyEQCRrSKU8QrsTpLvUfBBxbBzEw5x4uKDk7K3YQCUy0rhoWaVA3Wh&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ELITE CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.461824,
          lng: -47.4984316,
        },
        cep: "18071-019",
        endereco_original:
          "Rua REYNALDO NOGUEIRA JORDAO, 31, JARDIM NOVA IPANEMA, SOROCABA - SP, 18071-019",
        telefone: "(15) 99640-8772",
        estrelas: 4.2,
        avaliacoes: 66,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOvLYaD3CrnLuDRjCwFi21nm7a0Jge7rSCyuW6wg3dzwHkRy571hwJbGX-9PF1QMhPp8jivwvH2E8bouXdOcVhRQs-vR9K-TSF_ubqZSlbDwn0kUAiTl6r1PvidO90ZA81k0wDj8kQpK3x9OZ8t9F_LQGKOMm-E97zf-64y_WLyId34&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "B M FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2019448,
          lng: -47.5185649,
        },
        cep: "18540-023",
        endereco_original:
          "Rua Cardoso Pimentel, 1326, Centro, Porto Feliz - SP, 18540-023",
        telefone: "(15) 99710-2832",
        estrelas: 4.2,
        avaliacoes: 11,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMcT1ALK8QyuNTjSewMMtBvExOIM2Rn8DZk6_c_1M_Y7WHXMueepjKTzTM7JfueMXiRXvDrOzr4Ct3-NbJ1o1j9TgwPJ0x-xCBS0H57o_zwww__xlUgzAb7t3c0GkZIKX0KgWLbR_ZEoKZuw8fi2qUAe00rLsWbK0mwW1bTzCsnyA3v&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JOGADOR FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.1945512,
          lng: -47.5190852,
        },
        cep: "18540-000",
        endereco_original:
          "Avenida Governador Mário Covas, 2611, São Marcos, Porto Feliz - SP, 18540-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "CORIFEU AUTOMEC",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.573456,
          lng: -46.725854,
        },
        cep: "05581-001",
        endereco_original:
          "Avenida CORIFEU DE AZEVEDO MARQUES, 1202, BUTANTA, SAO PAULO - SP, 05581-001",
        telefone: "(11) 3722-0755",
        estrelas: 3.8,
        avaliacoes: 196,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNvEvhfDCNdbEuydZXUG0E_lLWzbOdQ-yGJFqe0AKB71VAclTJlupu__ltBk_cpyvcUNTDEblEE1P0Ws_FcMGGbDNKBxUk5h_QhtAdAiA1VYUdULjVfj9VMgp5jbx8Uh4D41LmpqHdT2EzIW_wfRACFQ6d7T2cJTmPCUBo4s5w3WatR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SATIKO CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6328636,
          lng: -46.6456027,
        },
        cep: "04308-000",
        endereco_original:
          "Avenida Engenheiro Armando de Arruda Pereira, 350, Jabaquara, Sao Paulo - SP, 04308-000",
        telefone: "(11) 94582-3904",
        estrelas: 4.4,
        avaliacoes: 97,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMKjKkolO2H0UCUgzyMjD0w40UrJKum7iCFW1XByDK6Xpclh7z1bj7-a0JxA6w3dAF8SmTI7J67Blg9D7TKTEIOjncp17ZjloIPxFto8wjyPix5aQ3m84PIXjdwGuZKFl45nsw0noKnfZNcgee04jz7jSB8XywrkQG_k7UOFNJqV3IY&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUNILARIA MAIA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2060151,
          lng: -46.9170471,
        },
        cep: "13211-410",
        endereco_original:
          "Rua Comendador Gumercindo Barranqueiros, 2039, Jardim Santa Teresa, Jundiaí - SP, 13211-410",
        telefone: "(11) 4521-1500",
        estrelas: 4.7,
        avaliacoes: 94,
        horario_funcionamento: [
          "Seg: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Ter: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Qua: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Qui: 7:30 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sex: 7:30 AM – 12:00 PM, 1:00 – 4:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMLwaraT7e0aVfqhk_mJyNKE7Iywv6loOfybS08rncUSFiTtS0bCUDGtC-u8crsLkB1vnzH7Qm_MLEJP-u9Vf4jjaf9nc9UDRXlYYPm_fiY1pMmqkmM7pDjfKVwZ3u-wTNqOuTbeAlrZblwxdbMWfvftzwkmXbddE30olYB4IdBX-Ru&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VALENTE ESTETICA AUTOMOTIVA EXPRESS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6266132,
          lng: -46.630167,
        },
        cep: "04304-001",
        endereco_original:
          "Avenida FAGUNDES FILHO, 1178, VILA MONTE ALEGRE, SÃO PAULO - SP, 04304-001",
        telefone: "(11) 5585-1655",
        estrelas: 4.6,
        avaliacoes: 295,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO3jlMWG2n4kbHad5h45vpJB04WZ0orICDq3mYMaqNrKuOcegOC4SNfk6ijmQy9wS-B50y9TBlcYDk92BFNTNj_BfJTL97uScWLS25KxoXBMnGc-ibP1fgi2rwFaY47R1llny0pwoTMtT_iXrnVkORIikVpI9cpERGXdDk4wshY8j5I&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ROLISCAR CENTRO AUTOMOTIVO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6242841,
          lng: -46.5957027,
        },
        cep: "04255-080",
        endereco_original:
          "Rua SAO SILVESTRE, 200, SAO JOAO CLIMACO, SAO PAULO - SP, 04255-080",
        telefone: "(11) 94032-3032",
        estrelas: 4.9,
        avaliacoes: 34,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:30 PM",
          "Ter: 8:00 AM – 6:30 PM",
          "Qua: 8:00 AM – 6:30 PM",
          "Qui: 8:00 AM – 6:30 PM",
          "Sex: 8:00 AM – 6:30 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNsqc-qAm23q2WzXNSRl1pb42DNDKSadBgxkw-8KqOc5mXIC4kHHRufMRtY4yxnlizZQE64MLDZ1t9V9U-sIuHSOau4GmGm5FS7oagLRYCXmG6kZV-oa8Ap36fSZhXVW0RpzmcscFOGsetqDacfSB5AGsx6kiv4lcgaxNqVQg0uCtY0&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SALVA CAR REPARACAO AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6446199,
          lng: -46.64456000000001,
        },
        cep: "04345-000",
        endereco_original:
          "Avenida Engenheiro George Corbisier, 895, Jabaquara, São Paulo - SP, 04345-000",
        telefone: "(11) 2774-1711",
        estrelas: 4.7,
        avaliacoes: 100,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPk_OmRMGGF2GupsvIIOaNQwhaExdp8HHwtnhXeMQFn0sKe3gSajnJsNlm71fRk8GOQG2l0cwHKVskc5fC9F8LDNdUVF6uuCCg9c8q7AxThXZlHAm2c9LvxwZ5h-UAKEc_-j3_K-gXXQPl92MFS_M9tKtpIV2AkhtZCfwn-GNj-r1Xu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA MORAIS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6540132,
          lng: -46.6598303,
        },
        cep: "04379-022",
        endereco_original:
          "Rua Emílio de Sousa Docca, 265, Vila Santa Catarina, São Paulo - SP, 04379-022",
        telefone: "(11) 5031-4858",
        estrelas: 3.9,
        avaliacoes: 89,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:45 PM",
          "Ter: 8:00 AM – 5:45 PM",
          "Qua: 8:00 AM – 5:45 PM",
          "Qui: 8:00 AM – 5:45 PM",
          "Sex: 8:00 AM – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPqKhuVf3SLGALBIfTimVGshSc4zw-fBB9xfgF0qUT7w4qieE7vRVLL2x9ZYne8X4RH_ItNextYp4EGLF-76V_5N6-a4cPpo8GYMQgPvTqjZu0kbhLO8zu9cAOfc4oGN56HiSyytWzGctAVp0XFiZnmnew0EZrrMoVjbPwp3xcUBlQF&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AJR SERVIÇOS AUTOMOTIVOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6407099,
          lng: -46.7169487,
        },
        cep: "04729-001",
        endereco_original:
          "Rua Missionários, 434, Jardim Caravelas, São Paulo - SP, 04729-001",
        telefone: "(11) 3798-4505",
        estrelas: 4.7,
        avaliacoes: 297,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM7YxlClwZeKai4k1CaBbEPKNcFSl3SzwcnS_e3JgvPQqNvlwtuG5V8mUwFFmpT3q4QIWpUUBk1RtR8KnZjsRlLNNddW4MM_kJOniDFMsBn12H5e1meHPsdLkIAts_zzUUJj4Fq-3TVS-Es_MapHg4IxE3xgLzmfm6NZJX0Xhq7BwA0&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA ISIDRO LTDA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5579484,
          lng: -46.5787235,
        },
        cep: "03181-100",
        endereco_original:
          "DO ACRE, 745, VILA BERTIOGA, SAO PAULO - SP, 03181-100",
        telefone: "(11) 2605-2396",
        estrelas: 4.4,
        avaliacoes: 126,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP0KMJvHIfUJBAKwFw9w0x1mhF-xxoVJLuHTQtrfIFHIQeupIAHkcZ5dziIyY7Fq0vrRKgOBsqaOShjw6hsKefOs9CXB3zI5PSgmYsCiXETSvBJ4kd9fAlG3H2_J3U_XXfZMtb6xjtZPGyB28NMRYDWKu8P7aVrK3NjtEnmTX2RdO3a&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO CARE",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5210216,
          lng: -46.56919790000001,
        },
        cep: "02179-040",
        endereco_original:
          "SARGENTO MANUEL CHAGAS, 439, PARQUE NOVO MUNDO, SAO PAULO - SP, 02179-040",
        telefone: "(11) 2635-1616",
        estrelas: 4,
        avaliacoes: 53,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO_DtmIcuqTRg-5JSjTvmOouiQS7j49jNeRuRhuocneoe8a8x7tlWip819_jnDF6LwU7J72PAAZtA1GErmng0hEsI__VTFClfUZbchyHx5igwnKDz5KmVJBSYRr6hu3W03MjwJ8vXjGWgpGQQ26vyNWyXsQDMw256rmtQQinWN1gjIA&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ZERO BALA REPAROS AUTOMOTIVOS",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.3261625,
          lng: -46.2303737,
        },
        cep: "07500-000",
        endereco_original:
          "RUA LEOPOLDO DA CUNHA LIMA, 235, LANIFICIO, SANTA ISABEL - SP, 07500-000",
        telefone: "(11) 4656-1626",
        estrelas: 4.4,
        avaliacoes: 28,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOSGi8YF2reWmnFCp-BR1D9FmuVLFAr648djP99aHRDKyaU94OsdUyZYjnt_MnH5vcbcacYWYVwZMuUS54X2C6cBCZ8MCYTCfh2rtTTdN1VWNcJj4Ic3Ww_mlqKcAxec_gJVqasPKWPuYtqKddtCxyRwPcAAwUPNodjk_SXIofkn69K&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TABOLANDO CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.540679,
          lng: -46.3573319,
        },
        cep: "08502-310",
        endereco_original:
          "Rua Marcondes Salgado, 120, Vila Correa, Ferraz de Vasconcelos - SP, 08502-310",
        telefone: null,
        estrelas: 4.4,
        avaliacoes: 5,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNL341PnwVHCt_MhYV0Iuc8uv6kiwElnw3bnfkKEY8WB-jHYMYyHDePHtEst7R6v0jk2NHTN8KTYRagxZubHeMr-KJH38NmQUHfPYk1sVb6lKPiFARWkGWQGtI1G4IuYZp5H_4sOSF5VtR9AfcfXKD7LPgsjT8KBu8k76livhBgqhEb&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JUNIOR FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Funilaria e pintura"],
        endereco: {
          lat: -23.5242294,
          lng: -47.16643089999999,
        },
        cep: "18120-000",
        endereco_original:
          "Rua MANOEL VICENTE, 38, MAIRINQUE, MAIRINQUE - SP, 18120-000",
        telefone: "(11) 98335-2287",
        estrelas: 5,
        avaliacoes: 10,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPFUpX_fO2d8UJqxljwu-H6uuI9qoLF4N4eh7U3TTYEcb5BSuk07xqXvnJfCogKyKgYtGNRevZaezNpO-nIq1Ax8khywX4wKgSqLMN2GdrB-EiP_1eYrbCXwt5y1fUTd0OrJOhfuGajHoZ3sadTEFZ6W3Z8omWoUjCn4g44ryKwCqM7&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FABIO SEGURA FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5389906,
          lng: -47.1807644,
        },
        cep: "18120-000",
        endereco_original:
          "JOAO LUCAS FERREIRA, 38, VILA SOROCABANA, MAIRINQUE - SP, 18120-000",
        telefone: "(11) 94244-6315",
        estrelas: 4.9,
        avaliacoes: 37,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 5:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 5:00 PM",
          "Sex: 9:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO7URHG4yx5CqJ6nBSXTCwN8zjRqk1jd_YWo0nI0JqPGTadVZaifrVa8oa1Uo_hSR2D47Wnbfp9Z_6KvX9kMNXrUHNVGxtK5CZMzeB7zZaep6ILsXbTp-1PurnZh9fKPadDwLYtGIW1geXghosGjbOZ_FZ_26IhhiAC5fJ24Gq8P9eq&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PERFORMANCE CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.1719593,
          lng: -45.8232607,
        },
        cep: "12224-270",
        endereco_original:
          "DOS NARCISOS, 61, JARDIM MOTORAMA, SAO JOSE DOS CAMPOS - SP, 12224-270",
        telefone: "(12) 98802-5721",
        estrelas: 5,
        avaliacoes: 3,
        horario_funcionamento: [
          "Seg: 9:00 AM – 5:00 PM",
          "Ter: 9:00 AM – 5:00 PM",
          "Qua: 9:00 AM – 5:00 PM",
          "Qui: 9:00 AM – 5:00 PM",
          "Sex: 9:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNnLH5E5pGgrsggh7R9vGB_Owfw-CBPZmeW6TQrhNY81-09nt6iLDBlT7WbaGLeNbXzPOelZvXDsurwphr2IeiTWBMumnYIM9c6en25cidnNqo9QD1yOi7zIZmoJ75P02kTHyChnodoeHEWjccrYuCsHEnjvbUt_S5mXQ5EdMloZGrb&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ZARDINI FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2118014,
          lng: -47.5214516,
        },
        cep: "18547-056",
        endereco_original:
          "SANTA CRUZ, 125, JARDIM SÃO BENTO, PORTO FELIZ - SP, 18547-056",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "FUNILARIA E PINTURA DO PEDRINHO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.1969299,
          lng: -47.52344739999999,
        },
        cep: "18540-000",
        endereco_original:
          "ROSA GUARINI MARTELLI, 170, HUMBERTO MARTELLI, PORTO FELIZ - SP, 18540-000",
        telefone: null,
        estrelas: 5,
        avaliacoes: 1,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "PODIUM",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5782811,
          lng: -46.5574084,
        },
        cep: "03275-010",
        endereco_original: "GOMES, 457, VILA IVONE, SAO PAULO - SP, 03275-010",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "OZEAS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5604438,
          lng: -46.7843209,
        },
        cep: "06050-210",
        endereco_original:
          "SALVADOR SINDONIA, 175, JAGUARIBE, OSASCO - SP, 06050-210",
        telefone: "(11) 3609-5558",
        estrelas: 4.4,
        avaliacoes: 255,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOguF3NYMuNkko5CN3XbvVrpLKI8SOtHu2n0z19pk1WrHuoyPZe28-Q7RPlu93z30IMMsmr1INBKW6zbSDuaNPwBky1u-jpV--BD7XsePiCOfxJGE8gPot0HR3PkwT043s7DrcNsmH7qPXEt1sAvh8NS3qVjdnDsyK2iakTan6w4Wie&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CARFIO II",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6638111,
          lng: -46.47835509999999,
        },
        cep: "09371-520",
        endereco_original:
          "JOAO RAMALHO, 1443, VILA NOEMIA, MAUA - SP, 09371-520",
        telefone: "(11) 4555-1477",
        estrelas: 4.5,
        avaliacoes: 142,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMZIY5AjjGBTJ1sR3OuzUj5sK6yIoLibm33LOmLse1BINIg5__M2xddfMgEP8NlwefT6ylPqOSHWEeoq-Cfcxw385M5ROQptAqvsYnmJiEVWvn1fjMbgr8iEWBzgd1tRauGCU1qQEbGP2XgVgl4wpB6QTa0uhQYl6BWe9SZF1zLHMWT&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GALLO IMPORTS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5572021,
          lng: -46.5248888,
        },
        cep: "03449-000",
        endereco_original:
          "Dezenove de Janeiro, 564, Vila Carrão, Sao Paulo - SP, 03449-000",
        telefone: "(11) 2269-3567",
        estrelas: 4.2,
        avaliacoes: 27,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMXmncETxlUIc82fWfQSkAKiEYTaViYZPnDFDsXrndy4iYt8U_rviKFJPr3fTcybhpXX3ZRzk5rwscqfRKKrVWLjUwxbMbmi0joOJ_867sF99OtLca4Z6b-G3BT-om-vEjrO5qICDVMYwyao7cc_02Ivt66jWP0ySf18ahLmiHL4JM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "STUDIO MARILIA BOTELHO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.3953689,
          lng: -46.3264083,
        },
        cep: "07400-605",
        endereco_original: "JOAO MANOEL, 345, CENTRO, ARUJA - SP, 07400-605",
        telefone: "(11) 2756-0105",
        estrelas: 4.9,
        avaliacoes: 85,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:30 PM",
          "Ter: 8:00 AM – 6:30 PM",
          "Qua: 8:00 AM – 6:30 PM",
          "Qui: 8:00 AM – 6:30 PM",
          "Sex: 8:00 AM – 6:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNJdQPnJWvYXk5dWh9wvRfTkvAeekIYmwZdGqH6ksgb8GtP3AR5zH_NlDtglOHqyZhV803VMASsmRvSISIxR4tFKBxNibRWfbX7PVEGcYiXt0UaSxQP6OkHKNJskZT-pDe6dHLNKZd46AfrTRoTkPFVt3LCeGZq3YFBR9zmvtBPuF6z&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TEL CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.9490919,
          lng: -46.3279886,
        },
        cep: "11015-531",
        endereco_original:
          "COMENDADOR MARTINS, 221, VILA MATHIAS, SANTOS - SP, 11015-531",
        telefone: "(13) 3222-7048",
        estrelas: 4.2,
        avaliacoes: 96,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMk4faud3EIvpi5sjLkdTnCBElbWUdjkiAhk_rK-FMTKoc1dCQPZlQQRf9bfcbk4erjpbd-5h1WLSG6sDpLW3L91uFEXBEWhN2xOQb-2SAjhOpOhmhz7_a9mkgpZJ6pKHWeGQNFYu5CHMrgnTsSADLTJStNTMz6GpwmOuVvWP__GKMK&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MAIOR REPAROS AUTOMOTIVOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.86839,
          lng: -47.2214081,
        },
        cep: "13184-205",
        endereco_original:
          "PLINIO PARDINI, 108, PARQUE ORTOLANDIA, HORTOLANDIA - SP, 13184-205",
        telefone: "(19) 3865-7128",
        estrelas: 4.3,
        avaliacoes: 95,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPBIWvMfNKOTEPQ7HwZYS8rGysbg6vnLWKUexbU95IajBHEaO460p41OWpR62INMMlESUNrwbxPjt_qPSBQyStYngr--GQ6H1kjFG86bXJ3b7vdeUew9oL40hp-UToAcmK9K5fekZjis_cRhHlU70EN3CvW--D7M5rmzNikWGRjVgPT&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SCUDERIA MORUMBI",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6083718,
          lng: -46.7471125,
        },
        cep: "05711-000",
        endereco_original:
          "AVENIDA DOUTOR LUIZ MIGLIANO, 283, JARDIM VAZANI, SAO PAULO - SP, 05711-000",
        telefone: "(11) 3742-0606",
        estrelas: 4.5,
        avaliacoes: 59,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DORWX8WPWueBwTyRZpwxn8meD60LCTP_EdWfkTTZdXsesEPGtQfTHr45llbJB8cdyhkUyzaP0Ij_hHh_gjIHJIjn6AibS_LPwjODhH1noxcyPNcWd7uQa3-inhzMEV2vc2nXUxmr-UFdefytGeBrNptch1DpZOkfrPyJE2k7FJqXsGy&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AURENA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4670702,
          lng: -46.5538067,
        },
        cep: "07051-020",
        endereco_original:
          "JACOB, 362, JARDIM TRANQUILIDADE, GUARULHOS - SP, 07051-020",
        telefone: "(11) 2422-8026",
        estrelas: 4.2,
        avaliacoes: 121,
        horario_funcionamento: [
          "Seg: 8:15 AM – 6:00 PM",
          "Ter: 8:15 AM – 6:00 PM",
          "Qua: 8:15 AM – 6:00 PM",
          "Qui: 8:15 AM – 6:00 PM",
          "Sex: 8:15 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPkz9-AY43FFa_BEMciOus7M4ZfVt2vu9fSg0P42C3q7ahoQuzxVZW6pgTJiWD6yQg4SGqT_97yfvAZ0gnauNbYB_gYJYu_nXrYc8LPb1GNHTVrpNMhW23J--jhEGFuBd2WwkTeGJOyZk4qWq8oGJCwIbAxSAVR3OL8l9nF4Q9K9kbp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CYBORG",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.2067796,
          lng: -45.8844506,
        },
        cep: "12231-040",
        endereco_original:
          "CACAPAVA, 162, VILA NAIR, SAO JOSE DOS CAMPOS - SP, 12231-040",
        telefone: "(12) 3921-2633",
        estrelas: 4,
        avaliacoes: 132,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:30 PM",
          "Ter: 7:30 AM – 5:30 PM",
          "Qua: 7:30 AM – 5:30 PM",
          "Qui: 7:30 AM – 5:30 PM",
          "Sex: 7:30 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOmEVH0GMdEJZB0IiSm6t4rCUsZtAEZ6M306axgugmnZdN3oDtob3zTvEFJAxAn54EOaNozd45ggRk4EjQLkp28Jam_pieBPB5L9mHvnqqsRGXHJbqDWIwUIZNDNuSrNwuag88qHI5nAhjSF4s2Eskb_vTZA1EbR1lzzOYQ4hUG0y22&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GRUPO DENCAR AUTO SERVICE",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5682224,
          lng: -46.59823249999999,
        },
        cep: "03123-020",
        endereco_original:
          "BARAO DE MONTE SANTO, 435, MOOCA, SAO PAULO - SP, 03123-020",
        telefone: "(11) 4255-1000",
        estrelas: 4.7,
        avaliacoes: 283,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMr020733mDdcZHI-7LNutIDhYvW8G7cNNXA0mByameHpHDC2kUIAk7L_nFIov9YLIidhfDB1vlqTrqxnA6c8Nr3ez3k3UQRSk2IdPrvTdV3cVrnrqsZ7cnUS_pxJfDmHxCc9YUuRE5vdMXiTGhWSgSROERrX0xbtEUtldgj5gSnQAL&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GCAR CENTRO AUTOMOTIVO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4781463,
          lng: -46.5493187,
        },
        cep: "07041-010",
        endereco_original:
          "STELLA MARIS, 146, VILA SAO JOAO, GUARULHOS - SP, 07041-010",
        telefone: "(11) 4372-0843",
        estrelas: 5,
        avaliacoes: 5,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMZ7GwjjUR_KdXD8blGDNA9jxAhTWekf-4FSHH3nyHaLQWadz8A03sU_XsNBVZWp36xPf3r91kUFMciTsZxe9AMqadBK2DlcPRINcoVR3TTZPcwK8KA5A0cyTeqQQTo1OAztv9mW_P8Vk7LV4eCqoG0URrhsy2jNBpbOwN_LznRQUS9&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TN CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6240216,
          lng: -46.5206702,
        },
        cep: "09230-701",
        endereco_original:
          "MARTIM FRANCISCO, 1574, JARDIM UTINGA, SANTO ANDRE - SP, 09230-701",
        telefone: "(11) 4479-1488",
        estrelas: 4.1,
        avaliacoes: 227,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP68zMwzhj-h6-MDHhadndJGHppL_MGgWRLhYSYZhkaX0pxCTrCtnRtvdgyKBcOLeyojvNrI7S3-HWdGDheJ3VjypONv-FTCoYSmvqEVUzPrPDT9iGD8_D7a65z2-rVthGY3AciEf93loXX1DyxVwLiPCh82Wjrg2jYhcp3iuuIYL8l&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JULIOCAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.5117143,
          lng: -46.586968,
        },
        cep: "02122-010",
        endereco_original:
          "Araritaguaba, 668, Vila Maria Alta, Sao Paulo - SP, 02122-010",
        telefone: "(11) 2954-8585",
        estrelas: 4.3,
        avaliacoes: 139,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOwxKlJkOKmKOVfS3qSGcCBiJ-N38NWi6dTBtxolrbm7lq7hGmVfY6-Zzehk21vV8YkXJjKT1Byhy5uQwfA_AFGk2mk8UzcKy_bix7XuunThazlGHGwZy6GADN6lOrtj3dlkEweg53PZeMABbo9e8kitK6BbK6T4Jdcd_djrpRtvDS8&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NOVA JUCAR AUTO ESTUFA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6662964,
          lng: -46.60539480000001,
        },
        cep: "09667-020",
        endereco_original:
          "Rua TURQUIA, 492, TABOAO, SAO BERNARDO DO CAMPO - SP, 09667-020",
        telefone: "(11) 4178-3450",
        estrelas: 4.1,
        avaliacoes: 215,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM6dehzhKkp5tV3sSAAgj6dMpGY4RAYK3f75z9v2-YSLHi__W4VHQme0m3Cge4DVYzwo23rKaKx0kw4_khMeAiRTBj0W_cuKWZqKiF64JksFnyKeDoCiOGVl-ETwqNmwkzwaubj3OKfMHVIwV1Z53v9QvJqchCjW81YMyxQhcs6FurR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FAGUNDES",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6539815,
          lng: -46.5546034,
        },
        cep: "09061-090",
        endereco_original:
          "Rua PARAIBUNA, 32, VILA SACADURA CABRAL, SANTO ANDRE - SP, 09061-090",
        telefone: "(11) 94731-4263",
        estrelas: 4.9,
        avaliacoes: 8,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "A C PERES",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.672979,
          lng: -46.5863583,
        },
        cep: "09691-000",
        endereco_original:
          "Rua JULIO DE MESQUITA, 101, PAULICEIA, SAO BERNARDO DO CAMPO - SP, 09691-000",
        telefone: "(11) 4361-3817",
        estrelas: 4.8,
        avaliacoes: 118,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOoCbgY4Z0tbXV-o0cBROoULzbewtQ34t4jtVQtGi7-JKKymQXpHqAM1QJyp69P_MrBtt_lG9rWuhVZ_l6J_uVkq8lrcM2o3NF_7MdzFRUlZthGZ9_3E5M9UeL3-c9nXI99jCX2upojmPDXPBu9b_gfGy3Ihu7i8EoUjHjxbkhaufjN&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "QUALLY FUNILARIA, PINTURA & ESTETICA AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6450777,
          lng: -46.514828,
        },
        cep: "09291-090",
        endereco_original:
          "Rua Apiaí, 550, Vila Curuçá, Santo André - SP, 09291-090",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "VF REPAROS AUTOMOTIVOS LTDA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6694578,
          lng: -46.5599645,
        },
        cep: "09750-001",
        endereco_original:
          "Avenida SENADOR VERGUEIRO, 3000, CENTRO, SAO BERNARDO DO CAMPO - SP, 09750-001",
        telefone: "(11) 4365-1111",
        estrelas: 4.7,
        avaliacoes: 95,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMz88LWleERevNWepn0P-lw--FjSNASUczZ75pKr2sbSe56YLkoRLX2w1ygRohQbLLWAnKMpX5nXFcP2CHS6V3h_Qcu3nRJ8rjkd2aINweUregk3K7y2FpsKs2HEXIZULWd9gQfWuf-HWRc0KgHVE9aHEdFQy-itfD70Li_XDkWartR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VP GARAGE PINTURA AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.7236037,
          lng: -46.5674745,
        },
        cep: "09810-270",
        endereco_original:
          "Rua Amaro Genari, 310, Cidade Miramar, São Bernardo do Campo - SP, 09810-270",
        telefone: "(11) 4355-0825",
        estrelas: 4.5,
        avaliacoes: 180,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOTh5G1GF9ZSecY1z5jNFAz6VROPrZ29rBbzbzsI2zwNa5NCeh2WV8EKXPoyx3MhkMFsUIotnN-tfr4dlFtC6BO9xWwV-0210z5MO31hK15ALcSZIGOE-Z8j9bf7L-qpjFMK8I89r-d1H-v9-wyk7_HdkUJ8g5FEPpoYiIAws7lcoy6&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CELMAR REPARAÇÃO AUTOMOTIVA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7167089,
          lng: -46.55000570000001,
        },
        cep: "09721-240",
        endereco_original:
          "Rua PAISSANDU, 103, CENTRO, SAO BERNARDO DO CAMPO - SP, 09721-240",
        telefone: "(11) 2356-5631",
        estrelas: 3.8,
        avaliacoes: 4,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "LEAO DE JUDA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.7239476,
          lng: -46.5678274,
        },
        cep: "09811-100",
        endereco_original:
          "Rua MIOSOTIS, 707, ASSUNCAO, SAO BERNARDO DO CAMPO - SP, 09811-100",
        telefone: "(11) 4355-0825",
        estrelas: 4.5,
        avaliacoes: 180,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOPZt55W6GLMvIXj0_NCtXRlh-J2QUvVI4DbpcmtaQV78y9ijd1rdWzdOclmO_XBZ5viFRnVG-IzUUn3KYT_cwFDyZQrg5kghQ3fCpx3P5vOJppNOxf8WcYLD4pp_9G_Ds8IHFRSGq7CR_lLeiWHjYzX7zR1fDTcbGUBhdPEqVo2ZO5&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NOVA PAULISTA CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.7169431,
          lng: -46.5508944,
        },
        cep: "09721-180",
        endereco_original:
          "Rua Frei Gaspar, 340, Centro, São Bernardo do Campo - SP, 09721-180",
        telefone: "(11) 2758-1873",
        estrelas: 4.9,
        avaliacoes: 101,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPBMNAkceLWke83xkYX4aM5jP4UzX-rWVWW2kORWnFC3hInW_yNG6Or0_6RUYfJfXbmOoffA9BFgMuYK79b1PGgobUtZvA5UErv0Wx3FYDE1b5a_qNOugdy8aNqx9bro1jXIUK5QOyAOiSNuztfD3HGcyBdvk1KzYdwhVWKkMx1-JD1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SEVEN CAR FUNILARIA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7032926,
          lng: -46.5377207,
        },
        cep: "09761-000",
        endereco_original:
          "Rua DOS VIANAS, 1680, BAETA NEVES, SAO BERNARDO DO CAMPO - SP, 09761-000",
        telefone: "(11) 97327-2890",
        estrelas: 4.9,
        avaliacoes: 83,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 2:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO1nKd_KHvj9yT-cCf147ls7JDhFjlD8By70ysVrccRDA-J1NhVf6mjWsBErjpwIBR8u5Lqm1SIgVoIuoF6SCBZB8dROfmskJvXndYtp3njMjTXkmfg9exrxH7CWFX2JDOYOVhuDOZF4IVX7nWH9YhLibVTEtsgCnAEd0SGtSpQEAA9&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LAAV SANTO ANDRÉ",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6809958,
          lng: -46.5091486,
        },
        cep: "09110-001",
        endereco_original:
          "Avenida DOM PEDRO I, 1897, VILA AMERICA, SANTO ANDRE - SP, 09110-001",
        telefone: "(11) 99149-2231",
        estrelas: 4.8,
        avaliacoes: 313,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM8no8VnVIJobBRrTrPf4nK1J6HKd2oNI1AvZcOPJDDb09dxPewZEUhqimcb33HlXJsigOK549Ib8aCtm2pyH3H9SWk951ndyKm6S--9du95pWjQXaDw1ApoQorC2q8djkszPCijJ2q-1UZuHf9YBYOIZPX8ZIMFqjcEoYe4VrwFYvZ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6959335,
          lng: -46.507079,
        },
        cep: "09172-520",
        endereco_original:
          "Rua BETA, 145, VILA MAZZEI, SANTO ANDRE - SP, 09172-520",
        telefone: "(11) 4455-9777",
        estrelas: 3.7,
        avaliacoes: 27,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOhW3YZ_gaSgSJkkjwoPjtySyTsJpUwNUpA5XQtdwsCkQ_Xf341vXDI2IeZzRnR0CD5km2lglCCaW6CRmDu2KWHQSyiG-NGQZ4bNgoO49gJUF5kltPX2DX4z7yR8GO-g7pJGOJQ9p2YO55EMq_2PA-787ztyizY3yeraEDBi06M_pEs&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "REPAR REPARACAO AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6759394,
          lng: -46.4549558,
        },
        cep: "09360-160",
        endereco_original:
          "Rua CARLOS TAMAGNINI, 8, VILA NOSSA SENHORA DAS VITORIAS, MAUA - SP, 09360-160",
        telefone: null,
        estrelas: 4.3,
        avaliacoes: 10,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 12:30 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNeB3rRpu8eQGX9qoZ4sK7hGgw9gQLcF79PtV4Rf0cwtCAhqotk_WxmKgOdPXYFG1lTaPI0McmV6YHzI4EcOlSdfCFUWqjrLUYLHLGGRMWkSb-5WGphUdtcgEhiHSoX62FWnakBimq94-Co1xmvAOEk_h_8aQUA-snO-HNhlo3ZUlHj&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MARQUES E MARQUES",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6202293,
          lng: -46.6828897,
        },
        cep: "04556-500",
        endereco_original:
          "Avenida SANTO AMARO, 4211, BROOKLIN PAULISTA, SAO PAULO - SP, 04556-500",
        telefone: "(11) 95844-1111",
        estrelas: 4.9,
        avaliacoes: 79,
        horario_funcionamento: [
          "Seg: 9:00 AM – 5:00 PM",
          "Ter: 9:00 AM – 5:00 PM",
          "Qua: 9:00 AM – 5:00 PM",
          "Qui: 9:00 AM – 5:00 PM",
          "Sex: 9:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP-QDZ7pqolJpQT5fMU1lsgY-Yqxk9GSmbG5-AZYZVZf6QWHpF59I9-f7Mu35k9m7-G3fllwDvbL6l4nrORSfRaczUepANVEWPU0w8ztmHSNpgrf3SaS3k49_fA4IVknhH0M8t1bwWmJ5OQZlYqqBhIpdocRpNFQQaQue79zLPnS0po&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "EDU AUTO MOTOR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5579667,
          lng: -46.7870095,
        },
        cep: "06050-170",
        endereco_original:
          "SEBASTIAO DE MELLO DIAS, 230, JAGUARIBE, OSASCO - SP, 06050-170",
        telefone: "(11) 3691-5477",
        estrelas: 4.3,
        avaliacoes: 81,
        horario_funcionamento: [
          "Seg: 7:30 AM – 6:00 PM",
          "Ter: 7:30 AM – 6:00 PM",
          "Qua: 7:30 AM – 6:00 PM",
          "Qui: 7:30 AM – 6:00 PM",
          "Sex: 7:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO6xWMKLlHIk4R19D7xzZ_XroYCQSbUmuUYm2ZJVfV4Jb-iMlW3eK20RePWdyQEASk7-0dHyOJODkb-Y5KJk8OAIs_eUOWvPze_mf_vPdYNxlcCadVq7a6-miY8LQ0ZSMrNCYijIjfL55nmkOlhbBTQIESAtgNDqaSs77b0gcQMVj0b&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO MECANICA CELSO",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.7075876,
          lng: -46.7126123,
        },
        cep: "04772-005",
        endereco_original:
          "ATLANTICA, 4515, INTERLAGOS, SAO PAULO - SP, 04772-005",
        telefone: "(11) 5666-3885",
        estrelas: 4.2,
        avaliacoes: 331,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMhjs7CNdtK-tZmHTOPGHFVVR1Xm_VQJlHPC-9wh7412CG4H97hKtXw6L4Ik4zo2dE6jYHUGQoRCHBSnj-fwOuDnNb2KUVa0W13q-RCDj8lZllJ6Fuipfc2tdwLoSR8S078yJ0ZT9GFBfv1iOlMfG4qVWBt8DwkFvGyAy9Z6ySoJdNg&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NORTE SUL",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2331246,
          lng: -45.91746990000001,
        },
        cep: "12240-000",
        endereco_original:
          "Avenida DOUTOR JOAO BATISTA SOARES DE QUEIROZ JUNIOR, 2891, JARDIM DAS INDUSTRIAS, SAO JOSE DOS CAMPOS - SP, 12240-000",
        telefone: "(12) 3206-9757",
        estrelas: 4.5,
        avaliacoes: 478,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOb36q5NtbeW8SDCbhOnw2jxDqCakkklpp0rEssT9KGZY8q24QLChremnqlIva8BsgguliVneHruznxaMTDlX3rk7H_nffUi4X2zk4xtKaKIl6ebFi-qWVP7bmXiBx62o4yhJuf9CKypvlRt3rmxF5LLBmXrK3Kbk-V19mJeKuBq7Iu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GUIA NORTE AUTO CENTER",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5153433,
          lng: -46.5947397,
        },
        cep: "02110-000",
        endereco_original:
          "NADIR DIAS DE FIGUEIREDO, 1130, VILA MARIA BAIXA, SAO PAULO - SP, 02110-000",
        telefone: null,
        estrelas: 4.2,
        avaliacoes: 66,
        horario_funcionamento: [
          "Seg: 6:00 AM – 10:00 PM",
          "Ter: 6:00 AM – 10:00 PM",
          "Qua: 6:00 AM – 10:00 PM",
          "Qui: 6:00 AM – 10:00 PM",
          "Sex: 6:00 AM – 10:00 PM",
          "Sab: 6:00 AM – 10:00 PM",
          "Dom: 6:00 AM – 10:00 PM",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DML50_hWuiOf8ovQXLlr0lAeh3m4_oFQYFNVLYwxhLsZ9_h4n94eIsr0wbGPf2n1t5me1-pX_-OeFvU-ZYl94Rn9rwy4bYRaT9SuLSEmmMYiUOc28ZLd4Cjtc1q3ylBA0g-FAfJz6cEOMDWD51W5mBDyUixTk51GHTfwjVvEnvD6bpi&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VERTT CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.9267478,
          lng: -47.0769205,
        },
        cep: "13030-420",
        endereco_original:
          "Rua Arnaldo Barreto, 938, São Bernardo, Campinas - SP, 13030-420",
        telefone: "(19) 3273-0567",
        estrelas: 4.7,
        avaliacoes: 436,
        horario_funcionamento: [
          "Seg: 8:00 – 11:45 AM, 1:00 – 6:00 PM",
          "Ter: 8:00 – 11:45 AM, 1:00 – 6:00 PM",
          "Qua: 8:00 – 11:45 AM, 1:00 – 6:00 PM",
          "Qui: 8:00 – 11:45 AM, 1:00 – 6:00 PM",
          "Sex: 8:00 – 11:45 AM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPDXVkrYdRUJS8bPZQO6lo41FELNF1spmkpfmd-sDbsctMS042-HHpVDIYhO1PEODZpWx_bek8k2viGNiRFLHBMOhOlEnHJ2XRjlLaCQL_6qBCbp2Zn1YXuAZb_SrSWQXMWUAbjBhKhIHPgPLp157IZ0KDFF6WCwX_9M8E8aBaCZmLi&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CANAA CAR",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.4741416,
          lng: -46.6393002,
        },
        cep: "02441-000",
        endereco_original:
          "ULTRAMARINO, 384, LAUZANE PAULISTA, SAO PAULO - SP, 02441-000",
        telefone: "(11) 2232-6562",
        estrelas: 4.1,
        avaliacoes: 127,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNYbmL1C1H-xzD5sdaAsMetLjqHcEwTok5fKrzVVj3wVcPpOB2mnJVnLxJDWmRaBuvv1IH0OeuytSto2pB19nenxDAvWs__pR3d7VPxGeAO3hNf0izu_vaX56yN2EWfXQunamrMKh8Gbx5RIi65iuhuufuqaccTz-ja1F85OnZ7C081&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "WM REPAROS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6577556,
          lng: -46.667122,
        },
        cep: "04365-000",
        endereco_original:
          "Avenida CUPECE, 1575, JARDIM PRUDENCIA, SAO PAULO - SP, 04365-000",
        telefone: "(11) 5564-0001",
        estrelas: 4,
        avaliacoes: 73,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:48 PM",
          "Ter: 8:00 AM – 5:48 PM",
          "Qua: 8:00 AM – 5:48 PM",
          "Qui: 8:00 AM – 5:48 PM",
          "Sex: 8:00 AM – 5:48 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN8r5_O14qcFz6adVldyQHkBdH2n8iaGlpdDCahJEpdh0G3_Ci4EzANTP00mwfUK8JMcRybO7T2VlTSNh3uGxGzUESFaGws77L1GbxoInFKcO7LCnlFbXcslVZJwiTQFhVDkY-v_VlL0zmHfW3yRuzNbhw_AEEA2LumC8TSRMN5TENB&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "INTERMEC",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6872345,
          lng: -46.7027831,
        },
        cep: "04781-000",
        endereco_original:
          "DOUTOR LUIS ARROBAS MARTINS, 62, CAPELA DO SOCORRO, SAO PAULO - SP, 04781-000",
        telefone: "(11) 5524-5867",
        estrelas: 4.6,
        avaliacoes: 63,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:00 PM",
          "Ter: 7:30 AM – 5:00 PM",
          "Qua: 7:30 AM – 5:00 PM",
          "Qui: 7:30 AM – 5:00 PM",
          "Sex: 7:30 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOqh3q8-AksQG22azi3FlMXhZ9wEE92nrR-Sv6EVjynt4ZaVMdBAiwEJIJhhB84ebeDC4pa5nJt1OLtUziV8I4stuYJebXJRFb03_1BuV9TPttbs5vQQedyXZz-SyQV29e4694_pHXzq_rJlED-O8VCns6ydANvvO7K8Nl35QKGnJoE&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BRAGION FUNILARIA",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.130719,
          lng: -46.5639964,
        },
        cep: "12943-330",
        endereco_original:
          "ARISTIDES BORGHI, 69, JARDIM ALVINOPOLIS, ATIBAIA - SP, 12943-330",
        telefone: "(11) 4412-9641",
        estrelas: 4.7,
        avaliacoes: 47,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:10 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:10 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:10 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:10 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:10 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "PICOLOTTO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.9883812,
          lng: -46.2646082,
        },
        cep: "11432-480",
        endereco_original:
          "MANOEL FRANCISCO, 200, VILA SANTO ANTONIO, GUARUJA - SP, 11432-480",
        telefone: "(13) 3355-5426",
        estrelas: 4.7,
        avaliacoes: 36,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMbIPeMhBtzZa0hgJNnwl5MUeGqjoRG8U4nKFVJuEzCuI5UClbwNc4oc_7JmGhPo0OryE_lnyY9TTQwrRY1W6B_Kn-_W9bZ2lCpL0ZKnp08Lc9Bv1w4Rd7Ulsk0JUFuYTpFV_puYjdg5bwy0x5_mqsEL_vHQoCmVnMDRUxCcNhJ1dLz&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ITATIBA FUNILARIA",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.0123499,
          lng: -46.840838,
        },
        cep: "13255-250",
        endereco_original:
          "HUMBERTO LEONE, 62, JARDIM DE LUCCA, ITATIBA - SP, 13255-250",
        telefone: "(11) 4534-2699",
        estrelas: 4.8,
        avaliacoes: 86,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP9aPCadhKKSng8pZ4WawowBE6p_EVJh7syPp4XD7mLgsZTKRa_o_O5rDykteOeE_VoDFxT4DMfQdjVCyorCRBq6M_dUl7h6u4LT-VOZeaLfN-wD3-GDQHfs_TYF63nb_ceTrPxpwOnASW7CdZMgtepPT8VG8Vl0xI6_FErNjVyjj6F&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SOFISTICAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.1833507,
          lng: -47.2753646,
        },
        cep: "13322-423",
        endereco_original:
          "MALASIA, 1437, JARDIM PANORAMA, SALTO - SP, 13322-423",
        telefone: "(11) 2840-3233",
        estrelas: 4.4,
        avaliacoes: 140,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP30BvUlC0iQ_RYwn12Ic3UvYET1tPFH7640HNJB1hHayro4ol_uDebhdzYqJZO9fP_R3Gu7avcdxM1jQX5hnfhGLyea9Dl-fwYCdFX0m8196NSk2trqhJlZL6kxZl8CzwvruTRQx4xn9f36l0Bu_G0uzBS-iZCryVLMgx37fLI8kR1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CORONATO PINHEIROS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5611599,
          lng: -46.6873285,
        },
        cep: "05407-002",
        endereco_original:
          "CARDEAL ARCOVERDE, 1647, PINHEIROS, SAO PAULO - SP, 05407-002",
        telefone: "(11) 3812-8955",
        estrelas: 3.9,
        avaliacoes: 101,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNw6exIxgCoJ3xjSXR-8kW9oclsvSh0y2ClaZY8EVE27MUmvjhZvlvmaVbb8QqFqHw580Owt5PJPDTCvaSoFTIMFnnaMzR32pa1ycwQTQRtam_AZLF144md61ICey-amMFH4kEavwT07pFeS1GYItxM1OfE4tkKwMij0Ncr4zZwRwjX&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JOTECAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6393334,
          lng: -46.7670835,
        },
        cep: "05777-000",
        endereco_original:
          "Estrada Estrada DO CAMPO LIMPO, 2067 - DE 2 ATE 3900-LD. P, 2067, VILA PREL, SAO PAULO - SP, 05777-000",
        telefone: "(11) 3834-9066",
        estrelas: 3.5,
        avaliacoes: 61,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP6KWpKLX14lONY4Dr2gPkeywFu4vqUjlYIZYQowDGIgHUsVjMbH0wuRbaqhRXxedYcHP7iBBSpVsKA3ZttzgM8BOPNuFKJbKveA_EMcRwcJWHu49Z39p-JWbk8g5HvLRgRe9iaCF21EPPajrv4XWUqplnEggfixvWffzQ_cpK8vEzz&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "4X4 MECANICA E FUNILARIA",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.1206564,
          lng: -46.5566323,
        },
        cep: "12942-653",
        endereco_original:
          "JOVIANO ALVIM, 862, ATIBAIA JARDIM, ATIBAIA - SP, 12942-653",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "AUTO ESTUFA CLASSIC SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7107881,
          lng: -46.5454014,
        },
        cep: "09710-212",
        endereco_original:
          "Municipal, 531, Centro, São Bernardo do Campo - SP, 09710-212",
        telefone: "(11) 4127-1961",
        estrelas: 4.6,
        avaliacoes: 49,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMF20VSQjx3S6vz6FGMnPpOUdujJ53pWsaspTPLY_DsEyjaYj44YAjC8uufd9ZujjC8l6-LeapwlCj5CXkNUGloO474OsuiG5Tnq5J7Cr7R9Vs_qhCC09nkoCH-Orj_NMkMtx-UVe4nh7dJMyWEm398qval2mIXJ0SIieY76qniF5WW&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUJICAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7206627,
          lng: -46.5671292,
        },
        cep: "09810-555",
        endereco_original:
          "CRISTIANO ANGELI, 379, ASSUNCAO, SAO BERNARDO DO CAMPO - SP, 09810-555",
        telefone: "(11) 4351-6333",
        estrelas: 4.2,
        avaliacoes: 120,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:15 PM",
          "Ter: 7:30 AM – 5:15 PM",
          "Qua: 7:30 AM – 5:15 PM",
          "Qui: 7:30 AM – 5:15 PM",
          "Sex: 7:30 AM – 5:15 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPiqa6fML0zQz6XnGhntgzMDrNIzIn9f8b8ywsC69y9vuy7Y1DOxxuFGULUIr__j4ujGMTHH4MaU_jVJWkIvHtMwr48pWg665EFvv859h-bacs7QJkhaSYwZfS2mrb0gjXaMl5XD2zl6tkUi439RN8Kpk_X2Fkl3Ju_bgGMRdIftYld&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GUERREIRO DOS BATIDOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4914968,
          lng: -46.6249767,
        },
        cep: "02035-012",
        endereco_original:
          "Rua DOUTOR ZUQUIM, 1669, SANTANA, SAO PAULO - SP, 02035-012",
        telefone: "(11) 3360-4043",
        estrelas: 4.6,
        avaliacoes: 32,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNGpNY942htCZ4nkgIxY1WrvIoVlm_8YedqxayCm6z7TuXdKnaBzglYBt8xzKD4aeKxdc_pjKqghVnUaDT1roIdWJRoR15kqvSC1VpYT9VdjA9eWWgtLLqc1N_7A56EYeNkPmVRKj7S2sfZqS8JnoLmYjTRsNyu-jZMMC_bRMqbCwvn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA MARQUES",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.656214,
          lng: -46.6554393,
        },
        cep: "04378-200",
        endereco_original:
          "SANTA CATARINA, 2580, VILA MASCOTE, SAO PAULO - SP, 04378-200",
        telefone: "(11) 5564-9898",
        estrelas: 3.8,
        avaliacoes: 162,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:40 PM",
          "Ter: 8:00 AM – 5:40 PM",
          "Qua: 8:00 AM – 5:40 PM",
          "Qui: 8:00 AM – 5:40 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 2:00 PM",
          "Dom: 9:00 AM – 2:00 PM",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPVY7vH1coznPAZeGp0vW0fSXeO7PmmLqw8ndk9JKB--YOQqYRpbbDClwSrPoz2RvWAkdtWEdGgefu9XYCQerW9OnmGqfO4MDHwyj1vv9nhXVe_3QfwVdTT_kj_RpEE7hq9a1n2S7LxDxQCedJIx8Lh-MyKIeRu9c8od459Ys6hnIur&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALE CAR",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.7052986,
          lng: -46.4321156,
        },
        cep: "09426-070",
        endereco_original:
          "HUMBERTO DE CAMPOS, 1780, BOCAINA, RIBEIRAO PIRES - SP, 09426-070",
        telefone: "(11) 97554-5538",
        estrelas: 4.6,
        avaliacoes: 105,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNuIyCwz9L6XzH7jBRC-i3joKeiJCi_VQbL9DCLz4M8MvPPUYsf6BdOCzVGYFUp7P9WBWfPaB9UD5TTa28JRfRA3YbB1A71nbxgqpJ0XqjzQiAFXAYya7LiaEfVrrW0IAfL7LIWJxgM7tvTLSPN11e27LSCmiVp7PT2BByC23CEWQl1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NOVA CONSOLI",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.046117,
          lng: -46.3491746,
        },
        cep: "12970-000",
        endereco_original:
          "BENEDITO TEÓFILO OTONI, 850, POUSO ALEGRE, PIRACAIA - SP, 12970-000",
        telefone: "(11) 4036-3547",
        estrelas: 4.5,
        avaliacoes: 15,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:30 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:30 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:30 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:30 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:30 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DObuUlyHa-WIyFNMt4AJEIAyBKeAX7BNkl2n6IXsz4JpB-AYxKoFjlkF9pX9aOR6PbJZquLJsjmRWKbEE3QcFeQVIjVacztyMD3l0J3FlEhV1hPcyLwKMgnzj4kRJgJ_0ZdDtWHmnFNu6B0LzMT0jhGMpZ6PFEQWgNmvLm5umHg1gQc&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PAULINHO TOTAL",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5917267,
          lng: -46.6773381,
        },
        cep: "04544-001",
        endereco_original:
          "DOUTOR ALCEU DE CAMPOS RODRIGUES, 535, VILA NOVA CONCEICAO, SAO PAULO - SP, 04544-001",
        telefone: "(11) 3849-7344",
        estrelas: 3.9,
        avaliacoes: 56,
        horario_funcionamento: [
          "Seg: 8:15 AM – 5:30 PM",
          "Ter: 8:15 AM – 5:30 PM",
          "Qua: 8:15 AM – 5:30 PM",
          "Qui: 8:15 AM – 5:30 PM",
          "Sex: 8:15 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMNxMCcltk0fJgDkRY13nUDW1w813k4m6FbXZLncmAR5E7WB-rKnEJFbxVe6cjKJUZDNPkQEDX4i0hCdGkTk8deeoaMYOBFp1mUHPDW56sjeiEFWDCveqmRF2Cj8oGIjUuFNw84LbIlU262EQF6kiieZRmV2lOS5iOwfTF7zV6hLsIZ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DEMAUTO",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5232153,
          lng: -46.6979458,
        },
        cep: "05046-000",
        endereco_original:
          "Rua AURELIA, 160, VILA ROMANA, SAO PAULO - SP, 05046-000",
        telefone: "(11) 3862-5871",
        estrelas: 4.7,
        avaliacoes: 287,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMVVqSRPHwoET9rlvyNT5NK6C1V81hJoV2rcwxcnwir6xysjMeKFn2XD1LLiFQ4-XWAy8n_zG3-dgzUG8S_bAwxsu96ZtdXfO-wPTDg0c9MV_ZG_0ptMLP6Sb6YByqX61wSzLv-9-2ENSbRFI8Y2-Smb6GoSYXP2c6tT73BrptAKhgU&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTOART",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4754749,
          lng: -46.8304585,
        },
        cep: "06543-315",
        endereco_original:
          "Alameda AMERICA, 386, TAMBORE, SANTANA DE PARNAIBA - SP, 06543-315",
        telefone: "(11) 4193-5998",
        estrelas: 4.3,
        avaliacoes: 90,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:30 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP9aJci1c0QoB_Bju9huY3rfjy1YaxEp5VyGCxJLZ80TNVClj8ELVwsTCkdV23PyGmVRa6An0Nz5JPwnyXi-8RC9RqhrduMvZT4GEIyYWUygAMTHZI92_JHlKdZSE5HvM802n5Zvqs2VWWm-7Qrm5JkpkL-tkrHjuHRrwOPcfGyP3y-&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DELGADO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5964803,
          lng: -46.5353755,
        },
        cep: "03282-001",
        endereco_original:
          "Avenida VILA EMA, 5004, VILA EMA, SAO PAULO - SP, 03282-001",
        telefone: "(11) 2211-3192",
        estrelas: 4.8,
        avaliacoes: 86,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 5:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 4:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "UNIAO W E A FUN PINT",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.9439714,
          lng: -46.5402897,
        },
        cep: "12900-000",
        endereco_original:
          "Avenida  JUSCELINO KUBITSCHEK DE OLIVEIRA, 82 - AN, 82, LAVAPES, BRAGANCA PAULISTA - SP, 12900-000",
        telefone: "(11) 4035-5859",
        estrelas: 4.6,
        avaliacoes: 76,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPw2pHfG8DRBdzCRMNm4O8-5jdUZFHaGhCIBS-4axwR_gs_F0nKUlnPmhD0lpvevflfqIHf58MFEY3VQmFfUu42rCMQm6HcfKqRiINNCW3vwp7wXJR_j9FfidxsDCayXjEQaHrGBPTLSXoGP7rA5yLXi1yKRMdhAFiH7YyZ56VR4hNr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CALAMITA MOTORS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5418472,
          lng: -46.5417194,
        },
        cep: "03442-010",
        endereco_original:
          "JULIO COLACO, 900, CARRAO, SAO PAULO - SP, 03442-010",
        telefone: "(11) 3798-6433",
        estrelas: 4.4,
        avaliacoes: 326,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOJu3ErrOTQz-7bGtM7fk8eLbKe2TS6QwWGhMdM9br-xCZxoxoCMhvFX6ua_yNWonwYZx-4mrNNyPpz5Yjz03g7OSFjeC47K7-Gouhg6kDehRWeTkYh-0mlKBnYAAwT4ZMncjNA7dg0kQP-G3iBIgw5smtVYjHVGefVr4ObkoHptQ_f&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "REINACAR",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6869218,
          lng: -46.4518497,
        },
        cep: "09360-120",
        endereco_original: "CAPITÃO JOÃO, 2479, MATRIZ, MAUA - SP, 09360-120",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "FUSION REPARACAO",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.8030123,
          lng: -47.11895089999999,
        },
        cep: "13140-000",
        endereco_original:
          "PROFESSOR BENEDITO MONTENEGRO, 336, BETEL, PAULINIA - SP, 13140-000",
        telefone: "(19) 98259-4411",
        estrelas: 4.1,
        avaliacoes: 64,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOPy4LjgHBnlReDSKAkWgxLHOkMyv2-37RyEUS4i-IRcLt2mNeNbkHh-_1cBiHgi6Y3DPIjZelbjRmO5kbw_79S_2_OXoHLRwn8xIJvcoKsPm9xqwLgpNI86VsukbsahWqXyW0jEHjTQe24aXYsLdeimRHKqK_Nflx6YdI2kbsVftuW&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BRAGA GARAGE",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5094994,
          lng: -46.6728917,
        },
        cep: "02550-080",
        endereco_original:
          "CONEGO ARAUJO MARCONDES, 56, LIMAO, SAO PAULO - SP, 02550-080",
        telefone: "(11) 3857-3292",
        estrelas: 4.8,
        avaliacoes: 34,
        horario_funcionamento: [
          "Seg: 8:30 AM – 5:30 PM",
          "Ter: 8:30 AM – 5:30 PM",
          "Qua: 8:30 AM – 5:30 PM",
          "Qui: 8:30 AM – 5:30 PM",
          "Sex: 8:30 AM – 5:30 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMh6e8_ZG505FxEn5xahtZDM7F89Z64Hs8-j7oYrVC--uxsq9kbfFz4ojM3puHrVHAlGga0P1Ahjouu5dozZvKFVWOU718YjM4tuhsG9a21FJRLkxVGx8O2C__zyG3tiVeus01ixzieIJEI5rg9NDfQ4P9VX0bjuxT9X6tdbHYPBL7B&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PONCE E FILHO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5588756,
          lng: -46.570369,
        },
        cep: "03346-010",
        endereco_original:
          "BUTIA, 42, ANALIA FRANCO, SAO PAULO - SP, 03346-010",
        telefone: "(11) 2965-7383",
        estrelas: 4.4,
        avaliacoes: 88,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMQsOxmEZj4w3qF3ES6CLEj0XqYvmjXdefy72a5TzN0auM5Ic_gh5RFe8B6OwN5ALJbzXpzFvlM2Vl5VhORVdV1ylMrH45iQTfHQtovL5bjHo3NJSf_Lap0rwc2AR_HXfAa1Q6JlzTtwJbQWIsgp3uui-aCJ7TM8hDMwarIBGi-W4dZ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LEMOS IMPORT",
        servicos: ["Vistoria por imagem", "Multimarcas", "Mecânica"],
        endereco: {
          lat: -23.6228001,
          lng: -46.55121399999999,
        },
        cep: "09550-250",
        endereco_original:
          "Rua ALEGRE, 771, SANTA PAULA, SAO CAETANO DO SUL - SP, 09550-250",
        telefone: "(11) 94782-4355",
        estrelas: 4.7,
        avaliacoes: 271,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPMG_wePlx05TU0UFECRcZfLu8dC31AxrtNXJ3PYfEZEydpa6t-mV5U77MDhS_c3u20Ysm26uXj94Y3f2hCYJ87nOYPJOpj2xDA9OVRHpIHcGp8AXuWb0a-e4Hu7HGIDu7LAvI_qHyGagPfMdp_rirWVv2loAt913PDa3oxRrIOMUF1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MONACO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.728329,
          lng: -46.5561049,
        },
        cep: "09811-375",
        endereco_original:
          "Rua LAZARA DE OLIVEIRA LEITE, 409, DEMARCHI, SAO BERNARDO DO CAMPO - SP, 09811-375",
        telefone: "(11) 4351-1133",
        estrelas: 4.4,
        avaliacoes: 93,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOQtbvp3p1rQGGh3hUTTlexLELLQSmNrOCvWzW7c_uzxGkav9GvukgSopmqtElj1cMLYcca4G2_92H2X0IQ_NBVNGGKydKqOu_QeqHZy3uvVnYI66dRMpHXx4m0DNC7i1UL0xjof1O4P7x0xVH4gWN_eGCCBngi7jAXZUJSROBWY7J9&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "STHYLLUZ CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.3957845,
          lng: -46.3240576,
        },
        cep: "07400-165",
        endereco_original:
          "MAJOR BENJAMIN FRANCO, 40, CENTRO, ARUJA - SP, 07400-165",
        telefone: "(11) 4653-4555",
        estrelas: 4,
        avaliacoes: 213,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMLeaxZXcWnJR4YxGkcttXqb1o4dZnVsw_kaI2LzdRHd2RPtXPiDtrcw5mOZSuROtAE8xQjZEExWXJl8DZtq22D_g7mBOXYjamzdCb_O6nkQdRlwiwTI7KlP0dsvm43-sh936d0IBZfA989APvT_O985b8gkK0J4ve9iS1nS2D4vhK2&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ECOFIX",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5439645,
          lng: -46.54654379999999,
        },
        cep: "03402-001",
        endereco_original:
          "CONSELHEIRO CARRAO, 1436, VILA CARRAO, SAO PAULO - SP, 03402-001",
        telefone: "(11) 2619-0277",
        estrelas: 4.2,
        avaliacoes: 88,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMFUaVieYIaxM6x-C21fCZnF3WQ0PRZrfHcowQy35QNYW2sjWUbKIachVWELSg9U-SLpKUUscowuhPWjLSzxEltEVdiOkVY1ZywxRzg-1UHWB5M6TwTK6toBXWoKuzZVFhk9WgbFG_1obIafO_PDUbmCAPWL7Wvz3bCC8zmrKZXnVk7&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RUSSO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
        ],
        endereco: {
          lat: -23.5133742,
          lng: -47.4753063,
        },
        cep: "18044-000",
        endereco_original:
          "VISCONDE DO RIO BRANCO, 1086, VILA JARDINI, SOROCABA - SP, 18044-000",
        telefone: "(15) 3229-4848",
        estrelas: 4.4,
        avaliacoes: 530,
        horario_funcionamento: [
          "Seg: 7:45 AM – 12:00 PM, 1:00 – 5:35 PM",
          "Ter: 7:45 AM – 12:00 PM, 1:00 – 5:35 PM",
          "Qua: 7:45 AM – 12:00 PM, 1:00 – 5:35 PM",
          "Qui: 7:45 AM – 12:00 PM, 1:00 – 5:35 PM",
          "Sex: 7:45 AM – 12:00 PM, 1:00 – 5:35 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNQjOVUrCCHQrSlIvBuzcubcLD5JvP8GAfcoEm7Mo2z-L8MzpO5xdtEd3B4O9P-1Lb2bkir63TZvelX1yIknjAlpR2WN4bet02bi56eCGcZ2p_VE2xAwGgVRDlM9_dOKHHQWn2qJyJipfcYFLsVzCnJp1JgeRrdrDCcCyEuOb5n9zli&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO ROBLES REPAROS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.518241,
          lng: -47.4817315,
        },
        cep: "18045-435",
        endereco_original:
          "Rua DOUTOR LINEU MATTOS SILVEIRA, 255, JARDIM HELENA CRISTINA, SOROCABA - SP, 18045-435",
        telefone: "(15) 3221-7964",
        estrelas: 4,
        avaliacoes: 37,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOdG4E7YLVuO_Z-cr7vI11paIajau_6HBXZowWfIAzlYwzZbsSo6L8RRjhjU0voznqIobxQK9HV-vb3A7gGd7fTb8PZC7DMMSuXrMXSTaTJlTL-DbjX-RhTzR2WuxuWw1ADJERqJLdwuZgSUevFxnwsO3jwmsoDMFSQuc0oHvHkOZjF&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SOLICAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5390274,
          lng: -46.4509298,
        },
        cep: "08215-115",
        endereco_original:
          "Jacu Pêssego, 5550, Itaquera, Sao Paulo - SP, 08215-115",
        telefone: "(11) 2364-7897",
        estrelas: 3.9,
        avaliacoes: 256,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMjNf9pQ4qP2m4mXjbnHn_J-Gj7WBym-db7uBgNhFs5RGXlHyemM50ltQvkm-C-97HQzG29GOYB4c7tLYJ3pHJfTnJRkiPl-kMeYi_PxEKV7ZlkfYj4KKhun-spv25bRgJGUO-eJ8fb9gTGaAhFqN4cn44XrTAZBinDt59IgJYwnr8N&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FREITAS VEICULOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.8873383,
          lng: -46.4239876,
        },
        cep: "11510-100",
        endereco_original:
          "PEDRO JOSE CARDOSO, 350, VILA PAULISTA, CUBATAO - SP, 11510-100",
        telefone: "(13) 3372-7715",
        estrelas: 4.5,
        avaliacoes: 70,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMHaV8Nv9sSlYf-Z1yFhhYvObP-54tH8vPBG1n4w2ThAqFT94z5ugSRw1Qo3zO_6tBNHj6l8Oc3oYO8zGEw8oUqsjT5AqtH8HFElhlqmcrHFI4LmKtD10tZ2GLBB7x8vT61abGhKdNy_KYePPPQ1Nvp7sgvgsw-V__LeQd8VdaR4-se&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GCAR ESTETICA AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.8536145,
          lng: -46.3090175,
        },
        cep: "37640-000",
        endereco_original:
          "JOSE MARQUES DE OLIVEIRA, 123, VILA RICA, EXTREMA - MG, 37640-000",
        telefone: "(11) 94111-9147",
        estrelas: 4.7,
        avaliacoes: 35,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 5:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 5:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN3wP3CafVnfkbU6erIxi4f0Hhr2BnfcixadTHFpifY7CVzII5BroGbkhvMRGMv7yu5txExUY24zbJ7ThtUaahUxiQTek1YkW3kfqb2ahVxojbeKKkqKZM0jjPnx9J1ZlBPlOmaZChXJOOEbErQsgkXU_RDBEk2JSasnnDRa2IHq21w&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTOMOTIVE FIX",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6283623,
          lng: -46.6467751,
        },
        cep: "04065-001",
        endereco_original:
          "CECI, 2188, PLANALTO PAULISTA, SAO PAULO - SP, 04065-001",
        telefone: null,
        estrelas: 5,
        avaliacoes: 3,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "JAGUARAUTO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5035137,
          lng: -46.6616973,
        },
        cep: "02520-200",
        endereco_original:
          "Avenida CASA VERDE, 2164, CASA VERDE, SAO PAULO - SP, 02520-200",
        telefone: "(11) 3858-4788",
        estrelas: 4.7,
        avaliacoes: 270,
        horario_funcionamento: [
          "Seg: 7:00 AM – 5:00 PM",
          "Ter: 7:00 AM – 5:00 PM",
          "Qua: 7:00 AM – 5:00 PM",
          "Qui: 7:00 AM – 5:00 PM",
          "Sex: 7:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOcsYBzilVgIZip1uZX3tSmn0eE0nsHqnIuN5mtgfhRPEAPKJdvDKE0n_zUpEgv-O_Oz4JDI4AhGWGF5nXSklZTypnFpZ3lU-HCQGGONBtJr4mOL-k4-XoOXgL3RXq-NrCVKbvj6D-f7-pbELoZrF2brBtF0pWnE9X-uONFGt5p6IHM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BFP MORUMBI",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6259824,
          lng: -46.7371409,
        },
        cep: "05640-004",
        endereco_original:
          "DOUTOR GUILHERME DUMONT VILLARES, 2364, JARDIM LONDRINA, SAO PAULO - SP, 05640-004",
        telefone: "(11) 3747-0139",
        estrelas: 4.6,
        avaliacoes: 431,
        horario_funcionamento: [
          "Seg: 7:00 AM – 6:00 PM",
          "Ter: 7:00 AM – 6:00 PM",
          "Qua: 7:00 AM – 6:00 PM",
          "Qui: 7:00 AM – 6:00 PM",
          "Sex: 7:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOZJqtoC1Kc_Aj5zbdFXdPAxxcPWwNehchqm9Xiu4ddRLsXP9BVspxMeRp_4RMXR0CgCflEfieAwbe8AbCBBq1iGbtPialqiVmkYzVoyF9Gj_bL87EMk98UrUPPuaSFcFuuwxN4EZ3fyUYZ81kgStxnyocsChbvwTViA1w2053jLPZN&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "G.C.MACHADO REPARACAO DE VEICULOS ME",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -22.899897,
          lng: -47.0841927,
        },
        cep: "13070-746",
        endereco_original:
          "Rua Major Luciano Teixeira, 222, Bonfim, Campinas - SP, 13070-746",
        telefone: "(19) 2512-1749",
        estrelas: 4.7,
        avaliacoes: 55,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOSn5i5OxFjZhcsezrGsr2856tR_vK48-a5y3C8LwRTAsounaB3WS3n9iOGjgPIfBzpP7ZHqKsID2gOhAEBE2U8EkY38_tm1C96UWeOgv-HxtBG2Y1Zje4cZj0EnbM2f-F-oU7VedGmmyUApQFYdsQknfTCalCeYeOYoUnCxnXR-IOr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VILAGATTI AUTO COMERCIAL LTDA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5037622,
          lng: -46.6869958,
        },
        cep: "02726-160",
        endereco_original:
          "Orlando Marchetti, 118, Vila Palmeiras, São Paulo - SP, 02726-160",
        telefone: "(11) 3932-1737",
        estrelas: 4.4,
        avaliacoes: 89,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN8RzIoEtiBWNPSNXIncFSqmZNbC9oWixkcPOYAJXAxb70ZCMbsQoqwqCiBB8rFidO9cNr7cBGj-XUdW8HhSyJSkx90FFVUbRFwoL76XynjgxDL58ioPMpMMeFLqDDwyzlZC4iXTj6_ShnfHYrD5iM2-gsQm6_q74s91yWj37gW034p&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NITROCAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6351472,
          lng: -46.62742550000001,
        },
        cep: "04301-002",
        endereco_original:
          "Avenida MIGUEL ESTEFANO, 2512, SAUDE, SAO PAULO - SP, 04301-002",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "BIRO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5118723,
          lng: -47.4495358,
        },
        cep: "18025-070",
        endereco_original:
          "Rua Marcílio Dias, 120, Vila Assis, Sorocaba - SP, 18025-070",
        telefone: "(15) 3231-1150",
        estrelas: 4.5,
        avaliacoes: 71,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 5:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 5:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOCtLreKXYUtKLsHGoR7e71ANT8sllXS7pAwBoxgo8htuHDJiwYLd4NkmbO6kXaI7mFbb2bj2Dzc6qJD2PHJj55I3QDxd_rFC0lgvVcHp0opfakV5klV-RoPZktua566HFOcYCiLIw_GFhMzvcUKeXIEF8a8f_YYqpTCmp-sktkEcIe&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TRICOLD REP AUTOMOT",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.9217823,
          lng: -47.090525,
        },
        cep: "13031-695",
        endereco_original:
          "Rua DOUTOR EDMUNDO NAVARRO DE ANDRADE, 2240, PARQUE INDUSTRIAL, CAMPINAS - SP, 13031-695",
        telefone: "(19) 3308-0494",
        estrelas: 4.3,
        avaliacoes: 95,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN32Tk33pcuHMRpkZ9cVHhgUNnV9jZ7S6DdW9rXydw-cX1dscEQnpXE2V1O-628VZyarYnVOYVuQ0BMLzwPIzm7vuYqTogbtnE0YDyS1tHvHS3b7PVzL78_3xeJ4kdH5K60a4Ocse4NkqvpILTYSnBCVn3z1atwVqxgkktNsGqNcc12&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "QUALITY",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5274128,
          lng: -46.6338806,
        },
        cep: "01124-020",
        endereco_original:
          "SALVADOR LEME, 291, BOM RETIRO, SAO PAULO - SP, 01124-020",
        telefone: "(11) 3326-6788",
        estrelas: 5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "TOKUNAGA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6275634,
          lng: -46.7067432,
        },
        cep: "04714-002",
        endereco_original:
          "ANTONIO DAS CHAGAS, 1518, SANTO AMARO, SAO PAULO - SP, 04714-002",
        telefone: "(11) 5182-7989",
        estrelas: 4.3,
        avaliacoes: 71,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOn4zBytitY_CXkq675GNLqPgsfJeYWb9akO7S8O0cswx0Y4B-aCKg9nQwetBYtSiQpxcTXlI3So8jtqPmMSWbVafmiKPdDSRnInYsrst1GeEYQjMRde1qHTxIoU4FU7Agyu9-xqK9qcsyRmYg492ErRHhIgsLL9kRC-Kf7TF60yLu2&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LSP REPARACOES",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
        ],
        endereco: {
          lat: -23.3177809,
          lng: -46.2189413,
        },
        cep: "07500-000",
        endereco_original:
          "PADRE LEÔNIDAS DA SILVA, 675, CRUZEIRO, SANTA ISABEL - SP, 07500-000",
        telefone: "(11) 4656-6301",
        estrelas: 4.5,
        avaliacoes: 33,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOLTck3P1Pk20sAkqLDaplRWU0wCMOmtz0p5ip2WpH-P1AeyarVwoVPG_Ewjkkyu19B7bZ4HemoiZmXNCYRDg5FqjLF8YPiOw58VlEU6CKaAIGuVsdcEVk4ywczgtfrXaCyCdEDdhERpqK4kLmFQjXYvAH7lDvWVfPOFYEFDC85oI6Z&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "EAGLES",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5019585,
          lng: -46.6201058,
        },
        cep: "02036-011",
        endereco_original:
          "Doutor Gabriel Piza, 621, Santana, Sao Paulo - SP, 02036-011",
        telefone: "(11) 3872-3569",
        estrelas: 4.9,
        avaliacoes: 460,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMD87NjBAb7tH5pjZCytSjMf2cuGis2jGu3Q7PDq9afIUWd-9JsdHYytEy1o_pzMrCCbB8C82egP6-AEPG5huUixliqw5ONQDlwryFpKkUUWK2NzAvRLsHQ3sazNN7tc7L_bSfZ-XS3S5Js3YiX9HM2z4tHobdYgvMGQYzwl4UqEM46&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "3D CAR SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5446585,
          lng: -46.5330883,
        },
        cep: "03444-000",
        endereco_original:
          "TAMAINDE, 969, VILA NOVA MANCHESTER, SAO PAULO - SP, 03444-000",
        telefone: "(11) 2093-9678",
        estrelas: 4.5,
        avaliacoes: 13,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "RCR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6300287,
          lng: -46.5320258,
        },
        cep: "09220-610",
        endereco_original:
          "Avenida UTINGA, 169, VILA METALURGICA, SANTO ANDRE - SP, 09220-610",
        telefone: "(11) 4997-4346",
        estrelas: 4.7,
        avaliacoes: 34,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMTMYssG3orVjhv7bYU2T8T8-rKE-xQvUrbPITriQf37fZaSxJ6WTVTE-u-w5i_aIfLv9RkX8T_S-TjFJb-F-khzp8niBA7SykhAWFu6UMid-J10fecy1V8p8FPGRiYuFy95ldfo36_bdN5DuHicPFdbcXr9NmfZLtadcvxgAXM4Xcj&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO SPEEDY REPARACOES",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.5295558,
          lng: -46.83287110000001,
        },
        cep: "06322-130",
        endereco_original:
          "ROMANOFF, 297, VILA MARIA HELENA, CARAPICUIBA - SP, 06322-130",
        telefone: "(11) 4164-1806",
        estrelas: 4.1,
        avaliacoes: 23,
        horario_funcionamento: [
          "Seg: 7:00 AM – 5:00 PM",
          "Ter: 7:00 AM – 5:00 PM",
          "Qua: 7:00 AM – 5:00 PM",
          "Qui: 7:00 AM – 5:00 PM",
          "Sex: 7:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPyqdy8TXt8nsy8kjVOSE2d7PqBQmUVDIX4MjA8tFfd2AP61yg5k6jEPJJ6HtXv3g33Qemzqyl142v5wTbCokQx5nNrLxXYbu6s7NYG_dW87yU1l1flWdhA4QBHZYDH4kRDFD3LDDJab8czztQ0t4Ab8w9mFcqZdraaiiGuuhv7cfjD&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GARAGE S IMPORTS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.5046775,
          lng: -46.9492353,
        },
        cep: "06423-150",
        endereco_original:
          "DOUTOR YOJIRO TAKAOKA, 2851, ALDEIA DA SERRA, BARUERI - SP, 06423-150",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "CASAGRANDE FUN PINT",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.7138878,
          lng: -46.7671674,
        },
        cep: "13904-025",
        endereco_original:
          "Cabo João dos Santos, 547, Ribeirão, Amparo - SP, 13904-025",
        telefone: "(19) 3807-8010",
        estrelas: 4.6,
        avaliacoes: 81,
        horario_funcionamento: [
          "Seg: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Ter: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Qua: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Qui: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Sex: 8:00 – 11:30 AM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNm6rB-xxOj8Sq-3lbqmu9Ra7Due2rN8OkjdqRGdNhyoX8YQi77UBZmJRaI7FpMTF3_qwQZB8ZBqu2CGF9R8cg6F8tHXWt6XYXg9-j8qu0pIdNTSzpwPmMCyUXL4uNKbL2_RbMipfpcDzUnHS8COy4KwQ2_YcMqp2fOx8ax2eU5Xl0t&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FAST FIX BLINDAGEM",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.609068,
          lng: -46.60143129999999,
        },
        cep: "04284-060",
        endereco_original:
          "ILIRIA, 169, Vila Moinho Velho, Sao Paulo - SP, 04284-060",
        telefone: "(11) 2271-2020",
        estrelas: 4.5,
        avaliacoes: 152,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:45 PM",
          "Ter: 8:00 AM – 5:45 PM",
          "Qua: 8:00 AM – 5:45 PM",
          "Qui: 8:00 AM – 5:45 PM",
          "Sex: 8:00 AM – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMrSeFplFsdpHccl7z68M09onwnOyol4Zn1YdULrRq0Hc2PJLKg32i4eoRpL8rsU6Wi9824p1N9xrsl4wNEItevNO7AJ8C70rrF3gUMYAQRHEfWBm1hA6rJdLH_FZgnr3S2AdlvOVnvWU4MkXeT9EzMOlqhUSOJZ8nnlhdnv6YBWWlz&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LAS VEGAS AUTO ESTUFA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6951794,
          lng: -46.5303473,
        },
        cep: "09182-410",
        endereco_original:
          "DONA NINA ZANOTTO, 532, JARDIM LAS VEGAS, SANTO ANDRE - SP, 09182-410",
        telefone: "(11) 4453-1133",
        estrelas: 4.4,
        avaliacoes: 101,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOwPwqGyxck9MmJVVBcFo_qZxBFZgnvp3JSb4vfsfbWsVNDnbhHN-KPH2KXv7FDF1re_nB8T2dY52OFA_OwVC83_mOClK0P44NWn6OVSbQ1Ay9Gmt4KHa66a26hmmvn8AWxq1hmMnnL8VhBXxhI7LeubmYsddn37JqlAx2gb3GfneJ7&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SUPERVISAO IPIRANGA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5915665,
          lng: -46.5980776,
        },
        cep: "04214-010",
        endereco_original:
          "DAS JUNTAS PROVISORIAS, 500, IPIRANGA, SAO PAULO - SP, 04214-010",
        telefone: "(11) 94444-4441",
        estrelas: 4.6,
        avaliacoes: 5,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPFkJCLYjIe7zjYptpOv8slcbRzItjQF2UEXbQwZMijJGOd-6X-Bg2yGdYwCgA1OEObtl0NpZ6j5VTkLQuha3nVnXAq7vIT7dYa5-B6x-FoT6huEYVAvnuvMJWvSpmxkAY4LltTjWKeoIrn8gQEjbuaaCpVS5O2Bvt9zx12vWtgdyYY&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FAVERO",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.7653544,
          lng: -47.4187158,
        },
        cep: "18170-000",
        endereco_original: "SP 79, 0, DOS PINTOS, PIEDADE - SP, 18170-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "AUTO ESTUFA C.T.F",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6816501,
          lng: -46.5549229,
        },
        cep: "09750-001",
        endereco_original:
          "SENADOR VERGUEIRO, 1640, CENTRO, SAO BERNARDO DO CAMPO - SP, 09750-001",
        telefone: "(11) 4123-5736",
        estrelas: 4.5,
        avaliacoes: 75,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPIot3mURoHkpi5aMF4AEhKI6MbGNr49fTZ_08s2_cRPT-FSCgrleI6PSWa1-L5NRurTbc_8PrcxC4Ip5Tdf_ufaQbmJK5iMMd50RGAfZSlGEAKrl0gAn8NiGEAYS8C1MHZvDuqffh1P8VlffsKqlOd5kmF1mHpepeotT6JezTzCjvl&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CASAGRANDE REPARACOES DE AUTOMOVEIS",
        servicos: ["Vistoria por imagem", "Funilaria e pintura", "Mecânica"],
        endereco: {
          lat: -22.991075,
          lng: -47.0039496,
        },
        cep: "13277-280",
        endereco_original:
          "DOUTOR ALFREDO ZACHARIAS, 31, VILA PAGANO, VALINHOS - SP, 13277-280",
        telefone: "(19) 3871-3232",
        estrelas: 4.3,
        avaliacoes: 70,
        horario_funcionamento: [
          "Seg: 7:30 AM – 6:00 PM",
          "Ter: 7:30 AM – 6:00 PM",
          "Qua: 7:30 AM – 6:00 PM",
          "Qui: 7:30 AM – 6:00 PM",
          "Sex: 7:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOwCgJ-Q89MnBKh0cFyCpsq39AGq2puaDYRXTCtjfEJXqisIPejpNe0EOeaHdKVz11Coy54UVo61Qw3U0NdOZMtsaFcqpGJmCVByDR1RWghysU6thfLDUJmI8kRVLwt-UdeOkyghewc514myHyR52_UJULkvqCJYcNyA-352zmn1WID&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ANARAFA FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.9383931,
          lng: -47.1024184,
        },
        cep: "13050-570",
        endereco_original:
          "INDAIATUBA, 337, JARDIM NOVO CAMPOS ELISEOS, CAMPINAS - SP, 13050-570",
        telefone: "(19) 3227-4650",
        estrelas: 4.7,
        avaliacoes: 130,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:30 – 5:45 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:30 – 5:45 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:30 – 5:45 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:30 – 5:45 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:30 – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOv_ItWQ_warDdXLDoD1ogfBeeZ9r-cj7hO-eqo-ErwLrMkKtgUrstQvJlQ3wHgxqO2_LfCiaZ609bheq7RwXUSjkof_uv_7ky-5BPxCooxmDh_AqX1t9OlSnGN9IBaVvb_q_Z6vBHxJjTUJ7dN-FfGXbPGzoPzw9qqKAq3GjdPJ6Yn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FLAMA CAR",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.556938,
          lng: -46.6896142,
        },
        cep: "05432-070",
        endereco_original:
          "Rua FIDALGA, 289, PINHEIROS, SAO PAULO - SP, 05432-070",
        telefone: "(11) 3814-1077",
        estrelas: 3.8,
        avaliacoes: 64,
        horario_funcionamento: [
          "Seg: 8:30 AM – 5:00 PM",
          "Ter: 8:30 AM – 5:00 PM",
          "Qua: 8:30 AM – 5:00 PM",
          "Qui: 8:30 AM – 5:00 PM",
          "Sex: 8:30 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOCPNYjbWyZ2UNkO2my5OuVk9xp3s9M5z-MHso-YR5wrZHG00XH-mPqLYmmeCKByWptHTIs8jKFlhTzPFT8QHn4ptmi6iFjPWA4e1Ej_Ph8R4m9xPwnqTw6j31EEhjHckK7Wym7nqJk3t23qlclTlf7uu2B-ZALkqDCtvo2C1_QYj8v&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA MORUMBI",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6097663,
          lng: -46.7488032,
        },
        cep: "05741-190",
        endereco_original:
          "DOUTOR JOAO GUIMARAES, 445, JARDIM TABOAO, SAO PAULO - SP, 05741-190",
        telefone: "(11) 98501-5412",
        estrelas: 1,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:48 PM",
          "Ter: 8:00 AM – 5:48 PM",
          "Qua: 8:00 AM – 5:48 PM",
          "Qui: 8:00 AM – 5:48 PM",
          "Sex: 8:00 AM – 5:48 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMY9KEWgRx-66qUofjQ8TgSAgmg-l5Rx0LtSy2ZwVTIB2O_IjHg1njQmiB7XKPDOcaspykk08T4XhxHItDcAWKY8BC4GnWrzj7DZQRVnAgFNtEmH_obeHuiVc5cgyg4vRJ1exFw0EpZ25--mCeTdrY95zgFTXQ3qhpnXzCnNOyD2Kcn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BFP SANTO AMARO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.658518,
          lng: -46.7066569,
        },
        cep: "04746-100",
        endereco_original:
          "BONNEVILLE, 74, SANTO AMARO, SAO PAULO - SP, 04746-100",
        telefone: "(11) 5545-1350",
        estrelas: 4.7,
        avaliacoes: 316,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNahiZjWpirynxVEe4LNWCzq7pq7hg5vyciAKHDKelpcoYMIQQZorTR21CTdMaRQy1BArhn5HLNC8jpxsnollx0BbKhtoNWbyC6RJ4_tzS0L0HDL5T8qAWsKivBPez0NcumjC69dg5PaS4a1egtTarxx_JBVXK6LzmEUGK8hzFqIa2M&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NOVO ITU",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.2542638,
          lng: -47.2988021,
        },
        cep: "13301-180",
        endereco_original:
          "Avenida ALFREDO SAVI, 260, JARDIM NOVO ITU, ITU - SP, 13301-180",
        telefone: "(11) 4023-0459",
        estrelas: 4.9,
        avaliacoes: 101,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:30 PM",
          "Ter: 7:30 AM – 5:30 PM",
          "Qua: 7:30 AM – 5:30 PM",
          "Qui: 7:30 AM – 5:30 PM",
          "Sex: 7:30 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNoTqVw8R0aDAFLmnZXEn5-KqFdlOHlScb-hQ2dkFuCBh9CcLXQDX1xnFJ87a31hrEmC1alxZBUZrqqVJrXe1z698zF-IaBeqx67e800BKCztGCRfTS3k658VXzPf04AuclDIzaYW0qcltbLSSCVPQGtO2QjN261CJsv2MlPakWV4g5&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BRIZA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5005808,
          lng: -46.6338432,
        },
        cep: "02013-040",
        endereco_original:
          "EMBAIXADOR JOAO NEVES DA FONTOURA, 305, SANTANA, SAO PAULO - SP, 02013-040",
        telefone: "(11) 2950-2556",
        estrelas: 4.3,
        avaliacoes: 108,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMhWJogEsQs-ihhq_IJAj1sn2jigV3veAsVw--ocvo1U68PU2iaInN8tKeQzSA9m7xOiqB4vDCnI_XzkFSeWU2wsRPgLR0HzSYs2XSqyiqWZ82lr8DuCRNrm8pPluAracWoem9SJP5j5PTI50T15NYvTaKQPy4aWVJo1af6F3Bus1Gx&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SCATTINI",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6112234,
          lng: -46.6636607,
        },
        cep: "04090-003",
        endereco_original:
          "DOS NHAMBIQUARAS, 1542, INDIANOPOLIS, SAO PAULO - SP, 04090-003",
        telefone: "(11) 5543-9622",
        estrelas: 4.4,
        avaliacoes: 373,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPvrXhhuD9b4NU0zmM2bR-yTuskxf_oOTPrfCD-tYieRoU2d2K3Zu2bVXw3Gaak9UapHgS-GMzKun6YvgsKrTjRvsyXa0uEZ0aogtIHmlzqSWhjyDS-j8-b_nxrb59FrbhCvDQXT1Wlvqqdxa8OSTpAIt_3Rhz6VBt-A8Dz1ukwgbCn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PRISMA VEICULOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.9920351,
          lng: -46.2702282,
        },
        cep: "11430-001",
        endereco_original:
          "ADHEMAR DE BARROS, 1067, VILA SANTO ANTONIO, GUARUJA - SP, 11430-001",
        telefone: "(13) 3357-5958",
        estrelas: 5,
        avaliacoes: 14,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNLBn2H-O8ukKorM2LfBLTRZYPLYwzpIJ9OfATul_UYiy98oBmC1Q1xuBoazGvKaCngGZOkmIAHJY7o-8AcyPVkst6zBUhGzqPakepYU8J49aPAyM2zCXX6TmQ3I_T_2acUhWOCezC_65utPCNWlRC5b-K8tngKK9FBAsgJNjoMuPQl&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO PLAY",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6474541,
          lng: -46.7081944,
        },
        cep: "04751-050",
        endereco_original:
          "Rua TENENTE-CORONEL CARLOS DA SILVA ARAUJO, 350, SANTO AMARO, SAO PAULO - SP, 04751-050",
        telefone: "(11) 5687-9977",
        estrelas: 4.6,
        avaliacoes: 111,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 9:00 AM – 12:00 PM, 1:00 – 4:30 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMNPdulm3YpLpfBflE2DpPFg3edPDwALjxpgVPnqFo1x4EwLHSFZcoLYPy58HJsTPLrSq2yd4dSEmpkJz7pT2qiTaxyI8eaDYlJwlbLMcGLzgJpoU_yPidacVEqVW2jlQ_TVZyt_RZtQHlK4ouShH5eZe8z9L5MiX1BgVsl1Z8ssJbr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AEROCAR RETOQUES",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7122915,
          lng: -46.3964826,
        },
        cep: "09406-190",
        endereco_original:
          "EUGENIO RONCON, 13, SANTANA, RIBEIRAO PIRES - SP, 09406-190",
        telefone: "(11) 4828-5940",
        estrelas: 4.5,
        avaliacoes: 171,
        horario_funcionamento: [
          "Seg: 8:00 – 11:30 AM, 1:00 – 5:30 PM",
          "Ter: 8:00 – 11:30 AM, 1:00 – 5:30 PM",
          "Qua: 8:00 – 11:30 AM, 1:00 – 5:30 PM",
          "Qui: 8:00 – 11:30 AM, 1:00 – 5:30 PM",
          "Sex: 8:00 – 11:30 AM, 1:00 – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPE8VjB1jhjThiSSnFE2KI5s3IDzqutNuTp8z-HZ_lmQg4IWIXUXCmMQc28_r9BbmlW7LmCsrJBFy0_a50WAepr01SV2YIwit1aZQEmHLXsXlmm2czI2t_Q6qm7OFT9QH5buv35FMNR9mxM8jX81n2LdrIckaoGtvdFTWmZKj37ROP7&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BONNEVILLE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.667063,
          lng: -46.7155005,
        },
        cep: "04763-000",
        endereco_original:
          "AUGUSTO FERREIRA DE MORAIS, 376, SOCORRO, SAO PAULO - SP, 04763-000",
        telefone: "(11) 3205-0190",
        estrelas: 4,
        avaliacoes: 80,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOq0G_upEZvDo6CocSWsIl-0bkOu4huwVY1JNoRPIU72rpLETn-c0ixqdUsNjLhXHaQDgFAoR61P-VbmRlJwyJ3od8YkqyNtXya5blQzuwwWTxQyhQ5DdXbKeN8efTlW4nJAjoBqz4WQjDvYHpTTvnPTwnodmG39AR_sdkUvGm2bdX3&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FERRETO",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.0333028,
          lng: -46.9766706,
        },
        cep: "13280-103",
        endereco_original:
          "MANOEL MATHEUS, 711, CENTRO, VINHEDO - SP, 13280-103",
        telefone: null,
        estrelas: 4.5,
        avaliacoes: 131,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN7kWcZbVQ8wG1d_z9mTIP6FZ5go5JDIPCNdrHh8QuDGgDwU6h0TBp7FkhCFwlVdrrCXkj6S3UiQhOdbAjcOAhqiJrtPE5KHYbVs6yz7uutUvqhJ1YCW3byTwMm1hwZVlj0E9RRBf_FQYPURAKP8KhFRfuL4F0sqrQBp0GRRnsHtXmt&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GIANONI E GIANONI",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.9603641,
          lng: -47.0048739,
        },
        cep: "13272-350",
        endereco_original:
          "CAMPOS SALLES, 1251, VILA FAUSTINA II, VALINHOS - SP, 13272-350",
        telefone: "(19) 3871-4567",
        estrelas: 4,
        avaliacoes: 55,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 6:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOmP3zdCJD1e_WVJVCa8CnpjPuuvSJPYQh-XHRfokqy8tVOQuADZkGmlMDFvzRq4EjtROpIzvph-vnUjhdnbSUDvNgufAPsjeMPSmLQ_dq0Qu4MEDws9YAKyDxmvp99VOLhfYG18U7tX8lejD8NR2_9OvnbbtLSg_fD2Cu38NLtsJBC&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "INFINIT PIRITUBA SERVICOS AUTOMOTIVOS",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5028872,
          lng: -46.74491769999999,
        },
        cep: "05132-180",
        endereco_original:
          "DOUTOR AZOR MONTENEGRO, 217, VILA MANGALOT, SAO PAULO - SP, 05132-180",
        telefone: "(11) 3904-2922",
        estrelas: 4.3,
        avaliacoes: 91,
        horario_funcionamento: [
          "Seg: 8:10 AM – 5:30 PM",
          "Ter: 8:10 AM – 5:30 PM",
          "Qua: 8:10 AM – 5:30 PM",
          "Qui: 8:10 AM – 5:30 PM",
          "Sex: 8:10 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPTFlMzG-uxGYAOljafWP8oKOK0Y3iqKnaVlolPuyY9wWTP-z-Z0hcpYZw3yRtVi7aEnP03yVTAIrYgckNNZZCkZUN_C3tGn71_yHvNU5_u2u6ZlE6BFocFkU0BztHgC9dIflfZNvh5lsj1stSuiKz0z3V7MvX1dU0saQ6BLh6qYHzn&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "DONICAR",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.4975831,
          lng: -46.4512717,
        },
        cep: "08011-710",
        endereco_original:
          "Rua ESTANISLAU DE MIRANDA, 128, SAO MIGUEL PAULISTA, SAO PAULO - SP, 08011-710",
        telefone: "(11) 2030-7548",
        estrelas: 3.9,
        avaliacoes: 520,
        horario_funcionamento: [
          "Seg: 8:10 AM – 6:00 PM",
          "Ter: 8:10 AM – 6:00 PM",
          "Qua: 8:10 AM – 6:00 PM",
          "Qui: 8:10 AM – 6:00 PM",
          "Sex: 8:10 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMy9B_Tw6Ztk4iMkf-cCa69dCq-4BpiD9G_vkhVL76vJiR88Tmvfx1Z2XtdugRcw06C9DonnV6J59YmdpRla2-wwdNI2CMUbWgUgAFQgNnGAETPQYVoYqUtUSCBzjwA-87B46aXKQxfnAkVtRmp1-7Shyf48ZqNcaK1ohindBAjnKoC&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO MECANICA E FUNILARIA NOVA VINHEDO LTDA ME",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.0230173,
          lng: -46.9892217,
        },
        cep: "13280-000",
        endereco_original:
          "ALFREDO ACHCAR, 464, NOVA VINHEDO, VINHEDO - SP, 13280-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "DIMAS NORTE II",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4999314,
          lng: -46.6126843,
        },
        cep: "02033-010",
        endereco_original:
          "GENERAL ATALIBA LEONEL, 1727, CARANDIRU, SAO PAULO - SP, 02033-010",
        telefone: "(11) 2904-8400",
        estrelas: 4,
        avaliacoes: 190,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP_kW6Ig_KwsV5-QaHty5520P5q9MsJyOARTprjLudjXFX2XcGuvBfL82LjQ09EnaM84BH95Ma_p8yEQlbo783rQPnKeuc-2xbdLCTrOK_kv73eubuN0VxZ6F6vDN1YAzeLkxjLDdYaf3bHf3QSnmEA5u78Be2C59OtmixB87jbDAhu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VAZ CENTRO AUTOMOTIVO",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.109713,
          lng: -46.5382662,
        },
        cep: "12944-000",
        endereco_original:
          "JERONIMO DE CAMARGO, 2030, Vila Neto, ATIBAIA - SP, 12944-000",
        telefone: "(11) 4411-9278",
        estrelas: 4.5,
        avaliacoes: 58,
        horario_funcionamento: [
          "Seg: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Ter: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Qua: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Qui: 8:00 – 11:30 AM, 1:30 – 5:00 PM",
          "Sex: 8:00 – 11:30 AM, 1:30 – 4:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMsM5HTPbuqs27CNG-1twh1VNnQVNCbxd45QOs0oKuKReYV9ESm1urKAAu_FATVhUzhusyJ7RESZH8fhGDMlhi3DB526djdbIVc6q_xnOMStgP5J2aICCYZo57s38w7rPvMWzKU-hnNL1U0zy4Wi41yb2jhGKD_3fqoO75IPLaDnaqM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PRIMUS SOLUCOES EM SINISTROS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.9220589,
          lng: -47.0669412,
        },
        cep: "13036-180",
        endereco_original:
          "PEDRO DOMINGOS VITALI, 430, PARQUE ITALIA, CAMPINAS - SP, 13036-180",
        telefone: "(19) 99547-9812",
        estrelas: 4.3,
        avaliacoes: 11,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNhj6EYxXQ-JlKe_LdbNxqtTRfEtJeaZ3rY43Lt2LHhqPXNqnZCaR-8ikjJV8ZnAzdmfCirJlgwmVaBeP5vrQT2UJkcugnwmvYTVFr5MfoANkLfR8BM9lR5x_V64HaqRnfg1UPpuqMEwRJuVmsN1_J4qeH6pNKPjAsvdI1KswRqjsis&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CARFIX",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2075318,
          lng: -45.8842291,
        },
        cep: "12231-050",
        endereco_original:
          "Rua JACAREI, 164, VILA NAIR, SAO JOSE DOS CAMPOS - SP, 12231-050",
        telefone: "(12) 96666-0062",
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOV0pnmh5tne_bEtR9EKClhMUtOQrZhLsx7GnAZaSzRyDr576pMnv70E8HMQyY_n6zIgBl_6VoaSPduDgKGsLdVu1KZLftw5gt0FohR9aIQOPLnr-D-j0_5TPAePQijAxGdINrGo_dECMn4inXK7Ht0FSIidAVaX4ThTC5JO_dgGNdF&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "S-CAR SERVICE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5030857,
          lng: -47.6016677,
        },
        cep: "18190-000",
        endereco_original:
          "RUA DANIEL VIEIRA RODRIGUES, 1020, JARDIM SALETE, ARACOIABA DA SERRA - SP, 18190-000",
        telefone: "(15) 3281-4625",
        estrelas: 4.4,
        avaliacoes: 41,
        horario_funcionamento: [
          "Seg: 8:20 AM – 6:00 PM",
          "Ter: 8:20 AM – 6:00 PM",
          "Qua: 8:20 AM – 6:00 PM",
          "Qui: 8:20 AM – 6:00 PM",
          "Sex: 8:20 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPwuTDnigQudF6_s386EUeY6qqkmXROk4VuJt6k_qxh6-RzvqlKrRusd6HOrIpmjYcNxVjZhJBLeTMu2enWJFS3tW9_upoGofVcbmO71-Y_OqvwzzVr6VQR2zj4RIa4FY5_eGqZb9d3Ki6VAjxvnOAm18EZ9oUf1KENcJboxgeJlIk2&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SMOKE CAR EXPRESS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.6641922,
          lng: -46.5989317,
        },
        cep: "09940-400",
        endereco_original:
          "DAS AMEIXEIRAS, 1059, TABOAO, DIADEMA - SP, 09940-400",
        telefone: "(11) 96104-7558",
        estrelas: 4.7,
        avaliacoes: 145,
        horario_funcionamento: [
          "Seg: 7:50 AM – 6:00 PM",
          "Ter: 7:50 AM – 6:00 PM",
          "Qua: 7:50 AM – 6:00 PM",
          "Qui: 7:50 AM – 6:00 PM",
          "Sex: 7:50 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNVb_E_KGhA0ZEkTkFC6B3IymnzQXwfPA0tNRfWaH5L_j5v3ooj3gR73kzq97GcjKADW9cMVeAlafUhwlNeSk06D_unfzqOC47hUeB7UcexdEE0ea3E7uBy96KIBhsI_VN0kdd8FMpIouAIV7LKrtiKxUeeI62nAIWK0gBKLvE8HbQ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "KMAR CENTRO TECNICO AUTOMOTIVO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.7147844,
          lng: -46.42159909999999,
        },
        cep: "09424-250",
        endereco_original:
          "MAJOR CARDIM, 580, VILA SUISSA, RIBEIRAO PIRES - SP, 09424-250",
        telefone: "(11) 4827-7110",
        estrelas: 4.7,
        avaliacoes: 95,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:48 PM",
          "Ter: 8:00 AM – 5:48 PM",
          "Qua: 8:00 AM – 5:48 PM",
          "Qui: 8:00 AM – 5:48 PM",
          "Sex: 8:00 AM – 5:48 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMtk2iAgFKd9FMhfAi0y6ij6RSWn9mRrd7MGRkjYPtDtrvWH8aV0BuzxyUD2QInEanxHpPFVjPXhPP9PsOYN_zL1NmpruUSzY1WW5j4_TkB1a88773YSs31foyJep5hQx5776G6Gxijf3eq3wuU_3sSHhWkW1bDBQlULoCueq_Vtorx&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GARAGEM CENTRO DE ESTÉTICA REPAROS AUTOMOTIVOS",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.3897166,
          lng: -46.3152555,
        },
        cep: "07401-795",
        endereco_original:
          "Narciso José Lopes, 48, Vila Pilar, Arujá - SP, 07401-795",
        telefone: "(11) 4654-3589",
        estrelas: 4.6,
        avaliacoes: 58,
        horario_funcionamento: [
          "Seg: 7:30 AM – 6:00 PM",
          "Ter: 7:30 AM – 6:00 PM",
          "Qua: 7:30 AM – 6:00 PM",
          "Qui: 7:30 AM – 6:00 PM",
          "Sex: 7:30 AM – 6:00 PM",
          "Sab: 7:30 AM – 3:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPATZUCHXnicp_ugOpkYcGp6d8H82LOvWpsJmKURiwYmxCHgipCWHx-a9iChg5X78qnj3idWFEB7vwDcilMflcOnO66Asiz8HjrAvVXGwu2iIvYagCppTh_ezvuCRFM3VuWRyfbOdRlK9pNJgXjh4BeLvYQOBDpihIQ2KfXrlLQG9tP&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MIZUTA CAR",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5165383,
          lng: -46.1909581,
        },
        cep: "08773-380",
        endereco_original:
          "FRANCISCO RODRIGUES FILHO, 645, VILA MOGILAR, MOGI DAS CRUZES - SP, 08773-380",
        telefone: "(11) 4791-1199",
        estrelas: 4.3,
        avaliacoes: 104,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPx8SvJHqP4FdDg44jXsEo444kiRTVDgk3dRrCi2ZYlR2REH9ffsIaes8RJQbmKssr_O-BJK7Mh2DaI2qga5coGV-_GLPw-JC_LLCuRmS6weUr-2ILYUUwWcf54vZz5gMSxkjieRKQ4lJPkUVDVsyOBd8qMbE90bU3VbCd_nKzvgOYx&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GURI EXPRESS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.194138,
          lng: -46.8765627,
        },
        cep: "13201-650",
        endereco_original:
          "RUA PRINCESA ISABEL, 277, VILA PRINCESA ISABEL, JUNDIAI - SP, 13201-650",
        telefone: "(11) 91297-1690",
        estrelas: 5,
        avaliacoes: 91,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMO_ilV1DeiAn_HJgYwGaqqRDum8t9GCw-ERLTy20MMhpjhT8by86D47Kk8ZmzVW2ozQRhUPJXfTb6EB_mt0mVFIjxyc3oorp8fVVUMkOtlB4ZnDeFCJM_FGb6g6aHhDOgZ61GXjyz63KAuFF_fV6GFPiZVWPn_RZJatUbQfhdGEcnZ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "NEXTCAR",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2510167,
          lng: -47.0559541,
        },
        cep: "13318-122",
        endereco_original:
          "MARANHAO, 713, CENTRO (JACARE), CABREUVA - SP, 13318-122",
        telefone: "(11) 94060-0939",
        estrelas: 5,
        avaliacoes: 15,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOK7xc3a1vnJVCsOCPw00a4YMDehUEpYTPQVmone-JvF35cVH8A9QLec3pGOm_BXCBpM0VYjKxL4MyY6KabNRbkBCZRun7t-YdZFRPikeOHC_Qh0TlRKSfrIyQ29thSfKnorbXR-26c6sm_z_RIzQRuPWC-zrkQIXQNUcoAjeP3Aof5&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ZITO CAR",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.6630762,
          lng: -47.22678699999999,
        },
        cep: "18150-000",
        endereco_original:
          "BUNJIRO NAKAO, 1000, RIO DE UNA, Ibiúna - SP, 18150-000",
        telefone: "(15) 99656-2239",
        estrelas: 5,
        avaliacoes: 4,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 2:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNm7rywa5sGfSFFWfIUcbFr7vmn_S6x9ZfmEU-Qs164D8LgEUxNCvkQA4wjGei_TWEM687_UFn55Uvw0daHzlfM2vLpeGXGCrbvfZFfwGCBaQySHBnyMYRczl4nPTr8ztrcYvpKG_3H_Vl0tyNeoafJhMr4MXs5aatendVr_SHpkzw1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PRIMOS REPARACAO AUTOMOTIVAS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.9872505,
          lng: -47.1073184,
        },
        cep: "13052-470",
        endereco_original:
          "ELDORADO, 984, PARQUE SAO PAULO, CAMPINAS - SP, 13052-470",
        telefone: "(19) 3326-5681",
        estrelas: 4,
        avaliacoes: 164,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPkWxtytfsq9BCwqrbMQBQ6Xeux-AuuKn6cZkvt_MovslCYAWYzrCj3PBRM1gGbSxDZVDrzzWM0rAP7URUxdAMf9jL-1TnrOehV843DlQVaJmCOXTusECNZnLi043oFxHrNmcGOpv3xMVdVMI2-Bg1I80HkBr5alvXXZav-9BtooURz&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TREND STUDIO",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5307867,
          lng: -46.6490764,
        },
        cep: "01203-002",
        endereco_original:
          "Rua Conselheiro Nébias, 1530, Campos Eliseos, Sao Paulo - SP, 01203-002",
        telefone: "(11) 3666-9694",
        estrelas: 4.2,
        avaliacoes: 54,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN1BkNRjXgTXI-i7CtASHu-BLFD-IIerSDvjPXcthTHRpK2Mx_qBVnGEMq7j06HX2VI6hfe_TgHrcb-CHsxHR2lTuNMvL0mHr_r7P50g4S3HTk288ZdROzvt_PoufT3B6DT6P8B6lGpP1cu6mJWVV4IdF9g6ZZJfa-EurXN7MGqibSB&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ORTIZ SERVICOS",
        servicos: ["Multimarcas", "Funilaria e pintura", "Mecânica"],
        endereco: {
          lat: -23.6058066,
          lng: -46.5512121,
        },
        cep: "03216-040",
        endereco_original:
          "SAO RAIMUNDO, 2265, VILA CALIFORNIA, sao paulo - SP, 03216-040",
        telefone: "(11) 94707-0891",
        estrelas: 4.1,
        avaliacoes: 37,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMHdLfuxeTEA75Q1yYKKdIb0SICuHAAbg_lDSb7emTqLB9jmcfptyuw-lJ9Qp2Iu4YGL3yFuSeYNsJmtfW3Qh1VzU_Rd42QVMgHC4mQis-wxixeNsN3gHRDgpTGTkEKcpyJAjhUsSbOCgkfDDrRIgfpn4KGwK-vLWZCPfT31IUyNSuZ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LUCAR",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4721035,
          lng: -46.5875047,
        },
        cep: "02265-002",
        endereco_original: "Guapira, 1934, Tucuruvi, São Paulo - SP, 02265-002",
        telefone: "(11) 98685-7520",
        estrelas: 4.4,
        avaliacoes: 55,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:30 PM",
          "Ter: 8:00 AM – 6:30 PM",
          "Qua: 8:00 AM – 6:30 PM",
          "Qui: 8:00 AM – 6:30 PM",
          "Sex: 8:00 AM – 6:30 PM",
          "Sab: 8:00 AM – 5:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOPxIOlm9dRYmhuzxJx4x2NLc14hZP6lqQ0PtQUWL9XdtgK4dyRN9eap4IsnRX7fFO8YG10WKpovaIss4BF0ux6YhKV0KKlwWQBDPxZJKspMRxSKsNecQ3GyyVZQqU8A1eYCgT5nyy3TJBSjkgw9i7vHX9gzwgObrzxFn7Z6byTehbw&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SPEED GARAGE",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4675288,
          lng: -46.58529129999999,
        },
        cep: "02274-070",
        endereco_original:
          "Padre Ludovico Zanol, 153, Jaçanã, São Paulo - SP, 02274-070",
        telefone: "(11) 2539-7811",
        estrelas: 4.3,
        avaliacoes: 62,
        horario_funcionamento: [
          "Seg: 7:30 AM – 5:30 PM",
          "Ter: 7:30 AM – 5:30 PM",
          "Qua: 7:30 AM – 5:30 PM",
          "Qui: 7:30 AM – 5:30 PM",
          "Sex: 7:30 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMVkS27ocmzn-0MrinwR5KS_Ywc3OWRe580_cI39-ahvNLQM7_Hn1AIN0peLKk52zBYvEt7Ne8_gPPXfljv4_39LKKHcrrM7yrG5X-ltztMud9ZVk99VYqtanPwPK0YUaCPsu2UhrJk60PieyRmk5xzokgvSsVHdINId2-antO_nQ4n&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTOCAR REPARACAO AUTOMOTIVA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Mecânica"],
        endereco: {
          lat: -23.438914,
          lng: -46.5915245,
        },
        cep: "02366-001",
        endereco_original:
          "CORONEL SEZEFREDO FAGUNDES, 5409, JARDIM FRANCISCO MENDES, SAO PAULO - SP, 02366-001",
        telefone: "(11) 2267-3503",
        estrelas: 5,
        avaliacoes: 17,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPVtV-TNSMNw2pjTtNXtXpm8OS5UPRaMW0RCnn7WSs2csLl2_ySUPwUlL27fZObNBbwR6zYfIqvmfUQ-trv1yOe6WetLs1xKdY30bgYTYko_tT6I7njgqzXv6AyvrbpzS5bf-Uc-rnLsdRY0ruUppMTYAgDHs3cWaaN6juDNi1sdA4R&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "J&F RECUPERADORA DE VEICULOS",
        servicos: ["Multimarcas", "Funilaria e pintura", "Mecânica"],
        endereco: {
          lat: -23.5041488,
          lng: -46.4562912,
        },
        cep: "08060-380",
        endereco_original:
          "AMERICO SUGAI, 417, VILA JACUI, SAO PAULO - SP, 08060-380",
        telefone: "(11) 3881-2960",
        estrelas: 4.6,
        avaliacoes: 91,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPhszMM77U_kXPB519m9hnurrHZu7judbS8Nb5U1RQFxJXrc0UcUwWDdPKXml-iTTl8Lxfe1WZmb1Df_kUH6iEsZm8xn6vfIJpVmkciUnIu-7S9t2J4nPkBbd5mFYnNYjqWE2FTfUJb5-i6edQx6YW9MbBrPPagt0GQcMYFphHTxPNu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BILOTI REPAROS AUTOMOTIVOS LTDA",
        servicos: ["Funilaria e pintura", "Mecânica"],
        endereco: {
          lat: -23.5327393,
          lng: -46.2069031,
        },
        cep: "08730-440",
        endereco_original:
          "Rua Capitão Joaquim de Mello Freire, 236, Vila Lavínia, MOGI DAS CRUZES - SP, 08730-440",
        telefone: "(11) 3374-2238",
        estrelas: 4.3,
        avaliacoes: 38,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMQdUQvqWuW8RpU8iXVldDWqEs2Kd-JvSo0WfnyhLZcsfTU49Q3wxuvinKv8olaAKRbuwy2rhPrH2VpKeqNjBhLwGR9SfIe_UNLgoyrSTUskLOdC4ytk6i9rNUwxv-uV3YySjn5VCsYYS-XJVPO69pGjj52bPjUH24e5XKDq3St8eI&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AMERICA CENTRO AUTOMOTIVO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.9527117,
          lng: -46.3199213,
        },
        cep: "11015-020",
        endereco_original:
          "Silva Jardim, 306, Vila Mathias, Santos - SP, 11015-020",
        telefone: "(13) 3301-3333",
        estrelas: 5,
        avaliacoes: 3,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNQvqKeFdtaKlo9_lpNdmsreDO9_0Y3tlelmShPY-Nw754QZnnHltXOiFYJiDXeVHVaukphqR8Ztq5-iNDygqC5MTUratpixdrDzNVbFTxkYixedL4ICl29PHaEqUi0jmexz-QCoTs-mUuuRIqlM0svrwcly4GS3mi4imoiLKkRCtJ5&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ROGERIO ALVES DE CARVALHO FUNILARIA ME",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -22.9612023,
          lng: -46.54043129999999,
        },
        cep: "12900-340",
        endereco_original:
          "CORONEL LEME, 465, CENTRO, BRAGANCA PAULISTA - SP, 12900-340",
        telefone: "(11) 4033-4468",
        estrelas: 4.4,
        avaliacoes: 73,
        horario_funcionamento: [
          "Seg: 7:00 AM – 10:00 PM",
          "Ter: 7:00 AM – 10:00 PM",
          "Qua: 7:00 AM – 10:00 PM",
          "Qui: 7:00 AM – 10:00 PM",
          "Sex: 7:00 AM – 10:00 PM",
          "Sab: 7:00 AM – 10:00 PM",
          "Dom: 7:00 AM – 10:00 PM",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOi7zbrBUdSrfxZK1Ax8PHYXhAFI2ZM-40AHTcaTPMCKu13pssObfLgmUfHpzOojMVI-oMd-lz3vIyrt1MPpt0ihZ3kcizH1cOdpl7GAfzGH_9zIlyiD_Z-m_psY52iFTV5-g-L7l0efkRb7lYWMg74psrmbsBZTo74KCl3wzD1ne4L&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AWD FUNILARIA E PINTURA",
        servicos: [
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.0199317,
          lng: -46.98121250000001,
        },
        cep: "13283-040",
        endereco_original:
          "OCTAVIO TASCA, 260, JOAO XXIII, VINHEDO - SP, 13283-040",
        telefone: "(19) 97135-0247",
        estrelas: 4.7,
        avaliacoes: 19,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPG8c7NG0SORYZ8_T1HfMozloRTNDVgKsVsTW-oqaiuIxRR8h50paW3flCWD24Y-f3qkDeriprrm0eQvAN0zjHSEMVH1G7XhdP4hOodKw2bDrU48JoDID-4d7ikkvhjOi5vzUghl0xELEfOAzzgJ-gHnWtKUzVKffLYNhYC84Wz5q1v&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "ALEMAO FUNILARIA E PINTURA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5516272,
          lng: -46.6464675,
        },
        cep: "01313-000",
        endereco_original:
          "Avenida NOVE DE JULHO, 881, BELA VISTA, SAO PAULO - SP, 01313-000",
        telefone: "(11) 3151-2171",
        estrelas: 4.7,
        avaliacoes: 97,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:30 PM",
          "Ter: 8:30 AM – 6:30 PM",
          "Qua: 8:30 AM – 6:30 PM",
          "Qui: 8:30 AM – 6:30 PM",
          "Sex: 8:30 AM – 6:30 PM",
          "Sab: 8:30 AM – 3:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMEx_qJanlaMCg1OdsDtC2Ae-VkohQ5mbhnVZhNKMrJryZkeSfosjGzfrAmi2QZcmBTILAy0SKFpKpO64hQY1izH228nbKk2TfhDFVXcuzkUvRtmwoAe8GD_fauRKKxV4_EofeJLil1vvZo2iprwPNTfleiHQ-jCE4domU8eapltXxJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RENOVACAO CENTRO DE REPARACAO AUTOMOTIVA",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.5206043,
          lng: -46.6100189,
        },
        cep: "02052-020",
        endereco_original:
          "Rua Leonor Fernandes Costa Zacharias, 1912, Vila Guilherme, Sao Paulo - SP, 02052-020",
        telefone: "(11) 2207-0583",
        estrelas: 4.5,
        avaliacoes: 68,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMCnmh11AMeafzi5tzFpXaQivNcRqgDr_eG39GwLmmHJJR2yeVDHC33DAqBofZ00Sjz8mmuwTm9T-67ae8QvHrMV82c7ZESgAh0hUoOHbcAVpPV_kNf_AjxaiT4iqQxPRqzR7hTlgh0Tn-DdHoKt2Jy6DTdpAhvznE3VxqaYUDScmiD&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "META SERVIÇOS AUTOMOTIVO LTDA - ME",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.5307237,
          lng: -46.6768806,
        },
        cep: "05016-090",
        endereco_original: "SUMARE, 73, PERDIZES, SAO PAULO - SP, 05016-090",
        telefone: "(11) 3864-1616",
        estrelas: 4.1,
        avaliacoes: 46,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPN1QJ2XiHHJWw3n_V5g5ivH5KohxfsiRDCo7dloCK2zUeMTxkHUyxGWL92ovePDHV_49yjTGBVd4AEexcaSY4T42LRrPKXXQu-f1oyxvj_rvgFAuMeXwZQVoV4VqrkgPCKlyqV5ohCsz_x_oEqD98FH-21w6So0JbheehDN_raGFUu&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "M R B SERVICOS DE LAVAGEM DE MOTOS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5594212,
          lng: -46.58294189999999,
        },
        cep: "03181-100",
        endereco_original:
          "Rua do Acre, 281, Vila Bertioga, São Paulo - SP, 03181-100",
        telefone: "(11) 2729-5269",
        estrelas: 4.4,
        avaliacoes: 100,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPH7Ojj_CxiI_9uwXSK2TNTwYGPUIhxHenBnuUwFvHOCfBd66uaPmM_7htGlNnIhP3QcHXA4MGbH-2Fk02N5KuNzj2T_JWEj6Q7BQQeadF_2jIwfo_Plspg09WkCCGY6Nk5qEcE87mo0_xtq6OlVmoFbcLeD8R3J4bfCi_n37RBxUL7&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OPHICINA",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.5057283,
          lng: -46.6614248,
        },
        cep: "02517-000",
        endereco_original:
          "RELIQUIA, 784, JARDIM DAS LARANJEIRAS, SAO PAULO - SP, 02517-000",
        telefone: "(11) 3966-5790",
        estrelas: 4.8,
        avaliacoes: 86,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNewvTpkQFWvQKgaRiHV-XCotdGB27Veja5UIqKIxDLViW-cOAUZAf79fTtHF3wNoElM6kJjk_6-v6ur7VvNof2j78vp4LFiucoYoxW3GkAoYfRk0-wRaP8yiEyE7_37C7PMjzW-Whr5FbEEJj8XgqsqfXoJuxU4QtUcKr_Hg5r7-Yq&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PROSERVICE",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.5246369,
          lng: -46.6296596,
        },
        cep: "01102-000",
        endereco_original:
          "DOS BANDEIRANTES, 864, LUZ, SAO PAULO - SP, 01102-000",
        telefone: "(11) 3228-4700",
        estrelas: 4.7,
        avaliacoes: 23,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:30 PM",
          "Ter: 8:00 AM – 5:30 PM",
          "Qua: 8:00 AM – 5:30 PM",
          "Qui: 8:00 AM – 5:30 PM",
          "Sex: 8:00 AM – 5:30 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPDTRveX0bjxWrniNeV6fEjJB0_ADbLNQxI1wJE3LiUMJy5I-_MvzNpvRsUXdf9bg7RiF3qznt5YOPJ85odIzlecVfXxAbiCQ0-eclVG9p4LgoziD_chK9Fq7tUHv_YsdTZmslLi-9gXwVSSZIGfAmWLmIze5CakYJt2XOIYMcCBbdG&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "PADDOCK MOTOCENTER",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
        ],
        endereco: {
          lat: -23.544919,
          lng: -46.5672626,
        },
        cep: "03318-001",
        endereco_original:
          "Rua SERRA DE BRAGANCA, 822, TATUAPE, SAO PAULO - SP, 03318-001",
        telefone: "(11) 94745-6663",
        estrelas: 4.9,
        avaliacoes: 407,
        horario_funcionamento: [
          "Seg: 9:00 AM – 5:00 PM",
          "Ter: 9:00 AM – 5:00 PM",
          "Qua: 9:00 AM – 5:00 PM",
          "Qui: 9:00 AM – 5:00 PM",
          "Sex: 9:00 AM – 5:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMOB2JErJyIFrpGDQBZL5jHLAQHgxZgLUPdY2bOqBZ_lZ0TILSaSqIRp_UeuX18BX2PkE6HacQoi6SSXHo4HYukVR0JtX5Lj9LVu7uF2qK5Rmhjl8WKFY6aBUlJMssPSAWr5a8HsDpCDfrP1bnqMvUK9RaRyBqwFwjwjmeiMicMO0B6&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAPS SANTANA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.4869411,
          lng: -46.61792519999999,
        },
        cep: "02330-001",
        endereco_original:
          "NOVA CANTAREIRA, 764, TUCURUVI, SAO PAULO - SP, 02330-001",
        telefone: "(11) 2385-9668",
        estrelas: 5,
        avaliacoes: 14,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNiI3B8XEbzEr8bLPLXQe4ryvblctUMn8CGuHkLxsjfCupV1KNSfC8Xj9ffTY9q3-7pT4fudwG2frIwsVsQQpcl8WEBDo44W1hyZLltwpq7t77kgAshoZG1gWzZR4HzYkO0urJOWvVydYUZcaIBi2HeFpqTeDkAgjpjlhgzZI49Pq9L&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RADU CAR SERVICE",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4815015,
          lng: -46.63229820000001,
        },
        cep: "02401-400",
        endereco_original:
          "Rua Voluntários da Pátria, 4637, Santana, São Paulo - SP, 02401-400",
        telefone: "(11) 2973-7153",
        estrelas: 5,
        avaliacoes: 61,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: 9:00 AM – 12:30 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DM36rqKcm_f4dKSapgtuDaveq5xfvQ1olnCm-HWsTTneAWlqnelKntxg8NPpom8QRFKkd-Dgja14Yaa4U-tucvmVgXNHdp4tJdsOQPfVFeSWmq7SNV3kJO41XIVQvYlUOAcXuAsYW7Rq_AsJDmaugQKktOInKd9tJ1lmLcY-qyEjk4R&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JOCASP SERVICOS AUTOMOTIVOS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.632901,
          lng: -46.6314196,
        },
        cep: "04312-010",
        endereco_original:
          "Rua Eduardo Pereira, 411, Vila Guarani Z Sul, SAO PAULO - SP, 04312-010",
        telefone: "(11) 5017-3821",
        estrelas: 4.8,
        avaliacoes: 4,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOJlkSOQo0zLpIvRKPM9zN5fzMzWwhomkT6Q-2A_ba_Ugpy9Vhqi-o2gxq6u-kdLYVc-SeJpfkkhOMJsursfm_L18l0NXCD7iUgShZDmE6nx_h3HFgiDQpO1-kViwtAZrxVGISV7RFC_Jfm3jsK1qpIVoy7EMqhWR4CkHPeTh6tbgwJ&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TREND AUTO SERVICE EXPRESS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.4915291,
          lng: -46.6892101,
        },
        cep: "02738-000",
        endereco_original:
          "Joao Paulo I, 250, Parque Monteiro Soares, São Paulo - SP, 02738-000",
        telefone: "(11) 3931-4145",
        estrelas: 4.6,
        avaliacoes: 10,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPSefIoCE1ZuFfdMNnm_LBkq1dzX2dcdeu9Q9LZzc1R_hvgeLBUEHOScrd9ks19Xxb3lhbTUO7v8T67gNTpS8cGygE5f0Z0WCriH5_0ee6hdEImj6aWM_XgFk5kvbf4tv-sAatVWianDfDoMQPt-kSByx194H27lZn5UdkCjLlJZzk7&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RAVENA MOTO CENTER LTDA",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5452817,
          lng: -46.5446547,
        },
        cep: "03403-001",
        endereco_original:
          "Conselheiro Carrao, 1669, Vila Carrao, São Paulo - SP, 03403-001",
        telefone: "(11) 97680-1841",
        estrelas: 4.6,
        avaliacoes: 11,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMcTtGEWtEfTNbX7uJh6gZLgJjEaKp6jkjQANsNjpYez2FTsuoA_Zm3WAFbKUc2GbGYO5TXvz_Qpa4HFbugA02Pc2_cu_5aH8zsWutD759-A35TTmhHp0GTpKuctZtPkvwdgdj-YOsThFymUqUmJrudVS-yRx2YlaLJs5hA2A8v3QrL&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "VIC MOTOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4950603,
          lng: -46.7020482,
        },
        cep: "02959-000",
        endereco_original:
          "MINISTRO PETRONIO PORTELA, 461, MOINHO VELHO, SAO PAULO - SP, 02959-000",
        telefone: "(11) 3931-8709",
        estrelas: 4,
        avaliacoes: 120,
        horario_funcionamento: [
          "Seg: 8:30 AM – 5:30 PM",
          "Ter: 8:30 AM – 5:30 PM",
          "Qua: 8:30 AM – 5:30 PM",
          "Qui: 8:30 AM – 5:30 PM",
          "Sex: 8:30 AM – 5:30 PM",
          "Sab: 9:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPHcFNj5N3wkRVcURs2eGf3T1sfiUw4Mg79KO8Lb033MxhIYp0EaYNtZFlrijz3P4ElmOxhjD9PTcGfkoWbOt4PpDieR9T-3v4Z-RXLcCtgSR-3isOTfqYFdsSHmHuk8eMSuctzwmOJFPClJM-ET4sX1RaavGGKujqSxAZRmSlPV4h0&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "EDCAR SERVICOS AUTOMOTIVOS",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.4990123,
          lng: -46.7071438,
        },
        cep: "02924-201",
        endereco_original:
          "GENERAL EDGAR FACO, 783, VILA OLGA CECILIA, SAO PAULO - SP, 02924-201",
        telefone: "(11) 2893-0413",
        estrelas: 4.6,
        avaliacoes: 196,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO0XElzcTJOT5xLQEqlJ2WF8P9pXotuenZtHRpkHbbAWL-epqU3Z-8Z2CAWpo65io_cNZ_dP2aiqP_8WS-Gu2XNyuVxuZgZFWLToeCyhVzH59fgvd16RDvP8104gJHfdJqTqTaeDX2c9AKJruuz8Bk7FZ02qiJ_FcDVk62Lycq5VlKR&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "A - PILKINGTON SANTO AMARO 3003 5255",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6388984,
          lng: -46.6732788,
        },
        cep: "04627-001",
        endereco_original:
          "WASHINGTON LUIS, 4521, SANTO AMARO, SAO PAULO - SP, 04627-001",
        telefone: "(11) 2614-3402",
        estrelas: 4.3,
        avaliacoes: 280,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN6n_uJB8scPzKUKfrNsaL5vqEer2TmK5e1QMJCYvYtmlO69QVfxRaP_2YvnQzTgNuHJsfjre0Jnym-RqYZrtvoH1ynaFLiDLVfzSwfAgQIx-B7lTI9EoEpAbl1iHz2kRr4-HIgIUrpffsx55AHjdfd-yjuNPA--2cLY9VInqT5Ei2g&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CONSERTO REVELIA",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5557714,
          lng: -46.6395571,
        },
        cep: "11111-111",
        endereco_original:
          "ENVIAR FOTOS DO VEÍCULO DO LINK DISPONIBILIZADO, 123, 123, SAO PAULO - SP, 11111-111",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "PANADES MOTOS",
        servicos: ["Vistoria por imagem", "Multimarcas", "Mecânica"],
        endereco: {
          lat: -23.6433713,
          lng: -46.7148427,
        },
        cep: "04727-100",
        endereco_original:
          "R DOUTOR FRITZ MARTIN, Vila Cruzeiro, Sao Paulo - SP, 04727-100",
        telefone: "(11) 5521-6856",
        estrelas: 4.5,
        avaliacoes: 25,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "VIANVEL",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.6234176,
          lng: -46.7393491,
        },
        cep: "05726-130",
        endereco_original:
          "Rua José da Silva Ribeiro, 149, Vila Andrade, São Paulo - SP, 05726-130",
        telefone: "(11) 97172-7274",
        estrelas: 4.4,
        avaliacoes: 31,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPSiBIkPccKMFyiIGcOmw8T3KAPTZjL_azILp9yinkWauVt_TarcqliP9RlgRDQA3dcS6h6dIaRb4yETxhw3JjfYmKGIcaQrfsOqXAMbYYcLQ5AHBM9uE58MI8yNMIkLXiyOeCO1HHwzzyirux7N3noH9SdCMXOkIBhOWIZY4J56lOm&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "SALES MOTO PECAS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.6708267,
          lng: -46.6688881,
        },
        cep: "04657-001",
        endereco_original:
          "YERVANT KISSAJIKIAN, 1117, VILA CONSTANCA, SAO PAULO - SP, 04657-001",
        telefone: "(11) 5563-4809",
        estrelas: 4.4,
        avaliacoes: 23,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMkBQEbYjfjUXx5v2woHIaO0-jrs-PmAkMAE9lxF0IkN2VcvU-Y8uCeQCmQabRZfZa2_jV31tahxC926AY-mbQaBsMwTA-QhaWG90OlRzr2Bzkew8XgLFKZMFltye7DSsSCfpf0IayEps0efOTDjg7R9hKyltuJ9MF5JavU_asHAaSM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "JOAO PAULO DE CAMARGO MOTOS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.6070532,
          lng: -46.7777034,
        },
        cep: "06757-170",
        endereco_original:
          "SAO PAULO, 494, PARQUE MONTE ALEGRE, TABOAO DA SERRA - SP, 06757-170",
        telefone: "(11) 4787-5445",
        estrelas: 4.3,
        avaliacoes: 300,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 2:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOI3X4ydVMiRpPWE1FQG4R0PIuRUYpvoWrdPCVUofi-dHD77w35wYYFtZjnPbWxt35flQO1kstfvmDQyyVkCJf3rOzacwFn2fqzNeF1GlS8mzmap5TR1pMiZoSD60IMxaqKd0uHbVTa7E-V-Rzlwt7UXKDQ92SQDRlAqAegGC1A5Nt-&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAPS TABOAO DA SERRA BR",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.607868,
          lng: -46.768204,
        },
        cep: "06768-100",
        endereco_original:
          "Rodovia Regis Bittencourt, 1550, JD MONTE ALEGRE, TABOAO DA SERRA - SP, 06768-100",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "ROSSETI CAR COMERCIO E SERVICOS AUTOMOTIVOS LTDA",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.7028614,
          lng: -46.7013525,
        },
        cep: "04801-000",
        endereco_original:
          "SENADOR TEOTONIO VILELA, 140, CIDADE DUTRA, SAO PAULO - SP, 04801-000",
        telefone: "(11) 5660-6009",
        estrelas: 4.6,
        avaliacoes: 195,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNknnJZyfbhnhcs7jL8o6JQFuNHfa4RWes8R2eak1MmBa7Ih6wgiciq2iJs2ylGH30Pp4aUFV4hP23Hg7a6peXVoHvDQgw-6nOn4Q0MacT4QaXjwYH1b5QD3FVkRkupp3G5TMYGr1cS1rXVQ2-aLIWBNA8IuxF2NiWWMULIMdH1LzSO&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "TORQUE TAMBORE SERVICOS AUTOMOTIVOS EIRELI",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.4925982,
          lng: -46.8333147,
        },
        cep: "06460-010",
        endereco_original: "ARUANA, 671, TAMBORE, BARUERI - SP, 06460-010",
        telefone: "(11) 4195-4681",
        estrelas: 4.3,
        avaliacoes: 509,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPC5SnvyRDaBudUfuC9YBDRulSu9mHT34elH32t4TfD7m1gLUq1l-pZ7deV-fuOLLgNGY1Gnfom62FiP1mjmhDUCqRokGS73PL4Wgld1hfaxWKNWBU8sYtfIUEIuBr2RBXjM9bpcTikLtMs8izRxAvBWt24QOeRW6ylGEmDdnwtbP1m&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "OFICINA THK",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.5080392,
          lng: -46.84909280000001,
        },
        cep: "06465-100",
        endereco_original:
          "da Aldeinha, 237, Alphaville Empresarial, Barueri - SP, 06465-100",
        telefone: "(11) 94713-3014",
        estrelas: 4.8,
        avaliacoes: 88,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: 8:00 AM – 5:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP2tNW_7i9b9zRFqty3C6dU4skH3vSTVtxjebHICp1cE-VA6sMEyyMIZb_eNbzoFZFpsRYxkv0xTUQ1CuXjJqdZa8dH5aC0NtTnXYA6mkANikD2xA1B610iVqD6Z5KoU1ZbBWwx0o_tf6tJUB5DuKSd6Q0ATSWAi6PnwkE6B8nD_HEy&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RICAR AUTO ESTUFA",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.7386208,
          lng: -46.5376078,
        },
        cep: "09791-020",
        endereco_original:
          "DOM FERNANDO MASCARENHAS, 235, FERRAZOPOLIS, SAO BERNARDO DO CAMPO - SP, 09791-020",
        telefone: "(11) 4335-3805",
        estrelas: 4.9,
        avaliacoes: 95,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN2S2dX00KehIzsD52KdCsvxSKHME87CMZZop3M-WGLYJYpEshspcpEqbw0Pi74mfaTRsQz_P7WYHBVV8hh-R16FYbIwaFiUOgQsMEz2PGriegpejogGfz49q7OPWCiRSIigosdEiHMliNBSlBryrpXNdv9G0C0_7mcUsaIMMRAOyc1&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "RCAR REPAROS AUTOMOTIVOS",
        servicos: ["Multimarcas"],
        endereco: {
          lat: -23.5251045,
          lng: -46.32355190000001,
        },
        cep: "08680-000",
        endereco_original:
          "MAJOR PINHEIRO FROES, 1931, VILA MARIA DE MAGGI, SUZANO - SP, 08680-000",
        telefone: "(11) 4748-3889",
        estrelas: 4.6,
        avaliacoes: 78,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMTdwKu-1yn7IKnag6uVtTiZ8bWG7WEMNg_beCleYrveHCkEQDCFN2AkkmRoQAMqld071czjAA8vn7Mr4QGVNe1yi7hb05oDSrtaC2xKMZk4frs3uI37TfUNnvrQVAhkrRnwIMrB8u7DOrk-VN631fhYNW97R2spP3gJ7s1zd8QnSSr&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUNILARIA E PINTURA MAIRIPORA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.256573,
          lng: -46.593809,
        },
        cep: "07661-775",
        endereco_original:
          "Avenida DOUTOR SERGIO MACHADO BRAUNER, 215, TERRA PRETA (TERRA PRETA), MAIRIPORA - SP, 07661-775",
        telefone: "(11) 99891-7544",
        estrelas: 4.3,
        avaliacoes: 6,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DP_0azlrUZc36vQ9GSnmfy_pwd5XkHykQlenWWuGfpKMXtZyg6nZrnUK1ADJiHnLmRimkrALD5KmEapOVqB-xCye3LxCHxQ-dlcJhpcBgJlRSdO98gaVUqCy035F9bRuWawujmVvTLhSVdTZDl_LZy0LwB2y9OTRkNFMVAaHanu2fKb&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "BANANEIRA FUNILARIA E PINTURA",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -23.7026575,
          lng: -47.0501173,
        },
        cep: "06723-060",
        endereco_original:
          "Estrada Sant Anna, 95, Santana, Cotia - SP, 06723-060",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "WILL S CAR REP AUTOM",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.1753213,
          lng: -46.85197549999999,
        },
        cep: "13219-807",
        endereco_original:
          "COMENDADOR ANTONIO BORIN, 2685, JARDIM COLONIAL, JUNDIAI - SP, 13219-807",
        telefone: "(11) 4584-7939",
        estrelas: 4.9,
        avaliacoes: 25,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPDCJPj8lQiy-krKfHhEe_LcyydhVxwjSqek6r-JOAkP4CXwu1fRhwhKSgFm_k15q1p-OOoRiv7wbnvMNDiEL6tMIM2VT6tHFFcixeOLXxt3BJhQjEtJ71kQbOICYw-7vC9L1YjIt0lTalHfx2z-mRdsROQM_Ms3_NdLxYKvwqLYlLT&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "LORO TRUCK CENTER",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.1729113,
          lng: -46.88035439999999,
        },
        cep: "13215-021",
        endereco_original:
          "Rua CARLOS GOMES, 1534, VILA GRAFF, JUNDIAI - SP, 13215-021",
        telefone: "(11) 4583-4855",
        estrelas: 4.2,
        avaliacoes: 15,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:30 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url: null,
      },
      {
        nome: "MARTELINHO DE OURO",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.9636952,
          lng: -46.3914785,
        },
        cep: "11310-200",
        endereco_original:
          "Avenida Capitãomor Aguiar, 842, Centro, São Vicente - SP, 11310-200",
        telefone: "(13) 3468-5385",
        estrelas: 4.2,
        avaliacoes: 109,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:00 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMffuA5-punPHQmCIk-RqvGlVftTaPyEIYzlF4EVDWiVAb2QupXqUMCNxrTPyZqMrnL6E3fFS5UiJbsU96V9HGX_k6-jUAMX2tPkfzMnEFwCFM6m8Hh9KZly7Behk9pwl6lRUX_6lGNDCBNGPHOVnONOUqm6kvJjQssqEK9BMS64gZq&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAPS SÃO VICENTE",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.9569637,
          lng: -46.3753007,
        },
        cep: "11390-001",
        endereco_original:
          "AV ANTONIO EMMERICK  1114, 1114, VILA CASCATINHA, SAO VICENTE - SP, 11390-001",
        telefone: "(13) 3878-0660",
        estrelas: 4.7,
        avaliacoes: 271,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNd3ROBZ7ZorISW3ThxniNbg4I49my7SZAM3H-m8_VTlXB9h5bD61OsvSxLtKqu73Ab5FAXUAtgBheVBOZFpwLKHAK4IAfOsWp8BmB4NVsbSZFGKpgi8AQoQgMUOJ06tJFTvNgQSA8CPwRBk5vjsCkpEnXs25-dX5n8LM7xw3xvXED_&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAPS SANTOS VILA MATHIAS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.9494498,
          lng: -46.3279348,
        },
        cep: "11075-300",
        endereco_original:
          "JOAQUIM TAVORA, 78, VILA MATHIAS, SANTOS - SP, 11075-300",
        telefone: "(13) 3326-3392",
        estrelas: 4.7,
        avaliacoes: 218,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPCAo99FTJKXHnDq2ZX0EH8dJEy4xoIdB7xi79jL9tvIeAvi3vATsFZEUaoKgZBkzGRWfqdCH4GROX_67nErwydEom3NgNRJAWKZNhirGmJy57XgQS7kcTFxhNBhNj8k3WlSqjxmJVAVrTOprtMY4c7PNkGU6CWIdTtLmceiMXLgdSc&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "REGIS MOTOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
        ],
        endereco: {
          lat: -23.9446482,
          lng: -46.3236058,
        },
        cep: "11075-220",
        endereco_original:
          "Julio de Mesquita, 48, Vila Mathias, Santos - SP, 11075-220",
        telefone: "(13) 3222-5434",
        estrelas: 4.7,
        avaliacoes: 101,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMAbjMFXVSjgFyMoPa5IZQRaR9Y1JAm1YaBMXydyO1ZL0o5X7e3KlCwfGvt7F2dPWPj93D8jUViO0fbuk1ZrYeYWWDtem6PPuipo3Rs25-aBlBRxYYWQn05BGFmpASqdNyIVONuN1Hy7fTPVmJJI1w7iN1_WEpRlwFlOJdV2DdkQGet&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CRICRI MOTOS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Mecânica",
          "Elétrica",
        ],
        endereco: {
          lat: -23.9492382,
          lng: -46.3195934,
        },
        cep: "11015-020",
        endereco_original:
          "Rua SILVA JARDIM, 206, VILA MATHIAS, SANTOS - SP, 11015-020",
        telefone: "(13) 3234-5050",
        estrelas: 4.4,
        avaliacoes: 274,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPYwbDQ1Nk4Q0Ss6F0l38nDjTtKzIYf-pWQuQnR96zVs06vIbCYZ-acVZ_kTtvTjKY_EP7-fq7MgG2SAnLrqIxuD8QV4c6o5WA0YvUlQXy7Qk8pQK8n3TBvvRjwYSATbgJOZsqXGUP0S69Q_FOF0edtf-9ergbJP-geXEGKjuKxepoM&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FUNILARIA E PINTURA FERNACAR",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.0925905,
          lng: -46.9503857,
        },
        cep: "13290-000",
        endereco_original:
          "CAROLINA DENADAY VITORELI, 205, JARDIM VERA CRUZ, LOUVEIRA - SP, 13290-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "CAPS GUARUJA",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.9925904,
          lng: -46.2570511,
        },
        cep: "11410-040",
        endereco_original:
          "MONTENEGRO, 255, VILA MAIA, GUARUJA - SP, 11410-040",
        telefone: "(13) 3371-6222",
        estrelas: 4,
        avaliacoes: 133,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DONueeQXZL0crVV3B7yJrux0PQbjIe5dDetn1i_f_DTgEoI3yTkHA75yk1pi37v7xgyjVPM3V-QhyUBcXXyXsKQmWg6WnsoTEPEfcwo1UVNB55Jri5kHwY9XliT-Czq2CL4CoYnfoelEg_DjpsA-Uf5pTOcWc66rijJRFpwLFj0xtAV&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "GOLDCAR REPARACOES AUTOMOTIVAS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2695288,
          lng: -47.2854398,
        },
        cep: "13304-060",
        endereco_original:
          "Gabriel de Bourbon y Bourbon, 449, São Luiz, Itu - SP, 13304-060",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "SAGA MOTO CENTER",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
        ],
        endereco: {
          lat: -22.9801014,
          lng: -47.000538,
        },
        cep: "13270-210",
        endereco_original:
          "DOS ESPORTES, 1197, VILA BISSOTO, VALINHOS - SP, 13270-210",
        telefone: "(19) 3849-1724",
        estrelas: 4.4,
        avaliacoes: 117,
        horario_funcionamento: [
          "Seg: 8:30 AM – 6:00 PM",
          "Ter: 8:30 AM – 6:00 PM",
          "Qua: 8:30 AM – 6:00 PM",
          "Qui: 8:30 AM – 6:00 PM",
          "Sex: 8:30 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DN4hQQhISHYall0wRkLu0v9N-Q1Yk-4X0y6CCuaRkIR_l_ThZXSB-N8xWa0dZ5tlyOEeLRk4NdMmbIpVBKbz9IvQiCeo5gNlHo_8lxJTskHHLT-FULhX-rkp2jB02yIuiBQutupnluzrEUaGFdGSiLhwIYCwvXEt5PfTBV01Ua665K2&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "QUATRO RODAS JACAREI",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.2839117,
          lng: -45.9645768,
        },
        cep: "12328-300",
        endereco_original:
          "ADHEMAR PEREIRA DE BARROS, 664, JARDIM SANTA MARIA, JACAREI - SP, 12328-300",
        telefone: "(12) 3951-1718",
        estrelas: 4.5,
        avaliacoes: 265,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNm3RAeVIefPPGTMwRspMd0wnSDzswQm45dbrs815WazSwFUiG085MOM5zE8DN8CIh0qijNPXKQeiyIN8NzZG1jHsBGdBaA9anYROo44_MHb88CWkIumAuc6QAEntSmhkhHRdPoMHziCvRcGIzxX4vK6P6R08ov6Fdu8nECqliWlvQd&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO NOVA FUNILARIA E PINTURA",
        servicos: [
          "Vistoria por imagem",
          "Funilaria e pintura",
          "Mecânica",
          "Elétrica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.2814491,
          lng: -45.9464351,
        },
        cep: "12305-490",
        endereco_original:
          "Geraldo Scavone, 1205, Jardim Califórnia, Jacareí - SP, 12305-490",
        telefone: "(12) 3958-7044",
        estrelas: 4.7,
        avaliacoes: 160,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMv5z4eo8qeAzOpH3ITsR5GDfa0LGrMwYoc6aX5v3RaYXq9H4PV-mIpnAdskLcKkugOK6jsu1BeF0gW1QL3-OPjt3DUBf_7cVSCx6bsRYZnOpdFEUFoT42iBVhPHnE0E34F0n8xPW5Lz-FpbpZlxXjW0sT7K6pqTE8WsQPtELPLkLkx&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "AUTO MECANICA SANTO ANTONIO",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -24.1625976,
          lng: -46.7695145,
        },
        cep: "11740-000",
        endereco_original:
          "Rua FRANCISCO DE ARAUJO FILHO, 275, PQ BALNEARIO ITANHAEM, ITANHAEM - SP, 11740-000",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "OFICINA CONFIANCA",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -23.2606401,
          lng: -45.9138854,
        },
        cep: "12238-170",
        endereco_original:
          "Rua Caravelas, 243, Jardim Vale do Sol, São José dos Campos - SP, 12238-170",
        telefone: null,
        estrelas: 4.1,
        avaliacoes: 156,
        horario_funcionamento: [
          "Seg: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Ter: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qua: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Qui: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sex: 8:00 AM – 12:00 PM, 1:15 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMpAs8YW34ok7KLuzwRRsZSRDo12M11a_enJU8Jkg4mP6zdwnHcm-PeBPrppsOSywiJ9sk2q5SX8Sk2ml7X754JHmh-LZPm6JITBJtwsnypo5fjfW6G58m84oOI5BgtEw3fYLJl4QQ1iwuHlFWRuIV5P810-He7RUXX8CC9VfmdJeYp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAMP AUTO CENTER",
        servicos: ["Multimarcas", "Funilaria e pintura", "Martelinho de ouro"],
        endereco: {
          lat: -22.9440646,
          lng: -47.0880465,
        },
        cep: "13051-145",
        endereco_original:
          "Avenida Anton Von Zuben, 1811, Jardim São José, Campinas - SP, 13051-145",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "SENE FUNILARIA E PINTURA",
        servicos: ["Vistoria por imagem", "Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.9249198,
          lng: -47.079803,
        },
        cep: "13030-710",
        endereco_original:
          "Rua Padre Bernardo da Silva, 1073, São Bernardo, Campinas - SP, 13030-710",
        telefone: "(19) 3272-8366",
        estrelas: 4,
        avaliacoes: 84,
        horario_funcionamento: null,
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOptqqjDn6sUafEJFnQxZcIPqZ-gE4DQU2IaILbakcSc0R1_AjkbrroRVb3zVjL9BkGRpjiXeIRCWXNXwcUCc8kHdxsG22qX4Ci9yuTEp6LiRlqNzfQ61q9zh-21D6tF5EFJa6AYpjbMpooeLwO5n2JZCR_qicE4EpQU_4r1n1jAO7H&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FAST STEEL REPARACOES AUTOMOBILISTICAS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.9186133,
          lng: -47.0725991,
        },
        cep: "13030-405",
        endereco_original:
          "das Amoreiras, 1033, São Bernardo, Campinas - SP, 13030-405",
        telefone: "(19) 97406-0580",
        estrelas: 4.8,
        avaliacoes: 31,
        horario_funcionamento: [
          "Seg: 7:30 – 11:30 AM, 1:10 – 6:00 PM",
          "Ter: 7:30 – 11:30 AM, 1:10 – 6:00 PM",
          "Qua: 7:30 – 11:30 AM, 1:10 – 6:00 PM",
          "Qui: 7:30 – 11:30 AM, 1:10 – 6:00 PM",
          "Sex: 7:30 – 11:30 AM, 1:10 – 6:00 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMG2iUfojlAjPQliJMLeyXQB49fc8Mj5Lyheme1gG5MaNZr5zgpqIJwyamIs5ho3P2hQvqMD1otfKaAiJ7mdXYMUos6qu4DmluUEfFF9TuwGtL5EBH7DO5sm9Apf5uNkfoxRsz3BPMvNRQbpHvTLONxo6J6747UEFStOPzJKVS5MhTh&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "FG MOTOS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.1963694,
          lng: -45.8772193,
        },
        cep: "12216-760",
        endereco_original:
          "ANDROMEDA, 9, JARDIM AUGUSTA, SAO JOSE DOS CAMPOS - SP, 12216-760",
        telefone: "(12) 99667-2196",
        estrelas: 5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 1:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DO6sgTXtfhFUes71WhoNWOk76JnRDnDRKHkB1X_9G1j266lXtzLA76V3FMTkZnFS1MEMd_WqUA8LuypZ8mqRURgXkxscfkTAPFJQAIoCKSMgGiBrsr_CHHuDNcVwDtuj0_jeb6EE82FZ8A9QdGBRWvCAq2yHMf-3U_xiACI1DAWzE2E&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MEC MOTOS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -23.5030834,
          lng: -47.4694627,
        },
        cep: "18043-000",
        endereco_original:
          "Avenida GENERAL CARNEIRO, 98, VILA LUCY, SOROCABA - SP, 18043-000",
        telefone: "(15) 3217-4837",
        estrelas: 4.7,
        avaliacoes: 210,
        horario_funcionamento: [
          "Seg: 9:00 AM – 6:00 PM",
          "Ter: 9:00 AM – 6:00 PM",
          "Qua: 9:00 AM – 6:00 PM",
          "Qui: 9:00 AM – 6:00 PM",
          "Sex: 9:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DNkdZCpTCoZFipB0lKU9U5IziGZ6M8cCU_IW0CdEQgIqAE-i0i8zseXHis_SwBQGDmgaDHjsxTyXMxR-ZauS-PLyqzB6uJr79n2NyFVaHP8sK5bsyue77DovCsdrkoZ4F6aL0BCgVPXXtTCIjMbIVH994MmjaPyPu7tcGdwa5LR7FUp&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "MOTO IMPORT - SOMENTE MOTO",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.9024149,
          lng: -47.0754679,
        },
        cep: "13070-752",
        endereco_original:
          "GOVERNADOR PEDRO DE TOLEDO, 397, BONFIM, CAMPINAS - SP, 13070-752",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "JET BALBEK",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -23.4653038,
          lng: -47.4794128,
        },
        cep: "18074-030",
        endereco_original:
          "ANTONIO FERRAZ, 41, JARDIM LOS ANGELES, SOROCABA - SP, 18074-030",
        telefone: "(15) 99702-0173",
        estrelas: 4.5,
        avaliacoes: 2,
        horario_funcionamento: [
          "Seg: 8:00 AM – 5:00 PM",
          "Ter: 8:00 AM – 5:00 PM",
          "Qua: 8:00 AM – 5:00 PM",
          "Qui: 8:00 AM – 5:00 PM",
          "Sex: 8:00 AM – 5:00 PM",
          "Sab: 8:00 AM – 5:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DOn38efAEOZ2XYL36AAxDmx6s4EfzcnlhX3PJvgELMfM4VYfrAlytSz3N3fb_9SUwfnGJGuSohMwc5mL0k4_6MnYihAKiIzJoGM7iYsEVew2TngJWr2BLoGYqepZj9vmSNkEl8jGODxPziK88vO5I1oaiESTrHDa6HRLCJVn2LD_pNx&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CERQUEIRA CENTRO TECNICO AUTOMOTIVO CAMPINAS",
        servicos: [
          "Vistoria por imagem",
          "Multimarcas",
          "Funilaria e pintura",
          "Mecânica",
          "Martelinho de ouro",
        ],
        endereco: {
          lat: -22.9071418,
          lng: -47.1046418,
        },
        cep: "13033-020",
        endereco_original:
          "Dona Concheta Pádula, 684, Jardim Aurélia, Campinas - SP, 13033-020",
        telefone: null,
        estrelas: null,
        avaliacoes: null,
        horario_funcionamento: null,
        imagem_url: null,
      },
      {
        nome: "CAPS AMOREIRAS",
        servicos: ["Vistoria por imagem", "Multimarcas"],
        endereco: {
          lat: -22.8707556,
          lng: -47.044334,
        },
        cep: "13088-028",
        endereco_original:
          "DNA LUÍSA DE GUSMÃO, 375, VILA NOGUEIRA, CAMPINAS - SP, 13088-028",
        telefone: "(19) 2513-5326",
        estrelas: 4.6,
        avaliacoes: 226,
        horario_funcionamento: [
          "Seg: 8:00 AM – 6:00 PM",
          "Ter: 8:00 AM – 6:00 PM",
          "Qua: 8:00 AM – 6:00 PM",
          "Qui: 8:00 AM – 6:00 PM",
          "Sex: 8:00 AM – 6:00 PM",
          "Sab: 8:00 AM – 12:00 PM",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DPYgFYHCu63Sejc7D5NRsDp38QPue95x4lyVqG0IVL1Dt6DGqOFVGIbctZQOHJLCuUTV48ywc0JzIEmMwa7Kc5vFqwDrykwtRlQydRiQHmwnrd3cV8kIF46VBz47Jq8Z-HKEEe-F9tyK2JZHdMJRGUIk3To36zW4ltoKEKFhhEiT9fz&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
      {
        nome: "CAPPI REPARADORA DE VEICULOS",
        servicos: ["Multimarcas", "Funilaria e pintura"],
        endereco: {
          lat: -22.7081911,
          lng: -46.7785384,
        },
        cep: "13901-002",
        endereco_original: "Polônia, 204, Silvestre, Amparo - SP, 13901-002",
        telefone: "(19) 3808-4368",
        estrelas: 4.5,
        avaliacoes: 35,
        horario_funcionamento: [
          "Seg: 7:30 – 11:00 AM, 12:30 – 5:45 PM",
          "Ter: 7:30 – 11:00 AM, 12:30 – 5:45 PM",
          "Qua: 7:30 – 11:00 AM, 12:30 – 5:45 PM",
          "Qui: 7:30 – 11:00 AM, 12:30 – 5:45 PM",
          "Sex: 7:30 – 11:00 AM, 12:30 – 5:45 PM",
          "Sab: Closed",
          "Dom: Closed",
        ],
        imagem_url:
          "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdCG2DMn8oW27Gt0xd_sw5bU-i0aUk8ButSykCwi8o-TBbmeG_lwfMZWeqigKEzeYoNXIGDwqcv4-mzDhoZLxPCM5P_VtTFkN8bN70RS_t1D8-0t3qdgM3mmOUxKydYeY-sPCM4nJNpxUT1JdqVjOJFRccEOS3y29IIB83AOh8tv9bbOQotH&key=AIzaSyBs7NUNGoxc9piEik-7t8R0n6jBfdf8E38",
      },
    ];
    setCarServices(carServices);
  };

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    map.addListener("bounds_changed", () => {
      setMapBounds(map.getBounds() || null);
    });
  };

  useEffect(() => {
    if (mapBounds) {
      const visible = carServices.filter((service) =>
        mapBounds.contains(service.endereco)
      );
      setVisibleServices(visible);
    }
  }, [mapBounds, carServices, userLocation]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResults(carServices); // Show all results when input is empty
    } else {
      const results = carServices.filter(
        // Filter through all car services
        (service) =>
          service.nome.toLowerCase().includes(searchTerm) ||
          (service.servicos &&
            service.servicos.some((s) => s.toLowerCase().includes(searchTerm)))
      );
      setSearchResults(results);
    }
  };

  const handleFilterChange = (
    filterType: string,
    value: string | number | null
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value === "" ? null : value,
    }));
  };

  // Automatically apply filters when the filter changes
  useEffect(() => {
    const filteredServices = carServices.filter((service) => {
      const matchesSearchTerm =
        searchTerm.trim() === "" ||
        service.nome.toLowerCase().includes(searchTerm) ||
        (service.servicos &&
          service.servicos.some((s) => s.toLowerCase().includes(searchTerm)));

      const matchesEstrelas =
        filters.estrelas === null ||
        (service.estrelas ?? 0) >= filters.estrelas;

      const matchesServicos =
        filters.servicos === null ||
        (service.servicos && service.servicos.includes(filters.servicos));

      const matchesHorario =
        filters.horario_funcionamento === null ||
        (service.horario_funcionamento &&
          service.horario_funcionamento.includes(
            filters.horario_funcionamento
          ));

      // Only check map visibility if search term is empty
      const isVisibleOnMap =
        searchTerm.trim() !== "" ||
        (mapBounds && mapBounds.contains(service.endereco));

      return (
        matchesSearchTerm &&
        matchesEstrelas &&
        matchesServicos &&
        matchesHorario &&
        isVisibleOnMap
      );
    });

    // Sort services by distance from userLocation
    const sortedServices = filteredServices.sort((a, b) => {
      if (!userLocation) return 0; // If userLocation is not available, do not sort
      const distanceA = haversineDistance(userLocation, a.endereco);
      const distanceB = haversineDistance(userLocation, b.endereco);
      return distanceA - distanceB;
    });

    setSearchResults(sortedServices);
  }, [filters, carServices, searchTerm, mapBounds, userLocation]);

  const haversineDistance = (
    coords1: google.maps.LatLngLiteral,
    coords2: google.maps.LatLngLiteral
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLng = toRad(coords2.lng - coords1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.lat)) *
        Math.cos(toRad(coords2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleServiceClick = (service: CarService) => {
    setSelectedService(service);
    setClicouOficina(true);
    if (mapRef) {
      mapRef.panTo(service.endereco);
      mapRef.setZoom(16); // Adjust zoom level as needed
    }
  };

  const handleBackClick = () => {
    setSelectedService(null);
    setClicouOficina(false);
    if (mapRef) {
      mapRef.setZoom(14); // Adjust zoom level as needed
    }
  };

  const handleShowMoreClick = () => {
    if (mapRef) {
      mapRef.setZoom((mapRef.getZoom() ?? 0) - 1); // Decrease zoom level to show more area
    }
  };

  useEffect(() => {
    const handleClassChange = () => {
      const darkModeEnabled =
        document.documentElement.classList.contains("dark-mode");
      setIsDarkMode(darkModeEnabled);
    };

    handleClassChange();

    const observer = new MutationObserver(handleClassChange);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <div className="div_oficinas">
        <div className="map">
          <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
            {userLocation && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation}
                zoom={14}
                onLoad={onMapLoad}
                options={{
                  styles: isDarkMode ? darkMapStyle : null,
                }}
              >
                {/* User location marker */}
                <Marker position={userLocation} />

                {/* Car service markers */}
                {visibleServices.map((service) => (
                  <Marker
                    key={service.nome}
                    position={service.endereco}
                    icon={
                      service === selectedService
                        ? {
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          }
                        : undefined
                    }
                  />
                ))}
              </GoogleMap>
            )}
          </LoadScript>
        </div>
        {/* Removed Search Results section */}

        <div className="lista_oficinas">
          <div
            className={
              clicouOficina
                ? "Oficina_Barra_Busca_div fecha_Oficina"
                : "Oficina_Barra_Busca_div"
            }
          >
            <Oficina_Barra_Busca
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
          <div
            className={
              clicouOficina
                ? "Oficina_titulo_filtro fecha_Oficina"
                : "Oficina_titulo_filtro"
            }
          >
            {searchTerm === "" ? <h2>Oficinas:</h2> : <h2>{searchTerm}</h2>}
            <select
              onChange={(e) =>
                handleFilterChange(
                  "estrelas",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
              className="avaliacoes"
            >
              <option value="">Avaliações</option>{" "}
              {/* Empty option with empty stars */}
              <option value="5">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </option>{" "}
              {/* 5 full stars */}
              <option value="4">
                &#9733;&#9733;&#9733;&#9733;&#9734;
              </option>{" "}
              {/* 4 full stars, 1 empty */}
              <option value="3">
                &#9733;&#9733;&#9733;&#9734;&#9734;
              </option>{" "}
              {/* 3 full stars, 2 empty */}
              <option value="2">
                &#9733;&#9733;&#9734;&#9734;&#9734;
              </option>{" "}
              {/* 2 full stars, 3 empty */}
              <option value="1">
                &#9733;&#9734;&#9734;&#9734;&#9734;
              </option>{" "}
              {/* 1 full star, 4 empty */}
            </select>
          </div>
          <div className="oficinas">
            {selectedService ? (
              <div
                className={
                  clicouOficina
                    ? "fecha_oficina_detalhes abre_oficina_detalhes"
                    : "fecha_oficina_detalhes"
                }
              >
                <Oficina_Oficina_Detalhes
                  oficina={selectedService}
                  onOficinaClick={handleBackClick}
                  distancia={
                    userLocation
                      ? haversineDistance(
                          userLocation,
                          selectedService.endereco
                        )
                      : undefined
                  }
                />
              </div>
            ) : (
              searchResults.map((service) => (
                <div
                  key={service.nome}
                  className={
                    clicouOficina
                      ? "abre_oficina fecha_Oficina"
                      : "abre_oficina"
                  }
                >
                  <Oficina_Oficina
                    oficina={service}
                    onOficinaClick={handleServiceClick}
                    distancia={
                      userLocation
                        ? haversineDistance(userLocation, service.endereco)
                        : undefined
                    }
                  />
                </div>
              ))
            )}
            <div
              className={
                clicouOficina ? "abre_oficina fecha_Oficina" : "abre_oficina"
              }
            >
              <button onClick={handleShowMoreClick} className="mostrar_mais">
                Mostrar mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapComponent;
