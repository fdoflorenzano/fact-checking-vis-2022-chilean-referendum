import clsx from "clsx";
import { Separator } from "@radix-ui/react-separator";

import type { Claim } from "../../types/claims";

type UnitChartProps = {
  verificationGroups: Record<string, Claim[]>;
  sourceGroups: [string, Claim[]][];
  preferenceGroups: Record<string, Claim[]>;
  total: number;
  onScroll: (id: string) => void;
};

import Avatar from "../Avatar";
import VerificationTooltip from "../VerificationTooltip";
import SmallTooltip from "../SmallTooltip";
import ClaimTooltip from "../ClaimTooltip";
import SimpleTooltip from "../SimpleTooltip";

import { toPercentage } from "../../util/number";
import { rawVerificationMap } from "../../constants/verifications";
import { rawSourceMap, sourceExplainers } from "../../constants/sources";
import {
  preferenceExplainers,
  rawPreferenceMap,
} from "../../constants/preferences";

import css from "./UnitChart.module.css";

function UnitChart({
  verificationGroups,
  sourceGroups,
  preferenceGroups,
  total,
  onScroll,
}: UnitChartProps) {
  return (
    <div className={css.root}>
      <div className={css.chart} id="verificationVis">
        <p>Resultado de verificación</p>

        <div className={css.groups}>
          {Object.entries(verificationGroups).map(([value, claims]) => (
            <div className={css.group}>
              <p>
                <VerificationTooltip verification={value}>
                  <span>{rawVerificationMap[value]}</span>
                </VerificationTooltip>{" "}
                <SmallTooltip content={`${claims.length} de ${total}`}>
                  <strong>{toPercentage(claims.length, total)}%</strong>
                </SmallTooltip>
              </p>

              <div className={css.dots}>
                {claims.map((claim) => (
                  <ClaimTooltip key={claim.index} claim={claim}>
                    <div
                      className={clsx(css.claim, `claim-${claim.index}`)}
                      onMouseOver={() => {
                        const elements = document.querySelectorAll(
                          `.claim-${claim.index}`
                        );
                        elements.forEach((el) => {
                          el.className = `${el.className} ${css.selected}`;
                        });
                      }}
                      onMouseOut={() => {
                        const elements = document.querySelectorAll(
                          `.claim-${claim.index}`
                        );
                        elements.forEach((el) => {
                          el.className = el.className.replaceAll(
                            ` ${css.selected}`,
                            ""
                          );
                        });
                      }}
                      onClick={() => {
                        const div = document.getElementById(
                          `claim-${claim.index}`
                        );
                        window.scrollTo({
                          top:
                            (div?.getBoundingClientRect().top ?? 0) +
                            window.scrollY,
                          behavior: "smooth",
                        });
                        onScroll("verificationVis");
                      }}
                    >
                      <Avatar verification={claim.verification} />
                    </div>
                  </ClaimTooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className={css.separator} />

      <div className={css.chart} id="sourceVis">
        <p>Fuente de afirmación</p>
        <div className={css.groups}>
          {sourceGroups.map(([value, claims]) => (
            <div className={css.group}>
              <p>
                <SimpleTooltip
                  content={
                    <span>
                      <strong>{rawSourceMap[value]}</strong>:{" "}
                      {sourceExplainers[value]}
                    </span>
                  }
                >
                  <span>{rawSourceMap[value]}</span>
                </SimpleTooltip>{" "}
                <SmallTooltip content={`${claims.length} de ${total}`}>
                  <strong>{toPercentage(claims.length, total)}%</strong>
                </SmallTooltip>
              </p>

              <div className={css.dots}>
                {claims.map((claim) => (
                  <ClaimTooltip claim={claim}>
                    <div
                      className={clsx(css.claim, `claim-${claim.index}`)}
                      onMouseOver={() => {
                        const elements = document.querySelectorAll(
                          `.claim-${claim.index}`
                        );
                        elements.forEach((el) => {
                          el.className = `${el.className} ${css.selected}`;
                        });
                      }}
                      onMouseOut={() => {
                        const elements = document.querySelectorAll(
                          `.claim-${claim.index}`
                        );
                        elements.forEach((el) => {
                          el.className = el.className.replaceAll(
                            ` ${css.selected}`,
                            ""
                          );
                        });
                      }}
                      onClick={() => {
                        const div = document.getElementById(
                          `claim-${claim.index}`
                        );
                        window.scrollTo({
                          top:
                            (div?.getBoundingClientRect().top ?? 0) +
                            window.scrollY,
                          behavior: "smooth",
                        });
                        onScroll("sourceVis");
                      }}
                    >
                      <Avatar verification={claim.verification} />
                    </div>
                  </ClaimTooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className={css.separator} />

      <div className={css.chart} id="preferenceVis">
        <p>Preferencia plebiscito</p>
        <div className={css.groups}>
          {Object.entries(preferenceGroups).map(([value, claims]) => (
            <div className={css.group}>
              <p>
                <SimpleTooltip
                  content={
                    <span>
                      <strong>{rawPreferenceMap[value]}</strong>:{" "}
                      {preferenceExplainers[value]}
                    </span>
                  }
                >
                  <span>{rawPreferenceMap[value]}</span>
                </SimpleTooltip>{" "}
                <SmallTooltip content={`${claims.length} de ${total}`}>
                  <strong>{toPercentage(claims.length, total)}%</strong>
                </SmallTooltip>
              </p>

              <div className={css.dots}>
                {claims.map((claim) => (
                  <ClaimTooltip claim={claim}>
                    <div
                      className={clsx(css.claim, `claim-${claim.index}`)}
                      onMouseOver={() => {
                        const elements = document.querySelectorAll(
                          `.claim-${claim.index}`
                        );
                        elements.forEach((el) => {
                          el.className = `${el.className} ${css.selected}`;
                        });
                      }}
                      onMouseOut={() => {
                        const elements = document.querySelectorAll(
                          `.claim-${claim.index}`
                        );
                        elements.forEach((el) => {
                          el.className = el.className.replaceAll(
                            ` ${css.selected}`,
                            ""
                          );
                        });
                      }}
                      onClick={() => {
                        const div = document.getElementById(
                          `claim-${claim.index}`
                        );
                        window.scrollTo({
                          top:
                            (div?.getBoundingClientRect().top ?? 0) +
                            window.scrollY,
                          behavior: "smooth",
                        });
                        onScroll("preferenceVis");
                      }}
                    >
                      <Avatar verification={claim.verification} />
                    </div>
                  </ClaimTooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UnitChart;
