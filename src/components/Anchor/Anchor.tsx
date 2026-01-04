type AnchorProps = {
  href: string;
  children?: React.ReactNode;
};

import css from "./Anchor.module.css";

function Anchor({ href, children }: AnchorProps) {
  return (
    <a className={css.root} href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}

export default Anchor;
