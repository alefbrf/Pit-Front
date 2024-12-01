import { useEffect, useRef, useState} from "react"
import SearchBar from "../../shared/components/searchbar"
import { Product } from "../../shared/classes/Product";
import ProductCard from "../../shared/components/product";
import IProduct from "../../shared/interfaces/IProduct";
import { FavoriteService } from "../../shared/services/api/Favorites/FavoritesService";
import '../../index.css'

export default function Favorite() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState<number>(1);
    const [totalProducts, setTTotalProducts] = useState(0);
    const gridRef = useRef<HTMLDivElement>(null);

    function handleValue(value: string) {
        gridRef.current?.scrollTo({top: 0, behavior: "instant"});
        setPage(1);
        searchProducts(value);
        searchTotalProducts();
    }

    async function searchProducts(value: string) {
        setFilter(value);
        const response = await FavoriteService.getAll(1, value);
        setProducts(response);        
    }

    async function searchMoreProducts() {
        const response = await FavoriteService.getAll(page + 1, filter);
        setProducts(prevProducts => [...prevProducts, ...response]);
    }

    async function searchTotalProducts() {
        const response = await FavoriteService.getTotalCount();
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
                    overflow: "auto",
                    height: '100%',
                    width: '100%'
                }}
                onScroll={handleScroll}
                ref={gridRef}
                >
                <div className="grid-responsive-cards">
                    {products?.map((product, index) => 
                        <ProductCard product={new Product(product)} key={index}/>
                    )}
                </div>
            </div>
        </>
    )
}