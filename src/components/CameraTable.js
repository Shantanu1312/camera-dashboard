import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, InputAdornment, Button, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';  // Server icon
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'; // Block icon
import WobotLogo from '../resources/wobotLogo.jpg'; // Assuming the logo is present in this path

const CameraTable = () => {
    const [cameras, setCameras] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const camerasPerPage = 10;

    // Fetch the camera data
    useEffect(() => {
        axios.get('https://api-app-staging.wobot.ai/app/v1/fetch/cameras', {
            headers: {
                Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy`
            }
        })
        .then(response => {
            setCameras(response.data.data);
        })
        .catch(error => {
            console.error('Error fetching the camera data:', error);
        });
    }, []);

    // Filter and search logic
    const filteredCameras = cameras.filter(camera => {
        return camera.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter ? camera.status === statusFilter : true) &&
            (locationFilter ? camera.location === locationFilter : true);
    });

    // Pagination logic
    const indexOfLastCamera = currentPage * camerasPerPage;
    const indexOfFirstCamera = indexOfLastCamera - camerasPerPage;
    const currentCameras = filteredCameras.slice(indexOfFirstCamera, indexOfLastCamera);

    const totalPages = Math.ceil(filteredCameras.length / camerasPerPage);

    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

        axios.put('https://api-app-staging.wobot.ai/app/v1/update/camera/status', {
            id: id,
            status: newStatus
        }, {
            headers: {
                Authorization: `Bearer 4ApVMIn5sTxeW7GQ5VWeWiy`
            }
        })
        .then(response => {
            setCameras(cameras.map(camera => 
                camera.id === id ? { ...camera, status: newStatus } : camera
            ));
        })
        .catch(error => {
            console.error('Error updating status:', error);
        });
    };

    return (
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', minHeight: '100vh' }}> {/* Cream background */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <img src={WobotLogo} alt="Wobot Logo" style={{ width: '150px', marginLeft: '-40px' }} />
            </div>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                    <h1 style={{color : '#212121', marginBottom: '5px' }}>Cameras</h1>
                    <p style={{color : '#212121', marginTop: '0px' }}>Manage your cameras here.</p>
                </div>
                <TextField
                    variant="outlined"
                    placeholder="Search cameras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    style={{ borderRadius: '25px', width: '30%' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        style: { borderRadius: 5 }
                    }}
                />
            </Box>

            <TableContainer component={Paper} style={{ backgroundColor: '#ffffff' }}>
                <Box style={{ padding: '10px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px' }}>
                    {/* Location Filter */}
                    <FormControl variant="outlined" size="small" style={{ width: '20%', borderRadius: '25px' }}>
                        <InputLabel><LocationOnIcon /> Location</InputLabel>
                        <Select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            label="Location"
                        >
                            <MenuItem value="">All</MenuItem>
                            {Array.from(new Set(cameras.map(camera => camera.location))).map((location, index) => (
                                <MenuItem key={index} value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small" style={{ width: '20%', borderRadius: '25px' }}>
                        <InputLabel><RssFeedIcon /> Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Health</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Recorder</TableCell>
                            <TableCell>Tasks</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentCameras.map((camera) => (
                            <TableRow key={camera.id}>
                                <TableCell>{camera.name}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="left">
                                        <Box position="relative" display="inline-flex" style={{ marginRight: '25px' }}> {/* Reduced margin for better alignment */}
                                            <FilterDramaIcon style={{ fontSize: '16px', position: 'absolute', top: '5px', left: '-20px' }} /> {/* Smaller Cloud Icon */}
                                            <CircularProgress variant="determinate" value={75} size={30} style={{ color: 'orange' }} /> {/* Smaller CircularProgress */}
                                            <Box
                                                top={0}
                                                left={0}
                                                bottom={0}
                                                right={0}
                                                position="absolute"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <span style={{ fontSize: '10px', color: 'black', fontWeight: 'bold' }}>{camera.health.cloud}</span> {/* Smaller font for the number */}
                                            </Box>
                                        </Box>
                                        <Box position="relative" display="inline-flex">
                                            <DnsOutlinedIcon style={{ fontSize: '16px', position: 'absolute',  top: '5px', left: '-20px' }} /> {/* Smaller Server Icon */}
                                            <CircularProgress variant="determinate" value={75} size={30} style={{ color: 'green' }} /> {/* Smaller CircularProgress */}
                                            <Box
                                                top={0}
                                                left={0}
                                                bottom={0}
                                                right={0}
                                                position="absolute"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <span style={{ fontSize: '10px', color: 'black', fontWeight: 'bold' }}>{camera.health.device}</span> {/* Smaller font for the number */}
                                            </Box>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell>{camera.location}</TableCell>
                                <TableCell>{camera.recorder ? camera.recorder : "N/A"}</TableCell>
                                <TableCell>{camera.tasks} Tasks</TableCell>
                                <TableCell>
                                    {camera.status === 'Active' ? (
                                        <Button
                                            variant="contained"
                                            style={{ backgroundColor: '#e6f4ef', color: '#029262', fontWeight: 'bold',fontSize: "10px" }}
                                            onClick={() => handleStatusToggle(camera.id, camera.status)}
                                        >
                                            Active
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            style={{ backgroundColor: '#f0f0f0', color: '#545454', fontWeight: 'bold',fontSize: "10px" }}
                                            onClick={() => handleStatusToggle(camera.id, camera.status)}
                                        >
                                            Inactive
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <BlockOutlinedIcon style={{ cursor: 'pointer' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={2}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index}
                        variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                        onClick={() => setCurrentPage(index + 1)}
                        style={{ margin: '0 5px' }}
                    >
                        {index + 1}
                    </Button>
                ))}
            </Box>
        </div>
    );
};

export default CameraTable;