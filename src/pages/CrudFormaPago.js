import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../service/ProductService";
import { ProvinciaService as FormaPagoService } from "../service/ProvinciaService"

const Crud = () => {
    let emptyFormaPago = {
        id: null,
        codigo:"",
        nombre: "",
        empresa:""
    };

    const [formaspago, setFormaPagos] = useState(null);
    const [formapagoDialog, setFormaPagoDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [formapago, setFormaPago] = useState(emptyFormaPago);
    const [selectedFormasPago, setSelectedFormaPago] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const formapagoService = new FormaPagoService();
        formapagoService.getFormaPago().then((data) => setFormaPagos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setFormaPagos(emptyFormaPago);
        setSubmitted(false);
        setFormaPagoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setFormaPagoDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (formapago.nombre.trim()) {
            let _products = [...formaspago];
            let _product = { ...formapago };
            if (formapago.id) {
                const index = findIndexById(formapago.id);

                _products[index] = _product;

                const provserv = new FormaPagoService();
                provserv.putFormaPago(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Forma Pago actualizada",
                    life: 3000,
                });
            } else {
                const provserv = new FormaPagoService();
                provserv.postFormaPago(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Forma Pago creada",
                    life: 3000,
                });
            }

            setFormaPagos(_products);
            setFormaPagoDialog(false);
            setFormaPagos(emptyFormaPago);
        }
    };

    const editProduct = (product) => {
        setFormaPagos({ ...product });
        setFormaPagoDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setFormaPagos(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = formaspago.filter((val) => val.id !== formapago.id);
        setFormaPagos(_products);
        setDeleteProductDialog(false);
        setFormaPagos(emptyFormaPago);
        const provserv = new FormaPagoService();
        provserv.deleteFormaPago(formapago.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Forma Pago eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < formaspago.length; i++) {
            if (formaspago[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = formaspago.filter((val) => !selectedFormasPago.includes(val));
        setFormaPagos(_products);
        setDeleteProductsDialog(false);
        setSelectedFormaPago(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Forma Pago eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...formapago };
        _product["category"] = e.value;
        setFormaPagos(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...formapago };
        _product[`${name}`] = val;

        setFormaPagos(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...formapago };
        _product[`${nombre}`] = val;

        setFormaPagos(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.codigo}
            </>
        );
    };


    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {formatCurrency(rowData.nombre)}
            </>
        );
    };

    const empresaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Empresa </span>
                {rowData.empresa}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Forma Pago</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={formaspago}
                        selection={selectedFormasPago}
                        onSelectionChange={(e) => setSelectedFormaPago(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen provincias registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="codigo" header="Codigo" body={codigoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="empresa" header="Empresa" body={empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={formapagoDialog} style={{ width: "450px" }} header="Forma Pago" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                    <label htmlFor="codigo">Codigo</label>
                              <InputText
                                id="codigo"
                                value={formapago.telefono}
                                onChange={(e) => onInputChange(e, "codigo")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !formapago.codigo
                                })}
                            />
                            </div>
                            <div className="field">
                          <label htmlFor="nombre">Nombre</label>
                              <InputText
                                id="Nombre"
                                value={formapago.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !formapago.nombre,
                                })}
                            />
                            {submitted && !formapago.nombre && <small className="p-invalid">El nombre de la forma pago necesario.</small>}
                        </div>
                            
                           
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {formapago && (
                                <span>
                                    Está seguro de borrar la forma de pago<b>{formapago.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {formapago && <span>Está seguro de borrar las formas de pago?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Crud, comparisonFn);
