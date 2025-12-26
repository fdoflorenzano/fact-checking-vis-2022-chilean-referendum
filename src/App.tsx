import { useMemo, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as d3 from "d3";

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

const [WIDTH, HEIGHT] = [1000, 500];
const RADIUS = 10;

const baseData = data.map((d) => ({ ...d, x: WIDTH / 2, y: HEIGHT / 2 }));

function App() {
  const [nodes, setNodes] = useState<Node[]>(baseData);

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

  const x = d3.scaleBand(values, [WIDTH, 0]).padding(0.3);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  useMemo(() => {
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "forceX",
        d3
          .forceX((d: Node) => (x(d.verification) ?? 0) + x.bandwidth() / 2)
          .strength(0.05)
      )
      .alphaMin(0.02)
      .alphaTarget(0)
      .force("forceY", d3.forceY(200).strength(0.008))
      .force("collision", d3.forceCollide(RADIUS * 1.2))
      .on("tick", () => {
        setNodes(() =>
          [...nodes].map((n) => ({
            ...n,
            x: Math.max(RADIUS, Math.min(WIDTH - RADIUS, n.x ?? 0)),
            y: Math.max(RADIUS, Math.min(HEIGHT - RADIUS, n.y ?? 0)),
          }))
        );
      });

    return simulation;
  }, []);

  return (
    <>
      <h1 style={{ maxWidth: "30ch" }}>
        Fact checking of 2022 Chilean constitutional referendum{" "}
      </h1>
      <div className="card">
        <p>
          Verifications done by the{" "}
          <a href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/">
            fact checking team
          </a>
          .
        </p>

        <div
          style={{
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            position: "relative",
            marginTop: "100px",
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
                top: `${20}px`,
                left: `${(x(v) ?? 0) + x.bandwidth() / 2}px`,
                transform: `translateX(-40%)`,
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
      </div>
    </>
  );
}

export default App;
