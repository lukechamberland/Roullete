import React, { useState } from "react";
import { redNumbers, blackNumbers, greenNumbers, numbers } from "./data";
import { returnArray, buildArray, changeCashAmount, addToBets, removeFromBets, calculate, calculateSubtract, showFullCashAmount } from "./helpers";
import YourBet from "./YourBet";

export default function Background() {

  const [bets, setBets] = useState([]); // nested array containing the bets placed
  const [colorState, setColorState] = useState([]); // colors that are to be changed
  const [selectedState, setSelectedState] = useState(0);  // selected number at the top (1, 2, 5, 10, 20, 100)
  const [currentSelected, setCurrentSelected] = useState([]); // temporary array of 4 or less bets
  const [totals, setTotals] = useState([]); // corresponding winnings 
  const [cashAmountState, setCashAmountState] = useState(false); // if cash has been inputted yet
  const [cashAmount, setCashAmount] = useState(0); // current cash amount
  const [startingAmount, setStartingAmount] = useState([]); // inputted starting amount
  const [bet, setBet] = useState(false); // if there is at least one bet
  const [currentNumberState, setCurrentNumberState] = useState(null); // current number for fire
  const [winner, setWinner] = useState(null); // number that fire lands on

  // remove a bet

  const removeCurrent = function () {
    const array = returnArray(bets);
    for (let ele of currentSelected) {
      array.pop();
    }
    const newArray = buildArray(array);
    setBets(newArray);
  }

  // remove current bets if new number is selected

  const resetSelectedState = function (num) {
    if (num === selectedState || num > cashAmount || !currentSelected || !cashAmountState) {
      return;
    } else {
      const firstArray = returnArray(bets);
      setSelectedState(num);
      setColorState([]);
      setCurrentSelected([]);
      const newArray = [];
      for (let i = 0; i < firstArray.length - currentSelected.length; i++) {
        newArray.push(firstArray[i]);
      }
      const nestedArrayOne = buildArray(newArray);
      setBets(nestedArrayOne);
      let totalsArray = returnArray(totals);
      for (let ele of currentSelected) {
        totalsArray.pop();
      }
      const finalArr = buildArray(totalsArray);
      setTotals(finalArr);
    }
  }

  // update colors and call correct function for calculating potential winnings

  const checkBets = function (bet, arr) {
    if (selectedState === 0) {
      return;
    }
    if (currentSelected.length >= 1) {
      if (numbers.includes(currentSelected[0]) && !numbers.includes(bet)) {
        return;
      }
      if (!numbers.includes(currentSelected[0]) && numbers.includes(bet)) {
        return;
      }
      if (currentSelected.includes("1-18") && bet === "19-36") {
        return;
      }
      if (currentSelected.includes("19-36") && bet === "1-18") {
        return;
      }
      if (currentSelected.includes("black") && bet === "red") {
        return;
      }
      if (currentSelected.includes("red") && bet === "black") {
        return;
      }
      if (currentSelected.includes("odd") && bet === "even") {
        return;
      }
      if (currentSelected.includes("even") && bet === "odd") {
        return;
      }
    }
    const newArr = returnArray(bets);
    if (newArr.includes(bet) && currentSelected.includes(bet)) {
      removeFromBets(bet, arr, setBets);
      calculateSubtract(currentSelected.length - 1, totals, setTotals);
      const newColorState = colorState.filter((ele) => ele !== bet);
      setColorState(newColorState);
      const newSelectedState = currentSelected.filter((ele) => ele !== bet);
      setCurrentSelected(newSelectedState);
    } else {
      if (currentSelected.length < 4) {
        addToBets(bet, arr, setBets, bets);
        calculate(bet, currentSelected.length + 1, selectedState, setTotals, totals);
        setColorState([...colorState, bet]);
        setCurrentSelected([...currentSelected, bet]);
      }
    }
  }

  // select winning number

  const fire = function (time) {
    if (bet) {
      setBet(false);
    }
    setBet(false);
    const num = Math.floor(Math.random() * numbers.length);
    setTimeout(() => {
      setCurrentNumberState(numbers[num]);
    }, time);
    if (time < 4000) {
      fire(time * 1.5);
      return;
    } else {
      setTimeout(() => {
        finalize(numbers[num]);
      }, 5000);
    }
  }

  // update all states depending on winning number

  const finalize = function (num) {
    setWinner(num);
    let total = 0;
    const numbers = returnArray(bets);
    const earnings = returnArray(totals);
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === num) {
        total += earnings[i];
      }
      if (numbers[i] === "black" && blackNumbers.includes(num)) {
        total += earnings[i];
      }
      if (numbers[i] === "red" && redNumbers.includes(num)) {
        total += earnings[i];
      }
      if (numbers[i] === "even" && num % 2 === 0) {
        total += earnings[i];
      }
      if (numbers[i] === "odd" && num % 2 !== 0) {
        total += earnings[i];
      }
      if (numbers[i] === "1-18" && num !== 0 && num < 19) {
        total += earnings[i];
      }
      if (numbers[i] === "19-36" && num > 18) {
        total += earnings[i];
      }
    }
    setTimeout(() => {
      setCashAmount(cashAmount + total);
      setBets([]);
      setWinner(null);
      setTotals([]);
      setCurrentNumberState(null);
    }, 2000);
  }

  // reset all bets

  const resetBets = function () {
    if (bets.length) {
      setSelectedState(0);
      setCurrentSelected([]);
      setColorState([]);
      setCashAmount(cashAmount - selectedState);
      if (!bet) {
        setBet(true);
      }
    }
  }

  // return color for if bet is selected or not

  const checkColors = function (number) {
    if (number === winner) {
      return "rgb(151, 255, 154)";
    }
    if (number === currentNumberState) {
      return "gold";
    }
    if (redNumbers.includes(number)) {
      return colorState.includes(number) ? "rgb(245, 170, 170)" : "";
    } else if (blackNumbers.includes(number)) {
      return colorState.includes(number) ? "rgb(180, 180, 180)" : "";
    } else if (greenNumbers.includes(number)) {
      return colorState.includes(number) ? "rgb(49, 222, 49)" : "";
    } else {
      return colorState.includes(number) ? "rgba(255, 255, 255, 0.616)" : "";
    }
  }

  // reset all states

  const resetStates = function() {
    setBets([]);
    setColorState([]);
    setSelectedState(0);
    setCurrentSelected([]);
    setTotals([]);
    setCashAmountState(false);
    setCashAmount(0);
    setStartingAmount([]);
    setBet(false);
    setCurrentNumberState(null);
    setWinner(null);
  }

  // return list of numbers

  const returnNumbers = function (arr, boolean) {
    if (boolean) {
      return (
        <div class="inner-wheel">
          {arr.map((ele, index) => (
            <div class={index % 2 === 0 ? "number" : "number-two"} style={{ background: checkColors(ele) }} onClick={() => checkBets(ele, bets)}>{ele}</div>
          ))}
        </div>
      )
    } else {
      return (
        <div class="inner-wheel">
          {arr.map((ele, index) => (
            <div class={(index + 1) % 2 === 0 ? "number" : "number-two"} style={{ background: checkColors(ele) }} onClick={() => checkBets(ele, bets)}>{ele}</div>
          ))}
        </div>
      )
    }
  }

  // return bottom row of numbers

  const returnBottom = function () {
    return (
      <div class="inner-wheel" style={{ justifyContent: "center" }}>
        <div class="number-clear" style={{ background: checkColors("1-18") }} onClick={() => checkBets("1-18", bets)}>1-18</div>
        <div class="number-clear" style={{ background: checkColors("odd") }} onClick={() => checkBets("odd", bets)}>odd</div>
        <div class="number" style={{ background: checkColors("red") }} onClick={() => checkBets("red", bets)}>red</div>
        <div class="number-zero" style={{ background: checkColors(0) }} onClick={() => checkBets(0, bets)}>0</div>
        <div class="number-zero" style={{ background: checkColors("00") }} onClick={() => checkBets("00", bets)}>00</div>
        <div class="number-two" style={{ background: checkColors("black") }} onClick={() => checkBets("black", bets)}>black</div>
        <div class="number-clear" style={{ background: checkColors("even") }} onClick={() => checkBets("even", bets)}>even</div>
        <div class="number-clear" style={{ background: checkColors("19-36") }} onClick={() => checkBets("19-36", bets)}>19-36</div>
      </div>
    )
  }

  // return enter cash amount input

  const enterCashAmount = function () {
    return (
      <input
        class="cash-amount"
        value={cashAmount}
        onChange={(e) => changeCashAmount(e.target.value, setCashAmount)}
        onKeyDown={(e) => handleKeyPress(e)}
      />
    )
  }

  // change cash amount if enter key is pressed

  const handleKeyPress = function (event) {
    if (cashAmount === 0) {
      return;
    }
    if (event.key === "Enter") {
      setCashAmountState(true);
      setStartingAmount(parseFloat(event.target.value));
    }
  }

  // show current cash amount

  const showCashAmount = function () {
    if (cashAmount < startingAmount) {
      if (Math.round(startingAmount - cashAmount) === startingAmount - cashAmount) {
        return '- $' + (startingAmount - cashAmount) + '.00';
      } else if (Math.round(((startingAmount - cashAmount) * 10)) / 10 === startingAmount - cashAmount) {
        return '- $' + (startingAmount - cashAmount) + '0';
      } else {
        return '- $' + (startingAmount - cashAmount);
      }
    } else {
      if (Math.round(cashAmount - startingAmount) === cashAmount - startingAmount) {
        return '+ $' + (cashAmount - startingAmount) + '.00';
      } else if (Math.round(((cashAmount - startingAmount) * 10)) / 10 === cashAmount - startingAmount) {
        return '+ $' + (cashAmount - startingAmount) + '0';
      } else {
        return '+ $' + (cashAmount - startingAmount);
      }
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <div class="wheel">
        <div class="second-wheel">
          <div class="current-bet">
            <div>
              <div class="total">${cashAmountState ? showFullCashAmount(cashAmount) : enterCashAmount()}{cashAmountState ? '' : '.00'}</div>
              <div style={{ color: "white" }}>{cashAmountState ? showCashAmount() : '+ $0.00'}</div>
            </div>
            <div class="num" style={{ background: selectedState === 1 ? "rgba(255, 255, 255, 0.592)" : "" }} onClick={() => resetSelectedState(1)}>1</div>
            <div class="num" style={{ background: selectedState === 2 ? "rgba(255, 255, 255, 0.592)" : "" }} onClick={() => resetSelectedState(2)}>2</div>
            <div class="num" style={{ background: selectedState === 5 ? "rgba(255, 255, 255, 0.592)" : "" }} onClick={() => resetSelectedState(5)}>5</div>
            <div class="num" style={{ background: selectedState === 10 ? "rgba(255, 255, 255, 0.592)" : "" }} onClick={() => resetSelectedState(10)}>10</div>
            <div class="num" style={{ background: selectedState === 20 ? "rgba(255, 255, 255, 0.592)" : "" }} onClick={() => resetSelectedState(20)}>20</div>
            <div class="num" style={{ background: selectedState === 100 ? "rgba(255, 255, 255, 0.592)" : "" }} onClick={() => resetSelectedState(100)}>100</div>
            <div style={{ display: "flex" }}>
              <div class={currentSelected.length > 0 ? "place-bet" : "place-bet-unselected"} onClick={() => resetBets()}>place bet</div>
              <div class="cashout" onClick={() => resetStates()}>cashout</div>
              <div class={!bet ? "play-unselected" : "play"} onClick={() => {
                if (bet) {
                  resetBets();
                  removeCurrent();
                  fire(50);
                } else {
                  console.log("no bets placed");
                }
              }}>play</div>
            </div>
          </div>
          {returnNumbers([26, 32, 15, 19, 4, 21, 2, 25, 17], true)}
          {returnNumbers([34, 6, 27, 13, 36, 11, 30, 8, 23], false)}
          {returnNumbers([10, 5, 24, 16, 33, 1, 20, 14, 31], true)}
          {returnNumbers([9, 22, 18, 29, 7, 28, 12, 35, 3], false)}
          {returnBottom()}
        </div>
      </div>
      <YourBet bets={bets} totals={totals} currentSelected={currentSelected} />
    </div>
  )
}