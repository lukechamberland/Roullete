import { numbers } from "./data";

// return appropriate class for styling

export const checkNumber = function (num, arrOne, arrTwo, arrThree) {
  if (arrOne.includes(num)) {
    return "new-number-red";
  } else if (arrTwo.includes(num)) {
    return "new-number-black";
  } else if (arrThree.includes(num)) {
    return "new-number-green";
  } else {
    return "new-number-clear";
  }
}

// returns necassary decimal places based on number

 export const checkIndex = function (number) {
  if (Math.round(number) === number) {
    return number + '.00';
  }
  if (Math.round(number * 10) / 10 === number) {
    return number + '0';
  }
  return number;
}

// flattens array for looping puroposes

export const returnArray = function (arr) {
  const newArr = [];
  for (let ele of arr) {
    for (let num of ele) {
      newArr.push(num);
    }
  }
  return newArr;
}

// nests an array for display

export const buildArray = function (arr) {
  const lastArray = [];
  let tempArr = [];
  for (let ele of arr) {
    if (tempArr.length < 3) {
      tempArr.push(ele);
    } else {
      lastArray.push(tempArr);
      tempArr = [ele];
    }
  }
  lastArray.push(tempArr);
  return lastArray;
}

// update input starting cash amount based on user input

export const changeCashAmount = function (variable, cb) {
  if (variable < 10000) {
    cb(parseFloat(variable) || 0);
  }
}

// update bet state if bet is deleted

export const removeFromBets = function (bet, arr, cb) {
  const newArr = returnArray(arr);
  let index = 0;
  for (let ele of newArr) {
    if (ele === bet) {
      index = newArr.indexOf(bet);
    }
  }
  newArr.splice(index, 1);
  const finalArr = buildArray(newArr);
  cb(finalArr);
}

// update bet state if bet is added

export const addToBets = function (bet, arr, cb, bets) {
  if (arr.length === 0) {
    cb([[bet]]);
  } else {
    const lastIndex = arr.length - 1;
    if (arr[lastIndex].length < 3) {
      const newArr = arr[lastIndex];
      arr.pop();
      newArr.push(bet);
      cb([...bets, newArr]);
    } else {
      cb([...bets, [bet]]);
    }
  }
}

// calculate appropriate number if bet is won after bet is added

export const calculate = function (num, length, state, cb, array) {
  let multiplyer = 2;
  if (numbers.includes(num)) {
    multiplyer = 35;
  }
  const newNum = Math.round(((state * multiplyer) / length) * 100) / 100;
  const newTotals = returnArray(array);
  const newArray = [...newTotals, newNum];
  newArray.reverse();
  for (let i = 0; i < length; i++) {
    newArray[i] = newNum;
  }
  newArray.reverse();
  const finalArr = buildArray(newArray);
  cb(finalArr);
}

// calculate appropriate number if bet is won after bet is removed

export const calculateSubtract = function (length, firstArray, cb) {
  const newTotals = returnArray(firstArray);
  const array = [...newTotals];
  array.pop();
  array.reverse();
  for (let i = 0; i < length; i++) {
    let newNum = Math.round((array[i] * ((length + 1) / length)) * 100) / 100;
    if (newNum === 34.99) {
      newNum += 0.01;
    }
    if (newNum === 175.01 || newNum === 17.51 || newNum === 1750.01) {
      newNum -= 0.01;
    }
    array[i] = newNum;
  }
  array.reverse();
  const finalArr = buildArray(array);
  cb(finalArr);
}

// show user's full cash amount with appropriate decimal

export const showFullCashAmount = function(number) {
  if (Math.round(number) === number) {
    return number + '.00';
  } else if (Math.round(number * 10) / 10 === number) {
    return number + '0';
  } else {
    return number;
  }
}