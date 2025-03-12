import React from "react";
import useStore from "../store/store";
import css from "./History.module.css";

const Clear = () => {
  const handleClear = useStore((state) => state.resetPainting)

  return (
    <div className={css.tool}>
      <button type="button" onClick={handleClear} className={css.button}>
        <span className={css.buttonLayout}>
          <span className={css.icon} role="img" aria-label="Clear">
            🧨
          </span>
          <span className={css.title}>Clear</span>
        </span>
      </button>
    </div>
  );
};

export default Clear;
