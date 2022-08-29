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
import { FormaPagoService} from "../service/FormaPagoService";

const CrudFormaPago = () => {
    let emptyProvincia = {
        id: null,
        codigo: "",
        nombre: "",
        empresa:"",
    };

    const [formaPagos, setformaPagos] = useState(null);
    const [formaPagoDialog, setformaPagoDialog] = useState(false);
    const [deleteformaPagoDialog, setDeleteformaPagoDialog] = useState(false);
    const [deleteformaPagosDialog, setDeleteformaPagosDialog] = useState(false);
    const [formaPago, setformaPago] = useState(emptyProvincia);
    const [selectedformaPagos, setSelectedformaPagos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const formaPagoservice = new FormaPagoService();
        formaPagoservice.getFormaPago().then((data) => setformaPagos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setformaPago(emptyProvincia);
        setSubmitted(false);
        setformaPagoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setformaPagoDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteformaPagoDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteformaPagosDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (formaPago.nombre.trim()) {
            let _products = [...formaPagos];
            let _product = { ...formaPago };
            if (formaPago.id) {
                const index = findIndexById(formaPago.id);

                _products[index] = _product;

                const tiposerv = new FormaPagoService();
                tiposerv.putFormaPago(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Forma Pago actualizada",
                    life: 3000,
                });
            } else {
                const tiposerv = new FormaPagoService();
                tiposerv.postFormaPago(_product)
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

            setformaPagos(_products);
            setformaPagoDialog(false);
            setformaPago(emptyProvincia);
        }
    };

    const editProduct = (product) => {
        setformaPago({ ...product });
        setformaPagoDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setformaPago(product);
        setDeleteformaPagoDialog(true);
    };

    const deleteProduct = () => {
        let _products = formaPagos.filter((val) => val.id !== formaPago.id);
        setformaPagos(_products);
        setDeleteformaPagoDialog(false);
        setformaPago(emptyProvincia);
        const tiposerv = new FormaPagoService();
        tiposerv.deleteFormaPago(formaPago.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Forma Pago eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < formaPagos.length; i++) {
            if (formaPagos[i].id === id) {
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
        setDeleteformaPagosDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = formaPagos.filter((val) => !selectedformaPagos.includes(val));
        setformaPagos(_products);
        setDeleteformaPagosDialog(false);
        setSelectedformaPagos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Formas de pago eliminadas ",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...formaPago };
        _product["category"] = e.value;
        setformaPago(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...formaPago };
        _product[`${name}`] = val;

        setformaPago(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...formaPago };
        _product[`${nombre}`] = val;

        setformaPago(_product);
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

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nombre}
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
                {rowData.nombre}
            </>
        );
    };
    const empresaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Empresa</span>
                {rowData.empresa}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
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
            <h5 className="m-0">Tipos de Intituciones</h5>
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
                        value={formaPagos}
                        selection={selectedformaPagos}
                        onSelectionChange={(e) => setSelectedformaPagos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No hay tipos de instituciones registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="codigo" header="Codigo" body={codigoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="empresa" header="Empresa" body={empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={formaPagoDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="codigo">Codigo</label>
                            <InputText
                                id="codigo"
                                value={formaPago.codigo}
                                onChange={(e) => onInputChange(e, "codigo")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !formaPago.codigo,
                                })}
                            />
                             <label htmlFor="nombre">Nombre</label>
                              <InputText
                                id="nombre"
                                value={formaPago.nombre}
                                onChange={(e) => onInputChange(e, "descripcion")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !formaPago.nombre,
                                })}
                                />
                             <label htmlFor="empresa">Empresa</label>
                              <InputText
                                id="descripcion"
                                value={formaPago.empresa}
                                onChange={(e) => onInputChange(e, "descripcion")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !formaPago.empresa,
                                })}
                            />

                            {submitted && !formaPago.nombre && <small className="p-invalid">El nombre del tipo de institucion es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteformaPagoDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {formaPago && (
                                <span>
                                    Está seguro de borrar<b>{formaPago.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteformaPagosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {formaPago && <span>Está seguro de borrar los tipos de institucion?</span>}
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

export default React.memo(CrudFormaPago, comparisonFn);