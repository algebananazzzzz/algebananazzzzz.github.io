var hint = [
  ['Just FRS'],
  ['H2, Ni/Pt, heat', 'BR2 in CCl4 \nHBr(g) \nH20(g), 300C, 60 atm, conc. H3PO4', 'KMnO4, H2SO4, heat', 'KMnO4, NaOH, cold'],
  ['conc. HNO3, H2SO4, 55/55-100/>100C\nBr2 anhy. FeBr3', 'H2, Ni/Pt, heat'],
  ['NaOH(aq), heat\nExcess ethanolic NH3, heat in sealed tube\nEthanolic KCN, heat', 'Ethanolic KOH, heat'],
  ['Dilute NaOH, heat', 'Dilute HCl, heat', 'LiAlH4 in dry ether\nor H2, Pt, r.t.'],
  ['conc. HNO3, H2SO4, 55/55-100/>100C\nBr2 anhy. FeBr3'],
  ['PCl3/PBr3/PI3\nPCl5\nSOCl2\nconc. HCl, anhy. ZnCl2, heat/HBr(g)', 'Excess conc. H2SO4, 170C', '', 'KMnO4(aq), H2SO4(aq), heat with reflux\nor K2Cr2O7(aq), H2SO4(aq), heat with distillation', 'I2, NaOH, heat', 'Conc. H2SO4, heat\nr.t.'],
  ['Br2(aq)\nBr2 in CCl4\nDilute HNO3\nConc. HNO3', '', '', 'Neutral FeCl3(aq)', 'Acyl chloride'],
  ['KMnO4, H2SO4, heat\nFehlings solution\nTollens reagent\nI2, NaOH, heat', 'LiAlH4, dry ether\nNaBH4, methanol\nH2(g), Ni/Pt, heat', '2,4-DNPH, warm', 'HCN(g), trace NaOH, cold'],
  ['KMnO4, H2SO4, heat\nI2, NaOH, heat', 'LiAlH4, dry ether\nNaBH4, methanol\nH2(g), Ni/Pt, heat', '2,4-DNPH, warm', 'HCN(g), trace NaOH, cold'],
  ['', '', '', 'PCl3\nPCl5\nSOCl2', 'Conc. H2SO4, heat', 'LiAlH4, dry ether', ],
  ['Amination\nEsterification (NaOH for faster rate)', 'H2O'],
  ['Dilute NaOH, heat', 'Dilute HCl, heat'],
  ['H2, Ni, heat\nor 1. Sn, conc. HCl, heat\n2. NaOH(aq)'],
  ['Aqueous acid', 'Halogenalkane, heat', 'Acyl Chlloride'],
  ['Dilute NaOH, heat', 'Dilute HCl, heat'],
]

