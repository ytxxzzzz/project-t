import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import * as _ from "lodash";

/* 入力フォームを出力する「Inputコンポーネント」 */
interface InputProps {
  defaultValue?: string
  value?: string
  name: string
  handleChange?(e: React.FormEvent<HTMLInputElement>): void
}
export const Input: React.StatelessComponent<InputProps> = (props) => {
  return (
    <input type="text"
      defaultValue={props.defaultValue?props.defaultValue : undefined}
      name={props.name} 
      value={props.value?props.value : undefined} 
      onChange={props.handleChange} />
  )
}

/* ボタンを出力する「Buttonコンポーネント」 */
interface ButtonProps {
  caption: string
  handleClick(): void
}
export const Button: React.StatelessComponent<ButtonProps> = (props) => {
  const style = {
    "minWidth": "64px",
    "lineHeight": "32px",
    "borderRadius": "4px",
    "border": "none",
    "padding": "0 16px",
    "color": "#fff",
    "background": "#4CAF50",
    "cursor": "pointer",
  };
  return (
    <button style={style} onClick={props.handleClick}>{props.caption}</button>
  )
}

/* テキストを出力する「Outputコンポーネント」 */
interface OutputProps {
  value: string
}
export const Output: React.StatelessComponent<OutputProps> = (props) => {
  return (
    <div>{props.value}</div>
  )
}
