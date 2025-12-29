import { useCallback, useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as d3 from "d3";
import { useWindowSize } from "@uidotdev/usehooks";

import data from "../data/extended-facts-verified.json";

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
}
type Scale = "verification" | "source" | "time";

const [DEFAULT_WIDTH, DEFAULT_HEIGHT] = [1200, 400];
const RADIUS = 10;
const MAX_APP_WIDTH = 1280;
const MIN_APP_WIDTH = 320;
const APP_X_PADDING = 0;

const parseTime = d3.utcParse("%Y.%m.%d");
const formatTime = d3.utcFormat("%Y.%m.%d");
const baseData = data.map((d) => ({
  ...d,
  x: DEFAULT_WIDTH / 2,
  y: DEFAULT_HEIGHT / 2,
}));

const colorScale = d3.schemeRdYlBu[5];
const verificationValues = [
  "false",
  "creative",
  "misleading",
  "inaccurate",
  "true",
];
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

const getColor = (v: string) => {
  const index = verificationValues.indexOf(v);
  return index > -1 ? colorScale[index] : "black";
};
const getAvatar = (v: string) => {
  const index = verificationValues.indexOf(v);
  return index > -1
    ? `https://factchecking.cl/wp-content/themes/gauge-child/lib/images/faces/${
        5 - index
      }.png`
    : "";
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
        .force("collision", d3.forceCollide(RADIUS * 1.5))
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
      <h1 className="title">Verificaciones de Plebiscito de Salida 2022</h1>

      <p>
        Verificationes realizadas por{" "}
        <a
          href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/"
          rel="noreferrer"
          target="_blank"
        >
          Factchecking.cl
        </a>
        .
      </p>

      <select value={scale} onChange={(e) => setScale(e.target.value as Scale)}>
        <option value="verification">Verificaciones</option>
        <option value="source">Fuente</option>
        <option value="time">Fecha de publicación</option>
      </select>

      <div
        className="visualizationWrapper"
        style={
          {
            "--height": `${dimensions.height}px`,
          } as React.CSSProperties
        }
      >
        {nodes.map((v) => (
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
                      "--fill": getColor(v.verification),
                    } as React.CSSProperties
                  }
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="tooltipContent"
                  sideOffset={10}
                  side="bottom"
                >
                  <blockquote>
                    <p>{v.fact}</p>
                  </blockquote>

                  <p
                    style={{
                      backgroundColor: getColor(v.verification),
                      color: "black",
                      display: "inline-flex",
                      alignItems: "center",
                      alignSelf: "end",
                      marginTop: "-20px",
                      padding: "3px",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    <strong>{v.verificationRaw}</strong>
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={getAvatar(v.verification)}
                    ></img>
                  </p>

                  <p>{v.articleSubtitle}</p>
                  <p>{v.date == null ? "Fecha desconocida" : v.date}</p>
                  <p>
                    {v.source?.medium ?? v.source?.platform} -
                    <a href={v.url} rel="noreferrer" target="_blank">
                      Fuente
                    </a>
                  </p>
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
                  "--fill": getColor(v),
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

      <p>
        Creado por{" "}
        <a
          href="https://github.com/fdoflorenzano"
          rel="noreferrer"
          target="_blank"
        >
          @fdoflorenzano
        </a>
        .
      </p>
    </>
  );
}

export default App;
