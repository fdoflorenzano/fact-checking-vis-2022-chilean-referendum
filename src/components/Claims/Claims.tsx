import Anchor from "../Anchor";
import Avatar from "../Avatar";
import VerificationTooltip from "../VerificationTooltip";

import { rawSourceMap } from "../../constants/sources";
import { parseTime, readableTime } from "../../util/time";
import { getSource } from "../../util/general";

import type { Claim } from "../../types/claims";

type ClaimsProps = {
  claims: Claim[];
};

import css from "./Claims.module.css";

function Claims({ claims }: ClaimsProps) {
  return (
    <div className={css.root}>
      {claims.map((claim) => (
        <div className={css.claim} key={`claim-${claim.index}`}>
          <div className={css.header}>
            <h2 id={`claim-${claim.index}`}>
              Afirmación <strong> #{claim.index + 1}</strong> sobre{" "}
              <strong className="emphasisText">{claim.categoryRaw}</strong>
            </h2>

            <div className={css.claimWrapper}>
              <VerificationTooltip verification={claim.verification}>
                <div className={css.verificationWrapper}>
                  <Avatar verification={claim.verification} />

                  <p>
                    <strong>{claim.verificationRaw}</strong>
                  </p>
                </div>
              </VerificationTooltip>

              <div className={css.textWrapper}>
                <blockquote>{claim.claim}</blockquote>
                <p className={css.source}>
                  {rawSourceMap[getSource(claim)]} (
                  {claim.date == null
                    ? "fecha desconocida"
                    : readableTime(parseTime(claim.date!)!)}
                  )
                </p>
              </div>
            </div>
          </div>

          <div className={css.result}>
            <p className={css.resultHeader}>
              <strong>Análisis de fackchecking.cl</strong>
            </p>
            <p>
              {claim.articleResult} Para más detalles, revisa el{" "}
              <Anchor href={claim.url}>artículo de verificación.</Anchor>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Claims;
