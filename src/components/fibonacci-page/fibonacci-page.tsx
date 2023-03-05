import React, { ChangeEvent, useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { delay } from "../../utils/utils";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import "./fibonacci-page.css";

export const FibonacciPage: React.FC = () => {
  const [number, setNumber] = useState("");
  const [arr, setArr] = useState<Array<number>>();
  const [loading, setLoading] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNumber(e.target.value);
  };

  const onClick = () => {
    fibonacciFunction(number);
  };

  const fibonacci = (n: number): number[] => {
    let arr: number[] = [1,1];
    for (let i = 2; i < n + 1; i++) {
      arr.push(arr[i - 2] + arr[i - 1]);
    }
    return arr;
  };

  const fibonacciFunction = async (inputValue: string) => {
    setLoading(true);
    await delay(SHORT_DELAY_IN_MS);
    const arr = fibonacci(Number(inputValue));
    for (let i = 0; i <= arr.length; i++) {
      await delay(SHORT_DELAY_IN_MS);
      setArr(arr.slice(0,i));
    }
    setLoading(false);
    setNumber("");
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <section className="sectionfib">
        <Input maxLength={19} value={number} onChange={onChange} isLimitText ={true} max={19} type="number"/>
        <Button
          text="Рассчитать"
          linkedList={"small"}
          onClick={onClick}
          isLoader={loading}
          disabled={!number}
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
