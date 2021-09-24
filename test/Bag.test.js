const Bag = artifacts.require('Bag')

contract('Bag', () => {
    let bag

    before(async () => {
        bag = await Bag.deployed()
    })

    describe('mintBag', () => {
        it('should create bags and increment _bagIds', async () => {
            await bag.mintBag("https://www.mybaglocation.com")
            await bag.mintBag("https://www.mytokenlocation2.com")

            const totalSupply = bag.totalSupply()

            expect(totalSupply.toString() === '2')
        })
    })
})