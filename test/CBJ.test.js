const CBJ = artifacts.require('CBJ')
const House = artifacts.require('House')

contract('CBJ', accounts => {
    let cbj
    let house

    before(async () => {
        cbj = await CBJ.deployed()
        house = await House.deployed(cbj.address)
    })

    it('transfers all tokens to house contract on deploy', async () => {
        let balance = await cbj.balanceOf(house.address)
        balance = web3.utils.fromWei(balance, 'ether')

        assert.equal(balance, 1000000, 'Balance should be 1M tokens for house contract')
    })
})