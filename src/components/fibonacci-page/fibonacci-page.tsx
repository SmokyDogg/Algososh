import React, { ChangeEvent, useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { delay } from "../../utils/utils";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import "./fibonacci-page.css";
import { getFibonacciNumbers } from "./utils";

export const FibonacciPage: React.FC = () => {
  const [number, setNumber] = useState<number>(0);
  const [arr, setArr] = useState<Array<number>>();
  const [loading, setLoading] = useState(false);
  const MAX_FIB = 19;
  const MIN_FIB = 1;

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNumber(Number(e.target.value));
  };

  const onClick = () => {
    fibonacciFunction(number);
  };

  const fibonacciFunction = async (inputValue: number) => {
    setLoading(true);
    await delay(SHORT_DELAY_IN_MS);
    const arr = getFibonacciNumbers(Number(inputValue));
    for (let i = 0; i <= arr.length; i++) {
      await delay(SHORT_DELAY_IN_MS);
      setArr(arr.slice(0,i));
    }
    setLoading(false);
    setNumber(0);
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <section className="sectionfib">
        <Input maxLength={MAX_FIB} value={number !== 0? `${number}` : ''} onChange={onChange} isLimitText ={true} min={MIN_FIB} max={MAX_FIB} type="number"/>
        <Button
          text="Рассчитать"
          linkedList={"small"}
          onClick={onClick}
          isLoader={loading}
          disabled={number > 0 && number <= MAX_FIB ? false: true}
        />
      </section>
      <ul className="listfib">
        {arr &&
          arr?.map((item, index) => {
            return (
              <li className="" key={index}>
                <Circle letter={String(item)} index={index} />
              </li>
            );
          })}
      </ul>
    </SolutionLayout>
  );
};
