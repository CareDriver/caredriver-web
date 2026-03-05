"use client";
import { useState, useCallback } from "react";
import { Services } from "@/interfaces/Services";
import { Locations, locationList } from "@/interfaces/Locations";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import {
  getAllServicesPaginated,
  getAllServicesNumPages,
  AdminServicesFilters,
} from "../api/AdminServicesRequester";
import { DocumentSnapshot } from "firebase/firestore";
import AdminServiceCard from "./AdminServiceCard";
import { toast } from "react-toastify";
import Taxi from "@/icons/Taxi";

const AdminActiveServicesListWithFilters = () => {
  const [selectedServiceType, setSelectedServiceType] = useState<Services | "">(
    "",
  );
  const [selectedLocation, setSelectedLocation] = useState<Locations | "">("");
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "started" | "finished" | "canceled" | "all"
  >("all");
  const [filtersActive, setFiltersActive] = useState(false);
  const [services, setServices] = useState<ServiceRequestInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>();

  const getAppliedFilters = (): AdminServicesFilters => {
    return {
      serviceType: selectedServiceType
        ? (selectedServiceType as Services)
        : undefined,
      location: selectedLocation ? (selectedLocation as Locations) : undefined,
      status: selectedStatus || "all",
    };
  };

  const loadServices = useCallback(
    async (pageNumber: number, startAfter?: DocumentSnapshot) => {
      if (!selectedServiceType) return;

      setIsLoading(true);
      try {
        const result = await getAllServicesPaginated(
          getAppliedFilters(),
          pageNumber,
          8,
          startAfter,
        );
        setServices(result.result);
        setLastDoc(result.lastDoc);
      } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Error al cargar los servicios");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedServiceType, selectedLocation, selectedStatus],
  );

  const loadNumPages = useCallback(async () => {
    if (!selectedServiceType) return;

    try {
      const pages = await getAllServicesNumPages(getAppliedFilters(), 8);
      setNumPages(pages);
    } catch (error) {
      console.error("Error loading pages:", error);
    }
  }, [selectedServiceType, selectedLocation, selectedStatus]);

  const handleApplyFilters = async () => {
    if (!selectedServiceType) {
      toast.error("Debes seleccionar un tipo de servicio");
      return;
    }
    setFiltersActive(true);
    setPageNum(1);
    await loadNumPages();
    await loadServices(1);
  };

  const handleClearFilters = () => {
    setSelectedServiceType("");
    setSelectedLocation("");
    setSelectedStatus("all");
    setFiltersActive(false);
    setServices([]);
    setPageNum(1);
    setNumPages(0);
  };

  const handleNextPage = async () => {
    if (pageNum < numPages && lastDoc) {
      const nextPageNum = pageNum + 1;
      setPageNum(nextPageNum);
      await loadServices(nextPageNum, lastDoc);
    }
  };

  const handlePrevPage = async () => {
    if (pageNum > 1) {
      const prevPageNum = pageNum - 1;
      setPageNum(prevPageNum);
      await loadServices(1);
    }
  };

  return (
    <div className="admin-services-container">
      {/* Filter Section */}
      <div className="filters-card">
        <div className="filters-header">
          <h3 className="text | medium bold">Filtros de búsqueda</h3>
          <p className="text | light small">
            Selecciona al menos un tipo de servicio para comenzar
          </p>
        </div>

        <div className="filters-grid">
          {/* Service Type Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Tipo de Servicio <span className="required">*</span>
            </label>
            <select
              value={selectedServiceType}
              onChange={(e) =>
                setSelectedServiceType(e.target.value as Services | "")
              }
              className="filter-select"
              disabled={filtersActive && isLoading}
            >
              <option value="">-- Selecciona un servicio --</option>
              <option value={Services.Driver}>Conductor</option>
              <option value={Services.Mechanic}>Mecánico</option>
              <option value={Services.Tow}>Grúa</option>
              <option value={Services.Laundry}>Lavadero</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label className="filter-label">Ubicación</label>
            <select
              value={selectedLocation}
              onChange={(e) =>
                setSelectedLocation(e.target.value as Locations | "")
              }
              className="filter-select"
              disabled={filtersActive && isLoading}
            >
              <option value="">-- Todas las ubicaciones --</option>
              {locationList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as
                    | "active"
                    | "started"
                    | "finished"
                    | "canceled"
                    | "all",
                )
              }
              className="filter-select"
              disabled={filtersActive && isLoading}
            >
              <option value="all">-- Todos los estados --</option>
              <option value="active">⏳ Esperando propuesta</option>
              <option value="started">🚀 En curso</option>
              <option value="finished">✅ Finalizado</option>
              <option value="canceled">❌ Cancelado</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filters-actions">
          <button
            className="general-button green"
            onClick={handleApplyFilters}
            disabled={!selectedServiceType || isLoading}
          >
            {isLoading ? "Cargando..." : "Buscar Servicios"}
          </button>
          {filtersActive && (
            <button
              className="general-button secondary"
              onClick={handleClearFilters}
              disabled={isLoading}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Services List */}
      {filtersActive && (
        <div className="services-section">
          {services.length > 0 ? (
            <>
              <div className="services-header">
                <h2 className="text | medium-big bold">
                  <Taxi /> Servicios encontrados ({services.length} de{" "}
                  {numPages * 8})
                </h2>
              </div>

              <div className="services-grid">
                {services.map((service: ServiceRequestInterface) => (
                  <AdminServiceCard
                    key={service.id}
                    service={service}
                    serviceType={selectedServiceType as Services}
                  />
                ))}
              </div>

              {/* Pagination */}
              {numPages > 1 && (
                <div className="pagination-section">
                  <button
                    className="btn-pagination"
                    onClick={handlePrevPage}
                    disabled={pageNum === 1 || isLoading}
                  >
                    ← Anterior
                  </button>

                  <div className="pagination-info">
                    <span className="page-number">Página {pageNum}</span>
                    <span className="page-divider">/</span>
                    <span className="page-total">{numPages}</span>
                  </div>

                  <button
                    className="btn-pagination"
                    onClick={handleNextPage}
                    disabled={pageNum === numPages || isLoading}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="loading-container">
              <span className="loader-green"></span>
              <p className="text | light">Cargando servicios...</p>
            </div>
          ) : (
            <div className="empty-state">
              <p className="text | light large">
                No hay servicios que coincidan con los filtros seleccionados
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminActiveServicesListWithFilters;
