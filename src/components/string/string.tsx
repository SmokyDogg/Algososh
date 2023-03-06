import React, { ChangeEvent, useState } from "react";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Circle } from "../ui/circle/circle";
import styles from "./string-page.module.css";
import { ElementStates } from "../../types/element-states";
import { DELAY_IN_MS } from "../../constants/delays";
import { delay, swap, TArray } from "../../utils/utils";

export const StringComponent: React.FC = () => {
  const [string, setString] = useState("");
  const [arr, setArr] = useState<Array<TArray>>([]);
  const [loading, setLoading] = useState(false);

  const MAX_LENGTH_ELEMENT = 11;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setString(e.target.value);
  };

  const onClick = () => {
    const array = string
      .split("")
      .map((value) => ({ value, color: ElementStates.Default }));
    reverse(array);
  };

  const reverse = async (array: TArray[]) => {
    setLoading(true);
    const mid = Math.ceil(array.length / 2);
    for (let i = 0; i < mid; i++) {
      let j = array.length - 1 - i;
      if (array.length === 1) {
        array[i].color = ElementStates.Modified;
      } else if (i < j) {
        array[i].color = ElementStates.Changing;
        array[j].color = ElementStates.Changing;
        setArr([...array]);
        swap(array, i, j);
        await delay(DELAY_IN_MS);
      }
      array[i].color = ElementStates.Modified;
      array[j].color = ElementStates.Modified;
      setArr([...array]);
    }
    setLoading(false);
  };

  return (
    <SolutionLayout title="Строка">
      <section className={styles.section}>
        <Input
          maxLength={MAX_LENGTH_ELEMENT}
          value={string}
          onChange={onChange}
          type="text"
          isLimitText={true}
        />
        <Button
          text="Развернуть"
          linkedList={"small"}
          onClick={onClick}
          isLoader={loading}
          disabled={!string}
        />
      </section>
      <ul className={styles.list}>
        {arr &&
          arr?.map((item, index) => {
            return (
              <li className="" key={index}>
                <Circle letter={item.value} state={item.color} />
              </li>
            );
          })}
      </ul>
    </SolutionLayout>
  );
};
