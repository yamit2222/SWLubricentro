import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  Divider,
  Collapse,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../helpers/sweetAlert.js';
import { importarProductosExcel } from '../services/producto.service.js';

const ExcelImport = ({ open, onClose, onImportSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isFormatVisible, setIsFormatVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Agregar animación CSS para el spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Estilos como objetos JavaScript
  const styles = {
    dropZone: {
      border: `2px dashed ${dragOver ? '#FFB800' : '#444'}`,
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
      backgroundColor: dragOver ? '#2C303A' : '#23272F',
      pointerEvents: isUploading ? 'none' : 'auto',
      opacity: isUploading ? 0.7 : 1,
      color: '#F3F4F6'
    },
    dropContent: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    dropText: {
      margin: '8px 0',
      color: '#F3F4F6'
    },
    dropSmall: {
      color: '#B0B0B0'
    },
    spinner: {
      width: '32px',
      height: '32px',
      border: '3px solid #353945',
      borderTop: '3px solid #FFB800',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px'
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      showErrorAlert('Error', 'Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showErrorAlert('Error', 'El archivo no puede ser mayor a 5MB');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    
    try {
      const result = await importarProductosExcel(file);

      if (result.status === 'success') {
        const { exitosos, fallidos, errores } = result.data;
        
        if (fallidos > 0) {
          // Mostrar errores detallados
          let errorMessage = `✅ Se importaron ${exitosos} productos correctamente.\\n`;
          errorMessage += `❌ ${fallidos} productos no se pudieron importar:\\n\\n`;
          
          errores.forEach((error, index) => {
            if (index < 3) { // Mostrar solo los primeros 3 errores para que se vea mejor
              errorMessage += `📍 Fila ${error.fila}:\\n`;
              error.errores.forEach(err => {
                errorMessage += `   • ${err}\\n`;
              });
              errorMessage += `\\n`;
            }
          });
          
          if (errores.length > 3) {
            errorMessage += `... y ${errores.length - 3} errores más. Revisa los logs de la consola.`;
          }

          console.group('🔍 Detalles de errores de importación:');
          errores.forEach(error => {
            console.log(`❌ Fila ${error.fila}:`, error.errores);
            console.log('📝 Datos originales:', error.datos);
            if (error.datosLimpios) {
              console.log('🔧 Datos procesados:', error.datosLimpios);
            }
            console.log('---');
          });
          console.groupEnd();

          showWarningAlert('Importación parcial', errorMessage);
        } else {
          showSuccessAlert('¡Éxito!', `Se importaron ${exitosos} productos correctamente`);
        }

        if (onImportSuccess) {
          onImportSuccess();
        }
        onClose();
      } else {
        showErrorAlert('Error', result.message || 'Error al importar productos');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showErrorAlert('Error', 'Error de conexión al importar productos');
    } finally {
      setIsUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    // Crear plantilla en formato vertical - cada campo en su propia fila (sin stock)
    const templateData = [
      ['nombre'],
      ['codigoP'],
      ['descripcion'],
      ['precio'],
      ['marca'],
      ['categoria'],
      ['subcategoria']
    ];

    // Convertir a CSV para descarga - formato correcto con separadores
    const csvContent = templateData.map(row => 
      row.join(',')
    ).join('\n');

    // Agregar BOM para UTF-8 para mejor compatibilidad con Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plantilla_productos_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseAndSuccess = () => {
    if (onImportSuccess) {
      onImportSuccess();
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#23272F',
          color: '#F3F4F6',
          borderRadius: 3,
          border: '2px solid #FFB800'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#23272F', 
        color: '#FFB800', 
        borderBottom: '1px solid #353945',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Importar Productos desde Excel
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#FFB800' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#23272F', color: '#F3F4F6', pt: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained"
            onClick={downloadTemplate}
            sx={{ 
              bgcolor: '#28a745', 
              color: 'white',
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: '#218838' }
            }}
          >
            📄 Descargar Plantilla
          </Button>
        </Box>

        <Box 
          sx={styles.dropZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
        />
          
          <Box>
            {isUploading ? (
              <>
                <Box sx={styles.spinner}></Box>
                <Typography sx={styles.dropText}>Procesando archivo...</Typography>
              </>
            ) : (
              <>
                <Box sx={{ ...styles.dropContent, fontSize: '48px' }}>📄</Box>
                <Typography sx={styles.dropText}><strong>Arrastra tu archivo Excel aquí</strong></Typography>
                <Typography sx={styles.dropText}>o haz clic para seleccionar</Typography>
                <Typography variant="caption" sx={styles.dropSmall}>Solo archivos .xlsx o .xls (máximo 5MB)</Typography>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2, bgcolor: '#353945' }} />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#FFB800', fontWeight: 600 }}>
              Formato requerido:
            </Typography>
            <IconButton
              onClick={() => setIsFormatVisible(!isFormatVisible)}
              sx={{ color: '#FFB800' }}
            >
              {isFormatVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={isFormatVisible}>
            <Box sx={{ mt: 2, p: 2, bgcolor: '#2C303A', borderRadius: 2, border: '1px solid #444' }}>
              <Typography sx={{ mb: 2, color: '#F3F4F6' }}>
                El archivo Excel debe tener los siguientes campos, cada uno en una fila separada (formato vertical):
              </Typography>
              <Box component="ol" sx={{ pl: 3, color: '#F3F4F6' }}>
                <li><strong style={{ color: '#FFB800' }}>nombre</strong> - Nombre del producto</li>
                <li><strong style={{ color: '#FFB800' }}>codigoP</strong> - Código único del producto</li>
                <li><strong style={{ color: '#FFB800' }}>descripcion</strong> - Descripción detallada</li>
                <li><strong style={{ color: '#FFB800' }}>precio</strong> - Precio en pesos</li>
                <li><strong style={{ color: '#FFB800' }}>marca</strong> - Marca del producto</li>
                <li><strong style={{ color: '#FFB800' }}>categoria</strong> - aceite, filtro o bateria</li>
                <li><strong style={{ color: '#FFB800' }}>subcategoria</strong> - auto, camioneta, vehiculo comercial, motocicleta o maquinaria</li>
              </Box>
              <Typography sx={{ mt: 2, color: '#FFB800', fontStyle: 'italic', fontSize: '0.9rem' }}>
                📝 Nota: El stock inicial será 0 para todos los productos importados. Puedes modificarlo después desde la gestión de productos.
              </Typography>
            </Box>
          </Collapse>
        </Box>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#23272F', borderTop: '1px solid #353945', p: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ color: '#F3F4F6', borderColor: '#444' }}
          variant="outlined"
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelImport;