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
import { TecnicoService } from "../service/TecnicoService";

const Crud = () => {
    let emptyTecnico = {
        id: null,
        cedula:"",
        nombre: "",
        apellido:"", 
        email:"",
        telefono:"",
        direccion:"",
        ciudad_id:"",
        id_empresa:"",
    };

    const [provincias, setTecnicos] = useState(null);
    const [provinciaDialog, setProvinciaDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [tecnico, setTecnico] = useState(emptyTecnico);
    const [selectedProvincias, setSelectedTecnicos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tecnicoservice = new TecnicoService();
        tecnicoservice.getTecnico().then((data) => setTecnicos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setTecnico(emptyTecnico);
        setSubmitted(false);
        setProvinciaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProvinciaDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (tecnico.nombre.trim()) {
            let _products = [...provincias];
            let _product = { ...tecnico };
            if (tecnico.id) {
                const index = findIndexById(tecnico.id);

                _products[index] = _product;

                const tiposerv = new TecnicoService();
                tiposerv.putTecnico(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tecnico Actualizado",
                    life: 3000,
                });
            } else {
                const tiposerv = new TecnicoService();
                tiposerv.postTecnico(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tecnico creado",
                    life: 3000,
                });
            }

            setTecnicos(_products);
            setProvinciaDialog(false);
            setTecnico(emptyTecnico);
        }
    };

    const editProduct = (product) => {
        setTecnico({ ...product });
        setProvinciaDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setTecnico(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = provincias.filter((val) => val.id !== tecnico.id);
        setTecnicos(_products);
        setDeleteProductDialog(false);
        setTecnico(emptyTecnico);
        const tiposerv = new TecnicoService();
        tiposerv.deleteTipoInstitucion(tecnico.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Tecnico eliminado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < provincias.length; i++) {
            if (provincias[i].id === id) {
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
        let _products = provincias.filter((val) => !selectedProvincias.includes(val));
        setTecnicos(_products);
        setDeleteProductsDialog(false);
        setSelectedTecnicos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Tecnicos eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...tecnico };
        _product["category"] = e.value;
        setTecnico(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...tecnico };
        _product[`${name}`] = val;

        setTecnico(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...tecnico };
        _product[`${nombre}`] = val;

        setTecnico(_product);
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

    const cedulaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {rowData.cedula}
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

    const apellidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido</span>
                {rowData.apellido}
            </>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.telefono}
            </>
        );
    };

    const direccionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Direccion</span>
                {rowData.direccion}
            </>
        );
    };

    const ciudad_idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ciudad_id</span>
                {rowData.ciudad_id}
            </>
        );
    };

    const id_empresaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id_empresa</span>
                {rowData.id_empresa}
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
            <h5 className="m-0">Tecnico</h5>
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
                        value={provincias}
                        selection={selectedProvincias}
                        onSelectionChange={(e) => setSelectedTecnicos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No esta registrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cedula" header="Cedula" body={cedulaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={cedulaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="apellido" header="Apellido" body={apellidoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="Email" header="Email" body={emailBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="Telefono" header="Telefono" body={telefonoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="Direccion" header="Direccion" body={direccionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="Ciudad_id" header="Ciudad_Id" body={ciudad_idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="Id_empresa" header="Id_empresa" body={id_empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={provinciaDialog} style={{ width: "450px" }} header="Tecnico" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                       
                            <label htmlFor="name">Cedula</label>
                            <InputText
                                id="cedula"
                                value={tecnico.cedula}
                                onChange={(e) => onInputChange(e, "cedula")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.cedula,
                                })}
                            />
                             <label htmlFor="description">Nombre</label>
                              <InputText
                                id="nombre"
                                value={tecnico.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.nombre,
                                })}
                            />
                            <label htmlFor="description">Apellido</label>
                              <InputText
                                id="apellido"
                                value={tecnico.apellido}
                                onChange={(e) => onInputChange(e, "apellido")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.apellido,
                                })}
                            />
                            <label htmlFor="description">Email</label>
                              <InputText
                                id="email"
                                value={tecnico.email}
                                onChange={(e) => onInputChange(e, "email")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.email,
                                })}
                            />
                            <label htmlFor="description">Telefono</label>
                              <InputText
                                id="telefono"
                                value={tecnico.telefono}
                                onChange={(e) => onInputChange(e, "telefono")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.telefono,
                                })}
                            />
                            <label htmlFor="description">Direccion</label>
                              <InputText
                                id="direccion"
                                value={tecnico.direccion}
                                onChange={(e) => onInputChange(e, "direccion")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !tecnico.direccion,
                                })}
                            />
                           
                            {submitted && !tecnico.nombre && <small className="p-invalid">El nombre del tecnico es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tecnico && (
                                <span>
                                    Está seguro de borrar el tecnico <b>{tecnico.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tecnico && <span>Está seguro de borrar estos tecnicos?</span>}
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

export default React.memo(Crud, comparisonFn)
       