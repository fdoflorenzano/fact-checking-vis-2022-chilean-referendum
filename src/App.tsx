import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

import type { Claim } from "./types/claims";

import BackToTopButton from "./components/BackToTopButton";
import Layout from "./components/Layout";
import Anchor from "./components/Anchor";
import Claims from "./components/Claims";

import { verificationValues } from "./constants/verifications";
import { sourceValues } from "./constants/sources";
import { preferenceValues } from "./constants/preferences";

import css from "./App.module.css";

import data from "../data/cleaned-claims.json";
import UnitChart from "./components/UnitChart";

const TOTAL_CLAIMS = data.length;

const verificationGroups: Record<string, Claim[]> = Object.fromEntries(
  verificationValues.map((value) => {
    return [value, data.filter((d) => d.verification === value)];
  })
);

const sourceGroups: [string, Claim[]][] = sourceValues.map((value) => {
  const claims = data.filter(
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

const preferenceGroups: Record<string, Claim[]> = Object.fromEntries(
  preferenceValues.map((value) => {
    const claims = data.filter((d) => d.preference === value);
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
  const [lastClick, setLastClick] = useState<string | null>(null);

  return (
    <Tooltip.Provider
      skipDelayDuration={0}
      delayDuration={0}
      disableHoverableContent={true}
    >
      <BackToTopButton
        itemToScrollId={lastClick}
        onScroll={() => setLastClick(null)}
      />

      <Layout end />

      <Layout withContainer className={css.titleWrapper}>
        <h1 className={css.title}>
          Verificaciones de <br /> Plebiscito de Salida 2022
        </h1>
      </Layout>

      <Layout withContainer>
        <p className={css.intro}>
          Las siguientes son las verificaciones, realizadas por el equipo de{" "}
          <Anchor href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/">
            Factchecking.cl
          </Anchor>
          , sobre afirmaciones que circularon diversas plataformas sobre el
          proceso constituyente meses antes del Plebiscito de Salida 2022. Se
          muestra la distribución de afirmaciones realizadas por el equipo
          agrupadas por resultado de verificación, fuente de afirmación y
          preferencia de opción con la cual se realizó tal afirmación. Esta
          página se experimenta de mejor manera en su versión de escritorio.
        </p>
      </Layout>

      <Layout withContainer>
        <UnitChart
          verificationGroups={verificationGroups}
          sourceGroups={sourceGroups}
          preferenceGroups={preferenceGroups}
          total={TOTAL_CLAIMS}
          onScroll={(id) => setLastClick(id)}
        />
      </Layout>

      <Layout withContainer>
        <Claims claims={data} />
      </Layout>

      <Layout withContainer>
        <p className={css.outtro}>
          Sitio creado por
          <Anchor href="https://github.com/fdoflorenzano">
            @fdoflorenzano
          </Anchor>
          . Todos los datos fueron extraidos de{" "}
          <Anchor href="https://factchecking.cl/plebiscito-de-salida-2022/verificaciones/">
            Factchecking.cl
          </Anchor>
          .
        </p>
      </Layout>

      <Layout end />
    </Tooltip.Provider>
  );
}

export default App;
