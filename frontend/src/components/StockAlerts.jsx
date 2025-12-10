import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Alert, 
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Collapse,
  IconButton,
  Badge
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InventoryIcon from '@mui/icons-material/Inventory';
import { getAllStockBajo } from '../services/alerts.service';

const StockAlerts = () => {
  const [alertas, setAlertas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState({ productos: false, subproductos: false });
  const LIMITE_MOSTRAR = 3; // Solo mostrar 3 productos por defecto

  useEffect(() => {
    loadStockAlerts();
    // Actualizar cada 5 minutos
    const interval = setInterval(loadStockAlerts, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadStockAlerts = async () => {
    try {
      setLoading(true);
      const data = await getAllStockBajo();
      setAlertas(data);
      // Resetear el estado de "ver más" cuando se actualizan las alertas
      setShowMore({ productos: false, subproductos: false });
    } catch (error) {
      console.error('Error cargando alertas de stock:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !alertas) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Cargando alertas de stock...</Typography>
      </Paper>
    );
  }

  if (alertas.total === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#e8f5e8' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon color="success" />
          <Typography variant="h6" color="success.main">
            Stock en buen estado
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Todos los productos tienen stock suficiente
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <Alert 
        severity={alertas.criticos > 0 ? 'error' : 'warning'}
        sx={{ borderRadius: 0 }}
        action={
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      >
        <AlertTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {alertas.criticos > 0 ? <ErrorIcon /> : <WarningIcon />}
            Alertas de Stock
            <Badge badgeContent={alertas.total} color="error" />
          </Box>
        </AlertTitle>
        <Typography variant="body2">
          {alertas.criticos > 0 && (
            <>Stock crítico: {alertas.criticos} productos. </>
          )}
          Stock bajo: {alertas.total} productos requieren reposición
        </Typography>
      </Alert>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {alertas.productos.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Productos ({alertas.productos.length})
                </Typography>
                {alertas.productos.length > LIMITE_MOSTRAR && (
                  <Button
                    size="small"
                    onClick={() => setShowMore(prev => ({ ...prev, productos: !prev.productos }))}
                    endIcon={showMore.productos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {showMore.productos ? 'Ver menos' : `Ver todos (${alertas.productos.length})`}
                  </Button>
                )}
              </Box>
              <List dense>
                {(showMore.productos ? alertas.productos : alertas.productos.slice(0, LIMITE_MOSTRAR))
                  .map((producto) => (
                  <ListItem key={`producto-${producto.id}`}>
                    <ListItemText
                      primary={producto.nombre}
                      secondary={`Código: ${producto.codigoP} | Categoría: ${producto.categoria}`}
                    />
                    <Chip
                      label={`Stock: ${producto.stock}`}
                      color={producto.nivel === 'critico' ? 'error' : 'warning'}
                      size="small"
                      icon={producto.nivel === 'critico' ? <ErrorIcon /> : <WarningIcon />}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {alertas.subproductos.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Subproductos ({alertas.subproductos.length})
                </Typography>
                {alertas.subproductos.length > LIMITE_MOSTRAR && (
                  <Button
                    size="small"
                    onClick={() => setShowMore(prev => ({ ...prev, subproductos: !prev.subproductos }))}
                    endIcon={showMore.subproductos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {showMore.subproductos ? 'Ver menos' : `Ver todos (${alertas.subproductos.length})`}
                  </Button>
                )}
              </Box>
              <List dense>
                {(showMore.subproductos ? alertas.subproductos : alertas.subproductos.slice(0, LIMITE_MOSTRAR))
                  .map((subproducto) => (
                  <ListItem key={`subproducto-${subproducto.id}`}>
                    <ListItemText
                      primary={subproducto.nombre}
                      secondary={`Código: ${subproducto.codigosubP} | Categoría: ${subproducto.categoria}`}
                    />
                    <Chip
                      label={`Stock: ${subproducto.stock}`}
                      color={subproducto.nivel === 'critico' ? 'error' : 'warning'}
                      size="small"
                      icon={subproducto.nivel === 'critico' ? <ErrorIcon /> : <WarningIcon />}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={loadStockAlerts}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default StockAlerts;