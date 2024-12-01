import { useEffect, useRef, useState} from "react"
import SearchBar from "../../shared/components/searchbar"
import IProduct from "../../shared/interfaces/IProduct";
import { ProductService } from "../../shared/services/api/Products/ProductsService";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, IconButton, Snackbar, SnackbarContent, TextField, Typography } from "@mui/material";
import Logo from "../../shared/components/logo";
import PriceFormat from "../../shared/Utils/PriceFormat";
import { AddCircle, ArrowBack, Delete, Edit } from "@mui/icons-material";
import { AutoNumericTextField } from "material-ui-autonumeric";

export default function ManageProduct() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState<number>(1);
    const [totalProducts, setTTotalProducts] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);
    
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogProduct, setDialogProduct] = useState<IProduct | null>();
    const [formData, setFormData] = useState({
        description: '',
        imageUrl: '',
        name: '',
        price: ''
    });

    const [errors, setErrors] = useState({
        Description: new Array<String>(),
        ImageUrl: new Array<String>(),
        Name: new Array<String>(),
        Price: new Array<String>()
    });

    function openDialog(id: number | null) {
        setDialogOpen(true);
        const prod = products.find((prod) => prod.id == id);
        setDialogProduct(prod);
        setFormData({
            description: prod?.description || '',
            imageUrl: prod?.imageUrl || '',
            name: prod?.name || '',
            price: PriceFormat(prod?.price || 0).replaceAll("R$", "").trim()
        });
    }
    function closeDialog() {
        setDialogOpen(false);
        setFormData({
            description: '',
            imageUrl: '',
            name: '',
            price: ''
        });
    }

    function handleInputChange(e: React.BaseSyntheticEvent) {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    function hasError(errors: String[]) {
        if (errors) {
            return !!errors.join(',');
        }

        return false;
    }

    function getErrorMessage(errors: String[]) {
        if (!hasError(errors)) {
            return '';
        }

        return errors.join(', ');
    }

    function handleSubmit(event: React.BaseSyntheticEvent) {
        event.preventDefault();
        setErrors({
            Description: new Array<String>(),
            ImageUrl: new Array<String>(),
            Name: new Array<String>(),
            Price: new Array<String>()
        });
        
        let price = formData.price;
        price = price.replaceAll(".", "").replaceAll(",", ".");
        if(!dialogProduct) {
            ProductService.create({
                description: formData.description,
                imageUrl: formData.imageUrl,
                name: formData.name,
                price: Number(price),
            }).
            then(response => {
                setFormData({
                    description: response.data.description,
                    imageUrl: response.data.imageUrl,
                    name: response.data.name,
                    price: PriceFormat(response.data.price).replaceAll("R$", "").trim()
                });
                setDialogProduct(response.data);
                setSnackBarOpen(true);
                setPage(1);
                searchProducts('');
                searchTotalProducts();
            }).
            catch(error => {
                setErrors(error.errors);
            });
            return;
        }

        ProductService.update(dialogProduct.id, {
            description: formData.description,
            imageUrl: formData.imageUrl,
            name: formData.name,
            price: Number(price),
        }).
        then(response => {
            setSnackBarOpen(true);
            setFormData({
                description: response.data.description,
                imageUrl: response.data.imageUrl,
                name: response.data.name,
                price: PriceFormat(response.data.price).replaceAll("R$", "").trim()
            });
            
            setProducts(products.map((prod) => {
                if (prod.id == dialogProduct.id) {
                    prod.description = response.data.description,
                    prod.imageUrl = response.data.imageUrl,
                    prod.name = response.data.name,
                    prod.price = response.data.price
                }
                return prod;
            }))
        }).
        catch(error => {
            setErrors(error.errors);
        });
    }

    function handleDelete(event: React.BaseSyntheticEvent, id: number) {
        event.preventDefault();

        ProductService.remove(id).
        then(() => {
            const prods = products.filter((prod) => prod.id != id);
            setProducts(prods);
            setSnackBarOpen(true);
            setDialogOpen(false);
        }).
        catch(error => {
            setErrors(error.errors);
        });
    }

    function handleValue(value: string) {
        gridRef.current?.scrollTo({top: 0, behavior: "instant"});
        setPage(1);
        searchProducts(value);
        searchTotalProducts();
    }

    async function searchProducts(value: string) {
        setFilter(value);
        const response = await ProductService.getAll(1, value);
        setProducts(response);   
    }

    async function searchMoreProducts() {
        const response = await ProductService.getAll(page + 1, filter);
        setProducts(prevProducts => [...prevProducts, ...response]);
    }

    async function searchTotalProducts() {
        const response = await ProductService.getTotalCount();
        setTTotalProducts(response);
    }

    useEffect(() => {
        setPage(1);
        searchProducts('');
        searchTotalProducts();
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

    return (
        <>
            <SearchBar handleValue={handleValue}/>
            <div style={{                
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <div style={{
                        overflow: "auto",
                        height: '100%',
                        width: '100%',
                    }}
                    onScroll={handleScroll}
                    ref={gridRef}
                    >
                    <div className="grid-responsive-cards">
                        {products?.map((product) => 
                            <Card
                                sx={{
                                    margin: '10px',
                                    maxWidth: '300px',
                                    width: '100%',
                                    float: 'left'
                                }}
                                key={product.id}
                            >
                                {!!product.imageUrl && 
                                    <CardMedia
                                        component='img'
                                        image={product.imageUrl}
                                        sx={{
                                            height: '170px',
                                            cursor: "pointer"
                                        }}
                                        onClick={() => openDialog(product.id)}
                                    />
                                }
                                {!product.imageUrl && 
                                    <div
                                        onClick={() => openDialog(product.id)}
                                        style={{
                                            height:'170px',
                                            display:'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: "pointer"
                                        }}
                                    >
                                        <Logo width={300} height={120} />
                                    </div>
                                }
                                <CardContent sx={{
                                    paddingBottom: 0,
                                    paddingTop: '5px'
                                }}>
                                    <Typography variant="body1" sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        height: '60px'
                                    }}>
                                        {product.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography marginLeft="10px" variant="body2">
                                        {PriceFormat(product.price)}
                                    </Typography>
                                    <div>
                                        <IconButton color='primary' onClick={() => openDialog(product.id)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={(e) => handleDelete(e, product.id)}>
                                            <Delete />
                                        </IconButton>
                                    </div>
                                </CardActions>
                            </Card>
                        )}
                    </div>
                    <Button variant="contained" sx={{
                            position: 'absolute',
                            bottom: 15,
                            right: 30,
                        }}
                        onClick={() => openDialog(null)}
                    >
                        <AddCircle sx={{marginRight: '5px'}}/>
                        Novo
                    </Button>
                </div>
            </div>
            <Dialog open={dialogOpen} fullScreen>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '10px 10px 0'
                }}>
                    <IconButton onClick={closeDialog}>
                        <ArrowBack />                    
                    </IconButton>
                </div>
                <div style={{
                        overflow: "auto",
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "20px",
                            width: "100%",
                            maxWidth:"400px"
                        }}
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}                    
                    >
                        <TextField
                            size="small"
                            fullWidth
                            required
                            label="Nome" 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={hasError(errors.Name)}
                            helperText={getErrorMessage(errors.Name)}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            required
                            label="Descrição" 
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            error={hasError(errors.Description)}
                            helperText={getErrorMessage(errors.Description)}
                        />
                        <TextField
                            size="small"
                            fullWidth
                            label="Url imagem" 
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            error={hasError(errors.ImageUrl)}
                            helperText={getErrorMessage(errors.ImageUrl)}
                        />
                        <AutoNumericTextField
                            props={{
                                size: 'small',
                                label:"Preço",                                
                                fullWidth: true,
                                required: true,
                                name: "price",
                                value: formData.price,
                                onChange: handleInputChange,
                                error: hasError(errors.Price),
                                helperText: getErrorMessage(errors.Price)
                            }}
                            autoNumericOptions={{
                                decimalCharacter: ',',
                                digitGroupSeparator: '.',
                                minimumValue: '0',
                                maximumValue: "99999.99"
                            }}
                        />
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            {dialogProduct && 
                                <Button
                                    variant="contained"
                                    onClick={(e) => handleDelete(e, dialogProduct.id)}
                                >
                                    Deletar
                                </Button>
                            }
                            <Button
                                variant="contained"
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </div>
                    </Box>
                </div>
            </Dialog>
            <Snackbar
                open={snackBarOpen}
                anchorOrigin={{ horizontal: "center", vertical: "bottom"}}
                autoHideDuration={5000}
                onClose={() => setSnackBarOpen(false)}                
            >
                <SnackbarContent
                    sx={{
                        backgroundColor: 'green',
                        color: 'white'
                    }}
                    message="Operação realizada com sucesso!"
                />
            </Snackbar>
        </>
    )
}