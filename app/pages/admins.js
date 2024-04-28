import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  CircularProgress,
  MenuItem,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Select,
  DialogTitle,
  Tabs,
  Tab,
} from '@mui/material';
import Account from './account';
import { signUp } from 'aws-amplify/auth';
import DriversPage from '../pages/drivers';
import SponsorsPage from '../pages/sponsors';

function Admin() {
  const [sponsorOrgs, setSponsorOrgs] = useState([]);
  const [sponsorUsers, setSponsorUsers] = useState([]);
  const [driverUsers, setDriverUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');

  const [selectedUser, setSelectedUser] = useState('');
  const [currentDriverId, setCurrentDriverId] = useState(null);

  const [selectedOrgBool, setSelectOrgBool] = useState(false);

  const [newSponsorName, setNewSponsorName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pointsChange, setPointsChange] = useState(0);
  const [behaviorText, setBehaviorText] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [orgsDialogOpen, setOrgsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [orgsList, setOrgsList] = useState([]);
  const [orgAddOrDelUser, setorgAddOrDelUser] = useState('');

  const [selectedUserUpdate, setUserUpdate] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [createOrgName, setCreateOrgName] = useState('');
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);

  // for adding a new driver dialog
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState('');
  const [userType, setUserType] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState('');
  const [selectAllSponsors, setSelectAllSponsors] = useState(false);
  const [sponsors, setSponsors] = useState([]);
  const [anyTime, setAnyTime] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submittedInvoice, setSubmittedInvoice] = useState(0);
  const [submittedAudit, setSubmittedAudit] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalDollars, setTotalDollars] = useState(0);
  const [pointRatio, setPointRatio] = useState(0);
  const [drivers, setDriver] = useState([]);
  const uniqueDriverNames = new Set(); // Initialize a set to store unique driver names
  const [reportValue, setReportValue] = useState(0);
  const [selectedAudit, setSelectedAudit] = useState('');
  const [auditLog, setAuditLog] = useState([]);
  const [csvContent, setCSVContent] = useState('');
  const [submittedSponsorDriverSales, setSubmittedSponsorDriverSales] = useState(0);
  const [selectedView, setSelectedView] = useState('');
  const [sponsorSales, setSponsorSales] = useState([]);
  const [driverSales, setDriverSales] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectAllDrivers, setSelectAllDrivers] = useState(false);

  const getSponsorDriverSales = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_sponsor_driver_sales?selectedSponsor=${selectedSponsor}&selectedDriver=${selectedDriver}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get sponsor sales');
      }
      const result = await response.json();
      setSponsorSales(result);
    } catch (error) {
      console.error('Failed to fetch sponsor sales:', error);
    }
  }

  const getSponsorAllDriverSales = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_sponsor_all_driver_sales?selectedSponsor=${selectedSponsor}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get sponsor sales');
      }
      const result = await response.json();
      setSponsorSales(result);
    } catch (error) {
      console.error('Failed to fetch sponsor sales:', error);
    }
  }

  const getAllSponsorDriverSales = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_all_sponsor_driver_sales?selectedDriver=${selectedDriver}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get sponsor sales');
      }
      const result = await response.json();
      setSponsorSales(result);
    } catch (error) {
      console.error('Failed to fetch sponsor sales:', error);
    }
  }

  const getAllSponsorAllDriverSales = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_all_sponsor_all_driver_sales?startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get sponsor sales');
      }
      const result = await response.json();
      setSponsorSales(result);
    } catch (error) {
      console.error('Failed to fetch sponsor sales:', error);
    }
  }

  const [sponsorSpoofId, setSponsorSpoofId] = useState('');
  const [openSponsorDialog, setOpenSponsorDialog] = useState(false);
  const [driverSpoofId, setDriverSpoofId] = useState('');
  const [openDriverDialog, setOpenDriverDialog] = useState(false);

  const handleSponsorDialogClose = () => {
    setOpenSponsorDialog(false);
  };

  const handleSetSponsorSpoof = (spoofId) => {
    setSponsorSpoofId(spoofId);
    setOpenSponsorDialog(true);
  }

  const handleDriverDialogClose = () => {
    setOpenDriverDialog(false);
  };

  const handleSetDriverSpoof = (spoofId) => {
    setDriverSpoofId(spoofId);
    setOpenDriverDialog(true);
  }

  const getAuditLog = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_audit_log?selectedSponsor=${selectedSponsor}&selectedAudit=${selectedAudit}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get audit log');
      }
      const result = await response.json();
      setAuditLog(result);
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
    }
  }

  const getAllAuditLogs = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_all_audit_logs?selectedAudit=${selectedAudit}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get all audit logs');
      }
      const result = await response.json();
      setAuditLog(result);
    } catch (error) {
      console.error('Failed to fetch all audit logs:', error);
    }
  }

  const handleSelectedView = (event) => {
    setSelectedView(event.target.value);
  }

  const handleSelectedAudit = (event) => {
    setSelectedAudit(event.target.value);
  }

  const handleSelectAllSponsors = (event) => {
    setSelectAllSponsors(event.target.checked);
    setSelectedSponsor('All Sponsors');
  }

  const handleSponsorSelect = (event) => {
    setSelectedSponsor(event.target.value);
  }

  const handleSubmitInvoice = () => {
    if (anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
    if (startDate == 'NaN-NaN-NaN') {
      setStartDate('');
    }
    if (endDate == 'NaN-NaN-NaN') {
      setEndDate('');
    }
    setSubmittedInvoice(submittedInvoice + 1);
  }

  const handleSubmitSponsorSales = () => {
    if(anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
    if(startDate == 'NaN-NaN-NaN') {
      setStartDate('');
    }
    if(endDate == 'NaN-NaN-NaN') {
      setEndDate('');
    }
    setSubmittedSponsorDriverSales(submittedSponsorDriverSales + 1);
  }

  const handleSubmitAudits = () => {
    if (anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
    if (startDate == 'NaN-NaN-NaN') {
      setStartDate('');
    }
    if (endDate == 'NaN-NaN-NaN') {
      setEndDate('');
    }
    setSubmittedAudit(submittedAudit + 1);
  }

  const handleStartDateChange = (event) => {
    const formattedDate = formatDate(event.target.value);
    setStartDate(formattedDate);
    if (anyTime == true) {
      setStartDate('');
    }
  };

  const handleEndDateChange = (event) => {
    const formattedDate = formatDate(event.target.value);
    setEndDate(formattedDate);
    if (anyTime == true) {
      setEndDate('');
    }
  };

  const formatDate = (dateString) => {
    let dateObject = new Date(dateString);

    // Adjust date for timezone offset
    dateObject.setDate(dateObject.getDate() + 1);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleAnyTime = (event) => {
    setAnyTime(event.target.checked);
    if (anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
  }

  useEffect(() => {
    if(submittedSponsorDriverSales > 0 && selectAllSponsors != true && selectAllDrivers != true && anyTime != true) {
      getSponsorDriverSales();
    }
    else if(submittedSponsorDriverSales > 0 && selectAllSponsors != true && selectAllDrivers != true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getSponsorDriverSales();
    }
    else if(submittedSponsorDriverSales > 0 && selectAllSponsors == true && selectAllDrivers == true && anyTime != true) {
      getAllSponsorAllDriverSales();
    }
    else if(submittedSponsorDriverSales > 0 && selectAllSponsors == true && selectAllDrivers == true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getAllSponsorAllDriverSales();
    }
    else if (submittedSponsorDriverSales > 0 && selectAllSponsors == true && selectAllDrivers != true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getAllSponsorDriverSales();
    }
    else if (submittedSponsorDriverSales > 0 && selectAllSponsors == true && selectAllDrivers != true && anyTime != true) {
      getAllSponsorDriverSales();
    }
    else if (submittedSponsorDriverSales > 0 && selectAllSponsors != true && selectAllDrivers == true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getSponsorAllDriverSales();
    }
    else if (submittedSponsorDriverSales > 0 && selectAllSponsors != true && selectAllDrivers == true && anyTime != true) {
      getSponsorAllDriverSales();
    }
  }, [submittedSponsorDriverSales]);

  const handleSelectAllDrivers = (event) => {
    setSelectAllDrivers(event.target.checked);
  }

  const handleDriverSelect = (event) => {
    setSelectedDriver(event.target.value);
  }

  useEffect(() => {
    if (submittedInvoice > 0 && selectAllSponsors != true && anyTime != true) {
      getInvoices();
      getDrivers();
    }
    else if (submittedInvoice > 0 && selectAllSponsors == true && anyTime != true) {
      getInvoicesAllSponsors();
      getAllDrivers();
    }
    else if (submittedInvoice > 0 && selectAllSponsors == true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getInvoicesAllSponsors();
      getAllDrivers();
    }
    else if (submittedInvoice > 0 && selectAllSponsors != true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getInvoices();
      getDrivers();
    }
  }, [submittedInvoice]);

  useEffect(() => {
    if (submittedAudit > 0 && selectAllSponsors != true && anyTime != true) {
      getAuditLog();
    }
    else if (submittedAudit > 0 && selectAllSponsors == true && anyTime != true) {
      getAllAuditLogs();
    }
    else if (submittedAudit > 0 && selectAllSponsors == true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getAllAuditLogs();
    }
    else if (submittedAudit > 0 && selectAllSponsors != true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getAuditLog();
    }
  }, [submittedAudit]);

  useEffect(() => {
    calcTotalPoints();
    calcTotalDollars();
  }, [invoices]);

  useEffect(() => {
    getDrivers();
  }, [selectedSponsor]);

  const calcTotalPoints = () => {
    if (invoices && invoices.length > 0) {
      const totalPoints = invoices.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
      setTotalPoints(totalPoints);
    }
    else {
      setTotalPoints(0);
    }
  }

  const calcTotalDollars = () => {
    if (invoices && invoices.length > 0) {
      const totalDollars = invoices.reduce((accumulator, currentValue) => accumulator + (currentValue.points / currentValue.point_Ratio), 0);
      setTotalDollars(totalDollars);
    }
    else {
      setTotalDollars(0);
    }
  }

  const handleDownload1 = () => {
    // Prepare CSV content
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload2 = () => {
    // Prepare CSV content
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload3 = () => {
    // Prepare CSV content
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "sponsor_driver_sales.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    createCSV();
  }, [auditLog]);

  useEffect(() => {
    createCSV2();
  }, [invoices]);

  useEffect(() => {
    createCSV3();
  }, [sponsorSales]);

  const createCSV = () => {
    if (auditLog > 0) {
      setCSVContent("data:text/csv;charset=utf-8," + auditLog.map(audit => Object.values(audit).join(",")).join("\n"));
    }
  }

  const createCSV2 = () => {
    if(invoices > 0) {
      setCSVContent("data:text/csv;charset=utf-8," + invoices.map(point => Object.values(point).join(",")).join("\n"));
    }
  }

  const createCSV3 = () => {
    if(sponsorSales > 0) {
      setCSVContent("data:text/csv;charset=utf-8," + sponsorSales.map(sales => Object.values(sales).join(",")).join("\n"));
    }
  }

  const getInvoices = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const response = await fetch(`/api/admin/get_invoices?selectedSponsor=${selectedSponsor}&startDate=${startDate}&endDate=${endDate}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to get invoices');
      }
      const result = await response.json();
      setInvoices(result); // Set "result" as the orders state
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  }

  const getInvoicesAllSponsors = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const response = await fetch(`/api/admin/get_invoices_all_sponsors?startDate=${startDate}&endDate=${endDate}`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to get invoices');
      }
      const result = await response.json();
      setInvoices(result); // Set "result" as the orders state
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  }

  const getDrivers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_drivers?selectedSponsor=${selectedSponsor}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get drivers');
      }
      const result = await response.json();
      setDriver(result); // Set "result" as the orders state
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  }

  const getAllDrivers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_all_drivers_for_sponsor`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get drivers');
      }
      const result = await response.json();
      setDriver(result); // Set "result" as the orders state
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  }

  const getSponsors = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/admin/get_all_sponsors_orgs`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get sponsors');
      }
      const result = await response.json();
      setSponsors(result); // Set "result" as the orders state
    } catch (error) {
      console.error('Failed to fetch sponsors:', error);
    }
  };

  const handleReportChange = (event, newValue) => {
    setReportValue(newValue);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchSponsorOrgs();
    getSponsors();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (sponsorOrgs.length > 0) {
      fetchSponsorsInSameOrg();
    }
    setIsLoading(false);
  }, [selectedOrg]);

  useEffect(() => {
    setIsLoading(true);
    if (sponsorOrgs.length > 0) {
      fetchDriversInSameOrg();
    }
    setIsLoading(false);
  }, [selectedOrg]);

  useEffect(() => {
    console.log("Updated orgs list: ", orgsList);
  }, [orgsList]);

  useEffect(() => {
    async function addNewUser(userId) {

      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "user_ID": userId,
          "org_ID": sponsorOrgs[selectedOrg].org_ID,
          "email": email,
          "name": name
        });

        const requestOptions1 = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        if (userType == 'driver') {
          fetch("/api/sponsor/post_add_driver", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }
        else if (userType == 'sponsor') {
          fetch("/api/sponsor/post_add_sponsor", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }
        // Edit here
        else if (userType == 'admin') {
          fetch("/api/sponsor/post_add_admin", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.error('Error during sign up:', error);
      }
    }

    if (newUser != '')
      addNewUser(newUser);
  }, [newUser]); // Depend on user state

  // Obtain all the sponsored orgs
  const fetchSponsorOrgs = async () => {
    try {
      const response = await fetch('/api/driver/get_all_avail_sponsor_companies');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      setSponsorOrgs(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  };

  // Obtain all the users in the same org
  const fetchSponsorsInSameOrg = async () => {
    try {
      console.log("Org Name:", sponsorOrgs[selectedOrg].org_Name);
      const response = await fetch(`/api/user/get_accounts_by_org_name?org_name=${sponsorOrgs[selectedOrg].org_Name}&user_type=${'SPONSOR'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setSponsorUsers(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  };

  // Only return drivers who are currently in this org and
  // Have an ACCEPTED app status
  const fetchDriversInSameOrg = async () => {
    try {
      console.log("Org Name:", sponsorOrgs[selectedOrg].org_Name);
      const response = await fetch(`/api/user/get_accounts_by_org_name?org_name=${sponsorOrgs[selectedOrg].org_Name}&user_type=${'DRIVER'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setDriverUsers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to fetch drivers');
    }
  };

  // handle the org changes
  const handleOrgChange = (event) => {
    const selectedOrgIndex = event.target.value;
    setSelectedOrg(selectedOrgIndex);
    setSelectOrgBool(true);
  };

  // Handle an add sponsor
  const handleAddSponsor = async () => {
    try {
      const response = await fetch('/api/admin/add_org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ org_Name: newSponsorName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add sponsor');
      }
      const data = await response.json();
      setSponsors([...sponsors, data]);
      setNewSponsorName('');
      setSuccessMessage('Sponsor added successfully');
    } catch (error) {
      console.error('Error adding sponsor:', error);
      setError('Failed to add sponsor');
    }
  };

  // Remove user from org
  const handleRemoveUserFromOrg = async (userID, orgID) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: userID,
          org_ID: orgID
        })
      };

      // If it is a remove operation
      const response = await fetch(`/api/sponsor/remove_from_org`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to remove sponsor');
      }

      if (sponsorOrgs[selectedOrg].org_ID == orgID) {
        console.log("The user is being removed")
        const updatedSponsorUsers = sponsorUsers.filter(user => user.user_ID !== userID);
        const updatedDriverUsers = driverUsers.filter(user => user.user_ID !== userID);
        setSponsorUsers(updatedSponsorUsers);
        setDriverUsers(updatedDriverUsers);
      }
      console.log("Setting it now in handleRemoveUserFromOrg");
      setSuccessMessage('User removed from org successfully');
    } catch (error) {
      console.error('Error removing sponsor:', error);
      setError('Failed to remove user');
    }
  }

  // Handle editing the sponsored orgs
  const handleEditSponsorOrgs = async (userID) => {
    setSelectedUser(userID);
    setSuccessMessage('');
    setOrgsDialogOpen(true);
  }

  // Handle an add or remove from org
  const handleActionChange = async (selectedAction) => {

    setActionType(selectedAction);

    if (selectedAction === 'Add') {

      // Fetch organizations that the driver is not a part of
      const response = await fetch(`/api/user/get_orgs_not_part_of?user_ID=${selectedUser}`);
      const data = await response.json();

      setOrgsList(data);
    } else if (selectedAction === 'Remove') {

      // Fetch organizations that the driver is a part of
      const response = await fetch(`/api/user/get_orgs_part_of?user_ID=${selectedUser}`);
      const data = await response.json();
      setOrgsList(data);
    }
  };

  // Get the orgID using the org_Name
  const handleOrgAction = async (orgName) => {
    let orgID;
    try {
      const response = await fetch(`/api/driver/get_orgID_using_name_mauricio?org_Name=${orgName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orgID');
      }
      const data = await response.json();
      orgID = data[0].org_ID;
    } catch (error) {
      console.error('Error fetching org_ID:', error);
      setError('Failed to fetch org_ID');
    }

    if (actionType === 'Add') {
      // API call to add the user to the org
      try {
        const response = await fetch('/api/user/post_add_to_org', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_ID: selectedUser,
            org_ID: orgID
          })
        });
        const result = await response.json();
        if (response.ok) {
          setSuccessMessage('User added to org successfully');
          // Remove the org from the list
          setOrgsList(prevOrgs => prevOrgs.filter(org => org.org_ID !== orgID));
        } else {
          throw new Error(result.message || 'Failed to add user to org');
        }
      } catch (error) {
        console.error('Error adding user to org:', error);
        setError(error.message);
      }
    } else if (actionType === 'Remove') {
      // Similar handling for removing a user from an org
      await handleRemoveUserFromOrg(selectedUser, orgID);
      setSuccessMessage('User removed from org successfully');
    }
  };

  // Handle a point submission
  const handlePointSubmit = async () => {
    try {
      console.log('Submit button clicked');
      const pointOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: currentDriverId,
          point_change_value: pointsChange,
          reason: behaviorText,
          org_ID: sponsorOrgs[selectedOrg].org_ID,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        })
      };

      const response = await fetch('/api/sponsor/edit_points', pointOptions);
      console.log('API Response', response);

      if (!response.ok) {
        throw new Error('Failed to update points');
      }

      setSuccessMessage("Points updated successfully");
      console.log("Success Message Set", successMessage);

    } catch (error) {
      console.error('Error updating points', error);
      setError('Failed to update points');
    }

    // Here, add your logic to update the points backend or state
    handleCloseDialog();
  };

  // Delete entire account
  const handleDeleteUser = async (userID) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: userID
        })
      };

      const response = await fetch(`/api/user/delete_user`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to remove sponsor');
      }
      const updatedSponsorUsers = sponsorUsers.filter(user => user.user_ID !== userID);
      const updatedDriverUsers = driverUsers.filter(user => user.user_ID !== userID);
      setSponsorUsers(updatedSponsorUsers);
      setDriverUsers(updatedDriverUsers);
      console.log("Setting it now in handleDeleteUser");
      setSuccessMessage('User removed successfully');
    } catch (error) {
      console.error('Error removing sponsor:', error);
      setError('Failed to remove user');
    }
  };

  // Submit an application to accept the user
  const handleAppSubmit = () => {

    async function handleSignUp(email, password, name, birthdate, userType) {
      console.log("email", email);
      console.log("password", password);
      console.log("name", name);
      console.log("birthdate", birthdate);
      console.log("userType", userType);

      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
          'username': email,
          'password': password,
          options: {
            userAttributes: {
              'email': email,
              'name': name,
              'birthdate': birthdate,
              'custom:user_type': userType,
            },
            autoSignIn: false
          }

        });

        console.log(userId);

        setNewUser(userId);

      } catch (error) {
        console.error('Error during sign up:', error);
      }
    }
    handleSignUp(email, password, name, birthday, userType);

    setAppDialogOpen(false);
  };

  const handleManagePoints = (driverId) => {
    setCurrentDriverId(driverId);
    setPointsChange(0);
    setDialogOpen(true);
  };

  const handleUpdateCredentials = (spoofId) => {
    setUserUpdate(spoofId);
    setUpdateDialogOpen(true);
  }

  const handleCloseDialog = () => {
    setSuccessMessage('');
    setDialogOpen(false);
  };
  const handleCloseOrgsDialog = () => {
    setSuccessMessage('');
    setOrgsDialogOpen(false);
  };
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  }
  // Add drivers or sponsors
  const handleAppCloseDialog = () => {
    setAppDialogOpen(false);
  };

  const handleAddDriver = (userType) => {
    setAppDialogOpen(true);
  };

  // Create an org
  const handleCreateOrg = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          org_Name: createOrgName
        })
      };
      //console.log("User Deleted" + userID);
      const response = await fetch(`/api/admin/post_create_org`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to create org');
      }
      console.log("Successfully created org");
      setSuccessMessage('Successfully create org');
    } catch (error) {
      console.error('Error creating org:', error);
      setError('Failed to create org');
    }
  }

  const handleOrgDialogClose = () => {
    setCreateOrgDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>

        <Typography variant="h4" gutterBottom>
          Select Organization
        </Typography>
        <TextField
          select
          label="Select Organization"
          variant="outlined"
          fullWidth
          margin="normal"
          value={selectedOrg}
          onChange={handleOrgChange} // Define this function to handle changes
        >
          {!isLoading && sponsorOrgs.map((sponsor, index) => (
            <MenuItem key={sponsor.org_Name} value={index}>
              {sponsor.org_Name}
            </MenuItem>
          ))}
        </TextField>

        {!selectedOrg && error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}
        {selectedOrgBool && (
          <Typography variant="h4" gutterBottom>
            Sponsors:
          </Typography>
        )}
        {selectedOrgBool && sponsorUsers.map((user) => (
          <Card key={user.user_ID} style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">Type: {user.user_Type}</Typography>
              <Typography variant="body1">Name: {user.first_Name}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveUserFromOrg(user.user_ID, sponsorOrgs[selectedOrg].org_ID)}
                style={{ marginRight: '8px' }}
              >
                Remove From Org
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'dimgray', color: 'white' }}
                onClick={() => handleUpdateCredentials(user.user_ID)}
              >
                Update Credentials
              </Button>
              <Button
                variant="contained"
                onClick={() => handleSetSponsorSpoof(user.user_ID)}
                style={{ marginRight: '8px', backgroundColor: 'green' }}
              >
                Sponsor View
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'red', color: 'white' }}
                onClick={() => handleDeleteUser(user.user_ID)}
              >
                Delete User
              </Button>
            </CardContent>
          </Card>
        ))}
        {selectedOrgBool && (
          <form>
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom: '20px' }}
              onClick={() => { setUserType('sponsor'); handleAddDriver(); }}
            >
              Add Sponsor
            </Button>
          </form>
        )}

        {selectedOrgBool && (
          <Typography variant="h4" gutterBottom>
            Drivers:
          </Typography>
        )}
        <div>
          {selectedOrgBool && driverUsers.map((user) => (
            <Card key={user.user_ID} style={{ marginBottom: '16px' }}>
              <CardContent>
                <Typography variant="h6">Type: {user.user_Type}</Typography>
                <Typography variant="body1">Name: {user.first_Name}</Typography>
                <Typography variant="body1">Points: {user.total_points}</Typography>
                <Typography variant="body1">Status: {user.app_Status}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleManagePoints(user.user_ID)}
                  style={{ marginRight: '8px' }}
                >
                  Manage Points
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveUserFromOrg(user.user_ID, sponsorOrgs[selectedOrg].org_ID)}
                  style={{ marginRight: '8px' }}
                >
                  Remove From Org
                </Button>
                <Button
                  variant="contained"
                  style={{ marginRight: '8px', backgroundColor: 'teal', color: 'white' }}
                  onClick={() => handleEditSponsorOrgs(user.user_ID)}
                >
                  Edit Sponsor Organization(s)
                </Button>
                <Button
                  variant="contained"
                  style={{ marginRight: '8px', backgroundColor: 'dimgray', color: 'white' }}
                  onClick={() => handleUpdateCredentials(user.user_ID)}
                >
                  Update Credentials
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSetDriverSpoof(user.user_ID)}
                  style={{ marginRight: '8px', backgroundColor: 'green' }}
                >
                  Driver View
                </Button>
                <Button
                  variant="contained"
                  style={{ marginRight: '8px', backgroundColor: 'red', color: 'white' }}
                  onClick={() => handleDeleteUser(user.user_ID)}
                >
                  Delete User
                </Button>
              </CardContent>
            </Card>
          ))}
          {selectedOrgBool && (
            <form>
              <Button
                variant="contained"
                color="primary"
                onClick={() => { setUserType('driver'); handleAddDriver(); }}
              >
                Add Driver
              </Button>
            </form>
          )}
        </div>
        {/* Points Management Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Manage Points</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="points"
              label="Change Points"
              type="number"
              fullWidth
              value={pointsChange}
              onChange={(e) => setPointsChange(e.target.value)}
            />
            <TextField
              margin="dense"
              id="behaviorText" // Unique ID
              label="Behavior"
              type="text"
              fullWidth
              value={behaviorText}
              onChange={(e) => setBehaviorText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handlePointSubmit} color="primary">Submit</Button>
          </DialogActions>
        </Dialog>
        {/* Alter orgs Dialog */}
        <Dialog open={orgsDialogOpen} onClose={handleCloseOrgsDialog}
          sx={{
            '& .MuiDialog-paper': {
              minWidth: '500px',
              maxWidth: '90%',
              width: 'auto',
              maxHeight: '80vh'
            }
          }}>
          <DialogTitle>Manage Orgs</DialogTitle>
          <DialogContent>
            <TextField
              select
              autoFocus
              margin="dense"
              id="action-select"
              label="Action"
              fullWidth
              value={actionType}
              onChange={(e) => handleActionChange(e.target.value)}
            >
              <MenuItem value="Add">Add</MenuItem>
              <MenuItem value="Remove">Remove</MenuItem>
            </TextField>
            {orgsList.map((org, index) => (
              <div key={index}>
                <Typography>{org.org_Name}</Typography>
                <Button variant="contained" onClick={() => handleOrgAction(org.org_Name)}>
                  {actionType === 'Add' ? 'Add to Org' : 'Remove from Org'}
                </Button>
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOrgsDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/* Driver Management Dialog */}
        <Dialog
          open={appDialogOpen}
          onClose={handleAppCloseDialog}
          fullWidth={true}
          style={{
            padding: '8px 24px'
          }}
        >
          <DialogTitle>Add a New User</DialogTitle>
          <DialogContent>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="Email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Name"
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="Birthday"
              label="Birthday (yyyy-mm-dd)"
              fullWidth
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="Password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAppCloseDialog}>Cancel</Button>
            <Button onClick={() => { handleAppSubmit(); }} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />

        <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Account</DialogTitle>
          <DialogContent>
            <Account isSpoof={true} spoofId={selectedUserUpdate} />
          </DialogContent>
        </Dialog>

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        )}
        {!error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" onClick={() => setCreateOrgDialogOpen(true)}> Create New Organization</Button>
          <form>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: '10px' }}
              onClick={() => { setUserType('admin'); handleAddDriver(); }}
            >
              Add Admin
            </Button>
          </form>
        </div>
        <div style={{ marginTop: '40px' }} />

        <Dialog open={createOrgDialogOpen} onClose={handleOrgDialogClose}>
          <DialogContent>
            <Typography variant="h5" gutterBottom>
              Organization Name
            </Typography>
            <TextField
              label="Enter Org Name"
              variant="outlined"
              value={createOrgName}
              fullWidth
              onChange={(e) => setCreateOrgName(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateOrg}>
              Create
            </Button>
          </DialogContent>
        </Dialog>

        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Tabs
              value={reportValue}
              onChange={handleReportChange}
              aria-label="catalog tabs"
              style={{ marginBottom: '20px' }} // Add margin-bottom for spacing
            >
              <Tab label="Sales" />
              <Tab label="Invoices" />
              <Tab label="Audit Log" />
            </Tabs>

        {reportValue === 0 && (
        <>
          <FormControlLabel
            control={<Checkbox checked={selectAllSponsors} onChange={handleSelectAllSponsors} />}
            label="All Sponsors"
            style={{marginRight: '10px'}}
          />
          <Select
            value={selectedSponsor}
            onChange={handleSponsorSelect}
            displayEmpty
            disabled={selectAllSponsors} // Disable the select if "All Drivers" or "Any Time" is checked
            style={{ marginBottom: '20px', marginRight: '10px'}}
          >
            <MenuItem value="" disabled={selectAllSponsors}>Select Sponsor</MenuItem>
            {sponsors && sponsors.map((sponsor, index) => (
              <MenuItem key={index} value={sponsor}>{sponsor}</MenuItem>
            ))}
          </Select>
          <FormControlLabel
            control={<Checkbox checked={selectAllDrivers} onChange={handleSelectAllDrivers} />}
            label="All Drivers"
            style={{marginRight: '10px'}}
          />
          <Select
            value={selectedDriver}
            onChange={handleDriverSelect}
            displayEmpty
            disabled={selectAllDrivers} // Disable the select if "All Drivers" or "Any Time" is checked
            style={{ marginBottom: '20px', marginRight: '10px'}}
          >
            <MenuItem value="" disabled={selectAllDrivers}>Select Driver</MenuItem>
            {drivers && drivers.map((driver, index) => (
              <MenuItem key={index} value={driver.first_Name}>{driver.first_Name}</MenuItem>
            ))}
          </Select>
          <Select
            value={selectedView}
            onChange={handleSelectedView}
            displayEmpty
            style={{marginRight: '10px'}}
          >
            <MenuItem value="">Select View</MenuItem>
            <MenuItem value="Detailed">Detailed</MenuItem>
            <MenuItem value="Summary">Summary</MenuItem>
          </Select>
          <FormControlLabel
            control={<Checkbox checked={anyTime} onChange={handleAnyTime} />}
            label="Any Time"
            style={{marginRight: '10px'}}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={anyTime} // Disable the Start Date TextField if "Any Time" is checked
            style={{marginRight: '10px'}}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={anyTime} // Disable the End Date TextField if "Any Time" is checked
            style={{marginRight: '10px'}}
          />
          <Button variant="contained" color="primary" onClick={handleSubmitSponsorSales} style={{marginRight: '10px'}}>
            Submit
          </Button>
          <Button variant="contained" color="primary" onClick={handleDownload3} style={{marginRight: '10px'}}>
            Download CSV
          </Button>
          {
            selectedView === 'Detailed' && sponsorSales.map((sales, index) => {
              if (!uniqueDriverNames.has(sales.first_Name)) {
                uniqueDriverNames.add(sales.first_Name);
                const filteredSales = sponsorSales.filter(s => s.first_Name === sales.first_Name);
                const totalPoints = filteredSales.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);

                return (
                  <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h2" style={{ marginBottom: '15px' }}>
                        Driver Name: {sales.first_Name}
                      </Typography>
                      {filteredSales.map((sale, idx) => (
                        <div key={idx} style={{ marginBottom: '15px' }}>
                          <Typography variant="body1" component="p">
                            Order ID: {sale.order_ID}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Item Name: {sale.item_Name}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Item Quantity: {sale.item_Quantity}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Points: {sale.points}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Timestamp: {sale.timestamp}
                          </Typography>
                        </div>
                      ))}
                      <Typography variant="h6" component="h2">
                        Total points: {totalPoints}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              } else {
                return null;
              }
            })
          }

          {
            selectedView === 'Summary' && sponsorSales.map((sales, index) => {
              if (!uniqueDriverNames.has(sales.first_Name)) {
                uniqueDriverNames.add(sales.first_Name);
                const filteredSales = sponsorSales.filter(s => s.first_Name === sales.first_Name);
                const totalPoints = filteredSales.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
                const allTotalPoints = sponsorSales.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);

                return (
                  <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h2" style={{ marginBottom: '15px' }}>
                        Driver Name: {sales.first_Name}
                      </Typography>
                      {filteredSales.map((sale, idx) => (
                        <div key={idx} style={{ marginBottom: '15px' }}>
                          <Typography variant="body1" component="p">
                            Order ID: {sale.order_ID}
                          </Typography>
                          {/* Total points spent within this order */}
                          <Typography variant="body1" component="p">
                            Total points spent within this order: {filteredSales.filter(s => s.order_ID === sale.order_ID).reduce((acc, curr) => acc + curr.points, 0)}
                          </Typography>
                        </div>
                      ))}
                      <Typography variant="h6" component="h2">
                        Total points: {totalPoints}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              } else {
                return null;
              }
            })
          }
        </>
        )}

{reportValue === 1 && (
  <>
    <FormControlLabel
      control={<Checkbox checked={selectAllSponsors} onChange={handleSelectAllSponsors} />}
      label="All Sponsors"
      style={{marginRight: '10px'}}
    />
    <Select
      value={selectedSponsor}
      onChange={handleSponsorSelect}
      displayEmpty
      disabled={selectAllSponsors} // Disable the select if "All Drivers" or "Any Time" is checked
      style={{ marginBottom: '20px', marginRight: '10px'}}
    >
      <MenuItem value="" disabled={selectAllSponsors}>Select Sponsor</MenuItem>
      {sponsors && sponsors.map((sponsor, index) => (
        <MenuItem key={index} value={sponsor}>{sponsor}</MenuItem>
      ))}
    </Select>
    <FormControlLabel
      control={<Checkbox checked={anyTime} onChange={handleAnyTime} />}
      label="Any Time"
      style={{marginRight: '10px'}}
    />
    <TextField
      label="Start Date"
      type="date"
      value={startDate}
      onChange={handleStartDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={anyTime} // Disable the Start Date TextField if "Any Time" is checked
      style={{marginRight: '10px'}}
    />
    <TextField
      label="End Date"
      type="date"
      value={endDate}
      onChange={handleEndDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={anyTime} // Disable the End Date TextField if "Any Time" is checked
      style={{marginRight: '10px'}}
    />
    <Button variant="contained" color="primary" onClick={handleSubmitInvoice} style={{marginRight: '10px'}}>
      Submit
    </Button>
    <Button variant="contained" color="primary" onClick={handleDownload1} style={{marginRight: '10px'}}>
      Download CSV
    </Button>
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Organization Name: {selectedSponsor}
        </Typography>
        <Typography variant="body1" component="p">
          Total Points Spent: {totalPoints}
        </Typography>
        <Typography variant="body1" component="p">
          Total Dollars Spent: {totalDollars}
        </Typography>
      </CardContent>
    </Card>
    {drivers.map((driver, index) => {
      // Check if the driver's name has already been encountered
      if (!uniqueDriverNames.has(driver.first_Name)) {
        // Add the driver's name to the set to mark it as encountered
        uniqueDriverNames.add(driver.first_Name);

        // Filter invoices for the current driver
        const filteredInvoices = invoices && invoices.length > 0 ? invoices.filter(invoice => invoice.first_Name === driver.first_Name) : [];

        // Calculate total points spent for the current driver
        const totalPoints = filteredInvoices.reduce((accumulator, currentValue) => accumulator + currentValue.points, 0);
        const totalDollars = filteredInvoices.reduce((accumulator, currentValue) => accumulator + (currentValue.points / currentValue.point_Ratio), 0);

        return (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="h6" component="h2">
                Driver Name: {driver.first_Name}
              </Typography>
              <Typography variant="body1" component="p">
                Total Points Spent: {totalPoints}
              </Typography>
              <Typography variant="body1" component="p">
                Total Dollars Spent: {totalDollars}
              </Typography>
            </CardContent>
          </Card>
        );
      } else {
        return null; // Skip rendering if the driver's name has already been encountered
      }
    })}
  </>
)}

{reportValue === 2 && (
  <>
    <Select
      value={selectedAudit}
      onChange={handleSelectedAudit}
      displayEmpty
      style={{marginRight: '10px'}}
    >
      <MenuItem value="">Select Audit</MenuItem>
      <MenuItem value="Driver_App_Audit">Driver App Audit</MenuItem>
      <MenuItem value="Login_Attempts_Audit">Login Attempts Audit</MenuItem>
      <MenuItem value="Password_Changes_Audit">Password Changes Audit</MenuItem>
      <MenuItem value="Point_Changes_Audit">Point Changes Audit</MenuItem>
    </Select>
    <FormControlLabel
      control={<Checkbox checked={selectAllSponsors} onChange={handleSelectAllSponsors} />}
      label="All Sponsors"
      style={{marginRight: '10px'}}
    />
    <Select
      value={selectedSponsor}
      onChange={handleSponsorSelect}
      displayEmpty
      disabled={selectAllSponsors} // Disable the select if "All Drivers" or "Any Time" is checked
      style={{ marginBottom: '20px', marginRight: '10px'}}
    >
      <MenuItem value="" disabled={selectAllSponsors}>Select Sponsor</MenuItem>
      {sponsors && sponsors.map((sponsor, index) => (
        <MenuItem key={index} value={sponsor}>{sponsor}</MenuItem>
      ))}
    </Select>
    <FormControlLabel
      control={<Checkbox checked={anyTime} onChange={handleAnyTime} />}
      label="Any Time"
      style={{marginRight: '10px'}}
    />
    <TextField
      label="Start Date"
      type="date"
      value={startDate}
      onChange={handleStartDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={anyTime} // Disable the Start Date TextField if "Any Time" is checked
      style={{marginRight: '10px'}}
    />
    <TextField
      label="End Date"
      type="date"
      value={endDate}
      onChange={handleEndDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={anyTime} // Disable the End Date TextField if "Any Time" is checked
      style={{marginRight: '10px'}}
    />
    <Button variant="contained" color="primary" onClick={handleSubmitAudits} style={{marginRight: '10px'}}>
      Submit
    </Button>
    <Button variant="contained" color="primary" onClick={handleDownload2} style={{marginRight: '10px'}}>
      Download CSV
    </Button>
    {selectedAudit === 'Driver_App_Audit' ? (
      auditLog.map((audit, index) => (
        <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6" component="h2">
              Driver App ID: {audit.driver_app_id}
            </Typography>
            <Typography variant="body1" component="p">
              User ID: {audit.user_ID}
            </Typography>
            <Typography variant="body1" component="p">
              Name: {audit.first_Name}
            </Typography>
            <Typography variant="body1" component="p">
              Reason: {audit.reason}
            </Typography>
            <Typography variant="body1" component="p">
              Timestamp: {audit.timestamp}
            </Typography>
            <Typography variant="body1" component="p">
              App Status: {audit.app_Status}
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : selectedAudit === 'Login_Attempts_Audit' ? (
      auditLog.map((audit, index) => (
        <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6" component="h2">
              Login Attempts ID: {audit.login_attempts_id}
            </Typography>
            <Typography variant="body1" component="p">
              User ID: {audit.user_ID}
            </Typography>
            <Typography variant="body1" component="p">
              Name: {audit.first_Name}
            </Typography>
            <Typography variant="body1" component="p">
              Status: {audit.status}
            </Typography>
            <Typography variant="body1" component="p">
              Timestamp: {audit.timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : selectedAudit === 'Password_Changes_Audit' ? (
      auditLog.map((audit, index) => (
        <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6" component="h2">
              Password Change ID: {audit.password_change_id}
            </Typography>
            <Typography variant="body1" component="p">
              User ID: {audit.user_ID}
            </Typography>
            <Typography variant="body1" component="p">
              Name: {audit.first_Name}
            </Typography>
            <Typography variant="body1" component="p">
              Change Type: {audit.change_type}
            </Typography>
            <Typography variant="body1" component="p">
              Timestamp: {audit.timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : selectedAudit === 'Point_Changes_Audit' && (
      auditLog.map((audit, index) => (
        <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="h6" component="h2">
              Point Change ID: {audit.point_change_id}
            </Typography>
            <Typography variant="body1" component="p">
              User ID: {audit.user_ID}
            </Typography>
            <Typography variant="body1" component="p">
              Name: {audit.first_Name}
            </Typography>
            <Typography variant="body1" component="p">
              Point Change Value: {audit.point_change_value}
            </Typography>
            <Typography variant="body1" component="p">
              Reason: {audit.reason}
            </Typography>
            <Typography variant="body1" component="p">
              Timestamp: {audit.timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))
    )}
  </>
)}

        {reportValue === 1 && (
          <>
            <Select
              value={selectedAudit}
              onChange={handleSelectedAudit}
              displayEmpty
              style={{ marginRight: '10px' }}
            >
              <MenuItem value="">Select Audit</MenuItem>
              <MenuItem value="Driver_App_Audit">Driver App Audit</MenuItem>
              <MenuItem value="Login_Attempts_Audit">Login Attempts Audit</MenuItem>
              <MenuItem value="Password_Changes_Audit">Password Changes Audit</MenuItem>
              <MenuItem value="Point_Changes_Audit">Point Changes Audit</MenuItem>
            </Select>
            <FormControlLabel
              control={<Checkbox checked={selectAllSponsors} onChange={handleSelectAllSponsors} />}
              label="All Sponsors"
              style={{ marginRight: '10px' }}
            />
            <Select
              value={selectedSponsor}
              onChange={handleSponsorSelect}
              displayEmpty
              disabled={selectAllSponsors} // Disable the select if "All Drivers" or "Any Time" is checked
              style={{ marginBottom: '20px', marginRight: '10px' }}
            >
              <MenuItem value="" disabled={selectAllSponsors}>Select Sponsor</MenuItem>
              {sponsors && sponsors.map((sponsor, index) => (
                <MenuItem key={index} value={sponsor}>{sponsor}</MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={<Checkbox checked={anyTime} onChange={handleAnyTime} />}
              label="Any Time"
              style={{ marginRight: '10px' }}
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={anyTime} // Disable the Start Date TextField if "Any Time" is checked
              style={{ marginRight: '10px' }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={anyTime} // Disable the End Date TextField if "Any Time" is checked
              style={{ marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmitAudits} style={{ marginRight: '10px' }}>
              Submit
            </Button>
            <Button variant="contained" color="primary" onClick={handleDownload2} style={{ marginRight: '10px' }}>
              Download CSV
            </Button>
            {
              selectedAudit === 'Driver_App_Audit' ? (
                auditLog.map((audit, index) => (
                  <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        Driver App ID: {audit.driver_app_id}
                      </Typography>
                      <Typography variant="body1" component="p">
                        User ID: {audit.user_ID}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Name: {audit.first_Name}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Reason: {audit.reason}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Timestamp: {audit.timestamp}
                      </Typography>
                      <Typography variant="body1" component="p">
                        App Status: {audit.app_Status}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : selectedAudit === 'Login_Attempts_Audit' ? (
                auditLog.map((audit, index) => (
                  <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        Login Attempts ID: {audit.login_attempts_id}
                      </Typography>
                      <Typography variant="body1" component="p">
                        User ID: {audit.user_ID}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Name: {audit.first_Name}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Status: {audit.status}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Timestamp: {audit.timestamp}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : selectedAudit === 'Password_Changes_Audit' ? (
                auditLog.map((audit, index) => (
                  <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        Password Change ID: {audit.password_change_id}
                      </Typography>
                      <Typography variant="body1" component="p">
                        User ID: {audit.user_ID}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Name: {audit.first_Name}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Change Type: {audit.change_type}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Timestamp: {audit.timestamp}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : selectedAudit === 'Point_Changes_Audit' && (
                auditLog.map((audit, index) => (
                  <Card key={index} style={{ marginBottom: '10px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        Point Change ID: {audit.point_change_id}
                      </Typography>
                      <Typography variant="body1" component="p">
                        User ID: {audit.user_ID}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Name: {audit.first_Name}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Point Change Value: {audit.point_change_value}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Reason: {audit.reason}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Timestamp: {audit.timestamp}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )
            }
          </>
        )}

        <Dialog open={openSponsorDialog} onClose={handleSponsorDialogClose}>
          <DialogContent>
            <SponsorsPage isSpoofing={true} sponsorSpoofID={sponsorSpoofId} />
          </DialogContent>
        </Dialog>

        <Dialog open={openDriverDialog} onClose={handleDriverDialogClose}>
          <DialogContent>
            <DriversPage isSpoofing={true} driverSpoofID={driverSpoofId} />
          </DialogContent>
        </Dialog>
      </Container>
    </React.Fragment>
  );
}

export default Admin;