new Chart(document.getElementById("bubble-chart"), {
  type: 'bubble',
  data: {
    datasets: [{
        label: ["Alkane"],
        backgroundColor: "rgba(255, 23, 68, 0.8)",
        borderColor: "rgba(255, 23, 68, 0.8)",
        data: [{
          x: 1,
          y: 18,
          r: 10
        }]
      }, {
        label: ["Alkene"],
        backgroundColor: "rgba(213, 0, 249, 0.8)",
        borderColor: "rgba(213, 0, 249, 0.8)",
        data: [{
          x: 2,
          y: 12,
          r: 10
        }, {
          x: 2,
          y: 14,
          r: 30
        }, {
          x: 2,
          y: 8,
          r: 10
        }, {
          x: 2,
          y: 9,
          r: 10
        }]
      },

      {
        label: ["Arenes"],
        backgroundColor: "rgba(101, 31, 255, 0.8)",
        borderColor: "rgba(101, 31, 255, 0.8)",
        data: [{
          x: 3,
          y: 15,
          r: 20
        }, {
          x: 3,
          y: 9,
          r: 10
        }]
      },
      {
        label: ["Halogenoalkane"],
        backgroundColor: "rgba(41, 121, 255, 0.8)",
        borderColor: "rgba(41, 121, 255, 0.8)",
        data: [{
            x: 4,
            y: 17,
            r: 30
          },
          {
            x: 4,
            y: 13,
            r: 10
          }
        ]
      },
      {
        label: ["Cyanide"],
        backgroundColor: "rgba(130, 177, 255, 0.8)",
        borderColor: "rgba(130, 177, 255, 0.8)",
        data: [{
            x: 4,
            y: 3,
            r: 10
          },
          {
            x: 4,
            y: 4,
            r: 10
          }, {
            x: 4,
            y: 12,
            r: 10
          }
        ]
      },
      {
        label: ["Halogenoarenes"],
        backgroundColor: "rgba(128, 216, 255, 0.8)",
        borderColor: "rgba(128, 216, 255, 0.8)",
        data: [{
          x: 4,
          y: 15,
          r: 20
        }]
      },
      {
        label: ["Aliphatic Alcohols"],
        backgroundColor: "rgba(0, 229, 255, 0.8)",
        borderColor: "rgba(0, 229, 255, 0.8)",
        data: [{
            x: 5,
            y: 17,
            r: 40
          }, {
            x: 5,
            y: 13,
            r: 10
          }, {
            x: 5,
            y: 7,
            r: 10
          }, {
            x: 5,
            y: 8,
            r: 20
          },
          {
            x: 5,
            y: 9,
            r: 10
          },
          {
            x: 5,
            y: 10,
            r: 20
          }
        ]
      },
      {
        label: ["Aromatic Alcohols"],
        backgroundColor: "rgba(132, 255, 255, 0.8)",
        borderColor: "rgba(132, 255, 255, 0.8)",
        data: [{
            x: 5,
            y: 15,
            r: 40
          },
          {
            x: 5,
            y: 7,
            r: 10
          },
          {
            x: 5,
            y: 6,
            r: 10
          },
          {
            x: 5,
            y: 1,
            r: 10
          },
          {
            x: 5,
            y: 10,
            r: 10
          }
        ]
      },
      {
        label: ["Aldehyde"],
        backgroundColor: "rgba(29, 233, 182, 0.8)",
        borderColor: "rgba(29, 233, 182, 0.8)",
        data: [{
            x: 6,
            y: 8,
            r: 40
          },
          {
            x: 6,
            y: 12,
            r: 30
          }, {
            x: 6,
            y: 11,
            r: 10
          }, {
            x: 6,
            y: 16,
            r: 10
          }
        ]
      },
      {
        label: ["Ketone"],
        backgroundColor: "rgba(118, 255, 3, 0.8)",
        borderColor: "rgba(118, 255, 3, 0.8)",
        data: [{
          x: 6,
          y: 8,
          r: 20
        }, {
          x: 6,
          y: 12,
          r: 30
        }, {
          x: 6,
          y: 11,
          r: 10
        }, {
          x: 6,
          y: 16,
          r: 10
        }]
      }, {
        label: ["Carboxylic Acid"],
        backgroundColor: "rgba(255, 234, 0, 0.8)",
        borderColor: "rgba(255, 234, 0, 0.8)",
        data: [{
            x: 7,
            y: 7,
            r: 10
          },
          {
            x: 7,
            y: 6,
            r: 10
          }, {
            x: 7,
            y: 5,
            r: 10
          }, {
            x: 7,
            y: 17,
            r: 30
          },
          {
            x: 7,
            y: 10,
            r: 10
          },
          {
            x: 7,
            y: 12,
            r: 10
          }
        ]
      }, {
        label: ["Acyl Chloride"],
        backgroundColor: "rgba(255, 145, 0, 0.8)",
        borderColor: "rgba(255, 145, 0, 0.8)",
        data: [{
            x: 7,
            y: 10,
            r: 20
          },
          {
            x: 7,
            y: 2,
            r: 10
          }
        ]
      },
      {
        label: ["Esters"],
        backgroundColor: "rgba(244, 255, 129, 0.8)",
        borderColor: "rgba(244, 255, 129, 0.8)",
        data: [{
            x: 7,
            y: 3,
            r: 10
          },
          {
            x: 7,
            y: 4,
            r: 10
          }
        ]
      },
      {
        label: ["Nitride"],
        backgroundColor: "rgba(255, 145, 0, 0.8)",
        borderColor: "rgba(255, 145, 0, 0.8)",
        data: [{
          x: 8,
          y: 12,
          r: 10
        }]
      },
      {
        label: ["Amine"],
        backgroundColor: "rgba(255, 61, 0, 0.8)",
        borderColor: "rgba(255, 61, 0, 0.8)",
        data: [{
          x: 8,
          y: 6,
          r: 10
        }, {
          x: 8,
          y: 17,
          r: 10
        }, {
          x: 8,
          y: 10,
          r: 10
        }, ]
      }, {
        label: ["Amide"],
        backgroundColor: "rgba(255, 23, 68, 0.8)",
        borderColor: "rgba(255, 23, 68, 0.8)",
        data: [{
          x: 8,
          y: 3,
          r: 10
        }, {
          x: 8,
          y: 4,
          r: 10
        }, ]
      },
    ]
  },
  options: {
    aspectRatio: $(window).width() / $(window).height(),
    tooltips: {
      callbacks: {
        label: function(t, d) {
          return d.datasets[t.datasetIndex].label + ": " +
            d.datasets[t.datasetIndex]['data'][t.index]['r'] / 10 + ' rxn(s)';
        },
        afterLabel: function(t, d) {
          return hint[t.datasetIndex][t.index];
        }
      },
      bodyFontSize: 14,
    },

    legend: {
      display: true,
      labels: {
        fontSize: (function() {
          width = $(window).width()
          if (width > 1400) {
            return 12
          } else if (width > 1200) {
            return 10
          } else if (width > 992) {
            return 8
          } else {
            return 5
          }
        })()
      }
    },
    scales: {
      yAxes: [{

        ticks: {
          callback: function(value, index, values) {
            types = ['Free Radical Substitution (1)', 'Nucleophilic Substitution (11)', 'Nucleophilic Addition (2)', 'Electrophilic Substitution (8)', 'Electrophilic Addition (3)', 'Elimination (2)', 'Reduction (6)', 'Condensation (2)', 'Condensation (N.A.S) (6)', 'Mild Oxidation (2)', 'Oxidation (9)', 'Acid-metal (2)', 'Acid-base (3)', 'Acid-carbonate (1)', 'Acid Hydrolysis (3)', 'Base Hydrolysis (3)', '(Water) Hydrolysis (1)', 'Complex formation (1)']
            return types[types.length - value];
          },
          stepSize: 1,
          fontSize: (function() {
            width = $(window).width()
            if (width > 1400) {
              return 12
            } else if (width > 1200) {
              return 10
            } else if (width > 992) {
              return 8
            } else {
              return 5
            }
          })()
        },

      }],
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          callback: function(value, index, values) {
            types = ['Alkane (1)', 'Alkene (6)', 'Arenes (2)', 'Halogens (9)', 'Hydroxyls (18)', 'Carbonyl (12)', 'Carboxylic Acid (13)', 'Nitrogen Compound (6)']
            return types[index];
          },
          stepSize: 1,
          fontSize: (function() {
            width = $(window).width()
            if (width > 1400) {
              return 12
            } else if (width > 1200) {
              return 10
            } else if (width > 992) {
              return 8
            } else {
              return 5
            }
          })()
        },
      }]
    }
  }
});