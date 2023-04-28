import {
  Container,
  Box,
  Flex,
  Text,
  Image,
  Center,
  SimpleGrid,
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Heading,
  Skeleton,
  Input,
  Textarea,
  Stack,
  Tooltip
} from '@chakra-ui/react'
import CoffeeLogo from './coffee.svg'
import { ConnectWallet, useContract, useContractRead, Web3Button } from "@thirdweb-dev/react";
import { BUYACOFFEE_ADDRESS } from './const/contractAddress';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { InfoOutlineIcon } from '@chakra-ui/icons'


export default function Home() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const {contract}=useContract(BUYACOFFEE_ADDRESS)
  const {
    data:totalCoffee,
    isLoading:loadingTotalCoffee
  } = useContractRead(contract , 'getTotalCoffee')

  const {
    data:recentCoffee,
    isLoading:loadingRecentCoffee
  } = useContractRead(contract , 'getAllCoffee')

  return (
    <Box bg='#FEFEFE' w={'100%'} h={'100%'}>
      <Container maxW={'1200px'} w={'100%'}>

        <Flex
          px={'10px'}
          bg={'center'}
          h={'120px'}
          borderRadius={'20px'}
          boxShadow={'lg'}
        >
          <Center w='100%'>
          <Image
            src={CoffeeLogo}
            width={50}
            height={50}
            alt='Buy Me a Coffee'
          
          />

          <Text
            w='100%'
            fontWeight={600}
            fontSize={'24px'}
          >
            Buy Me Coffee
          </Text>
          
          <Box mr={'2rem'}>
            <ConnectWallet
              theme="white"
              btnTitle="Connect Wallet"
            />
          </Box>

          </Center>
    
        </Flex>

        <Flex
          w={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          py={'20px'}
          height='100px'
          flexDirection={'column'}
        >
          <SimpleGrid
            columns={2}
            spacing={10}
            mt={'40px'}
            w={'100%'}

          >
            {/*左半邊卡片*/}
            <Box>
              <Card>
                <CardBody>
                    <Heading
                      size='md'
                      mb='20px'
                    >
                      Buy Me A Coffee
                    </Heading>

                    <Flex>

                      <Text>Total Coffee :</Text>

                      <Skeleton
                        isLoaded={!loadingTotalCoffee}
                        width={'20px'}
                      >
                        {totalCoffee?.toString()}
                      </Skeleton>
                    </Flex>

                    <Text
                      fontSize='xl'
                      py='10px'
                    >
                      妳的名字
                    </Text>
                    <Input
                    bg='gray.100'
                    maxLength={16}
                    placeholder='請輸入名字，例如:Andrew'
                    value={name}
                    onChange={(e) => setName (e.target.value)}
                    />

                    <Text
                      fontSize='xl'
                      py='10px'
                    >
                      妳的訊息
                    </Text>
                    <Textarea
                      size='lg'
                      bg={'gray.100'}  
                      value={message}
                      onChange={(e)=>setMessage(e.target.value)}
                    />

                    <Box mt={'20px'}
                    >
                      <Center>
                        <Web3Button
                          contractAddress={BUYACOFFEE_ADDRESS}
                          action={async() => {
                            await contract.call('buyCoffee',[message,name],
                            {value: ethers.utils.parseEther('0.01')
                          })
                            
                          }}
                          
                          onSuccess={()=> {
                             setMessage('')
                             setName('')
                             alert('妳購買的咖啡成功了喔~!')
                           }}
                          onError={(error) => {
                            alert(error)
                          }}
                        >
                          買一杯咖啡 0.01 ETH
                        </Web3Button>
                      </Center>
                    </Box>
                </CardBody>
              </Card>
            </Box>

            {/*右半邊卡片*/}
            <Box>
             <Card maxH={'50vh'} overflow={'scroll'}>
              <CardBody>
                <Text fontWeight={'bold'}>誰買了咖啡</Text>
                {!loadingTotalCoffee ?
                (
                  <Box>
                    {recentCoffee && recentCoffee?.map((coffee, index) => {
                      return (
                        <Card key={index} my={'10px'}>
                          <CardBody>
                            <Flex alignItems={'center'}>
                              <Image
                                src={CoffeeLogo}
                                alt='Coffee'
                                width={30}
                                height={30}
                                mr={'10px'}
                                />
                                <Text fontWeight={'bold'} mr='10px'>
                                  {coffee[2] ? coffee[2] : '匿名人士'}
                                </Text>
                                <Tooltip
                                  label={`錢包地址 : ${coffee[0]}`}
                                  bg={'gray.200'}
                                  color='black'
                                
                                >
                                  <InfoOutlineIcon />
                                </Tooltip>
                                </Flex>
                              <Flex>
                                <Text>
                                  {coffee[1] ? coffee[1] : '這個人啥都沒留下'}
                                </Text>
                                
                              </Flex>
                            
                          </CardBody>
                        </Card>
                      )
                    })}
                  </Box>
                ) : (
                    <stack>
                      <Skeleton height={'100px'}/>
                      <Skeleton height={'100px'}/>
                      <Skeleton height={'100px'}/>
                    </stack>
                    )
                  }

              </CardBody>
             </Card>
            </Box>
          </SimpleGrid>

        </Flex>
      </Container>
    </Box>
  );
}
