import React from "react";
import cx from "classnames";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Tool } from "@/types";
import css from "./EmojiPicker.module.css";

interface EmojiPickerProps {
  handleEmojiSelect: (update: Partial<Tool>) => void;
  handleClickOutside: (e: MouseEvent) => void;
  edit?: boolean;
}

interface EmojiObject {
  native: string;
  [key: string]: any;
}

const EmojiPicker = ({ handleEmojiSelect, handleClickOutside, edit = false }: EmojiPickerProps) => {
  return (
    <div
      className={cx(css.container, css.emojiPicker, {
        [css.edit]: edit,
      })}
    >
      <Picker
        data={data}
        set="native"
        title="Pick your paint…"
        previewEmoji="point_up_2"
        onEmojiSelect={(emoji: EmojiObject) => handleEmojiSelect({ paint: emoji.native })}
        onClickOutside={handleClickOutside}
        emojiButtonColors={['var(--color2)']}
        theme="light"
      />
    </div>
  );
};

export default EmojiPicker;
