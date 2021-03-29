import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./Table.css";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import LoadingContainer from "../../loadingAnimation/rocketAnimation";

const columns = [
  {
    field: "id",
    headerName: "No:",
    width: 60,
    sortable: false,
    headerClassName: "customColumn",
    headerAlign: "left",
  },
  {
    field: "launched",
    headerName: "Launched (UTC)",
    width: 250,
    sortable: false,
    headerClassName: "customColumn",
    headerAlign: "left",
  },
  {
    field: "location",
    headerName: "Location",
    width: 170,
    sortable: false,
    headerClassName: "customColumn",
    headerAlign: "left",
  },
  {
    field: "mission",
    headerName: "Mission",
    width: 300,
    sortable: false,
    headerClassName: "customColumn",
    headerAlign: "left",
  },
  {
    field: "orbit",
    headerName: "Orbit",
    width: 90,
    sortable: false,
    headerClassName: "customColumn",
    headerAlign: "left",
  },
  {
    field: "launchstatus",
    headerName: "Launch Status",
    width: 160,
    sortable: false,
    headerClassName: "customColumn launch-status",
    headerAlign: "left",
    cellClassName: (params) =>
      clsx("super-app", {
        Success: params.value === "Success",
        Failure: params.value === "Failed",
        Upcoming: params.value === "Upcoming",
      }),
  },
  {
    field: "rocket",
    headerName: "Rocket",
    width: 130,
    sortable: false,
    headerClassName: "customColumn",
    headerAlign: "left",
  },
];
const useStyles = makeStyles({
  root: {
    "& .super-app.Success": {
      backgroundColor: "#DEF7EC",
      color: "#03543F",
      fontWeight: "600",
      borderRadius: "200px",
      textAlign: "center",
    },
    "& .super-app.Failure": {
      backgroundColor: "#FDE2E1",
      color: "#981B1C",
      fontWeight: "600",
      borderRadius: "200px",
      textAlign: "center",
    },
    "& .super-app.Upcoming": {
      backgroundColor: "#FEF3C7",
      color: "#92400F",
      fontWeight: "600",
      borderRadius: "200px",
      textAlign: "center",
    },
  },
});

const DataTable = ({ data }) => {
  const classes = useStyles();
  const rows = data.map((item, index) => {
    let data = {
      id: index + 1,
      launched: item.launch_date_local,
      location: item.launch_site.site_name,
      mission: item.mission_name,
      orbit: item.rocket.second_stage.payloads[0].orbit,
      launchstatus: item.upcoming
        ? "Upcoming"
        : item.launch_success
        ? "Success"
        : "Failed",
      rocket: item.rocket.rocket_name,
    };
    return data;
  });
  return (
    <div className="Table" style={{ width: "76.5%" }}>
      <DataGrid
        disableColumnMenu
        hideFooterSelectedRowCount
        autoHeight
        className={classes.root}
        rows={rows}
        columns={columns}
        pageSize={10}
      />
    </div>
  );
};
export default DataTable;
