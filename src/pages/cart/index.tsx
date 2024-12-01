import { useEffect, useRef, useState } from "react";
import SearchBar from "../../shared/components/searchbar"
import IProduct from "../../shared/interfaces/IProduct";
import { CartService } from "../../shared/services/api/Cart/CartService";
import { Product } from "../../shared/classes/Product";
import ProductCart from "../../shared/components/ProductCart";
import { Autocomplete, Button, Dialog, Divider, FormControl, FormControlLabel, FormLabel, IconButton, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import IAddress from "../../shared/interfaces/IAddress";
import { AddressService } from "../../shared/services/api/Addresses/AddressesService";
import { OrderService } from "../../shared/services/api/Order/OrderService";
import { useNavigate } from "react-router-dom";
import PriceFormat from "../../shared/Utils/PriceFormat";
import IConfigs from "../../shared/interfaces/IConfigs";
import { AdminService } from "../../shared/services/api/Admin/AdminService";

export default function Cart() {    
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState<number>(1);
    const [totalProducts, setTTotalProducts] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [config, setConfig] = useState<IConfigs>();

    const [isDelivery, setIsDelivery] = useState(false);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [address, setAddress] = useState<{ id: number; label: string; } | null>();
    const [addressError, setAddressError] = useState(false);
    const [observation, setObservation] = useState('');
    const navigation = useNavigate();

    function searchFilterProducts(value: string) {
        gridRef.current?.scrollTo({top: 0, behavior: "instant"});
        setPage(1);
        searchProducts(value);
        searchTotalProducts();
    }

    function updateProduct(id: number, quantity: number, checked: boolean) {
        const Product = products.find((product) => product.id === id);
        if (Product) {
            Product.quantity = quantity;
            Product.checked = checked;
        }

        updateTotal(isDelivery);
    }

    function updateTotal(isDelivery: boolean) {
        const checkedProducts = products.filter(prod => prod.checked);
        if (checkedProducts.length > 0) {            
            let totalChecked = checkedProducts.map(prod => prod.price * prod.quantity).reduce((a, b) => a + b);

            if (isDelivery && config && config.deliveryTax) {
                totalChecked += config.deliveryTax;
            }
            setTotalOrder(totalChecked);
        } else setTotalOrder(0);
    }

    async function searchProducts(value: string) {
        setFilter(value);
        const response = await CartService.getAll(1, value);
        setProducts(response); 
    }

    async function searchMoreProducts() {
        const response = await CartService.getAll(page + 1, filter);
        setProducts(prevProducts => [...prevProducts, ...response]);
    }

    async function searchTotalProducts() {
        const response = await CartService.getTotalCount();
        setTTotalProducts(response);
    }

    async function searchAddresses() {
        const response = await AddressService.getAll();
        setAddresses(response);
    }

    useEffect(() => {
        setPage(1);
        searchProducts('');
        searchTotalProducts();
        searchAddresses();
        
        
        AdminService.getConfigs().
            then(response => {
                setConfig(response.data);
            });
    }, [])

    function handleScroll() {
        const scrollHeight = gridRef?.current?.scrollHeight ? gridRef?.current?.scrollHeight : 0;
        const scrollTop = gridRef?.current?.scrollTop ? gridRef?.current?.scrollTop : 0;

        const bottom = (scrollHeight - scrollTop == gridRef?.current?.clientHeight);
        if (bottom && totalProducts > products.length) {
            setPage(page + 1);
            searchMoreProducts();
        }
    }

    function openDialog() {
        setDialogOpen(true);
    }
    function closeDialog() {
        setDialogOpen(false);
        setIsDelivery(false);
        updateTotal(false);
    }
    function createOrder() {
        setAddressError(false);

        if (isDelivery && !address) {
            setAddressError(true);
            return
        }

        OrderService.create({
            isDelivery: isDelivery,
            addressId: address?.id,
            products: products?.filter(product => product.checked).map((product) => {
                return {
                    id: product.id,
                    quantity: product.quantity
                }
            }),
            observation: observation
        }).then(response => {
            navigation(`../profile/orders/${response.data.id}`);
        }).
        catch(error => console.log(error));
    }
    return (
        <>
            <SearchBar handleValue={searchFilterProducts}/>
            <div style={{
                    overflow: "auto",
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                onScroll={handleScroll}
                ref={gridRef}
                >
                {products?.map((product) => 
                    <ProductCart key={product.id} product={new Product(product)} onChange={updateProduct} ProductOrder={false} updateList={() => searchProducts(filter)}/>
                )}
            </div>
            <Paper sx={{
                width: '100%'
            }}>
                <div style={
                {
                    maxWidth: '700px',
                    width: '100%',
                    padding: '10px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography>
                        Total: {PriceFormat(totalOrder)}
                    </Typography>
                    <Button variant="contained" disabled={totalOrder == 0} onClick={openDialog}>Continuar</Button>
                </div>
            </Paper>
            <Dialog open={dialogOpen} fullScreen>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: 10
                }}>
                    <IconButton onClick={closeDialog}>
                        <ArrowBack />                    
                    </IconButton>
                    <Typography
                        component="h1"
                        fontSize="1.5rem"
                    >
                        Finalizar pedido
                    </Typography>
                </div>
                <div style={{
                    overflow: "auto",
                    height: '100%'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: '700px',
                        padding: '10px',
                        margin: '0px auto'
                    }}>
                        <FormControl sx={{marginLeft: '10px', width: '100%'}}>
                            <FormLabel>Entrega *</FormLabel>
                            <RadioGroup
                                value={isDelivery}
                                onChange={(e) => {setIsDelivery(JSON.parse(e.target.value)); updateTotal(JSON.parse(e.target.value))}}
                            >
                                <FormControlLabel value={false} control={<Radio />} label="Retirada"/>
                                <FormControlLabel value={true} control={<Radio />} label="Entrega"/>
                            </RadioGroup>
                            {isDelivery && 
                                <Autocomplete 
                                    size="small"
                                    sx={{ marginBottom: '10px', paddingRight: '20px'}}
                                    options={addresses.map((address) => {
                                        return {
                                            label: `${address.street}, ${address.number} ${!address.complement ? '' : ', ' + address.complement} - ${address.neighborhood}, ${address.postalCode}`,
                                            id: address.id
                                        }
                                    })}
                                    value={address || null}
                                    onChange={(event, newValue) => {setAddress(newValue); console.log(event)}}
                                    renderInput={(params) => <TextField {...params} label="Endereço *" error={addressError}/>}
                                />
                            }
                        </FormControl>
                        <Divider variant="middle" />
                        <TextField
                            size="small"
                            fullWidth
                            label="Observação" 
                            type="text"
                            value={observation}
                            sx={{marginLeft: '10px', marginTop: '10px', paddingRight: '20px', marginBottom: '10px'}}
                            onChange={(e) => {
                                e.target.value = e.target.value.slice(0, 199);
                                setObservation(e.target.value);
                            }}
                        />
                        <Divider variant="middle" />
                        {products?.filter(product => product.checked).map((product) =>
                            <ProductCart key={product.id} product={new Product(product)} onChange={updateProduct} ProductOrder={true}/>
                        )}
                    </div>
                </div>
                <Paper sx={{
                    width: '100%'
                }}>
                    <div style={
                    {
                        maxWidth: '700px',
                        width: '100%',
                        padding: '10px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            {isDelivery && config && config.deliveryTax > 0 &&
                                <>
                                    <Typography variant="body2">
                                        {isDelivery && config && config.deliveryTax > 0 &&
                                            `Subtotal: ${PriceFormat(totalOrder - config.deliveryTax)}`
                                        }
                                    </Typography>
                                    <Typography variant="body2">
                                        {isDelivery && config && config.deliveryTax > 0 &&
                                            `Taxa de entrega: ${PriceFormat(config.deliveryTax)}`
                                        }
                                    </Typography>
                                </>
                            }
                            <Typography>
                                Total: {PriceFormat(totalOrder)}
                            </Typography>
                        </div>
                        <Button variant="contained" disabled={totalOrder == 0} onClick={createOrder}>Finalizar</Button>
                    </div>
                </Paper>
            </Dialog>
        </>
    )
}