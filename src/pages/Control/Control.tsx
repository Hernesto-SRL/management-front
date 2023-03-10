import React from "react";
import {Box} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Sidebar, {SidebarSections} from "../../components/Sidebar";
import {
    ArrowCircleDownOutlined,
    ArrowCircleUpOutlined,
    CategoryOutlined,
    Inventory2Outlined,
    PostAddOutlined, WarehouseOutlined
} from "@mui/icons-material";
import StockEntry from "./StockEntry";
import StockExit from "./StockExit";
import NewProduct from "./NewProduct";
import NewProductCategory from "./NewProductCategory";
import NewBatch from "./NewBatch";
import NewWarehouse from "./NewWarehouse";

const sidebarSections: SidebarSections = {
    "Stock" : [
        { title: "Ingreso", to: "/control/stockEntry", icon: <ArrowCircleUpOutlined/> },
        { title: "Salida", to: "/control/stockExit", icon: <ArrowCircleDownOutlined/> },
    ],
    "Productos": [
        { title: "Nuevo Producto", to: "/control/newProduct", icon: <PostAddOutlined/> },
        { title: "Nueva Categoria", to: "/control/newProductCategory", icon: <CategoryOutlined/> },
    ],
    "Lotes": [
        { title: "Nuevo Lote", to: "/control/newBatch", icon: <Inventory2Outlined/> },
    ],
    "Depositos": [
        { title: "Nuevo Deposito", to: "/control/newWarehouse", icon: <WarehouseOutlined/> },
    ]
};

/*
    TODO
    NewSupplier
    DeleteProduct
    DeleteSupplier
    DeleteWarehouse
*/

const Control = () => {
    return (
        <Box display="flex" height="100%">
            <Sidebar title="CONTROL" sections={sidebarSections}/>
            <Routes>
                {/* STOCK */}
                <Route path="stockEntry" element={<StockEntry/>}/>
                <Route path="stockExit" element={<StockExit/>}/>

                {/* PRODUCT */}
                <Route path="newProduct" element={<NewProduct/>}/>
                <Route path="newProductCategory" element={<NewProductCategory/>}/>

                {/* BATCH */}
                <Route path="newBatch" element={<NewBatch/>}/>

                {/* WAREHOUSE */}
                <Route path="newWarehouse" element={<NewWarehouse/>}/>
            </Routes>
        </Box>
    );
};

export default Control;