import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { Header } from "../../shared/components/ui/Header";
import { SearchFilters } from "../../shared/components/ui/SearchFilters";
import ContainerStatistics from "../../shared/components/ui/ContainerStatistics";
import { TimeRangeSelector } from "../../shared/components/ui/TimeRangeSelector";
import { ContainerTable } from "../../shared/components/ui/ContainerTable";
import { Paginator } from "../../shared/components/ui/Paginator";
import { ContainerCreationDrawer } from "../ContainerCreation";
import { colors } from "@/shared/constants/colors";
import { fonts } from "@/shared/constants/fonts";

import {
  Container as ContainerType,
  ContainerFilterCriteria,
} from "../../shared/types/containers";
import { containerService } from "../../api/containerService";
import { AddCircleOutline } from "@mui/icons-material";

const PageBackground = styled(Box)({
  backgroundColor: colors.background,
  minHeight: "100vh",
});

const PageContent = styled(Container)({
  paddingTop: "16px",
  paddingBottom: "24px",
  maxWidth: "1392px !important",
});

const PageTitleBar = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  padding: "0 24px",
});

const PageTitle = styled(Typography)({
  fontFamily: fonts.heading,
  fontSize: "24px",
  fontWeight: 400,
  color: "black",
});

const SectionCard = styled(Box)({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "16px",
  boxShadow: "0 0 2px rgba(65, 64, 69, 0.2)",
});

const StatisticsSection = styled(Box)({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "24px 24px 14px 24px",
  marginBottom: "16px",
  boxShadow: "0 0 2px rgba(65, 64, 69, 0.2)",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "flex-start",
});

const ContainerListSection = styled(Box)({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "16px 24px",
  boxShadow: "0 0 2px rgba(65, 64, 69, 0.2)",
});

const SectionHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const SectionTitle = styled(Typography)({
  fontFamily: fonts.body,
  fontSize: "16px",
  fontWeight: 600,
  color: "#000000",
});

const CreateButton = styled(Button)({
  backgroundColor: "#3545EE",
  color: "white",
  textTransform: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  fontFamily: fonts.body,
  fontSize: "14px",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#4858FF",
  },
});

const PaginatorSection = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  padding: "0 4px",
});

const PaginatorText = styled(Typography)({
  fontFamily: fonts.body,
  fontSize: "14px",
  color: colors.gray[300],
});

