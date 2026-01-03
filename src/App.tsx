import * as Tooltip from "@radix-ui/react-tooltip";
import { Separator } from "@radix-ui/react-separator";
import * as d3 from "d3";

import data from "../data/extended-facts-verified.json";

import v1 from "./assets/v1.svg";
import v2 from "./assets/v2.svg";
import v3 from "./assets/v3.svg";
import v4 from "./assets/v4.svg";
import v5 from "./assets/v5.svg";

import "./App.css";

const parseTime = d3.utcParse("%Y.%m.%d");
const readableTime = d3.utcFormat("%d/%m/%Y");
const baseData = data.map((d, index) => ({
  ...d,
  index,
  preference:
    Math.random() > 0.4
      ? "approve"
      : Math.random() > 0.1
      ? "reject"
      : "neutral",
}));

// const colorInter1 = d3.interpolateLab("#e68fc3", "#7386e8");
// const colorInter2 = d3.interpolateLab("#7386e8", "#53c3ac");
// const colorScale = [
//   colorInter1(0),
//   colorInter1(0.5),
//   colorInter1(1),
//   colorInter2(0.5),
//   colorInter2(1),
// ];
const verificationValues = [
  "true",
  "inaccurate",
  "misleading",
  "creative",
  "false",
];
const verificationExplainers: Record<string, string> = {
  false:
    "La afirmación ha mostrado ser falsa tras ser verificada con las fuentes disponibles y expert@s.",
  creative:
    "La afirmación puede nacer de un dato verificable o de un hecho constatable, pero se exageran o combinan con falsedades.",
  misleading:
    "La afirmación contiene datos verificables, pero la interpretación que se hace de ellos, el contexto en que se sitúan, las proyecciones que se realizan con ellos o las correlaciones no son verificables.",
  inaccurate:
    "En términos generales la afirmación es correcta, debido a que se puede verificar con las fuentes disponibles y experto/as, pero hay datos imprecisos, omitidos o falta contexto.",
  true: "La afirmación expresada es correcta al ser verificada con las fuentes disponibles y expert@s.",
};

const sourceValues = [
  "Instagram",
  "TikTok",
  "Twitter",
  "YouTube",
  "Facebook",
  "leaflets",
  "online media",
  "television",
  "electoral campaign",
];
const sourceExplainers: Record<string, string> = {
  Instagram:
    "Afirmación analizada se publicó originalmente en la plataforma social Instagram.",
  TikTok:
    "Afirmación analizada se publicó originalmente en la plataforma social TikTok.",
  Twitter:
    "Afirmación analizada se publicó originalmente en la plataforma social X (llamada entonces, Twittwe).",
  YouTube:
    "Afirmación analizada se publicó originalmente en la plataforma web YouTube.",
  Facebook:
    "Afirmación analizada se publicó originalmente en la plataforma social Facebook.",
  leaflets:
    "Afirmación analizada fue compartida originalmente a través de folletos impresos.",
  "online media":
    "Afirmación analizada es una medio digital, como una imagen o video, compartido en redes sociales o la web pero la fuente original de publicación se desconoce. .",
  television:
    "Afirmación analizada fue transmitida originalmente a través de televisión, vía programas de televisión o puntos de prensa.",
  "electoral campaign":
    "Afirmación analizada se transmitió originalmente a través de la franja electoral que se emitió acercándose al plebiscito.",
};

const preferenceValues = ["approve", "reject", "neutral"];
const preferenceExplainers: Record<string, string> = {
  approve:
    "La afirmación se comparte como apoyo a la opción 'Apruebo' del plebiscito.",
  reject:
    "La afirmación se comparte como apoyo a la opción 'Rechazo' del plebiscito.",
  neutral:
    "La afirmación no se comparte como apoyo a ninguna opción del plebiscito, o no fue posible determinarlo.",
};

// const getColor = (v: string) => {
//   const index = verificationValues.indexOf(v);
//   return index > -1 ? colorScale[index] : "black";
// };
const getAvatar = (v: string) => {
  return {
    false: v5,
    creative: v4,
    misleading: v3,
    inaccurate: v2,
    true: v1,
  }[v];
};

const rawVerificationMap: Record<string, string> = {
  true: "Verdadero",
  inaccurate: "Impreciso",
  misleading: "Engañoso",
  creative: "Se puso creativ@",
  false: "Falso",
};
const sourceMap: Record<string, string> = {
  Instagram: "Instagram",
  TikTok: "TikTok",
  Twitter: "X",
  YouTube: "YouTube",
  Facebook: "Facebook",
  leaflets: "Folletos",
  "online media": "Contenido en línea",
  television: "TV",
  "electoral campaign": "Franja electoral",
};
const rawPreferenceMap: Record<string, string> = {
  approve: "Apruebo",
  reject: "Rechazo",
  neutral: "Neutral",
};

