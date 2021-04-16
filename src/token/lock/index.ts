import {ActionInterface, StateInterface} from "../../faces";

declare const ContractError: any;

export interface LockInterface {
  function: "lock";
  id: number;
  qty: number;
}

export const Lock = (state: StateInterface, action: ActionInterface) => {
  const balances = state.balances;
  const caller = action.caller;
  const pools = state.pools;

  const input: LockInterface = action.input;
  const id = input.id;
  const qty = input.qty;


  balances[caller] -= qty;
  if (caller in pools[id].vault) {
    state.vault[caller] += qty;
  } else {
    state.vault[caller] = qty;
  }

  return {...state};
};
