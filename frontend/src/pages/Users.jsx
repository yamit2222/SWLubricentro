import { useState, useCallback } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Search from '../components/Search';
import Popup from '../components/Popup';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import '@styles/colors.css';

// Crear un tema personalizado con los colores del proyecto
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFB800',
      contrastText: '#1A1A1A',
    },
    secondary: {
      main: '#1A1A1A',
      contrastText: '#FFB800',
    },
    error: {
      main: '#D72638',
    },
    background: {
      default: '#D9D9D9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4E4E4E',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: 'var(--amarillo-potente)',
          color: 'var(--negro-profundo)',
          '&:hover': {
            backgroundColor: 'var(--amarillo-potente-30)',
          },
        },
        outlined: {
          borderColor: 'var(--amarillo-potente)',
          color: 'var(--amarillo-potente)',
          '&:hover': {
            borderColor: 'var(--amarillo-potente)',
            backgroundColor: 'var(--amarillo-potente-10)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--color-fondo-secundario)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorSuccess': {
            backgroundColor: 'var(--color-exito)',
            color: 'white',
          },
          '&.MuiChip-colorError': {
            backgroundColor: 'var(--color-error)',
            color: 'white',
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: 'var(--color-advertencia)',
            color: 'var(--negro-profundo)',
          },
        },
      },
    },
  },
});

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

  const handleRutFilterChange = (e) => {
    setFilterRut(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.rut.toLowerCase().includes(filterRut.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Usuarios
              </Typography>
            </Grid>
            <Grid item>
              <Search value={filterRut} onChange={handleRutFilterChange} placeholder={'Filtrar por rut'} />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {user.rol === 'administrador' ? (
                      <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    ) : (
                      <PersonIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                    )}
                    <Typography variant="h6" component="div">
                      {user.nombreCompleto}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    RUT: {user.rut}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email: {user.email}
                  </Typography>
                  <Chip
                    label={user.rol.toUpperCase()}
                    color={user.rol === 'administrador' ? 'primary' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Tooltip title="Editar">
                    <IconButton 
                      onClick={() => {
                        setDataUser([user]);
                        handleClickUpdate();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      onClick={() => handleDelete([user])}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
    </ThemeProvider>
  );
};

export default Users;