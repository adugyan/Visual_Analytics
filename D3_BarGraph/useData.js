import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/adugyan/e0f52c64cdade2e6a627a60b58f4b566/raw/6c98a76d3a2251b68e37e972a49b1d523a392185/UN_Population_2019.csv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = d => {
      d.Population = +d['2020'] * 1000;
      return d;
    };
    csv(csvUrl, row).then(data => {
      setData(data.slice(0, 10));
    });
  }, []);
  
  return data;
};