import React, { ChangeEvent, useRef, useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { delay, randomNumber } from "../../utils/utils";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { LinkedList } from "./utils";

import styles from "./list-page.module.css";
import { MAX_LENGTH_ELEMENTS } from "../../constants/constant-elements";

enum Location {
  top = "top",
  bottom = "bottom",
}

type TElementStates = {
  modifiedIndex: number;
  changingIndex: number;
};

const MIN_LENGTH_ARR = 3;
const MAX_LENGTH_ARR = 6;
const MIN_VALUE_ELEMENT = 0;
const MAX_VALUE_ELEMENT = 99;

const randomArr = Array.from(
  { length: randomNumber(MIN_LENGTH_ARR, MAX_LENGTH_ARR) },
  () => String(randomNumber(MIN_VALUE_ELEMENT, MAX_VALUE_ELEMENT))
);

export const ListPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputIndex, setInputIndex] = useState<number | null>(null);
  const list = useRef(new LinkedList(randomArr));
  const [arr, setArr] = useState<string[]>(list.current.toArray());
  const [smallCircleIndex, setSmallCircleIndex] = useState(-1);
  const [smallCircleLocation, setSmallCircleLocation] = useState<
    Location | undefined
  >(undefined);
  const [typeElementStates, setTypeElementStates] = useState<TElementStates>({
    modifiedIndex: -1,
    changingIndex: -1,
  });
  const [currentElement, setCurrentElement] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState({
    loaderAddHead: false,
    loaderAddTail: false,
    loaderDeleteHead: false,
    loaderDeleteTail: false,
    loaderAddIndex: false,
    loaderDeleteIndex: false,
  });

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const onChangeIndex = (e: ChangeEvent<HTMLInputElement>) => {
    setInputIndex(Number(e.target.value));
  };

  const onClickAddHead = async () => {
    setLoading({ ...loading, loaderAddHead: true });
    setCurrentElement(inputValue);
    setSmallCircleLocation(Location.top);
    setSmallCircleIndex(0);
    await delay(SHORT_DELAY_IN_MS);
    setSmallCircleIndex(-1);
    list.current.prepend(inputValue);
    setTypeElementStates({ ...typeElementStates, modifiedIndex: 0 });
    setArr(list.current.toArray());
    await delay(SHORT_DELAY_IN_MS);
    setTypeElementStates({ ...typeElementStates, modifiedIndex: -1 });
    setInputValue("");
    setLoading({ ...loading, loaderAddHead: false });
    setDisabled(false);
  };

  const onClickAddTail = async () => {
    setLoading({ ...loading, loaderAddTail: true });
    setDisabled(true);
    setCurrentElement(inputValue);
    setSmallCircleLocation(Location.bottom);
    setSmallCircleIndex(list.current.getSize);
    await delay(SHORT_DELAY_IN_MS);
    list.current.append(inputValue);
    setTypeElementStates({ ...typeElementStates, modifiedIndex: arr.length });
    setSmallCircleIndex(arr.length);
    setSmallCircleIndex(-1);
    setArr(list.current.toArray());
    await delay(SHORT_DELAY_IN_MS);
    setTypeElementStates({ ...typeElementStates, modifiedIndex: -1 });
    setInputValue("");
    setLoading({ ...loading, loaderAddTail: false });
    setDisabled(false);
  };

  const onClickDeleteHead = async () => {
    setDisabled(true);
    setLoading({ ...loading, loaderDeleteHead: true });
    setCurrentElement(arr[0]);
    setSmallCircleLocation(Location.bottom);
    setSmallCircleIndex(0);
    arr.splice(0, 1, "");
    await delay(SHORT_DELAY_IN_MS);
    list.current.deleteHead();
    setSmallCircleIndex(-1);
    setArr(list.current.toArray());
    setLoading({ ...loading, loaderDeleteHead: false });
    setDisabled(false);
  };

  const onClickDeleteTail = async () => {
    setDisabled(true);
    setLoading({ ...loading, loaderDeleteTail: true });
    setCurrentElement(arr[arr.length - 1]);
    setSmallCircleLocation(Location.bottom);
    setSmallCircleIndex(arr.length);
    setArr((arr) => [...arr.slice(0, arr.length - 1), ""]);
    await delay(SHORT_DELAY_IN_MS);
    list.current.deleteTail();
    setSmallCircleIndex(-1);
    setArr(list.current.toArray());
    setLoading({ ...loading, loaderDeleteTail: false });
    setDisabled(false);
  };

  const onClickAddIndex = async () => {
    setLoading({ ...loading, loaderAddIndex: true });
    let currentElementIndex = -1;
    let index = Number(inputIndex);
    while (currentElementIndex <= index) {
      setCurrentElement(inputValue);
      setSmallCircleLocation(Location.top);
      setSmallCircleIndex(currentElementIndex - 1);
      setTypeElementStates({
        ...typeElementStates,
        changingIndex: currentElementIndex - 1,
      });
      setCurrentElement(inputValue);
      setSmallCircleLocation(Location.top);
      setSmallCircleIndex(currentElementIndex);
      await delay(SHORT_DELAY_IN_MS);
      currentElementIndex++;
    }
    list.current.addByIndex(inputValue, index);
    setSmallCircleIndex(-1);
    setTypeElementStates({ ...typeElementStates, modifiedIndex: index });
    setArr(list.current.toArray());
    await delay(SHORT_DELAY_IN_MS);
    setTypeElementStates({ ...typeElementStates, modifiedIndex: -1 });
    setArr(list.current.toArray());
    setInputValue("");
    setInputIndex(null);
    setLoading({ ...loading, loaderAddIndex: false });
    setDisabled(false);
  };

  const onClickDeleteIndex = async () => {
    setLoading({ ...loading, loaderDeleteIndex: true });
    let index = Number(inputIndex);
    let currentElementIndex = 0;
    while (currentElementIndex <= index) {
      setTypeElementStates({
        ...typeElementStates,
        changingIndex: currentElementIndex,
      });
      await delay(SHORT_DELAY_IN_MS);
      currentElementIndex++;
    }
    setCurrentElement(arr[index]);
    setSmallCircleLocation(Location.bottom);
    setSmallCircleIndex(index);
    setArr((arr) => [...arr.slice(0, index), "", ...arr.slice(index + 1)]);
    await delay(SHORT_DELAY_IN_MS);
    setTypeElementStates({ ...typeElementStates, changingIndex: -1 });
    setSmallCircleIndex(-1);
    list.current.deleteByIndex(index);
    setArr(list.current.toArray());
    setInputIndex(null);
    setLoading({ ...loading, loaderDeleteIndex: false });
    setDisabled(false);
  };

  const showHead = (index: number) => {
    return smallCircleIndex === index &&
      smallCircleLocation === Location.top ? (
      <Circle letter={currentElement} state={ElementStates.Changing} isSmall />
    ) : index === 0 ? (
      "head"
    ) : undefined;
  };

  const showTail = (index: number) => {
    return smallCircleIndex === index &&
      smallCircleLocation === Location.bottom ? (
      <Circle letter={currentElement} state={ElementStates.Changing} isSmall />
    ) : index === arr.length - 1 ? (
      "tail"
    ) : undefined;
  };

  const getLetterState = (
    index: number,
    typeElementStates: TElementStates
  ): ElementStates => {
    if (typeElementStates.modifiedIndex === index) {
      return ElementStates.Modified;
    }
    if (typeElementStates.changingIndex >= index) {
      return ElementStates.Changing;
    }
    return ElementStates.Default;
  };

  return (
    <SolutionLayout title="Связный список">
      <section className={styles.section}>
        <Input
          placeholder="Введите текст"
          maxLength={MAX_LENGTH_ELEMENTS}
          type="text"
          isLimitText={true}
          extraClass={styles.input}
          onChange={onChangeValue}
          value={inputValue}
          disabled={disabled}
        />
        <Button
          text="Добавить в head"
          linkedList="big"
          onClick={() => {
            onClickAddHead();
          }}
          isLoader={loading.loaderAddHead}
          disabled={!inputValue || loading.loaderAddTail}
        />
        <Button
          text="Добавить в tail"
          linkedList="big"
          onClick={() => {
            onClickAddTail();
          }}
          isLoader={loading.loaderAddTail}
          disabled={!inputValue || loading.loaderAddHead}
        />
        <Button
          text="Удалить из head"
          linkedList="big"
          onClick={() => {
            onClickDeleteHead();
          }}
          isLoader={loading.loaderDeleteHead}
          disabled={arr.length === 0 || loading.loaderDeleteTail}
        />
        <Button
          text="Удалить из tail"
          linkedList="big"
          onClick={() => {
            onClickDeleteTail();
          }}
          isLoader={loading.loaderDeleteTail}
          disabled={arr.length === 0 || loading.loaderDeleteHead}
        />
      </section>
      <section className={styles.section}>
        <Input
          extraClass={styles.input}
          placeholder="Введите индекс"
          onChange={onChangeIndex}
          value={inputIndex? `${inputIndex}` : ''}
          type="number"
          disabled={disabled}
          min="0"
          max={arr.length - 1}
        />
        <Button
          text="Добавить по индексу"
          linkedList="big"
          onClick={() => {
            onClickAddIndex();
          }}
          isLoader={loading.loaderAddIndex}
          disabled={inputIndex === null || inputValue.length === 0 || inputIndex > arr.length - 1}
        />
        <Button
          text="Удалить по индексу"
          linkedList="big"
          onClick={() => {
            onClickDeleteIndex();
          }}
          isLoader={loading.loaderDeleteIndex}
          disabled={inputIndex=== null || inputIndex > arr.length - 1 || loading.loaderAddIndex}
        />
      </section>
      <ul className={styles.list}>
        {arr &&
          arr?.map((item, index) => {
            return (
              <li key={index} className={styles.listItem}>
                <Circle
                  letter={item}
                  head={showHead(index)}
                  tail={showTail(index)}
                  state={getLetterState(index, typeElementStates)}
                  index={index}
                />
                {index !== arr?.length - 1 && <ArrowIcon />}
              </li>
            );
          })}
      </ul>
    </SolutionLayout>
  );
};
