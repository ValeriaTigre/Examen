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
import {  InformacionAdicionalService } from "../service/InformacionAdicionalService"

const Crud = () => {
    let emptyInformacionAdicional = {
        id: null,
        nombre: "",
        descripcion: "",
        empresa: ""
    };

    const [informacionadicionales, setInformacionAdicionales] = useState(null);
    const [informacionadicionalDialog, setInformacionAdicionalDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [informacionadicional, setInformacionAdicional] = useState(emptyInformacionAdicional);
    const [selectedInformacionAdicionales, setSelectedInformacionAdicionales] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const informacionadicionalService = new InformacionAdicionalService();
        informacionadicionalService.getInformacionAdicionales().then((data) => setInformacionAdicionales(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setInformacionAdicional(emptyInformacionAdicional);
        setSubmitted(false);
        setInformacionAdicionalDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setInformacionAdicionalDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (informacionadicional.nombre.trim()) {
            let _products = [...informacionadicionales];
            let _product = { ...informacionadicional };
            if (informacionadicional.id) {
                const index = findIndexById(informacionadicional.id);

                _products[index] = _product;

                const provserv = new InformacionAdicionalService();
                provserv.putInformacionAdicional(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Informacion adicional actualizada",
                    life: 3000,
                });
            } else {
                const provserv = new InformacionAdicionalService();
                provserv.postInformacionAdicional(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Informacion Adicional creada",
                    life: 3000,
                });
            }

            setInformacionAdicionales(_products);
            setInformacionAdicionalDialog(false);
            setInformacionAdicional(emptyInformacionAdicional);
        }
    };

    const editProduct = (product) => {
        setInformacionAdicional({ ...product });
        setInformacionAdicionalDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setInformacionAdicional(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = informacionadicionales.filter((val) => val.id !== informacionadicional.id);
        setInformacionAdicionales(_products);
        setDeleteProductDialog(false);
        setInformacionAdicional(emptyInformacionAdicional);
        const provserv = new InformacionAdicionalService();
        provserv.deleteInformacionAdicional(informacionadicional.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Informacion Adicional eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < informacionadicionales.length; i++) {
            if (informacionadicionales[i].id === id) {
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
        let _products = informacionadicionales.filter((val) => !selectedInformacionAdicionales.includes(val));
        setInformacionAdicionales(_products);
        setDeleteProductsDialog(false);
        setSelectedInformacionAdicionales(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Informacion adicional eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...informacionadicional };
        _product["category"] = e.value;
        setInformacionAdicional(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...informacionadicional };
        _product[`${name}`] = val;

        setInformacionAdicional(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...informacionadicional };
        _product[`${nombre}`] = val;

        setInformacionAdicional(_product);
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

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    };
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.descripciom}
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
            <h5 className="m-0">Informacion Adicional</h5>
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
                        value={informacionadicionales}
                        selection={selectedInformacionAdicionales}
                        onSelectionChange={(e) => setSelectedInformacionAdicionales(e.value)}
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
                        <Column field="id" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="descripcion" header="Descripcion" body={descripcionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="empresa" header="Empresa" body={empresaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={informacionadicionalDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="nombre"
                                value={informacionadicional.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !informacionadicional.nombre,
                                })}
                            />
                            <label htmlFor="descripcion">Descripcion</label>
                            <InputText
                                id="descripcion"
                                value={informacionadicional.descripciom}
                                onChange={(e) => onInputChange(e, "descripciom")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !informacionadicional.descripcion,
                                })}
                            />
                            <label htmlFor="empresa">Empresa</label>
                            <InputText
                                id="emperesa"
                                value={informacionadicional.empresa}
                                onChange={(e) => onInputChange(e, "empresa")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !informacionadicional.empresa,
                                })}
                            />
                            {submitted && !informacionadicional.nombre && <small className="p-invalid">El nombre de la provincia es necesario.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {informacionadicional && (
                                <span>
                                    Está seguro de borrar la provincia <b>{informacionadicional.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {informacionadicional && <span>Está seguro de borrar estas provincias?</span>}
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
