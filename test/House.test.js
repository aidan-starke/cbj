const House = artifacts.require('House')
const Bag = artifacts.require('Bag')
const CBJ = artifacts.require('CBJ')
const { expectRevert } = require('@openzeppelin/test-helpers')

let house
let bag
let cbj

contract('House', accounts => {
    before(async () => {
        cbj = await CBJ.new(1000000)
        cbjAddress = cbj.address

        house = await House.new(cbjAddress)
        houseAddress = house.address

        bag = await Bag.new(houseAddress)
        bagAddress = bag.address
    })

    describe('getBagPrice', () => {
        it('should return bag price', async () => {
            let bagPrice = await house.getBagPrice()
            bagPrice = web3.utils.fromWei(bagPrice.toString())

            assert(bagPrice === '0.025')
        })
    })

    describe('getChipPrice', () => {
        it('should return chip price', async () => {
            let chipPrice = await house.getChipPrice()
            chipPrice = web3.utils.fromWei(chipPrice.toString())

            assert(chipPrice === '0.0001')
        })
    })

    describe('createBag', () => {
        beforeEach(async () => {
            await bag.mintBag("https://www.mybaglocation.com")
            await bag.mintBag("https://www.mybaglocation2.com")
        })

        it('should create bag', async () => {
            let bagPrice = await house.getBagPrice()

            value = bagPrice.toString()

            await house.createBag(bagAddress, 1, { value: value, gas: 1000000 })

            const totalSupply = await house.totalSupply()

            assert(totalSupply.toString() === '1')
        })

        it('should not create bag if sender already has a bag', async () => {
            let bagPrice = await house.getBagPrice()
            value = bagPrice.toString()

            await expectRevert(
                house.createBag(bagAddress, 2, { value: value, gas: 1000000 }),
                'Only one bag per person'
            )
        })

        it('should not create bag if value !== price of bag', async () => {
            await expectRevert(
                house.createBag(bagAddress, 2, { value: 0, gas: 1000000, from: accounts[1] }),
                'Price must equal bag purchase price'
            )
        })

        it('getBag should return bag', async () => {
            let bag = await house.getBag()

            assert(bag.itemId === '1')
            assert(bag.bagId === '1')
            assert(bag.chips === '0')
            assert(bag.owner === accounts[0])
        })

        it('getBag should not return bag if sender is not bag owner', async () => {
            await expectRevert(
                house.getBag({ from: accounts[2] }),
                'Only bag owner can access bag'
            )
        })
    })

    describe('buyChips', () => {
        it('should buy chips', async () => {
            let chipPrice = await house.getChipPrice()
            let value = Number(chipPrice.toString()) * 1000
            value = value.toString()

            await cbj.approve(houseAddress, value)

            await house.buyChips(1000, { value, gas: 1000000 })

            let chipBalance = await house.getChipBalance()

            assert(chipBalance.toString() === '1000')
        })

        it('should not buy chips if value of transaction is below value of chips', async () => {
            await expectRevert(
                house.buyChips(1000, { value: 0, gas: 1000000 }),
                'Price must equal value of chips'
            )
        })
    })

    describe('cashIn', () => {
        it('should cash in chips', async () => {
            let chipPrice = await house.getChipPrice()
            let value = Number(chipPrice.toString()) * 1000
            value = value.toString()

            await cbj.approve(houseAddress, value)

            await house.cashIn(500, { gas: 1000000 })

            let chipBalance = await house.getChipBalance()

            assert(chipBalance.toString() === '500')
        })

        it('should not cash in if bag does not contain enough chips', async () => {
            await expectRevert(
                house.cashIn(3000, { gas: 1000000 }),
                'Must have enough chips'
            )
        })
    })
})