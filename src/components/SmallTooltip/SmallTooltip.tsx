import * as Tooltip from "@radix-ui/react-tooltip";

type SmallTooltipProps = {
  content: string;
  children?: React.ReactNode;
};

import css from "./SmallTooltip.module.css";

function SmallTooltip({ content, children }: SmallTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={css.root} sideOffset={8} side="top">
          <p>{content}</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default SmallTooltip;
