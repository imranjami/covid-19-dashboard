import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import LineGraph from "./LineGraph";
import Table from "./Table";
import InfoBox from "./InfoBox";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: 0});
  const [mapZoom, setMapZoom] = useState(2);
  const [casesType, setCasesType] = useState("cases");

  {/* API Call to get all country info */}
  useEffect(() => {
    const getCountryInfo = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
    }
    
    getCountryInfo();
  }, [])

  {/* API Call to get all country info */}
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

        let sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
        setTableData(sortedData);
      });
    };
    getCountriesData();

  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = (countryCode === 'worldwide' 
      ? "https://disease.sh/v3/covid-19/all" 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`);

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter({
        lat: data.countryInfo.lat,
        lng: data.countryInfo.long
      });
      setMapZoom(4);
    });

  }

  return (
    <div className="app">
      <div className="app__header">
        <h1>Live Covid-19 Statistics</h1>
        <FormControl className="app__dropdown">
          <Select
            variant="outlined"
            value={country}
            onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app__body">
        <Card className="app__left">
          <CardContent>
            <div className="app__information">
              <div className="app__table">
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
              </div>
              <div className="app__chart">
                <h3>Worldwide new {casesType}</h3>
                <LineGraph className="chart" casesType={casesType} />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="app__right">
          <div className="app__stats">
            <InfoBox
              title="Cases"
              isRed
              onClick={(e) => setCasesType("cases")}
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
            />
            <InfoBox
              title="Recovered"
              onClick={(e) => setCasesType("recovered")}
              active={casesType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
            />
            <InfoBox
              title="Deaths"
              isRed
              onClick={(e) => setCasesType("deaths")}
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
            />
          </div>
          <Map
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            casesType={casesType}
          />
        </div>
      </div>
      
      
    </div>
  );
};

export default App;
