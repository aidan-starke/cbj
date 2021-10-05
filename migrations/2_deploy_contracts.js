const CBJ = artifacts.require('CBJ')
const House = artifacts.require('House')

module.exports = async function (deployer, _network, accounts) {
    await deployer.deploy(CBJ, 1000000)
    const cbj = await CBJ.deployed()

    await deployer.deploy(House, cbj.address)
    const house = await House.deployed()

    await cbj.approve(accounts[0], web3.utils.toWei('1000000'))
    await cbj.transferFrom(accounts[0], house.address, web3.utils.toWei('1000000'))
}