export const ContainerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<ContainerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContainerFilterCriteria>({});
  const [timeRange, setTimeRange] = useState<
    "Week" | "Month" | "Quarter" | "Year"
  >("Week");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContainers, setTotalContainers] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load containers
  useEffect(() => {
    const loadContainers = async () => {
      setLoading(true);
      try {
        const response = await containerService.listContainers(filters);
        if (response.data) {
          setContainers(response.data);
          setTotalContainers(response.data.length);
          // Simulate pagination (backend doesn't implement it yet)
          setTotalPages(Math.ceil(response.data.length / 10));
        } else if (response.error) {
          setError(response.error.detail);
        }
      } catch {
        setError("Failed to load containers");
      } finally {
        setLoading(false);
      }
    };

    loadContainers();
  }, [filters]);

  const handleFiltersChange = (newFilters: ContainerFilterCriteria) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleTimeRangeChange = (
    range: "Week" | "Month" | "Quarter" | "Year"
  ) => {
    setTimeRange(range);
  };

  const handleCreateContainer = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleContainerCreated = () => {
    // Refresh the container list when a new container is created
    const loadContainers = async () => {
      setLoading(true);
      try {
        const response = await containerService.listContainers(filters);
        if (response.data) {
          setContainers(response.data);
          setTotalContainers(response.data.length);
          setTotalPages(Math.ceil(response.data.length / 10));
        }
      } catch {
        setError("Failed to load containers");
      } finally {
        setLoading(false);
      }
    };

    loadContainers();
    setDrawerOpen(false);
  };

  const handleTableAction = (container: ContainerType, action: string) => {
    // TODO: Implement table actions (edit, delete, etc.)
    console.log("Table action:", action, container);
  };

  const handleContainerRowClick = (container: ContainerType) => {
    navigate(`/containers/${container.id}`);
  };

  // Get paginated containers
  const startIndex = (currentPage - 1) * 10;
  const paginatedContainers = containers.slice(startIndex, startIndex + 10);

  if (loading) {
    return (
      <PageBackground>
        <Header />
        <PageContent>
          <Typography>Loading containers...</Typography>
        </PageContent>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
        <Header />
        <PageContent>
          <Typography color="error">Error: {error}</Typography>
        </PageContent>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Header />
      <PageContent>
        <PageTitleBar>
          <PageTitle>Container Managements</PageTitle>
        </PageTitleBar>

        <SectionCard>
          <SearchFilters
            onSearchChange={(value) =>
              handleFiltersChange({ ...filters, search: value })
            }
            onTypeChange={(value) =>
              handleFiltersChange({
                ...filters,
                type: value as "physical" | "virtual",
              })
            }
            onTenantChange={(value) =>
              handleFiltersChange({ ...filters, tenant: value })
            }
            onPurposeChange={(value) =>
              handleFiltersChange({
                ...filters,
                purpose: value as "development" | "research" | "production",
              })
            }
            onStatusChange={(value) =>
              handleFiltersChange({
                ...filters,
                status: value as
                  | "created"
                  | "active"
                  | "connected"
                  | "maintenance"
                  | "inactive",
              })
            }
            onAlertsChange={(hasAlerts) =>
              handleFiltersChange({ ...filters, has_alerts: hasAlerts })
            }
            onClearFilters={() => handleFiltersChange({})}
            searchValue={filters.search}
            selectedType={filters.type}
            selectedTenant={filters.tenant}
            selectedPurpose={filters.purpose}
            selectedStatus={filters.status}
            hasAlerts={filters.has_alerts}
          />
        </SectionCard>

        <StatisticsSection>
          <Box sx={{ width: "100%" }}>
            <TimeRangeSelector
              selectedRange={timeRange}
              onRangeChange={handleTimeRangeChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ContainerStatistics
              title={`${
                containers.filter((c) => c.type === "physical").length > 0
                  ? "Physical"
                  : "Virtual"
              } Containers`}
              containerCount={containers.length}
              yieldData={{
                average: 63,
                total: 81,
                dailyData: [82, 70, 84, 77, 92, 63, 70],
              }}
              spaceUtilization={{
                average: 80,
                dailyData: [85, 72, 88, 79, 91, 85, 76],
              }}
              dayLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ContainerStatistics
              title={`${
                containers.filter((c) => c.type === "virtual").length > 0
                  ? "Physical"
                  : "Virtual"
              } Containers`}
              containerCount={containers.length}
              yieldData={{
                average: 63,
                total: 81,
                dailyData: [82, 70, 84, 77, 92, 63, 70],
              }}
              spaceUtilization={{
                average: 80,
                dailyData: [85, 72, 88, 79, 91, 85, 76],
              }}
              dayLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </Box>
        </StatisticsSection>

        <ContainerListSection>
          <SectionHeader>
            <SectionTitle>Containers List</SectionTitle>
            <CreateButton onClick={handleCreateContainer}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AddCircleOutline />
                Create Container
              </span>
            </CreateButton>
          </SectionHeader>

          <ContainerTable
            containers={paginatedContainers}
            onRowAction={handleTableAction}
            onRowClick={handleContainerRowClick}
          />

          <PaginatorSection>
            <PaginatorText>
              Showing page {currentPage} of {totalPages} ({totalContainers}{" "}
              total containers)
            </PaginatorText>
            <Paginator
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </PaginatorSection>
        </ContainerListSection>
      </PageContent>

      <ContainerCreationDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onContainerCreated={handleContainerCreated}
      />
    </PageBackground>
  );
};
