import React from 'react';
import ClimaView from './DefaultView';

export const NascerDoSol = ClimaView.bind({});
NascerDoSol.args = {
  weather: 'sun',
  temperature: 29.1,
  location: 'Brasília',
  measure: 'sunrise',
  measureValue: '08:00',
};

export const PorDoSol = ClimaView.bind({});
PorDoSol.args = {
  weather: 'sun',
  temperature: 25,
  location: 'Brasília',
  measure: 'sunset',
  measureValue: '18:00',
};

export const Nublado = ClimaView.bind({});
Nublado.args = {
  weather: 'cloud',
  temperature: 22,
  location: 'São Paulo',
  measure: 'sunset',
  measureValue: '17:45',
};

export default {
  title: 'Blocks/Clima',
  component: ClimaView,
};
