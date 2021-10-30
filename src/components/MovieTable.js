import React, { useState, useEffect, useRef } from "react";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import MovieCard from "./MovieCard";
import { API_STATUS, MOVIE_LINK_API, RATE_MAX } from "../constants";

// styles
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../index.css";
import "./MovieTable.css";

const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState(API_STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState();

  //
  const [selectedMovies, setSelectedMovies] = useState(null);
  const [selectedDirectors, setSelectedDirectors] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    if (!movies?.length && status !== API_STATUS.ERROR) {
      fetch(MOVIE_LINK_API).then((res) =>
        res
          .json()
          .then((data) => {
            setMovies(data);

            if (data?.length) {
              let onlyDirectors = [];
              let onlyCertifications = [];

              // push only directors & certifications in corresponding arrays
              data.forEach(({ director, certification }) => {
                onlyDirectors.push({ name: director });
                onlyCertifications.push(certification);
              });

              setDirectors(onlyDirectors);
              setCertifications(onlyCertifications);
            }
            setStatus(API_STATUS.SUCCESS);
          })
          .catch((error) => {
            setStatus(error);
            setErrorMessage(error?.message);
          })
      );
    }
  }, [movies, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const dt = useRef(null);

  const certificationBodyTemplate = ({ certification }) => (
    <>
      <span className="p-column-title">Status</span>
      <span className={classNames("customer-badge", "status-" + certification)}>
        {certification}
      </span>
    </>
  );

  const titleBodyTemplate = ({ title }) => (
    <>
      <span className="p-column-title">Title</span>
      {title}
    </>
  );

  const ratingBodyTemplate = ({ rating }) => (
    <>
      <span className="p-column-title">Rating</span>
      {`${Math.round((rating / RATE_MAX) * 100)}%`}
    </>
  );

  const yearBodyTemplate = ({ releaseDate }) => (
    <>
      <span className="p-column-title">Year</span>
      {releaseDate}
    </>
  );

  const lengthBodyTemplate = ({ length }) => (
    <>
      <span className="p-column-title">Running Time</span>
      <span>{length}</span>
    </>
  );

  const directorBodyTemplate = ({ director }) => (
    <>
      <span className="p-column-title">Director</span>
      <span>{director}</span>
    </>
  );

  const renderDirectorFilter = () => (
    <MultiSelect
      className="p-column-filter"
      value={selectedDirectors}
      options={directors}
      onChange={onDirectorFilterChange}
      itemTemplate={directorItemTemplate}
      placeholder="All"
      optionLabel="name"
      optionValue="name"
    />
  );

  const directorItemTemplate = ({ name }) => (
    <div className="p-multiselect-representative-option">
      <span>{name}</span>
    </div>
  );

  const onDirectorFilterChange = (event) => {
    dt.current.filter(event.value, "director", "in");
    setSelectedDirectors(event.value);
  };

  const renderCertificationFilter = () => (
    <Dropdown
      value={selectedCertification}
      options={certifications}
      onChange={onCertificationFilterChange}
      itemTemplate={certificationItemTemplate}
      showClear
      placeholder="Select a Status"
      className="p-column-filter"
    />
  );

  const certificationItemTemplate = (certification) => (
    <span className={classNames("customer-badge", "status-" + certification)}>
      {certification}
    </span>
  );

  const onCertificationFilterChange = (event) => {
    dt.current.filter(event.value, "certification", "equals");
    setSelectedCertification(event.value);
  };

  const directorFilterElement = renderDirectorFilter();
  const certificationFilterElement = renderCertificationFilter();

  return movies?.length ? (
    <>
      <div className="datatable-movies-demo">
        <div className="card">
          <DataTable
            ref={dt}
            value={movies}
            header={<div className="table-header">Favorite Movie List</div>}
            className="p-datatable-movies"
            dataKey="title"
            rowHover
            selection={selectedMovies}
            onSelectionChange={(e) => {
              if (e.value.length) {
                setSelectedMovies([e.value[e.value.length - 1]]);
              } else {
                setSelectedMovies([]);
              }
            }}
            paginator
            rows={10}
            emptyMessage="No movies found"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
          >
            <Column
              selectionMode="multiple"
              style={{ width: "3em" }}
              className="table-first-column-check"
            />
            <Column
              field="title"
              header="Title"
              body={titleBodyTemplate}
              sortable
              filter
              filterPlaceholder="Search by title"
            />
            <Column
              sortField="releaseDate"
              filterField="releaseDate"
              header="Year"
              body={yearBodyTemplate}
              sortable
              filter
              filterMatchMode="contains"
              filterPlaceholder="Search by year"
            />
            <Column
              sortField="length"
              filterField="length"
              header="Running Time"
              body={lengthBodyTemplate}
              sortable
              filter
              filterMatchMode="contains"
              filterPlaceholder="Search by time"
            />
            <Column
              sortField="director"
              filterField="director"
              header="Director"
              body={directorBodyTemplate}
              sortable
              filter
              filterElement={directorFilterElement}
            />
            <Column
              field="certification"
              header="Certification"
              body={certificationBodyTemplate}
              sortable
              filter
              filterElement={certificationFilterElement}
            />
            <Column
              field="rating"
              header="Rating"
              body={ratingBodyTemplate}
              sortable
              filter
              filterPlaceholder="Search by rating"
            />
          </DataTable>
        </div>
      </div>
      {selectedMovies?.length ? (
        <MovieCard
          {...selectedMovies[0]}
          setSelectedMovies={setSelectedMovies}
        />
      ) : null}
    </>
  ) : (
    <p>{errorMessage}</p>
  );
};

export default MovieTable;
