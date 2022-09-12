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
import { FormaPagoService } from "../service/FormaPagoService";
import { EmpresaService } from "../service/EmpresaService";
import { Dropdown } from "primereact/dropdown";

const CrudFormaPago = () => {
  let emptyFormaPago = {
    id: null,
    codigo: "",
    nombre: "",
    empresa: null,
  };

  const [formaPagos, setformaPagos] = useState(null);
  const [formaPagoDialog, setformaPagoDialog] = useState(false);
  const [deleteformaPagoDialog, setDeleteformaPagoDialog] = useState(false);
  const [deleteformaPagosDialog, setDeleteformaPagosDialog] = useState(false);
  const [formaPago, setformaPago] = useState(emptyFormaPago);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empresas, setEmpresas] = useState(null);
  const [selectedformaPagos, setSelectedformaPagos] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const formaPagoservice = new FormaPagoService();
    formaPagoservice.getFormaPago().then((data) => setformaPagos(data));

    const empresaService = new EmpresaService();
    empresaService.getEmpresas().then((data) => setEmpresas(data));
  }, []);

  const openNew = () => {
    setformaPago(emptyFormaPago);
    setSubmitted(false);
    setformaPagoDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setformaPagoDialog(false);
  };

  const hideDeleteFormaPagoDialog = () => {
    setDeleteformaPagoDialog(false);
  };

  const hideDeleteFormaPagosDialog = () => {
    setDeleteformaPagosDialog(false);
  };

  const saveFormaPago = () => {
    setSubmitted(true);

    if (formaPago.nombre.trim()) {
      let _formaPagos = [...formaPagos];
      let _formaPago = { ...formaPago };
      if (formaPago.id) {
        const index = findIndexById(formaPago.id);

        _formaPagos[index] = _formaPago;

        const formaPagoServicio = new FormaPagoService();
        const newEstado = {
          ..._formaPago,
          empresa: empresaSeleccionada,
        };
        console.log(newEstado);
        formaPagoServicio.putFormaPago(newEstado).then((response) => {
          formaPagoServicio.getFormaPago().then((data) => setformaPagos(data));
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Forma Pago actualizada",
            life: 3000,
          });
        });
      } else {
        const formaPagoServicio = new FormaPagoService();
        const newEstado = {
          ..._formaPago,
          empresa: empresaSeleccionada,
        };
        console.log(newEstado);
        formaPagoServicio.postFormaPago(newEstado).then((response) => {
          formaPagoServicio.getFormaPago().then((data) => setformaPagos(data));
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Forma Pago creada",
            life: 3000,
          });
        });
      }

      setformaPagos(_formaPagos);
      setformaPagoDialog(false);
      setformaPago(emptyFormaPago);
    }
  };

  const editFormaPago = (formaPago) => {
    setformaPago({ ...formaPago });
    setformaPagoDialog(true);
  };

  const confirmDeleteFormaPago = (formaPago) => {
    setformaPago(formaPago);
    setDeleteformaPagoDialog(true);
  };

  const deleteFormaPago = () => {
    let _formaPagos = [...formaPagos];
    let _formaPago = { ...formaPago };
    const formaPagoServicio = new FormaPagoService();
    formaPagoServicio.deleteFormaPago({ data: _formaPago }).then((response) => {
      formaPagoServicio.getFormaPago().then((data) => setformaPagos(data));
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Forma de Pago Eliminado",
        life: 3000,
      });
    });
    setformaPagos(_formaPagos);
    setDeleteformaPagoDialog(false);
    setformaPago(emptyFormaPago);
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

  const deleteSelectedProducts = () => {
    let _products = formaPagos.filter(
      (val) => !selectedformaPagos.includes(val)
    );
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

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...formaPago };
    _product[`${name}`] = val;

    setformaPago(_product);
  };

  const onEmpresaChange = (e) => {
    setEmpresaSeleccionada(e.value);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
        </div>
      </React.Fragment>
    );
  };

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Codigo</span>
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
        {rowData.nombre}
      </>
    );
  };
  const empresaBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Empresa</span>
        {rowData.empresa.nombre}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editFormaPago(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteFormaPago(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Tipos de Intituciones</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveFormaPago}
      />
    </>
  );
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFormaPagoDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteFormaPago}
      />
    </>
  );
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFormaPagosDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
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
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="id"
              header="ID"
              body={idBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="codigo"
              header="Codigo"
              body={codigoBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="nombre"
              header="Nombre"
              body={nombreBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="empresa"
              header="Empresa"
              body={empresaBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={formaPagoDialog}
            style={{ width: "450px" }}
            header="Provincia"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
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
              {submitted && !formaPago.codigo && (
                <small className="p-invalid">El Codigo es necesario.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                value={formaPago.nombre}
                onChange={(e) => onInputChange(e, "nombre")}
                required
                className={classNames({
                  "p-invalid": submitted && !formaPago.nombre,
                })}
              />
              {submitted && !formaPago.nombre && (
                <small className="p-invalid">
                  El nombre del tipo de institucion es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="ciudad">Empresa</label>
              <Dropdown
                value={empresaSeleccionada}
                options={empresas}
                onChange={onEmpresaChange}
                optionLabel="nombre"
                placeholder="Seleccione una Empresa"
                required
                className={classNames({
                  "p-invalid": submitted && !formaPago.empresa,
                })}
              />
              {submitted && !formaPago.empresa && (
                <small className="p-invalid">El Estado es necesario.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteformaPagoDialog}
            style={{ width: "450px" }}
            header="Confirmación"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteFormaPagoDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {formaPago && (
                <span>
                  Está seguro de borrar<b>{formaPago.nombre}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteformaPagosDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteFormaPagosDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {formaPago && (
                <span>Está seguro de borrar los tipos de institucion?</span>
              )}
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