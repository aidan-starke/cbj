/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Input, Typography } from 'antd'
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const { Paragraph, Title } = Typography

function Bag ({ account, contracts, web3, setBalance }) {
    const [loading, setLoading] = useState(true)
    const [bag, setBag] = useState({})
    const [buyBag, setBuyBag] = useState(false)
    const [url, setUrl] = useState('')
    const [chipAmount, setChipAmount] = useState(0)

    const { CBJ, House } = contracts

    async function init () {
        let bagExists = await House.methods.bagExists().call({ from: account })
        if (bagExists) {
            getBag()
        }
        else setBuyBag(true)
    }

    useEffect(() => {
        init()
            .then(setLoading)
    }, [])

    async function createBag () {
        let bagPrice = await House.methods.getBagPrice().call()
        await House.methods.createBag().send({ from: account, value: bagPrice, gas: 1000000 })
        setBuyBag(false)
        getBag()
    }

    async function getBag () {
        let bag = await House.methods.getBag().call({ from: account })
        bag = {
            itemId: bag[0],
            chips: bag[1],
            owner: bag[2]
        }
        setBag(bag)
    }

    async function buyChips () {
        let chipPrice = await House.methods.getChipPrice().call()
        let value = Number(chipPrice.toString()) * chipAmount
        value = value.toString()

        await CBJ.methods.approve(House._address, value).send({ from: account, gas: 1000000 })
        await House.methods.buyChips(chipAmount).send({ from: account, value, gas: 1000000 })

        let balance = await CBJ.methods.balanceOf(account).call()
        getBag()
        setBalance(web3.utils.fromWei(balance.toString()))
    }

    async function cashIn () {
        await House.methods.cashIn(chipAmount).send({ from: account, gas: 1000000 })
        let balance = await CBJ.methods.balanceOf(account).call()
        getBag()
        setBalance(web3.utils.fromWei(balance.toString()))
    }

    if (loading) return <Title level={4}>Loading...</Title>

    else return (
        <>
            {!buyBag &&
                <Card style={{ maxWidth: '500px' }} title='Your Bag'>
                    <Typography>
                        <Paragraph>Id: {bag.itemId}</Paragraph>
                        <Paragraph>Chips: {bag.chips}</Paragraph>
                    </Typography >
                    <label htmlFor='input' />
                    <Button onClick={buyChips}>Buy Chips</Button>
                    <Input style={{ display: 'inline-block', maxWidth: '300px' }} placeholder='amount' type='text' onChange={e => setChipAmount(e.target.value)} />
                    <Button onClick={cashIn}>Cash in Chips</Button>
                    <Input style={{ display: 'inline-block', maxWidth: '300px' }} placeholder='amount' type='text' onChange={e => setChipAmount(e.target.value)} />
                </Card>
            }

            {buyBag && <Button onClick={createBag}>Create a bag!</Button>}
        </>
    )
}

function mapStateToProps (state) {
    return {
        account: state.blockchain.account,
        contracts: state.blockchain.contracts,
        web3: state.blockchain.web3,
    }
}

export default connect(mapStateToProps)(Bag)