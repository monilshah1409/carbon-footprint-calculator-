import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/animations.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Add this CSS at the top of your component, after the imports
const styles = {
  mainContainer: {
    backgroundImage:
      "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80')", // Nature-themed background
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    padding: "2rem 1rem",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Increased opacity for a filled look
    backdropFilter: "blur(4px)", // Optional: keep or remove blur as desired
    zIndex: 1,
  },
  contentContainer: {
    position: "relative",
    zIndex: 2,
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.7)", // More transparent glass effect
    backdropFilter: "blur(8px)",
    borderRadius: "1rem",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  inputStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent input background
    backdropFilter: "blur(4px)",
    transition: "all 0.3s ease",
  },
};

// Update the ResultCharts component with enhanced animations and interactivity
function ResultCharts({ results }) {
  const baseTotal = results.reduce(
    (sum, result) => sum + result.totalCarbonBase,
    0
  );
  const altTotal = results.reduce(
    (sum, result) => sum + result.totalCarbonWithAlternative,
    0
  );

  const barChartData = {
    labels: results.map((result) => result.item),
    datasets: [
      {
        label: "Concrete (Base Material)",
        data: results.map((result) => result.totalCarbonBase),
        backgroundColor:
          baseTotal > altTotal
            ? "rgba(239, 68, 68, 0.7)"
            : "rgba(54, 162, 235, 0.7)",
        borderColor:
          baseTotal > altTotal
            ? "rgba(239, 68, 68, 1)"
            : "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        borderRadius: 5,
      },
      {
        label: "Alternative Materials",
        data: results.map((result) => result.totalCarbonWithAlternative),
        backgroundColor:
          altTotal > baseTotal
            ? "rgba(239, 68, 68, 0.7)"
            : "rgba(34, 197, 94, 0.7)",
        borderColor:
          altTotal > baseTotal
            ? "rgba(239, 68, 68, 1)"
            : "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const pieChartData = {
    labels: [
      `Concrete (Base Material) - ${baseTotal.toFixed(1).toLocaleString()} Kg`,
      `Alternative Materials - ${altTotal.toFixed(1).toLocaleString()} Kg`,
    ],
    datasets: [
      {
        data: [baseTotal, altTotal],
        backgroundColor: [
          baseTotal > altTotal
            ? "rgba(239, 68, 68, 0.7)"
            : "rgba(54, 162, 235, 0.7)",
          altTotal > baseTotal
            ? "rgba(239, 68, 68, 0.7)"
            : "rgba(34, 197, 94, 0.7)",
        ],
        borderColor: [
          baseTotal > altTotal
            ? "rgba(239, 68, 68, 1)"
            : "rgba(54, 162, 235, 1)",
          altTotal > baseTotal
            ? "rgba(239, 68, 68, 1)"
            : "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Add hover animations to chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
            family: "Arial",
          },
          padding: 20,
          color: "#000000",
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              lineWidth: dataset.borderWidth,
              hidden: !chart.isDatasetVisible(i),
              index: i,
            }));
          },
        },
      },
      title: {
        display: true,
        text: "Carbon Emission Comparison by Material Type",
        font: {
          size: 20,
          weight: "bold",
          family: "Arial",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
        color: "#000000",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            // Custom tooltip for each dataset
            if (context.dataset.label === "Concrete (Base Material)") {
              return `Base Carbon: ${context.parsed.y.toFixed(
                2
              )} Kg\nTotal carbon emission using only the base material (no alternative)`;
            }
            if (context.dataset.label === "Alternative Materials") {
              return `Alternative Carbon: ${context.parsed.y.toFixed(
                2
              )} Kg\nTotal carbon emission when using the selected alternative material`;
            }
            if (context.dataset.label === "Alt. Used (%)") {
              return `Alt. Used: ${context.parsed.y.toFixed(
                1
              )}%\nPercentage of the alternative material used in the mix`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 12,
            family: "Arial",
          },
          color: "#000000",
        },
        title: {
          display: true,
          text: "Carbon Emission (Kg)",
          font: {
            size: 14,
            weight: "bold",
            family: "Arial",
          },
          color: "#000000",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Arial",
          },
          color: "#000000",
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
      onProgress: function (animation) {
        const ctx = animation.chart.ctx;
        const dataset = animation.chart.data.datasets[0];
        const meta = animation.chart.getDatasetMeta(0);

        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        meta.data.forEach((bar) => {
          const height = bar.height;
          ctx.fillRect(bar.x, bar.y + height, bar.width, 2);
        });
        ctx.restore();
      },
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length
        ? "pointer"
        : "default";
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2, // Increase resolution
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          font: {
            size: 14,
            weight: "bold",
            family: "Arial",
          },
          padding: 20,
          color: "#000000",
        },
      },
      title: {
        display: true,
        text: "Total Carbon Emission Comparison",
        font: {
          size: 20,
          weight: "bold",
          family: "Arial",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
        color: "#000000",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const percentage = (
              (context.parsed / context.dataset.data.reduce((a, b) => a + b)) *
              100
            ).toFixed(1);
            if (context.label.includes("Base Material")) {
              return `Base Carbon: ${context.parsed} Kg (${percentage}%)\nTotal carbon emission using only the base material (no alternative)`;
            }
            if (context.label.includes("Alternative Materials")) {
              return `Alternative Carbon: ${context.parsed} Kg (${percentage}%)\nTotal carbon emission when using the selected alternative material`;
            }
            return `${context.label}: ${context.parsed} Kg (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="space-y-12">
      {/* Bar Chart */}
      <div
        className="bg-white/80 p-8 rounded-2xl shadow-xl 
                    transform transition-all duration-500 ease-out 
                    hover:scale-[1.02] hover:shadow-2xl border border-emerald-100/50
                    animate-[slideInResults_1s_ease-out_0.3s_forwards] opacity-0
                    group"
      >
        <div className="relative h-[400px] w-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <Bar data={barChartData} options={barOptions} />
        </div>

        {/* Interactive Legend */}
        <div className="mt-6 flex justify-center gap-6">
          {barChartData.datasets.map((dataset, index) => (
            <div
              key={index}
              className="flex items-center p-2 rounded-lg hover:bg-emerald-50 
                          transition-colors duration-300 cursor-pointer"
            >
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: dataset.backgroundColor }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {dataset.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart */}
      <div
        className="bg-white/80 p-8 rounded-2xl shadow-xl 
                    transform transition-all duration-500 ease-out 
                    hover:scale-[1.02] hover:shadow-2xl border border-emerald-100/50
                    animate-[slideInResults_1s_ease-out_0.6s_forwards] opacity-0
                    group"
      >
        <div className="relative h-[500px] w-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-teal-50/30 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <Pie data={pieChartData} options={pieOptions} />
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white
                        transform transition-all duration-300 hover:scale-105
                        border border-emerald-100/50 shadow-sm"
          >
            <h4 className="text-sm font-medium text-emerald-600">
              Total Base Emission
            </h4>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {results
                .reduce((sum, r) => sum + r.totalCarbonBase, 0)
                .toFixed(1)}{" "}
              Kg
            </p>
          </div>
          <div
            className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-white
                        transform transition-all duration-300 hover:scale-105
                        border border-teal-100/50 shadow-sm"
          >
            <h4 className="text-sm font-medium text-teal-600">
              Total Alternative Emission
            </h4>
            <p className="text-2xl font-bold text-teal-700 mt-1">
              {results
                .reduce((sum, r) => sum + r.totalCarbonWithAlternative, 0)
                .toFixed(1)}{" "}
              Kg
            </p>
          </div>
        </div>
      </div>

      {/* Results Section - Creative Info Stripe Cards */}
      <div
        className="bg-white/80 rounded-xl shadow-md p-4 sm:p-8 border border-emerald-100/50
                    animate-[slideInResults_1s_ease-out_0.9s_forwards] opacity-0 mt-10 overflow-x-auto"
      >
        <div className="flex flex-col gap-6 min-w-0">
          {results.map((result, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-50 via-white to-teal-50 rounded-xl shadow p-4 md:p-6 border border-emerald-100 hover:shadow-xl transition-shadow duration-300 w-full max-w-4xl mx-auto"
            >
              {/* Item Name & Icon */}
              <div className="flex items-center gap-4 min-w-[140px]">
                <div className="bg-emerald-100 rounded-full p-2 md:p-3 shadow-md">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="#10B981"
                      opacity="0.15"
                    />
                    <path
                      d="M12 6v6l4 2"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-extrabold text-emerald-700 text-base md:text-lg tracking-wide break-words">
                  {result.item}
                </span>
              </div>
              {/* Base Carbon */}
              <div className="flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-500">Base Carbon</span>
                <span
                  className="bg-emerald-100 text-emerald-800 rounded px-2 py-1 font-bold text-sm md:text-base"
                  title="Total carbon emission using only the base material (no alternative)"
                >
                  {result.totalCarbonBase.toFixed(2)} Kg
                </span>
              </div>
              {/* Alternative Carbon */}
              <div className="flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-500">Alternative</span>
                <span
                  className="bg-teal-100 text-teal-800 rounded px-2 py-1 font-bold text-sm md:text-base"
                  title="Total carbon emission when using the selected alternative material"
                >
                  {result.totalCarbonWithAlternative.toFixed(2)} Kg
                </span>
              </div>
              {/* Saving/Extra */}
              <div className="flex flex-col items-center min-w-[100px]">
                <span className="text-xs text-gray-500">
                  {result.carbonSaving > 0 ? "Saving" : "Extra"}
                </span>
                <span
                  className={`rounded px-2 py-1 font-bold text-sm md:text-base
                  ${
                    result.carbonSaving > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  title="Difference in carbon emission between base and alternative material. Positive means saving, negative means extra emission."
                >
                  {result.carbonSaving.toFixed(2)} Kg
                </span>
              </div>
              {/* Percentage Alternative Used */}
              <div className="flex flex-col items-center min-w-[120px]">
                <span className="text-xs text-gray-500">Alt. Used</span>
                <span
                  className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-bold text-sm md:text-base"
                  title="Percentage of the alternative material used in the mix"
                >
                  {(typeof result.quantityAlternativeMaterial === "number" &&
                  typeof result.quantityBaseMaterial === "number"
                    ? (result.quantityAlternativeMaterial /
                        (result.quantityAlternativeMaterial +
                          result.quantityBaseMaterial)) *
                      100
                    : 0
                  ).toFixed(1)}
                  %
                </span>
              </div>
              {/* Max Allowable Distance */}
              {typeof result.maxAllowableDistanceAlternative !==
                "undefined" && (
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className="text-xs text-gray-500">
                    Max Alt. Distance
                  </span>
                  <span
                    className="bg-purple-100 text-purple-800 rounded px-2 py-1 font-bold text-sm md:text-base"
                    title="Maximum distance the alternative material can be transported before it becomes less eco-friendly than the base material"
                  >
                    {result.maxAllowableDistanceAlternative.toFixed(1)} km
                  </span>
                </div>
              )}
              {/* Status */}
              <div className="w-full flex justify-center mt-2">
                <span
                  className={`w-full text-center inline-flex items-center justify-center px-0 py-3 rounded-lg text-base font-bold uppercase tracking-wide transition-colors duration-200
                  ${
                    result.acceptanceStatus === "Accepted"
                      ? "bg-emerald-400 text-white hover:bg-emerald-500"
                      : "bg-red-400 text-white hover:bg-red-500"
                  }`}
                >
                  {result.acceptanceStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MaterialForm() {
  const [baseMaterials, setBaseMaterials] = useState([]);
  const [alternativeMaterials, setAlternativeMaterials] = useState([]);
  const [inputValue, setInputValue] = useState(""); // User input
  const [filteredOptions, setFilteredOptions] = useState([]); // Filtered dropdown options
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [selectedOption, setSelectedOption] = useState(null); // Selected option
  const [finalitemList, setfinalitemList] = useState([]);
  const [finalsceb, setfinalsceb] = useState([]);
  const [finalconstraint, setfinalconstraint] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);

  // Fetch materials from local JSON on mount
  useEffect(() => {
    async function fetchMaterials() {
      try {
        console.log("Fetching materials from local JSON...");
        const response = await fetch('/materials.json');
        const materialsList = await response.json();
        console.log("Materials fetched:", materialsList);

        const baseMats = materialsList.filter(m => m.type === "base").map(m => m.name);
        const altMats = materialsList.filter(m => m.type === "alternative");

        setBaseMaterials(baseMats);
        setAlternativeMaterials(altMats);
        setFilteredOptions(baseMats);
        setIsLoadingMaterials(false);
      } catch (error) {
        console.error("Error fetching materials:", error);
        setIsLoadingMaterials(false);
      }
    }
    fetchMaterials();
  }, []);

  // Update finalitemList, finalsceb, finalconstraint based on selectedOption
  useEffect(() => {
    try {
      if (!selectedOption) {
        setfinalitemList([]);
        setfinalsceb([]);
        setfinalconstraint([]);
        return;
      }
      // Filter alternative materials for selected base material
      let filteredAlts = [];
      if (selectedOption === "Concrete") {
        filteredAlts = alternativeMaterials.filter(m =>
          ["Waste Ceramic", "Recycle Aggregate", "Blast Furnace Slag", "Brick Waste"].includes(m.name)
        );
      } else if (selectedOption === "Cement") {
        filteredAlts = alternativeMaterials.filter(m =>
          ["Fly ash", "Biomass Bottom ash", "Micro silica"].includes(m.name)
        );
      } else if (selectedOption === "Sand and steel") {
        filteredAlts = alternativeMaterials.filter(m =>
          ["Blast furnace Slag", "Glass Powder", "Ceramic Powder", "Reinforce Bar"].includes(m.name)
        );
      }

      setfinalitemList(filteredAlts.map(m => m.name));
      setfinalsceb(filteredAlts.map(m => m.sourceCarbonEmission));
      setfinalconstraint(filteredAlts.map(m => m.maxAllowed));
    } catch (error) {
      console.error("Error updating alternative materials:", error);
    }
  }, [selectedOption, alternativeMaterials]);

  // Update the handleInputChange function
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Show all options if input is empty
    if (value.trim() === "") {
      setFilteredOptions(baseMaterials);
      setIsDropdownOpen(true);
      return;
    }

    // Filter options based on input value
    const filtered = baseMaterials.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsDropdownOpen(true);
  };

  // Update the handleBlur function
  const handleBlur = () => {
    setTimeout(() => {
      if (!baseMaterials.includes(inputValue)) {
        setInputValue("");
        setSelectedOption(null);
      }
      setIsDropdownOpen(false);
    }, 200);
  };

  // Update the handleSelect function
  const handleSelect = (option) => {
    setInputValue(option);
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  // Add a new function to handle input focus
  const handleFocus = () => {
    setFilteredOptions(baseMaterials);
    setIsDropdownOpen(true);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [commonValues, setCommonValues] = useState({
    totalQuantity: "",
    distance: "",
    transportationBase: "",
  });
  const [results, setResults] = useState([]);

  // Add a new state for animations
  const [showResults, setShowResults] = useState(false);

  // Add a state to control the animation sequence
  const [isLoading, setIsLoading] = useState(true);

  // Add this useEffect to handle the initial loading animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleItemSelection = (index) => {
    setItems((prevItems) =>
      prevItems.includes(index)
        ? prevItems.filter((i) => i !== index)
        : [...prevItems, index]
    );
  };

  const handleChange = (e, index, fieldName) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [index]: {
        ...formData[index],
        [fieldName]: value,
      },
    });
  };

  const handleCommonChange = (e, fieldName) => {
    const { value } = e.target;
    setCommonValues({
      ...commonValues,
      [fieldName]: value,
    });
  };

  const handleReset = () => {
    setItems([]);
    setFormData({});
    setCommonValues({
      totalQuantity: "",
      distance: "",
      transportationBase: "",
    });
    setResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedResults = [];
    items.forEach((index) => {
      const totalQuantity = parseFloat(commonValues.totalQuantity);
      const distance = parseFloat(commonValues.distance);
      const transportationBase = parseFloat(commonValues.transportationBase);
      const percentageAlternative = parseFloat(
        formData[index]?.percentageAlternative
      );
      const sourceCarbonAlternative = parseFloat(
        formData[index]?.sourceCarbonAlternative
      );
      const distanceAlternative = parseFloat(
        formData[index]?.distanceAlternative
      );
      const transportationAlternative = parseFloat(
        formData[index]?.transportationAlternative
      );

      const scebItem = finalsceb[index];
      console.log(scebItem);
      const constraint = finalconstraint[index];
      console.log(constraint);

      if (percentageAlternative <= constraint) {
        const totalCarbonBase =
          totalQuantity * (scebItem + distance * transportationBase);
        const quantityBaseMaterial =
          totalQuantity * (1 - 0.01 * percentageAlternative);
        const quantityAlternativeMaterial =
          totalQuantity * (0.01 * percentageAlternative);

        const maxAllowableDistanceAlternative =
          (scebItem - sourceCarbonAlternative) / transportationAlternative +
          (distance * transportationBase) / transportationAlternative;

        let ceb =
          quantityBaseMaterial * (scebItem + distance * transportationBase);
        console.log("ceb:", ceb);
        let cea =
          quantityAlternativeMaterial *
          (sourceCarbonAlternative +
            distanceAlternative * transportationAlternative);

        let totalCarbonWithAlternative = ceb + cea;
        let carbonSaving = totalCarbonBase - totalCarbonWithAlternative;
        let acceptanceStatus = carbonSaving > 0 ? "Accepted" : "Not Accepted";

        calculatedResults.push({
          item: finalitemList[index],
          totalCarbonBase,
          totalCarbonWithAlternative,
          carbonSaving,
          acceptanceStatus,
          quantityBaseMaterial,
          quantityAlternativeMaterial,
          maxAllowableDistanceAlternative,
        });
        console.log(calculatedResults);
      } else {
        alert(
          `Percentage of alternative material use for ${finalitemList[index]} is invalid. It should be less than ${constraint}%.`
        );
      }
    });

    setResults(calculatedResults);
    setShowResults(true); // Trigger the animation
  };

  if (isLoadingMaterials) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-600 text-xl font-semibold">Loading materials...</div>
      </div>
    );
  }

  return (
    <div
      style={styles.mainContainer}
      className={`main-container relative min-h-screen ${
        isLoading ? "opacity-0" : "animate-fade-in"
      }`}
    >
      <div
        style={styles.overlay}
        className={`${isLoading ? "opacity-0" : "animate-fade-in"}`}
      ></div>
      <div
        style={styles.contentContainer}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <div
              className={`relative rounded-3xl overflow-hidden bg-white/20 backdrop-blur-sm p-2 
                          ${isLoading ? "opacity-0" : "animate-slide-in-top"}`}
              style={{ animationDelay: "0.5s" }}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
              </div>

              {/* Main Content Container */}
              <div className="relative rounded-2xl overflow-hidden bg-white/30 backdrop-blur-md p-8">
                {/* Decorative Patterns */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/20 via-green-500/20 to-emerald-500/20"></div>

                {/* Grid Layout */}
                <div className="grid lg:grid-cols-[1fr,2px,1fr] gap-8">
                  {/* Left Section - Title */}
                  <div className="space-y-6 relative">
                    {/* Decorative Corner Elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-emerald-300/30 rounded-tl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-emerald-300/30 rounded-br-3xl"></div>

                    <div className="space-y-2 px-6">
                      <div className="relative">
                        <h1 className="text-6xl font-bold tracking-tight relative z-10">
                          <span className="block text-emerald-700 transform hover:scale-105 transition-transform duration-300">
                            Carbon
                          </span>
                          <span className="block text-teal-700 transform hover:scale-105 transition-transform duration-300">
                            Emission
                          </span>
                          <span
                            className="block bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 
                                         text-transparent bg-clip-text transform hover:scale-105 transition-transform duration-300"
                          >
                            Calculator
                          </span>
                        </h1>
                        {/* Floating Icons */}
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 space-y-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-100/30 flex items-center justify-center animate-bounce">
                            <svg
                              className="w-4 h-4 text-emerald-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <div
                            className="w-8 h-8 rounded-full bg-teal-100/30 flex items-center justify-center animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          >
                            <svg
                              className="w-4 h-4 text-teal-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Environmental Impact Icons */}
                    <div className="flex gap-4 pt-4 px-6">
                      <div className="group">
                        <div
                          className="w-14 h-14 rounded-xl bg-emerald-100/20 flex items-center justify-center
                                      transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                        >
                          <svg
                            className="w-7 h-7 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                        <div className="mt-2 text-xs text-emerald-700 font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Eco-Friendly
                        </div>
                      </div>

                      <div className="group">
                        <div
                          className="w-14 h-14 rounded-xl bg-teal-100/20 flex items-center justify-center
                                      transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                        >
                          <svg
                            className="w-7 h-7 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                            />
                          </svg>
                        </div>
                        <div className="mt-2 text-xs text-teal-700 font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Sustainable
                        </div>
                      </div>

                      <div className="group">
                        <div
                          className="w-14 h-14 rounded-xl bg-green-100/20 flex items-center justify-center
                                      transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                        >
                          <svg
                            className="w-7 h-7 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </div>
                        <div className="mt-2 text-xs text-green-700 font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Renewable
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animated Divider */}
                  <div
                    className="hidden lg:block w-px bg-gradient-to-b from-transparent via-emerald-200/30 to-transparent mx-auto
                                  relative after:absolute after:top-0 after:left-0 after:w-full after:h-full
                                  after:bg-gradient-to-b after:from-emerald-400/0 after:via-emerald-400/50 after:to-emerald-400/0
                                  after:animate-pulse"
                  ></div>

                  {/* Right Section - Description */}
                  <div className="space-y-6 lg:text-right relative">
                    <div className="space-y-4">
                      <h2
                        className="text-2xl font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 
                                    text-transparent bg-clip-text transform hover:scale-105 transition-transform duration-300"
                      >
                        Sustainable Construction Through Smart Material Choices
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Optimize your construction materials for environmental
                        impact. Calculate, compare, and make informed decisions
                        for a greener future.
                      </p>
                    </div>

                    {/* Enhanced Stats Section */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div
                        className="group bg-gradient-to-br from-emerald-50/30 to-transparent backdrop-blur-sm rounded-xl p-4
                                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <div className="text-3xl font-bold text-emerald-700 group-hover:animate-pulse">
                          CO₂
                        </div>
                        <div className="text-sm text-emerald-800">
                          Emission Tracking
                        </div>
                      </div>
                      <div
                        className="group bg-gradient-to-br from-teal-50/30 to-transparent backdrop-blur-sm rounded-xl p-4
                                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <div className="text-3xl font-bold text-teal-700 group-hover:animate-pulse">
                          ECO
                        </div>
                        <div className="text-sm text-teal-800">
                          Friendly Solutions
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Badge */}
                    <div className="inline-block group">
                      <div
                        className="bg-gradient-to-r from-emerald-100/30 to-teal-100/30 
                                    backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium 
                                    text-emerald-800 border border-emerald-200/20 shadow-sm
                                    transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      >
                        <span className="bg-gradient-to-r from-emerald-700 to-teal-700 text-transparent bg-clip-text">
                          Building a Sustainable Future Together
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div
            className={`grid ${
              results.length > 0 ? "lg:grid-cols-2" : "grid-cols-1"
            } gap-8 
                        ${isLoading ? "opacity-0" : "animate-slide-in-bottom"}`}
            style={{ animationDelay: "1s" }}
          >
            <div
              className={`transition-all duration-700 ${
                showResults ? "form-shift" : ""
              }`}
            >
              <div
                className="rounded-2xl shadow-xl p-6 lg:p-8 relative"
                style={styles.glassEffect}
              >
                {/* Environmental Theme Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-green-600"
                  >
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-3-9h6m-3-3v6" />
                  </svg>
                </div>

                {/* Environmental Icons for Form Sections */}
                <div className="mb-8 relative">
                  <div className="absolute left-0 top-0 -mt-4 -ml-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-8 text-green-800 border-b-2 border-green-100 pb-4 pl-6">
                    Input Parameters
                  </h2>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>

                {/* Base Material Section */}
                <div className="bg-white/20 rounded-xl shadow-md p-6 border border-white/10">
                  <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4">
                    <svg
                      className="w-32 h-32 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-green-700 mb-6 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Base Material
                  </h4>

                  <div className="space-y-6">
                    {/* Search Input */}
                    <div className="form-group relative">
                      <label className="block text-gray-700 font-medium mb-2">
                        Select Base Material
                      </label>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                bg-white/30 backdrop-blur-sm
                                focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                outline-none"
                        placeholder="Type to search..."
                      />

                      {/* Add dropdown menu */}
                      {isDropdownOpen && (
                        <div
                          className="absolute z-10 w-full mt-1 bg-white/40 backdrop-blur-md 
                                        border border-gray-200/30 rounded-lg shadow-lg"
                        >
                          {filteredOptions.map((option, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 cursor-pointer hover:bg-green-50 text-gray-700
                                        transition-colors duration-150"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(option);
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                      {/* Base Material Fields */}
                      <div className="space-y-6">
                        {/* Quantity Input */}
                        <div className="form-group">
                          <label className="block text-gray-700 font-medium mb-2">
                            Total Quantity (MT)
                          </label>
                          <input
                            type="number"
                            value={commonValues.totalQuantity}
                            onChange={(e) =>
                              handleCommonChange(e, "totalQuantity")
                            }
                            className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                    bg-white/30 backdrop-blur-sm
                                    focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                    outline-none"
                            required
                          />
                        </div>

                        {/* Distance Input */}
                        <div className="form-group">
                          <label className="block text-gray-700 font-medium mb-2">
                            Distance from Source (Km)
                          </label>
                          <input
                            type="number"
                            value={commonValues.distance}
                            onChange={(e) => handleCommonChange(e, "distance")}
                            className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                    bg-white/30 backdrop-blur-sm
                                    focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                    outline-none"
                            required
                          />
                        </div>

                        {/* Transportation Input */}
                        <div className="form-group">
                          <label className="block text-gray-700 font-medium mb-2">
                            Transportation Carbon Emission (Kg/Km/MT)
                          </label>
                          <input
                            type="number"
                            value={commonValues.transportationBase}
                            onChange={(e) =>
                              handleCommonChange(e, "transportationBase")
                            }
                            className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                    bg-white/30 backdrop-blur-sm
                                    focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                    outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Items Section */}
                  {selectedOption && (
                    <div className="bg-white/20 rounded-xl shadow-md p-6 border border-white/10">
                      <div className="absolute right-0 top-0 opacity-5 transform -translate-y-1/4 translate-x-1/4">
                        <svg
                          className="w-32 h-32 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-emerald-700 mb-6 flex items-center">
                        <svg
                          className="w-6 h-6 mr-2 text-emerald-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                        Select Alternative Items
                      </h3>

                      {/* Update checkbox grid with eco-friendly styling */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {finalitemList.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center p-4 bg-white/80 rounded-lg 
                                        hover:bg-green-50 transition-all duration-300
                                        border border-green-100 shadow-sm"
                          >
                            <input
                              type="checkbox"
                              id={`item-${index}`}
                              checked={items.includes(index)}
                              onChange={() => handleItemSelection(index)}
                              className="h-5 w-5 text-green-600 rounded border-gray-300 
                                       focus:ring-2 focus:ring-green-200"
                            />
                            <label
                              htmlFor={`item-${index}`}
                              className="ml-3 text-gray-700 font-medium cursor-pointer
                                            hover:text-green-700 transition-colors duration-300"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Add Alternative Material Input Fields */}
                      {items.length > 0 && (
                        <div className="space-y-6 mt-8">
                          <h4 className="text-lg font-semibold text-green-700 border-b border-green-100 pb-2">
                            Alternative Material Details
                          </h4>
                          {items.map((index) => (
                            <div
                              key={index}
                              className="bg-white/20 p-6 rounded-xl space-y-4"
                            >
                              <h5 className="font-medium text-gray-800 mb-4">
                                {finalitemList[index]}
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Percentage Input */}
                                <div className="form-group">
                                  <label className="block text-gray-700 font-medium mb-2">
                                    Percentage of Alternative Material (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      formData[index]?.percentageAlternative ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        index,
                                        "percentageAlternative"
                                      )
                                    }
                                    className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                            bg-white/30 backdrop-blur-sm
                                            focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                            outline-none"
                                    required
                                    min="0"
                                    max={finalconstraint[index]}
                                  />
                                  <p className="text-sm text-gray-500 mt-1">
                                    Maximum allowed: {finalconstraint[index]}%
                                  </p>
                                </div>

                                {/* Source Carbon Input */}
                                <div className="form-group">
                                  <label className="block text-gray-700 font-medium mb-2">
                                    Source Carbon Emission (Kg/MT)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      formData[index]
                                        ?.sourceCarbonAlternative || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        index,
                                        "sourceCarbonAlternative"
                                      )
                                    }
                                    className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                            bg-white/30 backdrop-blur-sm
                                            focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                            outline-none"
                                    required
                                  />
                                </div>

                                {/* Distance Input */}
                                <div className="form-group">
                                  <label className="block text-gray-700 font-medium mb-2">
                                    Distance from Source (Km)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      formData[index]?.distanceAlternative || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        index,
                                        "distanceAlternative"
                                      )
                                    }
                                    className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                            bg-white/30 backdrop-blur-sm
                                            focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                            outline-none"
                                    required
                                  />
                                </div>

                                {/* Transportation Input */}
                                <div className="form-group">
                                  <label className="block text-gray-700 font-medium mb-2">
                                    Transportation Carbon Emission (Kg/Km/MT)
                                  </label>
                                  <input
                                    type="number"
                                    value={
                                      formData[index]
                                        ?.transportationAlternative || ""
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        index,
                                        "transportationAlternative"
                                      )
                                    }
                                    className="w-full p-3 border-2 border-gray-200/30 rounded-lg 
                                            bg-white/30 backdrop-blur-sm
                                            focus:ring-2 focus:ring-green-200/50 focus:border-green-400/50 
                                            outline-none"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-8">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                                text-white rounded-lg hover:from-red-600 hover:to-red-700 
                                transition-all duration-300 font-medium shadow-md
                                hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Reset
                      </span>
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-500/70 to-emerald-600/70 
                                text-white rounded-lg hover:from-green-600/70 hover:to-emerald-700/70 
                                transition-all duration-300 font-medium shadow-md
                                hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        Calculate
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
              <div className="transition-all duration-500 ease-in-out animate-scale-in-center">
                <div
                  className="rounded-2xl shadow-xl p-6 lg:p-8"
                  style={styles.glassEffect}
                >
                  <h3 className="text-2xl font-bold mb-8 text-green-700 border-b-2 border-green-100 pb-4">
                    Analysis Results
                  </h3>

                  {/* Charts */}
                  <div className="space-y-8 mb-8">
                    <ResultCharts results={results} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add loading overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transition-opacity duration-1000 
                    flex items-center justify-center
                    ${
                      isLoading
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full 
                         animate-spin mb-4"
          ></div>
          <div className="text-emerald-600 text-xl font-semibold">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialForm;
