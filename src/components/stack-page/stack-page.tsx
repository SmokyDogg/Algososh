import React, { ChangeEvent, useRef, useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { delay } from "../../utils/utils";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Stack } from "./utils";

import styles from "./stack-page.module.css";
import { MAX_LENGTH_ELEMENTS } from "../../constants/constant-elements";

export const StackPage: React.FC = () => {
  const [string, setString] = useState("");
  const [arr, setArr] = useState<string[]>([]);
  const stack = useRef<Stack<string>>(new Stack());
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState({
    add: false,
    delete: false,
    clear: false,
  });
  const [actionElementIndex, setActionElementIndex] = useState(-1);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setString(e.target.value);
  };

  const onClickPush = async () => {
    setLoading({ ...loading, add: true });
    setDisabled(true);
    stack.current.push(string);
    setArr(stack.current.toArray);
    setString("");
    setActionElementIndex(stack.current.size - 1);
    await delay(SHORT_DELAY_IN_MS);
    setActionElementIndex(-1);
    setLoading({ ...loading, add: false });
    setDisabled(false);
  };

  const onClickClear = async () => {
    setLoading({ ...loading, clear: true });
    setDisabled(true);
    await delay(SHORT_DELAY_IN_MS);
    stack.current.clear();
    setArr([]);
    setDisabled(false);
    setLoading({ ...loading, clear: false });
  };

  const onClickPop = async () => {
    setLoading({ ...loading, delete: true });
    setDisabled(true);
    setActionElementIndex(stack.current.size - 1);
    await delay(SHORT_DELAY_IN_MS);
    stack.current.pop();
    setArr(stack.current.toArray);
    setActionElementIndex(-1);
    setLoading({ ...loading, delete: false });
    setDisabled(false);
  };

  return (
    <SolutionLayout title="Стек">
      <section className={styles.section}>
        <Input
          maxLength={MAX_LENGTH_ELEMENTS}
          value={string}
          onChange={onChange}
          type="text"
          isLimitText={true}
          extraClass={styles.input}
        />
        <Button
          text="Добавить"
          linkedList={"small"}
          onClick={() => {
            onClickPush();
          }}
          isLoader={loading.add}
          disabled={!string}
          extraClass={styles.button}
        />
        <Button
          text="Удалить"
          linkedList={"small"}
          onClick={() => {
            onClickPop();
          }}
          isLoader={loading.delete}
          disabled={disabled || arr.length === 0}
          extraClass={styles.button}
        />
        <Button
          text="Очистить"
          linkedList={"small"}
          onClick={() => {
            onClickClear();
          }}
          type="reset"
          isLoader={loading.clear}
          disabled={disabled || arr.length === 0}
          extraClass={styles.button}
        />
      </section>
      <ul className={styles.list}>
        {arr &&
          arr?.map((item, index) => {
            return (
              <li className={styles.list_item} key={index}>
                <Circle
                  letter={item}
                  state={
                    index === actionElementIndex
                      ? ElementStates.Changing
                      : ElementStates.Default
                  }
                  head={index === arr?.length - 1 ? "top" : undefined}
                  index={index}
                />
              </li>
            );
          })}
      </ul>
    </SolutionLayout>
  );
};
