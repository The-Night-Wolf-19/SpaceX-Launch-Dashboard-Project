import Header from "./Components/Header/Header";
import { Icon } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import { DateRangePicker } from "react-date-range";
import { DateRange } from "react-date-range";
import { addDays, addMonths } from "date-fns";
import DataTable from "./Components/Table/Table";
import api from "./api";
import bg from "./background.webp";
function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const enums = {
    All: "All Launches",
    SuccessFul: "Successful Launches",
    Failed: "Failed Launches",
    Upcoming: "Upcoming Launches",
  };
  const [dropdownOption, setDropDownOption] = useState(enums.All);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      let response = await api.get("/");

      if (response.status === 200 && mounted) {
        setApiData(response.data);
      } else console.log("Something wrong");
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  const LaunchFilter = () => {
    const HandleDropClick = async (term) => {
      setDropDownOption(term);
      setApiData([]);
      if (term === enums.Upcoming) {
        let response = await api.get("/upcoming");

        if (response.status === 200) setApiData(response.data);
      } else if (term === enums.SuccessFul) {
        let response = await api.get("/past?launch_success=true");

        if (response.status === 200) setApiData(response.data);
      } else if (term === enums.Failed) {
        let response = await api.get("/past?launch_success=false");

        if (response.status === 200) setApiData(response.data);
      } else {
        let response = await api.get("/");

        if (response.status === 200) setApiData(response.data);
      }
    };

    return (
      <Dropdown
        toggle={() => setDropdownOpen(!dropdownOpen)}
        isOpen={dropdownOpen}
        className="launch-filter"
      >
        <DropdownToggle className="launch-filter-button" caret>
          {dropdownOption}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => HandleDropClick(enums.All)}>
            {enums.All}
          </DropdownItem>
          <DropdownItem onClick={() => HandleDropClick(enums.SuccessFul)}>
            {enums.SuccessFul}
          </DropdownItem>
          <DropdownItem onClick={() => HandleDropClick(enums.Failed)}>
            {enums.Failed}
          </DropdownItem>
          <DropdownItem onClick={() => HandleDropClick(enums.Upcoming)}>
            {enums.Upcoming}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const DateFilter = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const HandleFilter = async () => {
      setApiData([]);
      if (dropdownOption === enums.SuccessFul) {
        let response = await api.get(
          `/past?launch_success=true&start="${state[0].startDate}"&end="${state[0].endDate}"`
        );
        if (response.status === 200) setApiData(response.data);
      } else if (dropdownOption === enums.Failed) {
        let response = await api.get(
          `/past?launch_success=false&start="${state[0].startDate}"&end="${state[0].endDate}"`
        );
        if (response.status === 200) setApiData(response.data);
      } else if (dropdownOption === enums.All) {
        let response = await api.get(
          `?start="${state[0].startDate}"&end="${state[0].endDate}"`
        );
        if (response.status === 200) setApiData(response.data);
      } else {
        let response = await api.get(
          `?start="${state[0].startDate}"&end="${state[0].endDate}"`
        );
        if (response.status === 200) setApiData(response.data);
      }
    };

    const [state, setState] = useState([
      {
        // startDate: new Date(),
        // endDate: addDays(new Date(), 7),
        startDate: new Date(),
        endDate: addMonths(new Date(), -6),
        // endDate: null,
        key: "selection",
      },
    ]);

    return (
      <div className="date-filter">
        <button
          className="date-filter-button"
          type="button"
          onClick={handleOpen}
        >
          Filter By Date
        </button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <div className="modalMenu">
                <div className="modalRight">
                  <button
                    className="filter-button"
                    onClick={() => HandleFilter()}
                  >
                    Filter
                  </button>
                </div>
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    setState([item.selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={state}
                  direction="horizontal"
                />
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  };

  return (
    <div className="App">
      <img src={bg} alt="" className="bgImg" />
      <Header />
      <div className="filter-div">
        {/* <h4>Last 6 Months</h4> */}
        <div className="date">
          <i class="fa fa-calendar-o" aria-hidden="true"></i>
          <DateFilter />
        </div>
        <LaunchFilter />
      </div>
      <div className="div-table">
        <DataTable data={apiData} />
      </div>
    </div>
  );
}

export default App;
