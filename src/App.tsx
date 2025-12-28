import { useCallback, useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as d3 from "d3";
import { useWindowSize } from "@uidotdev/usehooks";

import data from "../data/extended-facts-verified.json";

import "./App.css";

interface Node extends d3.SimulationNodeDatum {
  fact: string;
  verification: string;
  verificationRaw: string;
  articleSubtitle: string;
  url: string;
}

const rawVerificationMap: Record<string, string> = {
  true: "Verdadero",
  inaccurate: "Impreciso",
  misleading: "Engañoso",
  creative: "Se puso creativ@",
  false: "Falso",
};

const [DEFAULT_WIDTH, DEFAULT_HEIGHT] = [800, 400];
const RADIUS = 10;
const MAX_APP_WIDTH = 1280;
const MIN_APP_WIDTH = 320;
const APP_X_PADDING = 0;

const baseData = data.map((d) => ({
  ...d,
  x: DEFAULT_WIDTH / 2,
  y: DEFAULT_HEIGHT / 2,
}));

const colorScale = d3.schemeRdYlBu[5];
const values = ["false", "creative", "misleading", "inaccurate", "true"];
const getColor = (v: string) => {
  const index = values.indexOf(v);
  return index > -1 ? colorScale[index] : "black";
};
const getAvatar = (v: string) => {
  const index = values.indexOf(v);
  return index > -1
    ? `https://factchecking.cl/wp-content/themes/gauge-child/lib/images/faces/${
        5 - index
      }.png`
    : "";
};

function App() {
  const [nodes, setNodes] = useState<Node[]>(baseData);

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

  // console.log(size.width, size.height, dimensions.width, dimensions.height);
  console.log({ nodes: [...nodes] });

  const positionScale =
    orientation === "horizontal"
      ? d3.scaleBand(values, [dimensions.width, 0]).padding(0.3)
      : d3.scaleBand(values, [dimensions.height, 0]).padding(0.3);
  const getPosition = useCallback(
    (v: string) => (positionScale(v) ?? 0) + positionScale.bandwidth() / 2,
    [positionScale]
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
            ? d3.forceX((d: Node) => getPosition(d.verification)).strength(0.1)
            : d3.forceX(dimensions.width * 0.6).strength(0.05)
        )
        .force(
          "forceY",
          orientation === "horizontal"
            ? d3.forceY(dimensions.height * 0.6).strength(0.05)
            : d3.forceY((d: Node) => getPosition(d.verification)).strength(0.1)
        )
        .force("collision", d3.forceCollide(RADIUS * 1.2))
        .on("tick", () => {
          // console.log("tick", simulation.current?.alpha());
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
    ]
  );

  useEffect(() => {
    if (dimensions.width != sizeRef.current.width) {
      simulation.current?.stop();

      simulation.current = getSimulation();

      console.log("useEffect");

      // simulation.current.restart();
    }

    sizeRef.current = {
      width: dimensions.width,
      height: dimensions.height,
    };
  }, [dimensions.width, dimensions.height, getSimulation]);

  return (
    <>
      <h1 style={{ maxWidth: "18ch" }}>
        Verificaciones de Plebiscito de Salida 2022
      </h1>
      <div className="card">
        <p>
          Verificationes realizadas por{" "}
          <a href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/">
            Factchecking.cl
          </a>
          .
        </p>
      </div>

      <div
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: "relative",
          marginTop: "100px",
          overflow: "hidden",
        }}
      >
        {nodes.map((v) => (
          <Tooltip.Provider delayDuration={0} key={v.fact}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div
                  style={{
                    position: "absolute",
                    top: `${v.y ?? 0 - RADIUS}px`,
                    left: `${v.x ?? 0 - RADIUS}px`,
                    width: `${RADIUS * 2}px`,
                    height: `${RADIUS * 2}px`,
                    backgroundColor: getColor(v.verification),
                    borderRadius: "50%",
                  }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  style={{
                    width: "500px",
                    backgroundColor: "#111",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  sideOffset={10}
                  side="right"
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
                    <strong>{v.verificationRaw} </strong>
                    <img
                      style={{ width: "30px", height: "30px" }}
                      src={getAvatar(v.verification)}
                    ></img>
                  </p>

                  <p>{v.articleSubtitle}</p>
                  <p>
                    <a href={v.url} rel="noreferrer" target="_blank">
                      Fuente
                    </a>
                  </p>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}

        {values.map((v) => (
          <p
            key={"veri-" + v}
            style={{
              backgroundColor: getColor(v),
              color: "black",
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "end",
              marginTop: "-20px",
              padding: "3px",
              borderRadius: "5px",
              fontSize: "12px",
              position: "absolute",
              top:
                orientation === "horizontal"
                  ? `${20}px`
                  : `${getPosition(v)}px`,
              left:
                orientation === "horizontal"
                  ? `${getPosition(v)}px`
                  : `${20}px`,
              transform: orientation === "horizontal" ? `translateX(-50%)` : "",
            }}
          >
            <strong>{rawVerificationMap[v]} </strong>
            <img
              style={{ width: "30px", height: "30px" }}
              src={getAvatar(v)}
            ></img>
          </p>
        ))}
      </div>
    </>
  );
}

export default App;