const TOTAL_CLAIMS = baseData.length;
const verificationGroups = Object.fromEntries(
  verificationValues.map((value) => {
    return [value, baseData.filter((d) => d.verification === value)];
  })
);
const sourceGroups: [string, typeof baseData][] = sourceValues.map((value) => {
  const claims = baseData.filter(
    (d) => (d.source?.medium ?? d.source?.platform) === value
  );
  claims.sort((a, b) => {
    return (
      verificationValues.indexOf(a.verification) -
      verificationValues.indexOf(b.verification)
    );
  });

  return [value, claims];
});
sourceGroups.sort((a, b) => b[1].length - a[1].length);

const preferenceGroups = Object.fromEntries(
  preferenceValues.map((value) => {
    const claims = baseData.filter((d) => d.preference === value);
    claims.sort((a, b) => {
      return (
        verificationValues.indexOf(a.verification) -
        verificationValues.indexOf(b.verification)
      );
    });
    return [value, claims];
  })
);

function App() {
  return (
    <Tooltip.Provider
      skipDelayDuration={0}
      delayDuration={0}
      disableHoverableContent={true}
    >
      <button
        className="backToTop"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 34C18 35.1046 18.8954 36 20 36C21.1046 36 22 35.1046 22 34H20H18ZM21.4142 5.58579C20.6332 4.80474 19.3668 4.80474 18.5858 5.58579L5.85786 18.3137C5.07682 19.0948 5.07682 20.3611 5.85786 21.1421C6.63891 21.9232 7.90524 21.9232 8.68629 21.1421L20 9.82843L31.3137 21.1421C32.0948 21.9232 33.3611 21.9232 34.1421 21.1421C34.9232 20.3611 34.9232 19.0948 34.1421 18.3137L21.4142 5.58579ZM20 34H22V7H20H18V34H20Z"
            fill="white"
          />
        </svg>
      </button>

      <div className="wrapper end"></div>

      <div className="wrapper titleWrapper">
        <div className="container">
          <h1 className="title">Verificaciones de Plebiscito de Salida 2022</h1>
        </div>
      </div>

      <div className="wrapper">
        <div className="container">
          <p className="intro">
            Las siguientes son las verificaciones, realizadas por el equipo de{" "}
            <a
              href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/"
              rel="noreferrer"
              target="_blank"
            >
              Factchecking.cl
            </a>
            , sobre afirmaciones que circularon diversas plataformas sobre el
            proceso constituyente.
          </p>
        </div>
      </div>

      <div className="wrapper">
        <div className="container">
          <div className="visualizationWrapper">
            <div className="visualizationColumn">
              <p>Resultado de verificación</p>
              <div className="visualizationGroupWrapper">
                {Object.entries(verificationGroups).map(([value, claims]) => (
                  <div className="visualizationGroup">
                    <p>
                      <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                          <span>{rawVerificationMap[value]} </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="tooltipContent"
                            sideOffset={8}
                            side="top"
                          >
                            <div className="verificationWrapper">
                              <img
                                className="verificationAvatar"
                                src={getAvatar(value)}
                              ></img>
                            </div>
                            <div className="tooltipText">
                              <p className="explainer">
                                <strong>{rawVerificationMap[value]}</strong>:{" "}
                                {verificationExplainers[value]}
                              </p>
                            </div>
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>

                      <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                          <strong>
                            {Math.round((100 * claims.length) / TOTAL_CLAIMS)}%
                          </strong>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="tooltipContent small"
                            sideOffset={8}
                            side="top"
                          >
                            {claims.length} de {TOTAL_CLAIMS}
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </p>
                    <div className="visualizationDots">
                      {claims.map((d) => (
                        <Tooltip.Root key={d.index} delayDuration={0}>
                          <Tooltip.Trigger asChild>
                            <div
                              className={`node claim-${d.index}`}
                              onMouseOver={() => {
                                const elements = document.querySelectorAll(
                                  `.claim-${d.index}`
                                );
                                elements.forEach((el) => {
                                  el.className = `${el.className} selected`;
                                });
                              }}
                              onMouseOut={() => {
                                const elements = document.querySelectorAll(
                                  `.claim-${d.index}`
                                );
                                elements.forEach((el) => {
                                  el.className = el.className.replaceAll(
                                    " selected",
                                    ""
                                  );
                                });
                              }}
                              onClick={() => {
                                const div = document.getElementById(
                                  `claim-${d.index}`
                                );
                                window.scrollTo({
                                  top: div?.getBoundingClientRect().y,
                                  behavior: "smooth",
                                });
                              }}
                            >
                              <img src={getAvatar(d.verification)} />
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="tooltipContent"
                              sideOffset={8}
                              side="top"
                            >
                              <div className="verificationWrapper">
                                <img
                                  className="verificationAvatar"
                                  src={getAvatar(d.verification)}
                                ></img>
                                <span>
                                  <strong>{d.verificationRaw}</strong>
                                </span>
                              </div>
                              <div className="tooltipText">
                                <div className="category">
                                  <p>
                                    Afirmación <strong>#{d.index + 1}</strong>{" "}
                                    sobre{" "}
                                    <strong className="emphasisText">
                                      {" "}
                                      {d.categoryRaw}
                                    </strong>{" "}
                                  </p>
                                  <p className="source">
                                    {
                                      sourceMap[
                                        (d.source?.medium ??
                                          d.source?.platform)!
                                      ]
                                    }{" "}
                                    (
                                    {d.date == null
                                      ? "fecha desconocida"
                                      : readableTime(parseTime(d.date!)!)}
                                    )
                                  </p>
                                </div>

                                <p className="instruction">
                                  Haz clic para revisar verificación.
                                </p>
                              </div>
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="separator" />
            <div className="visualizationColumn">
              <p>Fuente de afirmación</p>
              <div className="visualizationGroupWrapper">
                {sourceGroups.map(([value, claims]) => (
                  <div className="visualizationGroup">
                    <p>
                      <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                          <span>{sourceMap[value]} </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="tooltipContent"
                            sideOffset={8}
                            side="top"
                          >
                            <div className="tooltipText">
                              <p className="explainer">
                                <strong>{sourceMap[value]}</strong>:{" "}
                                {sourceExplainers[value]}
                              </p>
                            </div>
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>

                      <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                          <strong>
                            {Math.round((100 * claims.length) / TOTAL_CLAIMS)}%
                          </strong>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="tooltipContent small"
                            sideOffset={8}
                            side="top"
                          >
                            {claims.length} de {TOTAL_CLAIMS}
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </p>
                    <div className="visualizationDots">
                      {claims.map((d) => (
                        <Tooltip.Root key={d.index} delayDuration={0}>
                          <Tooltip.Trigger asChild>
                            <div
                              className={`node claim-${d.index}`}
                              onMouseOver={() => {
                                const elements = document.querySelectorAll(
                                  `.claim-${d.index}`
                                );
                                elements.forEach((el) => {
                                  el.className = `${el.className} selected`;
                                });
                              }}
                              onMouseOut={() => {
                                const elements = document.querySelectorAll(
                                  `.claim-${d.index}`
                                );
                                elements.forEach((el) => {
                                  el.className = el.className.replaceAll(
                                    " selected",
                                    ""
                                  );
                                });
                              }}
                              onClick={() => {
                                const div = document.getElementById(
                                  `claim-${d.index}`
                                );
                                window.scrollTo({
                                  top: div?.getBoundingClientRect().y,
                                  behavior: "smooth",
                                });
                              }}
                            >
                              <img src={getAvatar(d.verification)} />
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="tooltipContent"
                              sideOffset={8}
                              side="top"
                            >
                              <div className="verificationWrapper">
                                <img
                                  className="verificationAvatar"
                                  src={getAvatar(d.verification)}
                                ></img>
                                <span>
                                  <strong>{d.verificationRaw}</strong>
                                </span>
                              </div>
                              <div className="tooltipText">
                                <div className="category">
                                  <p>
                                    Afirmación <strong>#{d.index + 1}</strong>{" "}
                                    sobre{" "}
                                    <strong className="emphasisText">
                                      {" "}
                                      {d.categoryRaw}
                                    </strong>{" "}
                                  </p>
                                  <p className="source">
                                    {
                                      sourceMap[
                                        (d.source?.medium ??
                                          d.source?.platform)!
                                      ]
                                    }{" "}
                                    (
                                    {d.date == null
                                      ? "fecha desconocida"
                                      : readableTime(parseTime(d.date!)!)}
                                    )
                                  </p>
                                </div>

                                <p className="instruction">
                                  Haz clic para revisar verificación.
                                </p>
                              </div>
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="separator" />
            <div className="visualizationColumn">
              <p>Preferencia plebiscito</p>
              <div className="visualizationGroupWrapper">
                {Object.entries(preferenceGroups).map(([value, claims]) => (
                  <div className="visualizationGroup">
                    <p>
                      <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                          <span>{rawPreferenceMap[value]} </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="tooltipContent"
                            sideOffset={8}
                            side="top"
                          >
                            <div className="tooltipText">
                              <p className="explainer">
                                <strong>{rawPreferenceMap[value]}</strong>:{" "}
                                {preferenceExplainers[value]}
                              </p>
                            </div>
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>

                      <Tooltip.Root delayDuration={0}>
                        <Tooltip.Trigger asChild>
                          <strong>
                            {Math.round((100 * claims.length) / TOTAL_CLAIMS)}%
                          </strong>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="tooltipContent small"
                            sideOffset={8}
                            side="top"
                          >
                            {claims.length} de {TOTAL_CLAIMS}
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </p>
                    <div className="visualizationDots">
                      {claims.map((d) => (
                        <Tooltip.Root key={d.index} delayDuration={0}>
                          <Tooltip.Trigger asChild>
                            <div
                              className={`node claim-${d.index}`}
                              onMouseOver={() => {
                                const elements = document.querySelectorAll(
                                  `.claim-${d.index}`
                                );
                                elements.forEach((el) => {
                                  el.className = `${el.className} selected`;
                                });
                              }}
                              onMouseOut={() => {
                                const elements = document.querySelectorAll(
                                  `.claim-${d.index}`
                                );
                                elements.forEach((el) => {
                                  el.className = el.className.replaceAll(
                                    " selected",
                                    ""
                                  );
                                });
                              }}
                              onClick={() => {
                                const div = document.getElementById(
                                  `claim-${d.index}`
                                );
                                window.scrollTo({
                                  top: div?.getBoundingClientRect().y,
                                  behavior: "smooth",
                                });
                              }}
                            >
                              <img src={getAvatar(d.verification)} />
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="tooltipContent"
                              sideOffset={8}
                              side="top"
                            >
                              <div className="verificationWrapper">
                                <img
                                  className="verificationAvatar"
                                  src={getAvatar(d.verification)}
                                ></img>
                                <span>
                                  <strong>{d.verificationRaw}</strong>
                                </span>
                              </div>
                              <div className="tooltipText">
                                <div className="category">
                                  <p>
                                    Afirmación <strong>#{d.index + 1}</strong>{" "}
                                    sobre{" "}
                                    <strong className="emphasisText">
                                      {" "}
                                      {d.categoryRaw}
                                    </strong>{" "}
                                  </p>
                                  <p className="source">
                                    {
                                      sourceMap[
                                        (d.source?.medium ??
                                          d.source?.platform)!
                                      ]
                                    }{" "}
                                    (
                                    {d.date == null
                                      ? "fecha desconocida"
                                      : readableTime(parseTime(d.date!)!)}
                                    )
                                  </p>
                                </div>

                                <p className="instruction">
                                  Haz clic para revisar verificación.
                                </p>
                              </div>
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="container">
          <div className="claimList">
            {baseData.map((n) => (
              <div className="claim" key={`claim-${n.index}`}>
                <div className="claimHeader">
                  <h2 id={`claim-${n.index}`}>
                    Afirmación <strong> #{n.index + 1}</strong> sobre{" "}
                    <strong className="emphasisText"> {n.categoryRaw}</strong>
                  </h2>

                  <div className="claimWrapper">
                    <Tooltip.Root delayDuration={0}>
                      <Tooltip.Trigger asChild>
                        <div className="verificationWrapper">
                          <img src={getAvatar(n.verification)}></img>

                          <p>
                            <strong>{n.verificationRaw}</strong>
                          </p>
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="tooltipContent"
                          sideOffset={8}
                          side="top"
                        >
                          <div className="verificationWrapper">
                            <img
                              className="verificationAvatar"
                              src={getAvatar(n.verification)}
                            ></img>
                          </div>
                          <div className="tooltipText">
                            <p className="explainer">
                              <strong>
                                {rawVerificationMap[n.verification]}
                              </strong>
                              : {verificationExplainers[n.verification]}
                            </p>
                          </div>
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>

                    <div className="textWrapper">
                      <blockquote>{n.fact}</blockquote>
                      <p className="source">
                        {sourceMap[(n.source?.medium ?? n.source?.platform)!]} (
                        {n.date == null
                          ? "fecha desconocida"
                          : readableTime(parseTime(n.date!)!)}
                        )
                      </p>
                    </div>
                  </div>
                </div>
                <div className="result">
                  <p className="resultHeader">
                    <strong>Análisis de fackchecking.cl</strong>
                  </p>
                  <p>
                    {n.articleSubtitle} Para más detalles, revisa el{" "}
                    <a href={n.url} rel="noreferrer" target="_blank">
                      artículo de verificación.
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="container">
          <p className="outtro">
            Sitio creado por
            <a
              href="https://github.com/fdoflorenzano"
              rel="noreferrer"
              target="_blank"
            >
              @fdoflorenzano
            </a>
            . Todos los datos fueron extraidos de{" "}
            <a
              href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/"
              rel="noreferrer"
              target="_blank"
            >
              Factchecking.cl
            </a>
            .
          </p>
        </div>
      </div>

      <div className="wrapper end"></div>
    </Tooltip.Provider>
  );
}

export default App;
