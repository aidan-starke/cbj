import React from 'react'

import useWindowSize from '../utils/useWindowSize'

const gateway = 'https://gateway.pinata.cloud/ipfs/'

function Prism () {
  const { width } = useWindowSize()

  return (
    <div style={{ textAlign: 'center' }}>
      {width > 600 && (
        <img
          src={gateway + 'QmV1yMNGooCJh9UMFQWWh411pCxXVX8TnjBtUeeLpPHRhr'}
          alt='prism'
        />
      )}
      {width <= 600 && (
        <img
          src={gateway + 'QmYGHg1NyamHiQWo5nxqJS1CR7YmM5UkcSfpmwnvSENNMd'}
          alt='prism-small'
        />
      )}
    </div>
  )
}

export default Prism
