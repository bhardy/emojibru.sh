import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import css from "./EmojiPicker.module.css";

const EmojiPicker = ({ updateTool, edit }) => {
  return (
    <div
      className={cx(css.container, {
        [css.edit]: edit,
      })}
    >
      <Picker
        data={data}
        set="native"
        title="Pick your paint…"
        previewEmoji="point_up_2"
        onEmojiSelect={(emoji) => updateTool({ paint: emoji.native })}
        emojiButtonColors={['var(--color2)']}
        theme="light"
        style={{
          "--border-radius": 0,
        }}
      />
    </div>
  );
};

EmojiPicker.propTypes = {
  updateTool: PropTypes.func.isRequired,
  edit: PropTypes.bool,
};

EmojiPicker.defaultProps = {
  edit: false,
};

export default EmojiPicker;
