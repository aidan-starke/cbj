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
    const [chipAmount, setChipAmount] = useState(0)

    const { CBJ, House, Bag } = contracts

    async function init () {
        let bagExists = await House.methods.bagExists().call({ from: account })
        if (bagExists) {
            getBag()
        }
        else setBuyBag(true)
    }

    useEffect(() => {
        init()
            .then(() => setLoading(false))
    }, [])

    function mintBag () {
        const data = JSON.stringify({
            type: 'CBJ Bag', owner: account
        })
        try {
            client.add(data)
                .then(async added => {
                    const url = `https://ipfs.infura.io/ipfs/${added.path}`
                    let bagId = await Bag.methods.mintBag(url).call({ from: account })
                    createBag(bagId)
                })
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createBag (bagId) {
        let bagPrice = await House.methods.getBagPrice().call()
        await House.methods.createBag(Bag._address, bagId).send({ from: account, value: bagPrice, gas: 1000000 })
        setBuyBag(false)
        getBag()
    }

    async function getBag () {
        let bag = await House.methods.getBag().call({ from: account })
        bag = {
            itemId: bag[0],
            bagContract: bag[1],
            bagId: bag[2],
            chips: bag[3],
            owner: bag[4]
        }
        try {
            let token = await Bag.methods.tokenURI(bag.bagId).call()
            console.log(token)

        } catch (err) { console.log(err.message) }
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

    if (loading) return <Title level={4}>Loading...</Title>

    else return (
        <>
            {!buyBag &&
                <Card style={{ maxWidth: '500px' }} title='Your Bag'>
                    <Typography>
                        <Paragraph>Id: {bag.bagId}</Paragraph>
                        <Paragraph>Bag Contract: {bag.bagContract}</Paragraph>
                        <Paragraph>Chips: {bag.chips}</Paragraph>
                        <Paragraph>Metadata: {bag.metadata}</Paragraph>
                    </Typography >
                    <label htmlFor='input' />
                    <Button onClick={buyChips}>Buy Chips</Button>
                    <Input style={{ display: 'inline-block', maxWidth: '300px' }} placeholder='amount' type='text' onChange={e => setChipAmount(e.target.value)} />
                </Card>
            }

            {buyBag && <Button onClick={mintBag}>Create a bag!</Button>}
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