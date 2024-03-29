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

const monthReversed = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const PrintListMap = ({ category, setReady }) => {
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);

  const [result3, setResult3] = useState(null);

  useEffect(() => {
    if (!category?.id) return;

    const re = {};
    const re2 = {};
    const re3 = {};

    //initialize re2 with sorted months

    const last8months = [];
    const today = new Date();

    for (var i = 7; i >= 0; i -= 1) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

      last8months.push(
        `${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`
      );

      re3[months[d.getMonth() + 1] + " " + d.getFullYear()] ||= 0;
    }

    for (let i = 0; i < last8months.length; i++) {
      re2[last8months[i]] ||= 0;
    }

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

        //result2 and result3, just different format of the object
        if (re2[month + "/" + String(year).slice(2)] >= 0) {
          re2[month + "/" + String(year).slice(2)] += order.quantity;
        }

        if (
          re3[
            `${months[completedDate.getMonth() + 1]} ${String(
              completedDate.getFullYear()
            )}`
          ] >= 0
        ) {
          re3[
            `${months[completedDate.getMonth() + 1]} ${String(
              completedDate.getFullYear()
            )}`
          ] += order.quantity;
        }
      });
    });

    setResult(re);
    setResult2(re2);
    setResult3(re3);
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
          // legend: {
          //   // display: false,
          // },

          legend: {
            labels: {
              boxWidth: 60,
              boxHeight: 18,
              font: {
                size: 22,
              },
              textAlign: "center",
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: 15,
              },
            },
          },

          y: {
            ticks: {
              color: "black",
              font: {
                weight: "bold",
                size: 15,
              },
            },
            grace: "12%",
            beginAtZero: true,
          },
        },
      },
      data: {
        labels: Object.keys(result2).map((v) => v),
        datasets: [
          {
            label: " Category Usage by Month",
            data: Object.values(result2).map((v) => v),
          },
        ],
      },
    });

    setReady((prev) => [...prev, category.id]);
  }, [result]);

  return (
    <div className="pagebreak">
      <div className="home-krink ppi-martop">{category?.name}</div>
      <div className="ppi-can">
        <canvas
          className="pi-parent ppi-print"
          id={`pi-parent-${category?.id}`}
        ></canvas>
      </div>

      <div className="ppi-bot">
        <div className="pi-octoggle ppi-b ppi-c ppi-titlesmall">
          Usage by Month
        </div>
        {result3 &&
          Object.keys(result3).map((value, i) => (
            <div className="pi-sub ppi-b ppi-fontsmall">
              {value}: {Object.values(result3)[i]}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PrintListMap;
