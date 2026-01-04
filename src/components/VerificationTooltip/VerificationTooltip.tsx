import * as Tooltip from "@radix-ui/react-tooltip";

import Avatar from "../Avatar";

type VerificationTooltipProps = {
  verification: string;
  children?: React.ReactNode;
};

import {
  rawVerificationMap,
  verificationExplainers,
} from "../../constants/verifications";

import css from "./VerificationTooltip.module.css";

function VerificationTooltip({
  verification,
  children,
}: VerificationTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={css.root} sideOffset={8} side="top">
          <div className={css.wrapper}>
            <Avatar className={css.avatar} verification={verification} />
          </div>
          <div className={css.text}>
            <p className={css.explainer}>
              <strong>{rawVerificationMap[verification]}</strong>:{" "}
              {verificationExplainers[verification]}
            </p>
          </div>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default VerificationTooltip;
