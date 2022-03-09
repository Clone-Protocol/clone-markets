import BalanceViewComp from '~/components/Home/BalanceView'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { Balance, fetchBalance } from '~/web3/Home/balance'
import { Box } from '@mui/material'

const BalanceView = () => {
  const { publicKey } = useWallet()
  const { getInceptApp } = useIncept()
  const [balance, setBalance] = useState<Balance>()

  useEffect(() => {
    const program = getInceptApp('9MccekuZVBMDsz2ijjkYCBXyzfj8fZvgEu11zToXAnRR')

    async function fetch() {
      const data = await fetchBalance({
        program,
        userPubKey: publicKey,
      })
      if (data) {
        setBalance(data)
      }
    }
    fetch()
  }, [publicKey])

  return (
    <Box sx={{ maxWidth: '806px' }}>
      <BalanceViewComp balance={balance} />
    </Box>
  )
}

export default BalanceView