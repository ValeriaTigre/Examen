import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InformacionAdicionalService } from "../service/InformacionAdicionalService";
// nombre mal crud ->crudprovinvia
const CrudInformacionAdicional = () => {
  let emptyInformacionAdicional = {
    id: null,
    nombre: "",
    descripcion: "",
  };

  //estados
  const [informacionAdicional, setInformacionAdicional] = useState(
    emptyInformacionAdicional
  );
  const [informacionAdicionals, setInformacionAdicionals] = useState(null);

  const [informacionAdicionalDialog, setInformacionAdicionalDialog] =
    useState(false);
  const [
    deleteInformacionAdicionalDialog,
    setDeleteInformacionAdicionalDialog,
  ] = useState(false);
  const [
    deleteInformacionAdicionalsDialog,
    setDeleteInformacionAdicionalsDialog,
  ] = useState(false);

  const [selectedInformacionAdicionals, setSelectedInformacionAdicionals] =
    useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const informacionAdicionalService = new InformacionAdicionalService();
    informacionAdicionalService
      .getInformacionAdicional()
[4:34 p. m., 15/9/2022] Valeria Doming: .then((data) => setInformacionAdicionals(data));
  }, []);

  const openNew = () => {
    setInformacionAdicional(emptyInformacionAdicional);
    setSubmitted(false);
    setInformacionAdicionalDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setInformacionAdicionalDialog(false);
  };

  const hideDeleteInformacionAdicionalDialog = () => {
    setDeleteInformacionAdicionalDialog(false);
  };

  const hideDeleteInformacionAdicionalsDialog = () => {
    setDeleteInformacionAdicionalsDialog(false);
  };

  const saveInformacionAdicional = () => {
    setSubmitted(true);
    if (informacionAdicional.nombre.trim()) {
      let _informacionAdicionals = [...informacionAdicionals];
      let _informacionAdicional = { ...informacionAdicional };
      if (informacionAdicional.id) {
        const index = findIndexById(informacionAdicional.id);

        _informacionAdicionals[index] = _informacionAdicional;

        const informacionAdicionalService = new InformacionAdicionalService();
        informacionAdicionalService.putInformacionAdicional(
          _informacionAdicional
        );
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Informacion Adicional actualizada",
          life: 3000,
        });
      } else {
        const informacionAdicionalService = new InformacionAdicionalService();
        informacionAdicionalService
          .postInformacionAdicional(_informacionAdicional)
          .then((response) => {
            informacionAdicionalService
              .getInformacionAdicional()
              .then((data) => setInformacionAdicionals(data));
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Informacion Adicional creada",
              life: 3000,
            });
          });
      }

      setInformacionAdicionals(_informacionAdicionals);
      setInformacionAdicionalDialog(false);
      setInformacionAdicional(emptyInformacionAdicional);
    }
  };

  const editInformacionAdicional = (informacionAdicional) => {
    setInformacionAdicional({ ...informacionAdicional });
    setInformacionAdicionalDialog(true);
  };

  const confirmDeleteInformacionAdicional = (informacionAdicional) => {
    setInformacionAdicional(informacionAdicional);
    setDeleteInformacionAdicionalDialog(true);
  };

  const deleteInformacionAdicional = () => {
    let _informacionAdicionals = [...informacionAdicionals];
    let _informacionAdicional = { ...informacionAdicional };
    const informacionAdicionalService = new InformacionAdicionalService();
    informacionAdicionalService
      .deleteInformacionAdicional({ data: _informacionAdicional })
      .then((response) => {
        informacionAdicionalService
          .getInformacionAdicional()
          .then((data) => setInformacionAdicionals(data));
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Informacion Adicional Eliminada",
          life: 3000,
        });
      });
    setInformacionAdicionals(_informacionAdicionals);
    setDeleteInformacionAdicionalDialog(false);
    setInformacionAdicional(emptyInformacionAdicional);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < informacionAdicionals.length; i++) {
      if (informacionAdicionals[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const deleteSelectedProducts = () => {
    let _products = informacionAdicionals.filter(
      (val) => !selectedInformacionAdicionals.includes(val)
    );
    setInformacionAdicionals(_products);
    setDeleteInformacionAdicionalsDialog(false);
    setSelectedInformacionAdicionals(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Informacion eliminadas",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...informacionAdicional };
    _product[`${name}`] = val;

    setInformacionAdicional(_product);
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
        <span className="p-column-title">Code</span>
        {rowData.id}
      </>
    );
  };

  const nombreBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.nombre}
      </>
    );
  };

  const descripcionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.descripcion}
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editInformacionAdicional(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteInformacionAdicional(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Informacion Adicional</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
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
        onClick={saveInformacionAdicional}
      />
    </>
  );
  const deleteProvinciaDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteInformacionAdicionalDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteInformacionAdicional}
      />
    </>
  );
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteInformacionAdicionalsDialog}
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
            value={informacionAdicionals}
            selection={selectedInformacionAdicionals}
            onSelectionChange={(e) => setSelectedInformacionAdicionals(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            globalFilter={globalFilter}
            emptyMessage="No existen informacion registradas."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="id"
              header="Id"
              body={idBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="name"
              header="Nombre"
              body={nombreBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="descripscion "
              header="Descripcion"
              body={descripcionBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={informacionAdicionalDialog}
            style={{ width: "450px" }}
            header="Informacion Adicional"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                id="nombre"
                value={informacionAdicional.nombre}
                onChange={(e) => onInputChange(e, "nombre")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !informacionAdicional.nombre,
                })}
              />
              {submitted && !informacionAdicional.nombre && (
                <small className="p-invalid">
                  El nombre de la informacion es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="descripcion">Descripcion</label>
              <InputText
                id="descripcion"
                value={informacionAdicional.descripcion}
                onChange={(e) => onInputChange(e, "descripcion")}
                required
                className={classNames({
                  "p-invalid": submitted && !informacionAdicional.descripcion,
                })}
              />
              {submitted && !informacionAdicional.descripcion && (
                <small className="p-invalid">
                  La descripcion de la informacion es necesario.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteInformacionAdicionalDialog}
            style={{ width: "450px" }}
            header="Confirmación"
            modal
            footer={deleteProvinciaDialogFooter}
            onHide={hideDeleteInformacionAdicionalDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {informacionAdicional && (
                <span>
                  Está seguro de borrar esta informacion{" "}
                  <b>{informacionAdicional.nombre}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteInformacionAdicionalsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteInformacionAdicionalsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {informacionAdicional && (
                <span>Está seguro de borrar estas provincias?</span>
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
// nombre mal crud ->crudprovinvia
export default React.memo(CrudInformacionAdicional, comparisonFn);