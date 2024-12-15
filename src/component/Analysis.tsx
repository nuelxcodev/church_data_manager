import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { useDataContext } from "../../utils/dataContext";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface DashboardCardProps {
    title: string;
    value: string | number;
    percentage: string | number;
    date: string;
    color: string;
}

const Analysis: React.FC = () => {

    const { state } = useDataContext(); // Access the state from the context
    const { churchData = [], covert = [] } = state;

    const months = Array.from({ length: 12 }, (_, index) =>
        new Date(0, index).toLocaleString('default', { month: 'long' })
    );

    const [datalist, setDatalist]: any = useState([])
    const [curryear, setyear]: any = useState(new Date(Date.now()).getFullYear().toString())
    const [filteredfinancialdata, setFilter] = useState<Record<string, any>>([])

    function summary(data: string) {
        return filteredfinancialdata.reduce((initial: number, newUpdate: any) => {
            return initial + (newUpdate[data] || 0);
        }, 0);
    }

    console.log(filteredfinancialdata)

    const year = [...new Set(churchData.map((report: any) => new Date(report.serviceDate).getFullYear()))]



    function yearlydata() {
        const data = curryear ? curryear : new Date(Date.now()).getFullYear()
        const filteredReports = data !== "select year" ? churchData.filter((x: any) => {
            const date = new Date(x.serviceDate)
            const match = date.getFullYear() === parseInt(data)
            return match
        }) : churchData.filter((x) => new Date(x.serviceDate).getFullYear() === new Date(Date.now()).getFullYear());

        const summarizedData = months.map((month) => {
            const filteredData = filteredReports.filter((x) => {
                const serviceMonth = new Date(x.serviceDate).toLocaleString('default', { month: 'long' });
                return serviceMonth === month;
            });

            return {
                month, // Include the month name
                offerings: filteredData.reduce((a, b) => a + (b.offerings || 0), 0),
                tithes: filteredData.reduce((a, b) => a + (b.tithes || 0), 0),
                services: filteredData.length,
            };
        });
        setFilter(filteredReports)
        setDatalist(summarizedData);


    }


    useEffect(() => {
        yearlydata()
    }, [curryear]);


    const data = {
        attendance: { men: summary('men'), women: summary('women'), children: summary('children'), newConvert: covert.length },
        offerings: datalist.map((x: any) => x.offerings),
        tithes: datalist.map((x: any) => x.tithes),
        specialDonations: 100,
    };

    console.log(datalist)


    const { attendance, offerings, tithes, specialDonations } = data;

    const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, percentage, date, color }) => (
        <div className={`p-4 rounded shadow text-white`} style={{ backgroundColor: color }}>
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-sm">
                {percentage}% <span className=" text-neutral-600 bg-y">{date}</span>
            </p>
        </div>
    );



    // Chart Data
    const barChartData = {
        labels: ["Men", "Women", "Children", "New Converts"],
        datasets: [
            {
                label: "Attendance",
                data: [attendance.men, attendance.women, attendance.children, attendance.newConvert],
                backgroundColor: ["#3b82f6", "#10b981", "#f97316", "#8b5cf6"],
            },
        ],
    };

    const lineChartData = {
        labels: months,
        datasets: [
            {
                label: "Offerings (₦)",
                data: offerings,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                tensin: 0.3,
            },
            {
                label: "Tithes (₦)",
                data: tithes,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.5)",
                tension: 0.3,
            },
        ],
    };

    const pieChartData = {
        labels: ["Tithes", "Offerings", "Special Donations"],
        datasets: [
            {
                label: "Income Sources",
                data: [datalist.map((x: any) => x.tithes).reduce((a: any, b: any) => a + b, 0),
                datalist.map((x: any) => x.offerings).reduce((a: any, b: any) => a + b, 0), 1000],
                backgroundColor: ["#3b82f6", "#10b981", "#f97316"],
            },
        ],
    };

    const Header = () => (
        <header className="bg-white shadow p-2 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Church Data Analysis for {curryear}</h1>

            <div>
                <select name="year" id="year" className=" w-60 p-2 border" value={curryear} onChange={(e) => setyear(e.target.value)}>
                    {year.map(c => (
                        <option key={c} value={c}>{c}</option>))}
                </select>
            </div>

        </header>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 space-y-6">
                {/* Dashboard Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total Attendance"
                        value={attendance.men + attendance.women + attendance.children + attendance.newConvert}
                        percentage="10"
                        date="Weekly"
                        color="#3b82f6"
                    />
                    <DashboardCard
                        title="Offerings"
                        value={`₦${datalist.map((x: any) => x.offerings).reduce((a: any, b: any) => a + b, 0)}`}
                        percentage="15"
                        date="Weekly"
                        color=" rgb(132 204 22 / var(--tw-bg-opacity, 1))"
                    />
                    <DashboardCard
                        title="Tithes"
                        value={`₦${datalist.map((x: any) => x.tithes).reduce((a: any, b: any) => a + b, 0)}`}
                        percentage="20"
                        date="Weekly"
                        color="rgb(239 68 68 / var(--tw-bg-opacity, 1))"
                    />
                    <DashboardCard
                        title="Special Donations"
                        value={`₦${specialDonations}`}
                        percentage="5"
                        date="Weekly"
                        color=" rgb(234 179 8 / var(--tw-bg-opacity, 1))"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded shadow ">
                        <h2 className="text-sm font-semibold">Attendance Analysis</h2>
                        <div className="h-48">
                            <Bar data={barChartData} />
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-sm font-semibold">Income Distribution</h2>
                        <div className="h-48">
                            <Pie data={pieChartData} />
                        </div>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-sm font-semibold">Offerings and Tithes Over Time</h2>
                    <div className="h-64">
                        <Line data={lineChartData} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analysis;
