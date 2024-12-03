import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import NavBar from '../components/NavBar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    technologies: '',
    description: '',
    supervisor: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://devseccvr.alwaysdata.net/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedProject(null);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`https://devseccvr.alwaysdata.net/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProject),
      });
      if (response.ok) {
        fetchProjects();
        handleEditClose();
      }
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`https://devseccvr.alwaysdata.net/projects/${selectedProject.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProjects();
        handleMenuClose();
      }
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const handleAddMenuOpen = (event) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddManually = () => {
    handleAddMenuClose();
    setAddDialogOpen(true);
  };

  const handleUploadFile = () => {
    handleAddMenuClose();
    // Aquí puedes manejar la lógica para cargar un archivo
    console.log("Cargar archivo seleccionado");
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    setNewProject({
      name: '',
      technologies: '',
      description: '',
      supervisor: ''
    });
  };

  const handleAddSave = async () => {
    try {
      const response = await fetch("https://devseccvr.alwaysdata.net/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        fetchProjects();
        handleAddClose();
      }
    } catch (error) {
      console.error("Error al agregar el proyecto:", error);
    }
  };

  return (
    <div>
      <NavBar />

      <div className='container' style={{ width: '80%', margin: '0 auto' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1>Administrador de proyectos</h1>
          <p>Gestiona y supervisa todos tus proyectos en un solo lugar</p>
        </header>

        <div className='Table' style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <TextField
              label="Buscar proyectos..."
              variant="outlined"
              size='small'
              margin="normal"
              style={{ flex: 1, marginRight: '10px' }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{
                height: '40px',
                color: '#fff',
                background: 'linear-gradient(90deg, #FF4E50, #F9D423)',
                borderRadius: '50px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
              }}
              onClick={handleAddMenuOpen}
            >
              Agregar Proyecto
            </Button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tecnologías</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Supervisor</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.technologies}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.supervisor}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, project)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Menú de agregar proyecto */}
      <Menu
        anchorEl={addMenuAnchorEl}
        open={Boolean(addMenuAnchorEl)}
        onClose={handleAddMenuClose}
      >
        <MenuItem onClick={handleAddManually}>
          <PlaylistAddIcon style={{ marginRight: '10px' }} /> Agregar manualmente
        </MenuItem>
        <MenuItem onClick={handleUploadFile}>
          <FileUploadIcon style={{ marginRight: '10px' }} /> Cargar desde archivo
        </MenuItem>
      </Menu>

      {/* Diálogo para agregar manualmente */}
      <Dialog open={addDialogOpen} onClose={handleAddClose}>
        <DialogTitle>Agregar Proyecto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <TextField
            label="Tecnologías"
            fullWidth
            margin="dense"
            value={newProject.technologies}
            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <TextField
            label="Supervisor"
            fullWidth
            margin="dense"
            value={newProject.supervisor}
            onChange={(e) => setNewProject({ ...newProject, supervisor: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Projects;
