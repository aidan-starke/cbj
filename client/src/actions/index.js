export const SET_ACCOUNT = 'SET_ACCOUNT'
export const SET_CONTRACTS = 'SET_CONTRACTS'
export const SET_WEB3 = 'SET_WEB3'

export function mapAccountToStore (account) {
  return {
    type: SET_ACCOUNT,
    account,
  }
}

export function mapContractsToStore (contracts) {
  return {
    type: SET_CONTRACTS,
    contracts
  }
}

export function mapWeb3ToStore (web3) {
  return {
    type: SET_WEB3,
    web3,
  }
}
