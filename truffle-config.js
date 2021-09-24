const path = require('path')
require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

const { INFURA_API_KEY, MNEMONIC } = process.env

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`
      ),
      network_id: 4,
    },
    matic: {
      provider: () => new HDWalletProvider(
        MNEMONIC,
        `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`
      ),
      network_id: 80001,
    },
  },
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  compilers: {
    solc: {
      version: '^0.8.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
