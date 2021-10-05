import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import CBJ from '../contracts/CBJ.json'
import House from '../contracts/House.json'

function getWeb3 () {
    return new Promise(async (resolve, reject) => {
        const provider = await detectEthereumProvider()
        if (provider) {
            await provider.request({ method: 'eth_requestAccounts' })
            try {
                const web3 = new Web3(window.ethereum)
                resolve(web3)
            } catch (err) {
                reject(err)
            }
        } reject('Install Metamask')
    })
}

async function getContracts (web3) {
    const networkId = await web3.eth.net.getId()
    const cbjDeployedNetwork = CBJ.networks[networkId]
    const houseDeployedNetwork = House.networks[networkId]

    return Promise.all([
        new web3.eth.Contract(
            CBJ.abi,
            cbjDeployedNetwork && cbjDeployedNetwork.address
        ),
        new web3.eth.Contract(
            House.abi,
            houseDeployedNetwork && houseDeployedNetwork.address
        )
    ])
}

export { getWeb3, getContracts }