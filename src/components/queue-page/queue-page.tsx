import React, { ChangeEvent, useRef, useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { delay } from "../../utils/utils";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Queue } from "./utils";
import styles from "./queue-page.module.css";
import { MAX_LENGTH_ELEMENTS } from "../../constants/constant-elements";


export const QueuePage: React.FC = () => {
  const queue_length = 7;
  const [string, setString] = useState("");
  const queue = useRef<Queue<string>>(new Queue(queue_length));
  const [arr, setArr] = useState<(string | null)[]>(
    new Array(queue_length).fill(null)
  );
  const [disabled, setDisabled] = useState(false);
  const [actionElementIndex, setActionElementIndex] = useState(-1);
  const [loading, setLoading] = useState({
    add: false,
    delete: false,
    clear: false,
  });

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setString(e.currentTarget.value);
    setDisabled(true);
  };

  const onClickEnqueue = async () => {
    setLoading({ ...loading, add: true });
    setActionElementIndex(queue.current.getTail);
    queue.current.enqueue(string);
    setArr(queue.current.toArray());
    await delay(SHORT_DELAY_IN_MS);
    setString("");
    setActionElementIndex(-1);
    setLoading({ ...loading, add: false });
    setDisabled(false);
  };

  const onClickDequeue = async () => {
    setLoading({ ...loading, delete: true });
    setDisabled(true);
    setActionElementIndex(queue.current.getHead);
    await delay(SHORT_DELAY_IN_MS);
    queue.current.dequeue();
    setActionElementIndex(-1);
    setLoading({ ...loading, delete: false });
    setDisabled(false);
  };

  const onClickClear = async () => {
    setLoading({ ...loading, clear: true });
    setDisabled(true);
    await delay(SHORT_DELAY_IN_MS);
    queue.current.clear();
    setArr(new Array(queue_length).fill(null));
    setDisabled(false);
    setLoading({ ...loading, clear: false });
  };

  return (
    <SolutionLayout title="Очередь">
      <section className={styles.section}>
        <Input
          maxLength={MAX_LENGTH_ELEMENTS}
          value={string}
          onChange={onChangeValue}
          type="text"
          isLimitText={true}
          extraClass={styles.input}
        />
        <Button
          text="Добавить"
          linkedList={"small"}
          onClick={() => {
            onClickEnqueue();
          }}
          isLoader={loading.add}
          disabled={!string || queue.current.isFull()}
          extraClass={styles.button}
        />
        <Button
          text="Удалить"
          linkedList={"small"}
          onClick={() => {
            onClickDequeue();
          }}
          isLoader={loading.delete}
          disabled={disabled || queue.current.isEmpty()}
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
          disabled={disabled || queue.current.getTail() === 0}
          extraClass={styles.button}
        />
      </section>
      <ul className={styles.list}>
        {arr &&
          arr?.map((item, index) => {
            return (
              <li className={styles.list_item} key={index}>
                <Circle
                  letter={item ? item : ""}
                  state={
                    index === actionElementIndex
                      ? ElementStates.Changing
                      : ElementStates.Default
                  }
                  head={
                    (index === queue.current.getHead() &&
                      !queue.current.isEmpty()) ||
                    (index === queue.current.getHead() &&
                      queue.current.getHead() === queue.current.getSize() - 1)
                      ? "head"
                      : ""
                  }
                  tail={
                    index === queue.current.getTail() &&
                    !queue.current.isEmpty()
                      ? "tail"
                      : ""
                  }
                  index={index}
                />
              </li>
            );
          })}
      </ul>
    </SolutionLayout>
  );
};
