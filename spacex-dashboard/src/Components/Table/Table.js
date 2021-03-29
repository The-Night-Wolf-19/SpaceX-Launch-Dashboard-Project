import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./Table.css";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import LoadingContainer from "../../loadingAnimation/rocketAnimation";
import api from "../../api";
import Modal from "@material-ui/core/Modal";

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
    width: 130,
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
      position: "relative !important",
      top: "6px !important",
      lineHeight: "40px !important",
      minHeight: "8px !important",
      maxHeight: "40px !important",
    },
    "& .super-app.Failure": {
      backgroundColor: "#FDE2E1",
      color: "#981B1C",
      fontWeight: "600",
      borderRadius: "200px",
      textAlign: "center",
      position: "relative !important",
      top: "6px !important",
      lineHeight: "40px !important",
      minHeight: "8px !important",
      maxHeight: "40px !important",
    },
    "& .super-app.Upcoming": {
      backgroundColor: "#FEF3C7",
      color: "#92400F",
      fontWeight: "600",
      borderRadius: "200px",
      textAlign: "center",
      position: "relative !important",
      top: "6px !important",
      lineHeight: "40px !important",
      minHeight: "8px !important",
      maxHeight: "40px !important",
    },
  },
});

const useDetailStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: 50,
    left: 50,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const DataTable = ({ data }) => {
  const classes = useStyles();
  const classesDetail = useDetailStyles();
  const [open, setOpen] = React.useState(false);
  const [flightData, setflightData] = React.useState({});
  const rows = data.map((item, index) => {
    let data = {
      id: index + 1,
      launched: item.launch_date_utc,
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

  const CustomLoader = () => {
    return (
      <div className="div-loading">
        <LoadingContainer />
      </div>
    );
  };
  const clickHandler = async (id) => {
    setOpen(true);
    let response = await api.get(`/${data[id - 1].flight_number}`);
    if (response.status === 200) {
      console.log(response.data);
      setflightData(response.data);
    }
  };

  return (
    <div className="Table" style={{ width: "74.55%" }}>
      <DataGrid
        disableColumnMenu
        hideFooterSelectedRowCount
        autoHeight
        autoWidth
        className={classes.root}
        rows={rows}
        onRowClick={(GridRowData) => clickHandler(GridRowData.id)}
        components={{
          LoadingOverlay: CustomLoader,
        }}
        loading={rows.length > 0 ? false : true}
        columns={columns}
        pageSize={10}
      />
      <div className="Detail-Modal">
        <Modal
          open={open}
          onClose={() => {
            setOpen(!open);
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classesDetail.paper}>
            <div className="top-section">
              <img
                className="top-section-image"
                src={flightData?.links?.mission_patch_small}
                alt=" "
              ></img>
              <div>
                <h5>{flightData?.mission_name}</h5>
                <p>{flightData?.rocket?.rocket_name}</p>
              </div>
              <p>{flightData?.launch_success}</p>
            </div>
            <div className="detailDescription">
              <p>
                {flightData?.details}{" "}
                <a
                  href={flightData?.links?.wikipedia}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Wikipedia
                </a>
              </p>
            </div>
            <div className="lower-section">
              <div className="flight-row">
                <p>Flight Number</p>
                <p>{flightData?.flight_number}</p>
              </div>
              <div className="flight-row">
                <p>Mission Name</p>
                <p>{flightData?.mission_name}</p>
              </div>
              <div className="flight-row">
                <p>Rocket Type</p>
                <p>{flightData?.rocket?.rocket_type}</p>
              </div>
              <div className="flight-row">
                <p>Rocket Name</p>
                <p>{flightData?.rocket?.rocket_name}</p>
              </div>
              <div className="flight-row">
                <p>Manufacturer</p>
                <p>SpaceX</p>
              </div>
              <div className="flight-row">
                <p>Nationality</p>
                <p>SpaceX</p>
              </div>
              <div className="flight-row">
                <p>Launch Date</p>
                <p>{flightData?.launch_date_utc}</p>
              </div>
              <div className="flight-row">
                <p>Payload Type</p>
                <p>
                  {flightData?.rocket?.second_stage?.payloads[0]?.payload_type}
                </p>
              </div>
              <div className="flight-row">
                <p>Orbit</p>
                <p>{flightData?.rocket?.second_stage?.payloads[0]?.orbit}</p>
              </div>
              <div className="flight-row">
                <p>Launch Site</p>
                <p>{flightData?.launch_site?.site_name}</p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default DataTable;
