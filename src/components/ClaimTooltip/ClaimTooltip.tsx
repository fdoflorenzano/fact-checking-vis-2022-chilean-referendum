import * as Tooltip from "@radix-ui/react-tooltip";

import type { Claim } from "../../types/claims";

type ClaimTooltipProps = {
  claim: Claim;
  children?: React.ReactNode;
};

import Avatar from "../Avatar";

import { rawSourceMap } from "../../constants/sources";
import { getSource } from "../../util/general";
import { parseTime, readableTime } from "../../util/time";
import { rawPreferenceMap } from "../../constants/preferences";

import css from "./ClaimTooltip.module.css";

function ClaimTooltip({ claim, children }: ClaimTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={css.root} sideOffset={8} side="top">
          <div className={css.wrapper}>
            <Avatar className={css.avatar} verification={claim.verification} />

            <span>
              <strong>{claim.verificationRaw}</strong>
            </span>
          </div>

          <div className={css.text}>
            <div>
              <p>
                Afirmación <strong>#{claim.index + 1}</strong> sobre{" "}
                <strong className="emphasisText"> {claim.categoryRaw}</strong>{" "}
              </p>
              <p className={css.source}>
                {rawSourceMap[getSource(claim)]} (
                {claim.date == null
                  ? "fecha desconocida"
                  : readableTime(parseTime(claim.date!)!)}
                ) - Opción {rawPreferenceMap[claim.preference]}
              </p>
            </div>

            <p className={css.instruction}>
              Haz clic para revisar verificación.
            </p>
          </div>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default ClaimTooltip;
