import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useDataContext } from "../../utils/dataContext"; // Import the custom hook

const MonthlyReport = () => {
    const { state } = useDataContext(); // Access the state from the context
    const { churchData = [] } = state; // Default to an empty array if churchData is undefined

    const [filter, setFilter]: any = useState({ month: "", year: "" });
    const [curentfilter, setcurrFilter]: any = useState({ month: [], year: [] });

    function arrangeyear(data: number[]) {
        // Remove undefined or invalid elements
        data = data.filter((item) => item !== undefined && item !== null);

        // Bubble sort logic for demonstration
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length - i - 1; j++) {
                if (data[j] > data[j + 1]) {
                    // Swap elements
                    const temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        function monthnorep() {
            // Map the service dates to month names
            const data = churchData.map((x: any) =>
                new Date(x.serviceDate).toLocaleString('default', { month: 'short' })
            );

            // Use a Set to store unique months
            const uniqueMonths = Array.from(new Set(data));
            return uniqueMonths;
        }

        const month = monthnorep()
        setcurrFilter({ month: month, year: data })
        return data;
    }




    // Example usage
    useEffect(() => {
        arrangeyear([...new Set(churchData.map((report: any) => new Date(report.serviceDate).getFullYear()))]);
    }, [])



    // Filter reports based on the selected month and year
    const filteredReports = filter.month.length > 0 || filter.year.length > 0 ? churchData.filter((report: any) => {
        const reportDate = new Date(report.serviceDate);
        const monthMatch = filter.month ? reportDate.getMonth() + 1 === parseInt(filter.month) : true;
        const yearMatch = filter.year ? reportDate.getFullYear() === parseInt(filter.year) : true;
        return monthMatch && yearMatch;
    }) : churchData.filter((x) => new Date(x.serviceDate).getFullYear() === new Date(Date.now()).getFullYear());

console.log(filteredReports)


    const totalFinancials = {
        offerings: filteredReports.reduce((a: number, b: any) => a + b.offerings, 0),
        tithes: filteredReports.reduce((a: number, b: any) => a + b.tithes, 0),
        totalAmount: filteredReports.reduce((a: number, b: any) => a + b.totalAmount, 0),
    };



    const totalAttendance = {
        men: filteredReports.reduce((a: any, b: any) => a + b.men, 0),
        women: filteredReports.reduce((a: any, b: any) => a + b.women, 0),
        children: filteredReports.reduce((a: any, b: any) => a + b.children, 0)
    }


    // Function to share the report on WhatsApp
    const shareToWhatsApp = () => {
        const message = `
Church Report (${filter.month || "All Months"} ${filter.year || "All Years"})

Total Attendance:
Men: ${totalAttendance.men}
Women: ${totalAttendance.women}
Children: ${totalAttendance.children}
Total: ${totalAttendance.men + totalAttendance.women + totalAttendance.children}

Total Financials:
Offerings: ₦${totalFinancials.offerings.toLocaleString()}
Tithes: ₦${totalFinancials.tithes.toLocaleString()}
Total Amount: ₦${totalFinancials.totalAmount.toLocaleString()}

Generated on ${new Date().toLocaleDateString()}
        `;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url,"_whatsapp");
    };

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                    <label className="text-sm font-medium text-gray-600">Month</label>
                    <select
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={filter.month}
                        onChange={(e) => setFilter({ ...filter, month: e.target.value })}
                    >
                        <option value="">All</option>
                        {curentfilter.month.map((i:any) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Year</label>
                    <select
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={filter.year}
                        onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                    >
                        {curentfilter.year.map((year: any) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Report Table */}

            <div className="max-w-6xl mx-auto my-10 bg-white shadow-lg rounded-lg border border-gray-300 p-6">
                {filteredReports.length > 0 ? (
                    <table className="min-w-full border border-gray-300 rounded-md overflow-hidden text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Service Title</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Men</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Women</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Children</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Offerings (₦)</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Tithes (₦)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map((report, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {report?.serviceDate}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{report?.serviceTitle}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{report?.men || 0}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{report?.women || 0}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{report?.children || 0}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                    ₦ {report?.offerings.toLocaleString() || "0"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                    ₦ {report?.tithes.toLocaleString() || "0"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center py-4">No data available for the selected filters.</p>
                )}

                {/* Summary and WhatsApp Button */}
                {filteredReports.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
                        <div className="text-sm">
                            <p className="font-semibold">Total Attendance:</p>
                            <p>
                                Men: {totalAttendance.men}, Women: {totalAttendance.women}, Children: {totalAttendance.children}, Total:{" "}
                                {totalAttendance.men + totalAttendance.women + totalAttendance.children}
                            </p>
                            <p className="mt-2 font-semibold">Total Financials:</p>
                            <p>
                                Offerings: ₦{totalFinancials.offerings.toLocaleString()}, Tithes: ₦
                                {totalFinancials.tithes.toLocaleString()}, Total: ₦{totalFinancials.totalAmount.toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={shareToWhatsApp}
                            className="mt-4 sm:mt-0 flex items-center px-4 py-1 bg-green-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-green-700 gap-2"
                        >
                            <FaWhatsapp size={20} />
                            Share on WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthlyReport;
