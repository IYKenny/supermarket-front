import EmployeesTable from "./EmployeesTable";
import { useEffect, useState } from "react";
import { CiCircleQuestion, CiSearch } from "react-icons/ci";
import {
  Flex,
  Text,
  Input,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  useToast,
  Spinner,
  Box,
  Center,
  Heading,
  Button,
  Stack,
  Divider,
  ButtonGroup,
  Image
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import "../../dashboard.css";
import { AiFillCalendar, AiFillPlusCircle } from "react-icons/ai";
import CreateCarOwnerModal from "./CreateCarOwnerModal";
import { useLocation, useNavigate } from "react-router-dom";
import useCarOwners from "../../apis/useEmployees";
import { FiMinus, FiPlus } from "react-icons/fi";

const Employees = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const {
    getAllLoading,
    getAllCarOwners,
    owners,
    getTotalCarOwners,
    totalOwners,
  } = useCarOwners();
  const itemsPerPage = 5;
  const location = useLocation();
  const [pageNum, setPageNum] = useState<number>(1);
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const page: any = searchParams.get("page");
    if (parseInt(page) > 0) {
      return setPageNum(page);
    }
    return navigate("/?page=1");
  }, [searchParams]);

  const headers: any = [
    {
      name: "First Name",
    },
    {
      name: "Last Name",
    },
    {
      name: "National ID",
      sortable: true,
    },
    {
      name: "Phone number",
    },
    {
      name: "Email",
    },
    {
      name: "Department",
    },
    {
      name: "Position",
    },
    {
      name: "Manufacturer",
    },
    {
      name: "Model",
    },
    {
      name: "Serial Number",
    },
    // {
    //   name: "Manage",
    // },
  ];

  const getOwnersByPageNum = (pageNum: any) => {
    getAllCarOwners(itemsPerPage, pageNum);
  };

  useEffect(() => {
    getOwnersByPageNum(pageNum);
  }, [pageNum]);

  //get total car owners to set pagination total
  useEffect(() => {
    getTotalOwners();
  }, []);

  const getTotalOwners = async () => {
    getTotalCarOwners(0, 0);
  };

  return (
    <>
      <Box pl="25px" pr="25px" mx="0px" pt={"30px"}>
        <Box className="table-nav">
          <Box className="tb-title">
            <Text>Products</Text>
          </Box>
        </Box>

        <Box className="customers-table-container w-full" marginBottom={"40px"}>
          {
            !getAllLoading && owners?.length==0?
<Box w={'100%'} py={'30px'} >
  <Center w={'100%'}><Text fontSize={'20px'} fontWeight={'bold'}>No products available</Text></Center>
</Box>
            :
            <></>
          }
          <Flex flexWrap={'wrap'} columnGap={'20px'}>
          {
            owners?.map((owner:any)=>{
              return(
                <Product owner={owner} />
              )
            })
          }
          </Flex>
        </Box>
      </Box>

      <CreateCarOwnerModal
        onSuccess={() => {
          getOwnersByPageNum(pageNum);
          setIsOpen(false);
          getTotalCarOwners(0, 0);
        }}
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => {
          setIsOpen(false);
        }}
      ></CreateCarOwnerModal>
    </>
  );
};

const Product = ({owner}:any)=>{
  const [count,setCount] = useState<number>(0);
  const toast = useToast()

  const addToCart = (productInfo:any)=>{
 try{
  const  currentCart = localStorage.getItem("cart");
  let newCart:any  = [];
  if(currentCart){
    const cartArrObj = JSON.parse(currentCart);
    if(cartArrObj?.length>0){
        newCart = cartArrObj?.filter((p:any)=>p?.code != productInfo?.code)
    }
  }
  newCart.push({...productInfo,quantity: count})
  toast({
    title: "Success",
    description: "Product added to cart successfully!",
    status: "success",
    duration: 2000,
    isClosable: true,
    position: "top-right",
});
  localStorage.setItem("cart",JSON.stringify(newCart))
 }
 catch(error){
alert("An error ocurred, please try again")
 }
  }
              return(
                <Card maxW='sm'>
                <CardBody>
                  <Image
                    src={owner?.image}
                    w={'100%'}
                    minW={'250px'}
                    objectFit={'cover'}
                    h={'220px'}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                  />
                  <Stack mt='6' spacing='3'>
                    <Heading size='md'>{owner?.name}</Heading>
                    {/* <Text>
                      This sofa is perfect for modern tropical spaces, baroque inspired
                      spaces, earthy toned spaces and for people who love a chic design with a
                      sprinkle of vintage design.
                    </Text> */}
                    <Text color='blue.600' fontSize='2xl'>
                      RWF {owner?.price?.toLocaleString()}
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing='2'>
                   <Flex columnGap={'6px'}>
                    <Center><button onClick={()=>{
                      if(count-1>=0){
                        setCount(count-1)
                      }
                    }}><FiMinus size={20} /></button></Center>
<Center><Text>{count}</Text></Center>
                    <Center><button onClick={()=>{
                      if(count<owner?.quantity){
                        setCount(count+1)
                      }
                    }}><FiPlus size={20} /></button></Center>
                   </Flex>
                   {
                    count>0?
                    <Button onClick={()=>{
                      addToCart(owner)
                    }} variant='ghost' colorScheme='blue'>
                      Add to cart
                    </Button>
                    :
                    <></>
                   }
                  </ButtonGroup>
                </CardFooter>
              </Card>
              )
}

export default Employees;
