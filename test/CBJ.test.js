const CBJ = artifacts.require('CBJ')

contract('CBJ', accounts => {
    let cbj

    before(async () => {
        cbj = await CBJ.deployed()
    })

    it('gives the owner of the token 1M tokens', async () => {
        let balance = await cbj.balanceOf(accounts[0])
        balance = web3.utils.fromWei(balance, 'ether')

        assert.equal(balance, 1000000, 'Balance should be 1M tokens for contract creator')
    })

    it('can transfer tokens between accounts', async () => {
        let amount = web3.utils.toWei('1000')
        await cbj.transfer(accounts[1], amount, { from: accounts[0] })

        let balance = await cbj.balanceOf(accounts[1])
        balance = web3.utils.fromWei(balance, 'ether')

        assert.equal(balance, 1000, 'Balance should be 1K for accounts[1]')
    })
})