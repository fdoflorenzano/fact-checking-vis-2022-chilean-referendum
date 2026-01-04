import * as Tooltip from "@radix-ui/react-tooltip";

type SimpleTooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
};

import css from "./SimpleTooltip.module.css";

function SimpleTooltip({ content, children }: SimpleTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={css.root} sideOffset={8} side="top">
          <div className={css.text}>
            <p className={css.explainer}>{content}</p>
          </div>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default SimpleTooltip;
