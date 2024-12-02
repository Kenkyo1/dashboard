import './App.css'
import Grid from '@mui/material/Grid2'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';

{/* Hooks */ }
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {

  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])

  let [items, setItems] = useState<Item[]>([])

  {/* Hook: useEffect */ }
  useEffect(() => {
    let request = async () => {

      {/* Request */ }
      let API_KEY = "5ad95fd42f766d02d815616e2b22d887"
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
      let savedTextXML = await response.text();

      {/* XML Parser */ }
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let dataToIndicators: Indicator[] = new Array<Indicator>();

      // arreglo temporal del tipo ITEM
      let datoItems: Item[] = new Array<Item>();

      {/* 
          Análisis, extracción y almacenamiento del contenido del XML 
          en el arreglo de resultados
      */}

      let name = xml.getElementsByTagName("name")[0].innerHTML || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

      let location = xml.getElementsByTagName("location")[1]

      let latitude = location.getAttribute("latitude") || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

      let longitude = location.getAttribute("longitude") || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

      let altitude = location.getAttribute("altitude") || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

      // referencias a los elementos de time
      let timeItem = xml.getElementsByTagName("time")[1]

      let dateFrom = timeItem.getAttribute("to") || ""
      let dateTo = timeItem.getAttribute("from") || ""

      let precipitacion = xml.getElementsByTagName("time > precipitation")[1]
      let probability = precipitacion.getAttribute("probability") || ""

      let humidity = xml.getElementsByTagName("time > humidity")[1]
      let humidityValue = humidity.getAttribute("value") || ""

      let clouds = xml.getElementsByTagName("time > clouds")[1]
      let cloudsValue = clouds.getAttribute("all") || ""

      // console.log(dataToIndicators)

      {/* Modificación de la variable de estado mediante la función de actualización */ }
      setIndicators(dataToIndicators)
    }

    request();
  }, [])

  let renderIndicators = () => {

    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, xl: 3 }}>
            <IndicatorWeather
              title={indicator["title"]}
              subtitle={indicator["subtitle"]}
              value={indicator["value"]} />
          </Grid>
        )
      )

  }

  return (
    <>
      <Grid container spacing={5}>

        {/* Indicadores */}

        {/* <Grid size={{ xs: 12, xl: 3 }}>
          <IndicatorWeather title={'Indicador 1'} subtitle={'Unidad 1'} value={'1.23'} />
        </Grid>
        <Grid size={{ xs: 12, xl: 3 }}>
          <IndicatorWeather title={'Indicador 2'} subtitle={'Unidad 2'} value={'3.12'} />
        </Grid>
        <Grid size={{ xs: 12, xl: 3 }}>
          <IndicatorWeather title={'Indicador 3'} subtitle={'Unidad 3'} value={'2.31'} />
        </Grid>
        <Grid size={{ xs: 12, xl: 3 }}>
          <IndicatorWeather title={'Indicador 4'} subtitle={'Unidad 4'} value={'3.21'} />
        </Grid> */}

        {renderIndicators()}

        {/* TABLA */}
        <Grid size={{ xs: 12, xl: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, xl: 3 }}>
              <ControlWeather />
            </Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              <TableWeather />
            </Grid>
          </Grid>

        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, xl: 4 }}>
          <LineChartWeather />
        </Grid>

      </Grid>
    </>
  )
}

export default App
