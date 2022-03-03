import React from "react";
import PropTypes from "prop-types";
import embed from "vega-embed";
import { isMobileOnly } from "react-device-detect";

const mjdNow = Date.now() / 86400000.0 + 40587.0;

const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const spec = (url) => ({
  $schema: "https://vega.github.io/schema/vega-lite/v4.json",
  data: {
    url,
    format: {
      type: "json",
      property: "data", // where on the JSON does the data live
    },
  },
  background: "transparent",
  layer: [
    {
      selection: {
        filterMags: {
          type: "multi",
          fields: ["filter"],
          bind: "legend",
        },
        grid: {
          type: "interval",
          bind: "scales",
        },
      },
      mark: {
        type: "point",
        shape: "circle",
        filled: "true",
        size: 15,
      },
      transform: [
        {
          calculate:
            "join([format(datum.mag, '.2f'), ' ± ', format(datum.magerr, '.2f'), ' (', datum.magsys, ')'], '')",
          as: "magAndErr",
        },
        { calculate: `${mjdNow} - datum.mjd`, as: "daysAgo" },
        {
          calculate: `(indexof(datum.filter, 'ztfr') >= 0
          ? "#dc3545"
          : indexof(datum.filter, 'ztfi') >= 0
            ? "#f3dc11"
            : indexof(datum.filter, 'ztfg') >= 0
              ? "#28a745"
              : indexof(datum.filter, 'AllWISE') >= 0
                ? "#2f5492"
                : indexof(datum.filter, 'Gaia_EDR3') >= 0
                  ? "#ff7f0e"
                  : indexof(datum.filter, 'PS1_DR1') >= 0
                    ? "#3bbed5"
                    : indexof(datum.filter, 'GALEX') >= 0
                      ? "#6607c2"
                      : indexof(datum.filter, 'TNX') >= 0
                        ? "#ed6cf6"
                        : "${getRandomColor()}")`,
          as: "plcolor",
        },
      ],
      encoding: {
        x: {
          field: "daysAgo",
          type: "quantitative",
          scale: {
            zero: false,
            reverse: true,
          },
          axis: {
            title: "days ago",
          },
        },
        y: {
          field: "mag",
          type: "quantitative",
          scale: {
            zero: false,
            reverse: true,
          },
          axis: {
            title: "mag",
          },
        },
        color: {
          field: "filter",
          type: "nominal",
          scale: { range: { field: "plcolor" } },
        },
        tooltip: [
          { field: "magAndErr", title: "mag", type: "nominal" },
          { field: "filter", type: "ordinal" },
          { field: "mjd", type: "quantitative" },
          { field: "daysAgo", type: "quantitative" },
          { field: "limiting_mag", type: "quantitative", format: ".2f" },
        ],
        opacity: {
          condition: { selection: "filterMags", value: 1 },
          value: 0,
        },
      },
    },

    // Render error bars
    {
      selection: {
        filterErrBars: {
          type: "multi",
          fields: ["filter"],
          bind: "legend",
        },
      },
      transform: [
        { filter: "datum.mag != null && datum.magerr != null" },
        { calculate: "datum.mag - datum.magerr", as: "magMin" },
        { calculate: "datum.mag + datum.magerr", as: "magMax" },
        { calculate: `${mjdNow} - datum.mjd`, as: "daysAgo" },
      ],
      mark: {
        type: "rule",
        size: 0.5,
      },
      encoding: {
        x: {
          field: "daysAgo",
          type: "quantitative",
          scale: {
            zero: false,
            reverse: true,
          },
          axis: {
            title: "days ago",
          },
        },
        y: {
          field: "magMin",
          type: "quantitative",
          scale: {
            zero: false,
            reverse: true,
          },
        },
        y2: {
          field: "magMax",
          type: "quantitative",
          scale: {
            zero: false,
            reverse: true,
          },
        },
        color: {
          field: "filter",
          type: "nominal",
          legend: {
            orient: isMobileOnly ? "bottom" : "right",
          },
        },
        opacity: {
          condition: { selection: "filterErrBars", value: 1 },
          value: 0,
        },
      },
    },

    // Render limiting mags
    {
      transform: [
        { filter: "datum.mag == null" },
        { calculate: `${mjdNow} - datum.mjd`, as: "daysAgo" },
      ],
      selection: {
        filterLimitingMags: {
          type: "multi",
          fields: ["filter"],
          bind: "legend",
        },
      },
      mark: {
        type: "point",
        shape: "triangle-down",
      },
      encoding: {
        x: {
          field: "daysAgo",
          type: "quantitative",
          scale: {
            zero: false,
            reverse: true,
          },
          axis: {
            title: "days ago",
          },
        },
        y: {
          field: "limiting_mag",
          type: "quantitative",
        },
        color: {
          field: "filter",
          type: "nominal",
        },
        opacity: {
          condition: { selection: "filterLimitingMags", value: 0.3 },
          value: 0,
        },
      },
    },
  ],
});

const VegaPlot = React.memo((props) => {
  const { dataUrl } = props;
  return (
    <div
      ref={(node) => {
        if (node) {
          embed(node, spec(dataUrl), {
            actions: false,
          });
        }
      }}
    />
  );
});

VegaPlot.propTypes = {
  dataUrl: PropTypes.string.isRequired,
};

VegaPlot.displayName = "VegaPlot";

export default VegaPlot;
