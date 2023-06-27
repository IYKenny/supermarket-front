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
import axiosInstance from "../../util/axios";

const Cart = () => {

    const [carts,setCarts] = useState<any>([])
const toast = useToast();
const navigate = useNavigate()
    const getCarts  =()=>{
        try{
            const currentCart:any = localStorage.getItem("cart");
            if(currentCart){
                setCarts(JSON.parse(currentCart));
            }
        }
        catch(error){alert("an error ocuured")}
    }

    useEffect(()=>{
        getCarts()
    },[])

    const checkout = async()=>{
       try{
        if(carts.length>0){
            for(let i=0; i<carts.length; i++){
                const data = {
                    quantity: carts[i]?.quantity,
                    code: parseInt(carts[i]?.code)
                };
                console.log( "data",data)
                const res:any = await axiosInstance.post("/product-purchased",data);
            }
            toast({
                title: "Success",
                description: "Products purchased successfully!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top-right",
            });
        localStorage.removeItem("cart")
            navigate("/")
        }
       }
       catch(error){
        console.log(error)
        toast({
            title: "Failed",
            description: "error occurred , please try again",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top-right",
        });
       }
    }

    const getTotal = ()=>{
        let sum = 0;
        for(let i=0; i<carts.length; i++){
           sum+= parseFloat(carts[i]?.price) * parseFloat(carts[i]?.quantity);
    }
    return sum;
}

const removeCart = (productInfo:any)=>{
    try{
        const  currentCart = localStorage.getItem("cart");
        let newCart:any  = [];
        if(currentCart){
          const cartArrObj:any = JSON.parse(currentCart);
          if(cartArrObj?.length>0){
              newCart = cartArrObj?.filter((p:any)=>p?.code != productInfo?.code)
          }
        }
        setCarts(newCart)
        toast({
          title: "Success",
          description: "Product removed from cart successfully!",
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
 
  return (
    <>
      <Box pl="25px" pr="25px" mx="0px" pt={"30px"}>
        <Box className="table-nav">
          <Box className="tb-title">
            <Text>Products added to cart</Text>
          </Box>
        </Box>

        <Box py={'20px'} px={'20px'} className="customers-table-container w-full" marginBottom={"40px"}>
          {
           carts?.length==0?
<Box w={'100%'} py={'30px'} >
  <Center w={'100%'}><Text fontSize={'20px'} fontWeight={'bold'}>No products added to cart available</Text></Center>
</Box>
            :
            <></>
          }
          <Flex mb={'10px'} flexWrap={'wrap'} columnGap={'20px'}>
          {
            carts?.map((cart:any)=>{
              return(
                <Product onRemove={(productInfo:any)=>{
                    removeCart(productInfo)
                }} owner={cart} />
              )
            })
          }

          </Flex>
          {
            carts?.length>0?
<Box py={'10px'}>
<Text mb={'10px'} color='blue.600' fontSize='2xl'>
                      Total: {getTotal()?.toLocaleString()}
                    </Text>
<Button  colorScheme="primary" onClick={()=>{
    checkout()
}}>Buy Now</Button>
    </Box>
            :
            <></>
          }
        </Box>
      </Box>
      </>
  );
};

const Product = ({owner,onRemove}:any)=>{
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
                      Quantity: {owner?.quantity}
                    </Text>
                      <Text color='blue.600' fontSize='2xl'>
                      Total Price: RWF {(parseFloat(owner?.quantity)*(owner?.price))?.toLocaleString()}
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing='2'>
                   
<Button onClick={()=>{
onRemove(owner)
}} colorScheme="red">Remove</Button>
                  
                  </ButtonGroup>
                </CardFooter>
              </Card>
              )
}

export default Cart;
