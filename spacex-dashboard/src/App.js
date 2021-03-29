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
import axios from "axios";

function App() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOption, setDropDownOption] = useState("All Launches");
  const [apiData, setApiData] = useState([]);

  const sortUpcoming = () => {
    return (apiData || []).filter((item) => {
      return item.upcoming === true;
    });
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      let response = await axios
        .create({
          baseURL: "https://api.spacexdata.com/v3/launches",
        })
        .get("/");

      if (response.status === 200 && mounted) {
        setApiData(response.data);
        let new_res = sortUpcoming();
        console.log(new_res);
      } else console.log("Something wrong");
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  const LaunchFilter = () => {
    const enums = {
      All: "All Launches",
      SuccessFul: "Successful Launches",
      Failed: "Failed Launches",
      Upcoming: "Upcoming Launches",
    };

    const HandleDropClick = (term) => {
      setDropDownOption(term);
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
    const [state, setState] = useState([
      {
        // startDate: new Date(),
        // endDate: addDays(new Date(), 7),
        startDate: new Date(),
        endDate: addMonths(new Date(), -6),
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
          Last 6 Months
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
                  <h6 className="CustomDate">Past week</h6>
                  <h6 className="CustomDate">Past month</h6>
                  <h6 className="CustomDate">Past 3 months</h6>
                  <h6 className="CustomDate">Past 6 months</h6>
                  <h6 className="CustomDate">Past year</h6>
                  <h6 className="CustomDate">Past 2 years</h6>
                </div>
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setState([item.selection])}
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
