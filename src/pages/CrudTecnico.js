import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TecnicoService } from "../service/TecnicoService";
import { CiudadService } from "../service/CiudadService";
import { EmpresaService } from "../service/EmpresaService";
import { Dropdown } from "primereact/dropdown";

const Crud = () => {
  let tecnicoVacio = {
    id: null,
    nombre: "",
    apellido: "",
    cedula: "",
    direccion: "",
    telefono: "",
    email: "",
    ciudad: null,
    empresa: null,
  };

  //estados
  const [tecnico, setTecnico] = useState(tecnicoVacio);
  const [tecnicos, setTecnicos] = useState(null);

  const [empresa, setEmpresa] = useState(null);

  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const [ciudades, setCiudades] = useState(null);

  const [tecnicoDialog, setTecnicoDialog] = useState(false);
  const [deleteTecnicoDialog, setDeleteTecnicoDialog] = useState(false);
  const [deleteTecnicosDialog, setDeleteTecnicosDialog] = useState(false);

  const [selectedTecnicos, setSelectedTecnicos] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const tecnicoService = new TecnicoService();
    tecnicoService.getTecnicos().then((data) => setTecnicos(data));

    const ciudadService = new CiudadService();
    ciudadService.getCiudades().then((data) => setCiudades(data));

    const empresaService = new EmpresaService();
    empresaService.getEmpresas().then((data) => setEmpresa(data[0]));
  }, []);

  const openNew = () => {
    setTecnico(tecnicoVacio);
    setSubmitted(false);
    setTecnicoDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTecnicoDialog(false);
  };

  const hideDeleteTecnicoDialog = () => {
    setDeleteTecnicoDialog(false);
  };

  const hideDeleteTecnicosDialog = () => {
    setDeleteTecnicosDialog(false);
  };

  const saveTecnico = () => {
    setSubmitted(true);
    if (tecnico.nombre.trim()) {
      let _tecnicos = [...tecnicos];
      let _tecnico = { ...tecnico };
      if (tecnico.id) {
        const index = findIndexById(tecnico.id);

        _tecnicos[index] = _tecnico;

        const tecnicoServico = new TecnicoService();
        tecnicoServico.putTecnicos(_tecnico);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Técnico actualizado",
          life: 3000,
        });
      } else {
        const tecnicoServicio = new TecnicoService();
        const prueba = {
          ..._tecnico,
          ciudad: ciudadSeleccionada,
          empresa: empresa,
        };
        console.log("************");
        console.log(prueba);
        tecnicoServicio.postTecnicos(prueba).then((response) => {
          // hacer peticion a la bdd de la nueva lista de provincias caso contrario no se muestra la nueva provincia ingresada
          tecnicoServicio.getTecnicos().then((data) => setTecnicos(data));
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Tecnico Registrado",
            life: 3000,
          });
        });
      }

      setTecnicos(_tecnicos);
      setTecnicoDialog(false);
      setTecnico(tecnicoVacio);
    }
  };

  const editTecnico = (tecnico) => {
    setTecnico({ ...tecnico });
    setTecnicoDialog(true);
  };

  const confirmDeleteTecnico = (tecnico) => {
    setTecnico(tecnico);
    setDeleteTecnicoDialog(true);
  };

  const deleteTecnico = () => {
    let _tecnicos = [...tecnicos];
    let _tecnico = { ...tecnico };
    const tecnicoServicio = new TecnicoService();
    console.log("********");
    console.log(_tecnico);

    tecnicoServicio.deleteTecnicos({ data: _tecnico }).then((response) => {
      tecnicoServicio.getTecnicos().then((data) => setTecnicos(data));
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Tecnico Eliminado",
        life: 3000,
      });
    });
    setTecnicos(_tecnicos);
    setDeleteTecnicoDialog(false);
    setTecnico(tecnicoVacio);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < tecnicos.length; i++) {
      if (tecnicos[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const deleteSelectedTecnicos = () => {
    let _tecnico = tecnicos.filter((val) => !selectedTecnicos.includes(val));
    setTecnicos(_tecnico);
    setDeleteTecnicosDialog(false);
    setSelectedTecnicos(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Tecnicos eliminados",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _tecnico = { ...tecnico };
    _tecnico[`${name}`] = val;

    setTecnico(_tecnico);
  };

  const onCityChange = (e) => {
    setCiudadSeleccionada(e.value);
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
        <span className="p-column-title">ID</span>
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

  const apellidosBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Apellido</span>
        {rowData.apellido}
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

  const direccionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Direccion</span>
        {rowData.direccion}
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

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </>
    );
  };

  const ciudadlBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ciudad</span>
        {rowData.ciudad.nombre}
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
          onClick={() => editTecnico(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteTecnico(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Tecnicos</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Busqueda..."
        />
      </span>
    </div>
  );

  const tecnicoDialogFooter = (
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
        onClick={saveTecnico}
      />
    </>
  );
  const deleteTecnicoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteTecnicoDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteTecnico}
      />
    </>
  );
  const deleteTecnicosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteTecnicosDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedTecnicos}
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
            value={tecnicos}
            selection={selectedTecnicos}
            onSelectionChange={(e) => setSelectedTecnicos(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            globalFilter={globalFilter}
            emptyMessage="No existen tecnicos registrados."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>
            <Column
              field="code"
              header="Id"
              body={idBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="nombres"
              header="Nombres"
              body={nombreBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="name"
              header="Apellidos"
              body={apellidosBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="cedula"
              header="Cedula"
              body={cedulaBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="direccion"
              header="Direccion"
              body={direccionBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="telefono"
              header="Telefono"
              body={telefonoBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              body={emailBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="ciudad"
              header="Ciudad"
              body={ciudadlBodyTemplate}
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
            visible={tecnicoDialog}
            style={{ width: "600px" }}
            header="Ingreso de Tecnicos"
            modal
            className="p-fluid"
            footer={tecnicoDialogFooter}
            onHide={hideDialog}
          >
            {/* Nombre y Apellido */}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="nombre">Nombres</label>
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
                {submitted && !tecnico.nombre && (
                  <small className="p-invalid">
                    Los Nombres del Tecnico son Necesarios.
                  </small>
                )}
              </div>

              <div className="field col">
                <label htmlFor="apellido">Apellidos</label>
                <InputText
                  id="apellido"
                  value={tecnico.apellido}
                  onChange={(e) => onInputChange(e, "apellido")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !tecnico.apellido,
                  })}
                />
                {submitted && !tecnico.apellido && (
                  <small className="p-invalid">
                    Los Apellidos del Tecnico son Necesarios.
                  </small>
                )}
              </div>
            </div>

            {/* dni y direccion */}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="cedula">Cedula</label>
                <InputText
                  id="cedula"
                  value={tecnico.cedula}
                  onChange={(e) => onInputChange(e, "cedula")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !tecnico.cedula,
                  })}
                />
                {submitted && !tecnico.cedula && (
                  <small className="p-invalid">
                    La cedula del Tecnico es Necesario.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="direccion">Dirección</label>
                <InputText
                  id="direccion"
                  value={tecnico.direccion}
                  onChange={(e) => onInputChange(e, "direccion")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !tecnico.direccion,
                  })}
                />
                {submitted && !tecnico.direccion && (
                  <small className="p-invalid">
                    La Dirección del Tecnico es necesario.
                  </small>
                )}
              </div>
            </div>

            {/*  telefono y email*/}
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="telefono">Teléfono</label>
                <InputText
                  id="telefono"
                  value={tecnico.telefono}
                  onChange={(e) => onInputChange(e, "telefono")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !tecnico.telefono,
                  })}
                />
                {submitted && !tecnico.telefono && (
                  <small className="p-invalid">
                    El Telefono del Tecnico es necesario.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="ciudad">Ciudad</label>
                <Dropdown
                  value={ciudadSeleccionada}
                  options={ciudades}
                  onChange={onCityChange}
                  optionLabel="nombre"
                  placeholder="Seleccione una ciudad"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={tecnico.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                className={classNames({
                  "p-invalid": submitted && !tecnico.email,
                })}
              />
              {submitted && !tecnico.email && (
                <small className="p-invalid">
                  El Email del Tecnico es necesario.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteTecnicoDialog}
            style={{ width: "450px" }}
            header="Confirmación"
            modal
            footer={deleteTecnicoDialogFooter}
            onHide={hideDeleteTecnicoDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {tecnico && (
                <span>
                  Está seguro de borrar la provincia <b>{tecnico.nombre}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteTecnicosDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteTecnicosDialogFooter}
            onHide={hideDeleteTecnicosDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {tecnico && <span>Está seguro de borrar estas provincias?</span>}
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