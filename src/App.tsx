import { useCallback, useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as d3 from "d3";
import { useWindowSize } from "@uidotdev/usehooks";

import data from "../data/extended-facts-verified.json";

import v1 from "./assets/v1.svg";
import v2 from "./assets/v2.svg";
import v3 from "./assets/v3.svg";
import v4 from "./assets/v4.svg";
import v5 from "./assets/v5.svg";
// import v6 from "./assets/v6.svg";

import "./App.css";

interface Node extends d3.SimulationNodeDatum {
  fact: string;
  verification: string;
  source: {
    medium?: string;
    platform?: string;
  };
  date: string | null;
  verificationRaw: string;
  articleSubtitle: string;
  url: string;
  categoryRaw: string;
}
type Scale = "verification" | "source" | "time";

const [DEFAULT_WIDTH, DEFAULT_HEIGHT] = [1200, 350];
const RADIUS = 12;
const MAX_APP_WIDTH = 1000;
const MIN_APP_WIDTH = 320;
const APP_X_PADDING = 32;

const parseTime = d3.utcParse("%Y.%m.%d");
const formatTime = d3.utcFormat("%Y.%m.%d");
const readableTime = d3.utcFormat("%d/%m/%Y");
const baseData = data.map((d) => ({
  ...d,
  x: DEFAULT_WIDTH / 2,
  y: DEFAULT_HEIGHT / 2,
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
  "false",
  "creative",
  "misleading",
  "inaccurate",
  "true",
];

// const verificationExplainers = {
//   false:
//     "La afirmación ha mostrado ser falsa tras ser verificada con las fuentes disponibles y expert@s.",
//   creative:
//     "La afirmación puede nacer de un dato verificable o de un hecho constatable, pero se exageran o combinan con falsedades.",
//   misleading:
//     "La afirmación contiene datos verificables, pero la interpretación que se hace de ellos, el contexto en que se sitúan, las proyecciones que se realizan con ellos o las correlaciones no son verificables.",
//   inaccurate:
//     "En términos generales la afirmación es correcta, debido a que se puede verificar con las fuentes disponibles y experto/as, pero hay datos imprecisos, omitidos o falta contexto.",
//   true: "La afirmación expresada es correcta al ser verificada con las fuentes disponibles y expert@s.",
// };
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
const dateExtent = [parseTime("2022.04.19")!, parseTime("2022.08.29")!];

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

const fieldAccessor = (d: Node, scale: Scale) =>
  (scale === "verification"
    ? d.verification
    : scale === "time"
    ? d.date
    : d.source?.medium ?? d.source?.platform) ?? "";

const rawVerificationMap: Record<string, string> = {
  true: "Verdadero",
  inaccurate: "Impreciso",
  misleading: "Engañoso",
  creative: "Se puso creativ@",
  false: "Falso",
};
const monthMap: Record<number, string> = {
  5: "Mayo 2025",
  6: "Junio 2025",
  7: "Julio 2025",
  8: "Agosto 2025",
};
const sourceMap: Record<string, string> = {
  Instagram: "Instagram",
  TikTok: "TikTok",
  Twitter: "X",
  YouTube: "YouTube",
  Facebook: "Facebook",
  leaflets: "Folletos",
  "online media": "Contenido enlinea",
  television: "TV",
  "electoral campaign": "Franja electoral",
};

function App() {
  const [nodes, setNodes] = useState<Node[]>(baseData);

  const [scale, setScale] = useState<Scale>("verification");

  const size = useWindowSize();
  const orientation = (size.width ?? 1000) > 800 ? "horizontal" : "vertical";
  const dimensions =
    orientation === "horizontal"
      ? {
          width: Math.max(
            Math.min(
              size.width ?? DEFAULT_WIDTH,
              MAX_APP_WIDTH - 2 * APP_X_PADDING
            ),
            MIN_APP_WIDTH - 2 * APP_X_PADDING
          ),
          height: DEFAULT_HEIGHT,
        }
      : {
          width: Math.max(
            Math.min(
              size.width ?? DEFAULT_WIDTH,
              MAX_APP_WIDTH - 2 * APP_X_PADDING
            ),
            MIN_APP_WIDTH - 2 * APP_X_PADDING
          ),
          height: DEFAULT_WIDTH,
        };
  const sizeRef = useRef({ width: 0, height: 0 });

  const verificationScale = d3
    .scaleBand(verificationValues, [
      orientation === "horizontal" ? dimensions.width : dimensions.height,
      0,
    ])
    .paddingOuter(0.1)
    .paddingInner(0.2);

  const sourceScale = d3
    .scaleBand(sourceValues, [
      orientation === "horizontal" ? dimensions.width : dimensions.height,
      0,
    ])
    .paddingOuter(0.1)
    .paddingInner(0.2);

  const timeScale = d3.scaleTime(dateExtent, [
    (verificationScale(verificationValues[verificationValues.length - 2]) ??
      0) +
      verificationScale.bandwidth() / 2,
    (verificationScale(verificationValues[0]) ?? 0) +
      verificationScale.bandwidth() / 2,
  ]);

  const getPosition = useCallback(
    (v: string) => {
      if (scale === "time") {
        return !v
          ? (verificationScale(
              verificationValues[verificationValues.length - 1]
            ) ?? 0) +
              verificationScale.bandwidth() / 2
          : timeScale(parseTime(v)!);
      }
      if (scale === "source") {
        return (
          (sourceScale(v) ?? sourceScale.range()[0]) +
          sourceScale.bandwidth() / 2
        );
      }

      if (scale === "verification") {
        return (
          (verificationScale(v) ?? verificationScale.range()[0]) +
          verificationScale.bandwidth() / 2
        );
      }

      return 0;
    },
    [scale, timeScale, sourceScale, verificationScale]
  );

  const simulation = useRef<d3.Simulation<Node, undefined>>(null);

  const getSimulation = useCallback(
    () =>
      d3
        .forceSimulation<Node>(nodes)
        .alphaMin(0.01)
        .alphaTarget(0)
        .alpha(1)
        .force(
          "forceX",
          orientation === "horizontal"
            ? d3
                .forceX((d: Node) => getPosition(fieldAccessor(d, scale)))
                .strength(0.09)
            : d3.forceX(dimensions.width * 0.6).strength(0.05)
        )
        .force(
          "forceY",
          orientation === "horizontal"
            ? d3.forceY(dimensions.height * 0.6).strength(0.05)
            : d3
                .forceY((d: Node) => getPosition(fieldAccessor(d, scale)))
                .strength(0.09)
        )
        .force("collision", d3.forceCollide(RADIUS * 1.1))
        .on("tick", () => {
          if ((simulation.current?.alpha() ?? 1) < 0.01) {
            simulation.current?.stop();
          }
          setNodes(() =>
            [...nodes].map((n) => ({
              ...n,
              x: Math.max(
                RADIUS,
                Math.min(MAX_APP_WIDTH - 2 * APP_X_PADDING - RADIUS, n.x ?? 0)
              ),
              y: Math.max(RADIUS, Math.min(DEFAULT_WIDTH - RADIUS, n.y ?? 0)),
            }))
          );
        }),
    [
      orientation,
      getPosition,
      nodes,
      setNodes,
      dimensions.width,
      dimensions.height,
      scale,
    ]
  );

  useEffect(() => {
    if (dimensions.width != sizeRef.current.width) {
      simulation.current?.stop();

      simulation.current = getSimulation();
    }

    sizeRef.current = {
      width: dimensions.width,
      height: dimensions.height,
    };
  }, [dimensions.width, dimensions.height, getSimulation]);

  useEffect(() => {
    simulation.current?.stop();
    simulation.current = getSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  return (
    <>
      <div className="wrapper end"></div>

      <div className="wrapper titleWrapper">
        <div className="container">
          <h1 className="title">Verificaciones de Plebiscito de Salida 2022</h1>
        </div>
      </div>

      <div className="wrapper">
        <div className="container">
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
            proceso constituyente. Organiza por:{" "}
            <select
              value={scale}
              onChange={(e) => setScale(e.target.value as Scale)}
            >
              <option value="verification">Verificaciones</option>
              <option value="source">Fuente</option>
              <option value="time">Fecha de publicación</option>
            </select>
          </p>

          <div
            className="visualizationWrapper"
            style={
              {
                "--height": `${dimensions.height}px`,
              } as React.CSSProperties
            }
          >
            {nodes.map((v, index) => (
              <Tooltip.Provider delayDuration={0} key={v.fact}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div
                      className="node"
                      style={
                        {
                          "--y": `${v.y ?? 0 - RADIUS}px`,
                          "--x": `${v.x ?? 0 - RADIUS}px`,
                          "--size": `${RADIUS * 2}px`,
                        } as React.CSSProperties
                      }
                      onClick={() => {
                        const div = document.getElementById(`claim-${index}`);
                        window.scrollTo({
                          top: div?.getBoundingClientRect().y,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <img
                        src={getAvatar(v.verification)}
                        width={RADIUS * 2}
                        height={RADIUS * 2}
                      />
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
                          src={getAvatar(v.verification)}
                        ></img>
                        <span>
                          <strong>{v.verificationRaw}</strong>
                        </span>
                      </div>
                      <div className="tooltipText">
                        <div className="category">
                          <p>
                            Afirmación <strong>#{index + 1}</strong> sobre{" "}
                            <strong className="emphasisText">
                              {" "}
                              {v.categoryRaw}
                            </strong>{" "}
                          </p>
                          <p className="source">
                            {
                              sourceMap[
                                (v.source?.medium ?? v.source?.platform)!
                              ]
                            }{" "}
                            (
                            {v.date == null
                              ? "fecha desconocida"
                              : readableTime(parseTime(v.date!)!)}
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
              </Tooltip.Provider>
            ))}

            {scale === "verification" &&
              verificationValues.map((v) => (
                <p
                  key={"veri-" + v}
                  className="verificationTick"
                  style={
                    {
                      "--y":
                        orientation === "horizontal"
                          ? `${20}px`
                          : `${getPosition(v)}px`,
                      "--x":
                        orientation === "horizontal"
                          ? `${getPosition(v)}px`
                          : `${20}px`,
                      "--transform":
                        orientation === "horizontal" ? `translateX(-50%)` : "",
                    } as React.CSSProperties
                  }
                >
                  {rawVerificationMap[v]}
                  <img className="avatar" src={getAvatar(v)} />
                </p>
              ))}

            {scale === "source" &&
              sourceValues.map((v) => (
                <p
                  key={"source-" + v}
                  className="sourceTick"
                  style={
                    {
                      "--y":
                        orientation === "horizontal"
                          ? `${20}px`
                          : `${getPosition(v)}px`,
                      "--x":
                        orientation === "horizontal"
                          ? `${getPosition(v) + 5}px`
                          : `${20}px`,
                      "--transform":
                        orientation === "horizontal" ? `translateX(-50%)` : "",
                    } as React.CSSProperties
                  }
                >
                  {sourceMap[v]}
                </p>
              ))}

            {scale === "time" &&
              timeScale.ticks(5).map((v) => (
                <p
                  key={"time-" + v}
                  className="timeTick"
                  style={
                    {
                      "--y":
                        orientation === "horizontal"
                          ? `${20}px`
                          : `${getPosition(formatTime(v))}px`,
                      "--x":
                        orientation === "horizontal"
                          ? `${getPosition(formatTime(v)) + 5}px`
                          : `${20}px`,
                      "--transform":
                        orientation === "horizontal" ? `translateX(-50%)` : "",
                    } as React.CSSProperties
                  }
                >
                  {monthMap[v.getMonth() + 1]}
                </p>
              ))}
            {scale === "time" && (
              <p
                key={"time-unk"}
                className="timeTick"
                style={
                  {
                    "--y":
                      orientation === "horizontal"
                        ? `${20}px`
                        : `${getPosition("")}px`,
                    "--x":
                      orientation === "horizontal"
                        ? `${getPosition("") + 5}px`
                        : `${20}px`,
                    "--transform":
                      orientation === "horizontal" ? `translateX(-50%)` : "",
                  } as React.CSSProperties
                }
              >
                Fecha desconocida
              </p>
            )}
          </div>

          <div className="claimList">
            {nodes.map((n, i) => (
              <div className="claim">
                <h2 id={`claim-${i}`}>
                  Afirmación <strong> #{i + 1}</strong> sobre{" "}
                  <strong className="emphasisText"> {n.categoryRaw}</strong>
                </h2>

                <div className="claimWrapper">
                  <div className="verificationWrapper">
                    <img src={getAvatar(n.verification)}></img>

                    <p>
                      <strong>{n.verificationRaw}</strong>
                    </p>
                  </div>

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

                <p className="result">
                  {n.articleSubtitle} Para más detalles, revisa el{" "}
                  <a href={n.url} rel="noreferrer" target="_blank">
                    artículo de verificación.
                  </a>
                </p>
              </div>
            ))}
          </div>

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
    </>
  );
}

export default App;
