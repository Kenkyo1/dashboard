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
      let dataItems: Item[] = new Array<Item>();

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
      let timeElements = xml.getElementsByTagName("time")

      for (let i = 0; i < Math.min(timeElements.length, 6); i++) {
        let timeItem = timeElements[i];

        let fromFull = timeItem.getAttribute("from") || "";
        let from = fromFull.split("T")[1] || "";
        let toFull = timeItem.getAttribute("to") || "";
        let to = toFull.split("T")[1] || "";

        let precipitation = timeItem.getElementsByTagName("precipitation")[0];
        let probability = precipitation?.getAttribute("probability") || "";

        let humidity = timeItem.getElementsByTagName("humidity")[0];
        let humidityValue = humidity?.getAttribute("value") || "";

        let clouds = timeItem.getElementsByTagName("clouds")[0];
        let cloudsValue = clouds?.getAttribute("all") || "";

        // Almacenamos cada Item en el arreglo temporal
        dataItems.push({
          dateStart: from,
          dateEnd: to,
          precipitation: probability,
          humidity: humidityValue,
          clouds: cloudsValue
        });
      }

      // console.log(dataToIndicators)

      {/* Modificación de la variable de estado mediante la función de actualización */ }
      setIndicators(dataToIndicators)
      setItems(dataItems);
    }

    request();
  }, [])

  let renderIndicators = () => {

    return indicators
      .map(
        (indicator, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3, xl: 3 }}>
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

        {renderIndicators()}

        {/* TABLA */}
        <Grid size={{ xs: 12, sm: 12, md: 8, xl: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3, md: 4, xl: 3 }}>
              <ControlWeather />
            </Grid>
            <Grid size={{ xs: 12, sm: 9, md: 8, xl: 9 }}>
              <TableWeather itemsIn={items} />
            </Grid>
          </Grid>

        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, sm: 8, md: 6, xl: 4 }}>
          <LineChartWeather />
        </Grid>

      </Grid>
    </>
  )
}

export default App
