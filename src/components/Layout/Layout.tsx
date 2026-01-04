import clsx from "clsx";

type LayoutProps = {
  withContainer?: boolean;
  end?: boolean;
  className?: string;
  children?: React.ReactNode;
};

import css from "./Layout.module.css";

function Layout({ className, withContainer, end, children }: LayoutProps) {
  const classes = clsx(css.root, { [css.end]: end }, className);

  if (withContainer)
    return (
      <div className={classes}>
        <div className={css.container}>{children}</div>
      </div>
    );

  return <div className={classes}>{children}</div>;
}

export default Layout;
