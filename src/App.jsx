import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=es&q=`;

// Definición de animaciones
const sunnyAnimation = keyframes`
  0% { background-color: #FFD700; }
  50% { background-color: #FFEC8B; }
  100% { background-color: #FFD700; }
`;

const rainyAnimation = keyframes`
  0% { background-color: #4F86F7; }
  50% { background-color: #6CA0DC; }
  100% { background-color: #4F86F7; }
`;

const cloudyAnimation = keyframes`
  0% { background-color: #C0C0C0; }
  50% { background-color: #A9A9A9; }
  100% { background-color: #C0C0C0; }
`;

const slideRightAnimation = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const enlargeAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

export default function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHot, setIsHot] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const [saving, setSaving] = useState(false);

  const saveToDatabase = async () => {
    try {
      if (!weather) {
        throw new Error('No hay datos meteorológicos para guardar');
      }

      setSaving(true);

      const response = await fetch('http://localhost:5000/saveWeatherData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: weather.city,
          country: weather.country,
          temperature: weather.temperature
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos en la base de datos');
      }

      console.log('Datos guardados correctamente en MongoDB');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim() || !country.trim()) throw { message: "Los campos 'ciudad' y 'país' son obligatorios" };

      const res = await fetch(API_WEATHER + city + "," + country);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      console.log(data);

      setIsTransitioning(true);
      setIsHot(data.current.temp_c >= 20);

      setTimeout(() => {
        setWeather({
          city: data.location.name,
          country: data.location.country,
          temperature: data.current.temp_c,
          condition: data.current.condition.code,
          conditionText: data.current.condition.text,
          icon: data.current.condition.icon,
        });
        setIsTransitioning(false);
      }, 500);

    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherAnimation = (condition) => {
    if (condition.includes("sunny")) return sunnyAnimation;
    if (condition.includes("rain") || condition.includes("drizzle")) return rainyAnimation;
    if (condition.includes("cloudy")) return cloudyAnimation;
    return null;
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 15 }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontFamily: 'Cooper, sans-serif', marginBottom: '20px', fontSize:'43px' }} 
      >
        TP2: Programación III "Weather App" 
      </Typography>
      <Box
  sx={{ display: "grid", gap: 3 }}
  component="form"
  autoComplete="off"
  onSubmit={onSubmit}
>
  <TextField
    id="country"
    label="País"
    variant="outlined"
    size="small"
    required
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    error={error.error}
    helperText={error.message}
    sx={{ 
      '& .MuiOutlinedInput-root': { 
        backgroundColor: '#F5DAD2',
        '& fieldset': { 
          borderColor: '#B3A398' 
        }, 
        '&:hover fieldset': { 
          borderColor: '#944E63' 
        }, 
        '&.Mui-focused fieldset': { 
          borderColor: '#944E63' 
        }, 
      } 
    }}
  />

  <TextField
    id="city"
    label="Ciudad"
    variant="outlined"
    size="small"
    required
    value={city}
    onChange={(e) => setCity(e.target.value)}
    error={error.error}
    helperText={error.message}
    sx={{ 
      '& .MuiOutlinedInput-root': { 
        backgroundColor: '#F5DAD2',
        '& fieldset': { 
          borderColor: '#B3A398' 
        }, 
        '&:hover fieldset': { 
          borderColor: '#944E63' 
        }, 
        '&.Mui-focused fieldset': { 
          borderColor: '#944E63' 
        }, 
      } 
    }}
  />

  <LoadingButton
    type="submit"
    variant="contained"
    loading={loading}
    loadingIndicator="Buscando..."
    sx={{ 
      backgroundColor: '#DBB5B5', 
      '&:hover': { backgroundColor: '#987070' },
      animation: loading ? `${enlargeAnimation} 0.6s infinite` : 'none'
    }}
  >
    Buscar
  </LoadingButton>
  
  <LoadingButton
    onClick={saveToDatabase}
    variant="contained"
    loading={saving}
    loadingIndicator="Guardando..."
    sx={{ 
      backgroundColor: '#DBB5B5', 
      '&:hover': { backgroundColor: '#987070' },
      animation: saving ? `${enlargeAnimation} 0.6s infinite` : 'none'
    }}
  >
    Base de Datos
  </LoadingButton>
</Box>



      {weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
            animation: `${getWeatherAnimation(weather.conditionText.toLowerCase())} 5s infinite alternate, ${isTransitioning ? (isHot ? `${slideRightAnimation} 0.5s` : `${slideLeftAnimation} 0.5s`) : 'none'}`,
            transition: 'transform 0.5s, opacity 0.5s',
          }}
        >
          <Typography
            variant="h4"
            component="h2"
          >
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />
          <Typography
            variant="h5"
            component="h3"
          >
            {weather.temperature} °C
          </Typography>
          <Typography
            variant="h6"
            component="h4"
          >
            {weather.conditionText}
          </Typography>
        </Box>
      )}
      <Typography
        textAlign="center"
        sx={{ mt: 5, fontSize: "15px" }}
      >
        Este trabajo fue realizado por Luz Argiró Arriazu, COM 1
      </Typography>

      <Typography
        textAlign="center"
        sx={{ mt: 1, fontSize: "13px" }}
      >
        Ir al Trabajo Practico:{" "}
        <a
          href="https://classroom.google.com/u/2/c/NjgxNDY4MDgzMTUz/a/NjgyMzg2ODIxNDc0/details"
          title="Classroom"
        >
          Classroom.com
        </a>
      </Typography>
    </Container>
  );
}
