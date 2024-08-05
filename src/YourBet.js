import React from "react";
import { redNumbers, blackNumbers, greenNumbers } from "./data";
import { checkNumber, checkIndex } from "./helpers";

export default function YourBet(props) {

  const { bets, totals } = props;

  // return list of user's bets

  const returnBets = function () {
    return (
      <div style={{ display: "block", marginLeft: "5px", width: "90%" }}>
        {bets.map((bet, index) => (
          <div style={{ marginLeft: "20px", height: "100px", marginTop: "30px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {bet.map((ele, i) => (
                <div>
                  <div class={checkNumber(ele, redNumbers, blackNumbers, greenNumbers)}>{ele}</div>
                  <div style={{ color: "white", marginLeft: "30px", marginTop: "4px" }}>+ {checkIndex(totals[index][i])}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div class="your-bet">
      {returnBets()}
    </div>
  )
}