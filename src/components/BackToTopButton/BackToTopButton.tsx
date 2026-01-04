import { useCallback } from "react";

import css from "./BackToTopButton.module.css";

type BackToTopButtonProps = {
  itemToScrollId: string | null;
  onScroll: (id: string | null) => void;
};

function BackToTopButton({ itemToScrollId, onScroll }: BackToTopButtonProps) {
  const scrollCallback = useCallback(() => {
    if (itemToScrollId) {
      const div = document.getElementById(itemToScrollId);

      window.scrollTo({
        top: (div?.getBoundingClientRect().top ?? 0) + window.scrollY,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    onScroll(null);
  }, [itemToScrollId, onScroll]);

  return (
    <button className={css.root} onClick={scrollCallback}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 34C18 35.1046 18.8954 36 20 36C21.1046 36 22 35.1046 22 34H20H18ZM21.4142 5.58579C20.6332 4.80474 19.3668 4.80474 18.5858 5.58579L5.85786 18.3137C5.07682 19.0948 5.07682 20.3611 5.85786 21.1421C6.63891 21.9232 7.90524 21.9232 8.68629 21.1421L20 9.82843L31.3137 21.1421C32.0948 21.9232 33.3611 21.9232 34.1421 21.1421C34.9232 20.3611 34.9232 19.0948 34.1421 18.3137L21.4142 5.58579ZM20 34H22V7H20H18V34H20Z"
          fill="white"
        />
      </svg>
    </button>
  );
}

export default BackToTopButton;
