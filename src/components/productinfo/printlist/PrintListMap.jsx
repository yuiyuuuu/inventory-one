import React, { useEffect, useState } from "react";

import Chart from "chart.js/auto";

const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const PrintListMap = ({ category }) => {
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);

  useEffect(() => {
    if (!category?.id) return;

    const re = {};
    const re2 = {};

    category.items.forEach((item) => {
      item.orders.sort(function (a, b) {
        return (
          new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
        );
      });

      item.orders.forEach((order) => {
        const completedDate = new Date(order.completedAt);
        const year = completedDate.getFullYear();
        const month = completedDate.getMonth() + 1;

        re[year] ||= {};
        re[year][months[month]] ||= 0;

        re[year][months[month]] += order.quantity;

        //re2

        re2[month + "/" + String(year).slice(2)] ||= 0;
        re2[month + "/" + String(year).slice(2)] += order.quantity;
        setResult2(re2);
      });
    });

    console.log(re2, "result");

    setResult(re);
  }, [category]);

  //could use one useeffect, but two is more clean and easier to read with the chart
  useEffect(() => {
    if (!result) return;

    //add chart here later

    const c = new Chart(document.getElementById(`pi-parent-${category?.id}`), {
      type: "line",
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: "black",
            },
          },
        },
      },
      data: {
        labels: Object.keys(result2).map((v) => v),
        datasets: [
          {
            label: " Category QTY by month",
            data: Object.values(result2).map((v) => v),
          },
        ],
      },
    });

    // const chart = new Chart(
    //   document.getElementById(`pi-parent-${category?.id}`),
    //   {
    //     type: "line",
    //     data: {
    //       labels: (function () {
    //         const result = [];
    //         const year = Object.keys(result);

    //         year.forEach((t) => {
    //           console.log(t, "t");
    //           result.push(...Object.keys(t));
    //         });

    //         console.log(result, "re");
    //         return result;
    //       })(),
    //     },
    //   }
    // );
  }, [result]);

  return (
    <div className='pagebreak'>
      <div className='home-krink'>{category?.name}</div>
      <div className='ppi-can'>
        <canvas
          className='pi-parent ppi-print'
          id={`pi-parent-${category?.id}`}
        ></canvas>
      </div>
    </div>
  );
};

export default PrintListMap;
