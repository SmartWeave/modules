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

  if (!Number.isInteger(qty)) {
    throw new ContractError(`Invalid value for "qty". Must be an integer.`);
  }
  if (qty <= 0) {
    throw new ContractError(`Invalid funding amount.`);
  }
  if (!(caller in balances)) {
    throw new ContractError(`Caller doesn't own any tokens.`);
  }
  if (balances[caller] < qty) {
    throw new ContractError(
      `Caller balance not high enough to send ${qty} token(s)!`
    );
  }
  if (id >= pools.length) {
    throw new ContractError(`Invalid pool id.`);
  }

  balances[caller] -= qty;
  if (caller in pools[id].vault) {
    pools[id].vault[caller] += qty;
  } else {
    pools[id].vault[caller] = qty;
  }

  return {...state, balances, pools};
};
