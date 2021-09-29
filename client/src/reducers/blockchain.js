import { SET_ACCOUNT, SET_CONTRACTS, SET_WEB3 } from '../actions'

function blockchain (state = { account: '', contracts: {}, web3: undefined }, action) {
  switch (action.type) {
    case SET_ACCOUNT:
      state.account = action.account
      return state
    case SET_CONTRACTS:
      state.contracts = {
        CBJ: action.contracts[0],
        House: action.contracts[1],
        Bag: action.contracts[2]
      }
      return state
    case SET_WEB3:
      state.web3 = action.web3
      return state
    default:
      return state
  }
}

export default blockchain
