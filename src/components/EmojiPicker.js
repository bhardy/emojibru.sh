import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import css from "./EmojiPicker.module.css";

const EmojiPicker = ({ handleEmojiSelect, handleClickOutside, edit }) => {
  return (
    <div
      className={cx(css.container, {
        [css.edit]: edit,
      })}
    >
      <Picker
        data={data}
        set="native"
        // @todo find out what this prop is now
        title="Pick your paint…"
        previewEmoji="point_up_2"
        onEmojiSelect={(emoji) => handleEmojiSelect?.({ paint: emoji.native })}
        onClickOutside={handleClickOutside}
        emojiButtonColors={['var(--color2)']}
        theme="light"
      />
    </div>
  );
};

EmojiPicker.propTypes = {
  handleEmojiSelect: PropTypes.func,
  handleClickOutside: PropTypes.func,
  edit: PropTypes.bool,
};

EmojiPicker.defaultProps = {
  edit: false,
};

export default EmojiPicker;
