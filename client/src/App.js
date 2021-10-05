import React, { useEffect, useState } from 'react'
import { getContracts, getWeb3 } from './utils/web3'
import { Button, Card, Menu, PageHeader } from 'antd'
import { Content, Footer } from 'antd/lib/layout/layout'
import { connect } from 'react-redux'
import { mapAccountToStore, mapContractsToStore, mapWeb3ToStore } from './actions'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { Bag, BlackJack, Prism, ThemeSwitch } from './components'


function App ({ dispatch }) {
  const [web3, setWeb3] = useState()
  const [acc, setAcc] = useState()
  const [account, setAccount] = useState()
  const [contracts, setContracts] = useState()
  const [balance, setBalance] = useState()

  useEffect(() => {
    init()
    //eslint-disable-next-line
  }, [])

  const init = async () => {
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    const acc = account.substr(0, 6).concat('...', account.substr(account.length - 4, 4))
    const contracts = await getContracts(web3)
    const balance = await contracts[0].methods.balanceOf(account).call()

    dispatch(mapAccountToStore(account))
    dispatch(mapContractsToStore(contracts))
    dispatch(mapWeb3ToStore(web3))

    setBalance(web3.utils.fromWei(balance.toString()))
    setWeb3(web3)
    setAccount(account)
    setAcc(acc)
    setContracts(contracts)
  }

  async function faucet () {
    await contracts[0].methods.faucet(account, web3.utils.toWei('10')).send({ from: account, gas: 1000000 })
    const balance = await contracts[0].methods.balanceOf(account).call()
    setBalance(web3.utils.fromWei(balance.toString()))
  }

  return (
    <>
      <PageHeader
        title='CBJ'
        subTitle='Crypto BlackJack'
        style={{ border: '1px solid rgb(235, 237, 240)' }}
        position='fixed'
      >
        {!web3 && <Button style={{ position: 'absolute', top: 20, right: 20, margin: 0 }} onClick={init}>Connect</Button>}
        {balance > 0 ? <h3 style={{ position: 'absolute', top: 22, left: 200, margin: 0 }}>CBJ Balance: {balance}</h3> : <Button onClick={faucet} style={{ position: 'absolute', top: 22, left: 200, margin: 0 }}>Get CBJ Tokens!</Button>}
        {acc && <h4 style={{ position: 'absolute', top: 30, right: 30, margin: 0 }}>{acc}</h4>}
      </PageHeader>

      <Menu mode='horizontal' >
        <Menu.Item key='home'><Link to='/' />Home</Menu.Item>
        <Menu.Item key='bag'><Link to='/bag' />My Bag</Menu.Item>
        <Menu.Item key='play'><Link to='/play' />Play BlackJack</Menu.Item>
      </Menu>

      <Content>
        <Card style={{ maxWidth: '1600px', height: '600px', margin: '10px auto' }}>
          <Switch>
            <Route exact path='/'
              render={() => <Prism />} />

            <Route path='/bag'
              render={() => <Bag setBalance={setBalance} />} />

            <Route path='/play'
              render={() => <BlackJack account={account} contracts={contracts} web3={web3} />} />
          </Switch>
        </Card>

      </Content>

      <ThemeSwitch />

      <Footer style={{ textAlign: 'center' }}>Crypto BlackJack ©2021 Created by <a href='https://starkemedia.com' target='_blank' rel="noreferrer">StarkeMedia</a></Footer>
    </>
  )
}

export default connect()(App)
