import React, { useState, ChangeEvent, FormEvent } from "react";
import * as XLSX from "xlsx";
import { useDataContext } from "../../utils/dataContext"; // Adjust the path as per your setup

// Define the Service Report type
interface ServiceReport {
    id: number;
    serviceDate: string;
    serviceTitle: string;
    men: number;
    women: number;
    children: number;
    totalAttendance: number;
    offerings: number;
    tithes: number;
    totalAmount: number;
}

const ServiceReportPage: React.FC = () => {
    const { state, dispatch } = useDataContext(); // Access context state and dispatch
    const reports = state.churchData as ServiceReport[]; // Replace local state

    const [newReport, setNewReport] = useState<Omit<ServiceReport, "id" | "totalAttendance" | "totalAmount">>({
        serviceDate: "",
        serviceTitle: "Overflow",
        men: 0,
        women: 0,
        children: 0,
        offerings: 0,
        tithes: 0,
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const validationErrors: { [key: string]: string } = {};

        if (!newReport.serviceDate) validationErrors.serviceDate = "Service Date is required.";
        if (!newReport.serviceTitle) validationErrors.serviceTitle = "Service Title is required.";
        if (newReport.men === undefined || newReport.men < 0) validationErrors.men = "Number of Men must be 0 or greater.";
        if (newReport.women === undefined || newReport.women < 0) validationErrors.women = "Number of Women must be 0 or greater.";
        if (newReport.children === undefined || newReport.children < 0) validationErrors.children = "Number of Children must be 0 or greater.";
        if (newReport.offerings === undefined || newReport.offerings < 0) validationErrors.offerings = "Offerings must be 0 or greater.";
        if (newReport.tithes === undefined || newReport.tithes < 0) validationErrors.tithes = "Tithes must be 0 or greater.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewReport((prev) => ({ ...prev, [name]: name === "serviceTitle" ? value : Number(value) || value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Calculate Total Attendance and Total Amount
        const totalAttendance = newReport.men + newReport.women + newReport.children;
        const totalAmount = newReport.offerings + newReport.tithes;

        if (editingId !== null) {
            // Dispatch edit action
            dispatch({
                type: "UPDATE_CHURCH_DATA",
                payload: {
                    id: editingId,
                    ...newReport,
                    totalAttendance,
                    totalAmount,
                },
            });
            setEditingId(null);
        } else {
            // Dispatch add action
            dispatch({
                type: "ADD_CHURCH_DATA",
                payload: {
                    id: reports.length + 1,
                    ...newReport,
                    totalAttendance,
                    totalAmount,
                },
            });
        }

        setNewReport({
            serviceDate: "",
            serviceTitle: "Overflow",
            men: 0,
            women: 0,
            children: 0,
            offerings: 0,
            tithes: 0,
        });
        setShowForm(false);
        setErrors({});
    };

    const handleEdit = (id: number) => {
        const reportToEdit = reports.find((report) => report.id === id);
        if (reportToEdit) {
            setNewReport({
                serviceDate: reportToEdit.serviceDate,
                serviceTitle: reportToEdit.serviceTitle,
                men: reportToEdit.men,
                women: reportToEdit.women,
                children: reportToEdit.children,
                offerings: reportToEdit.offerings,
                tithes: reportToEdit.tithes,
            });
            setEditingId(id);
            setShowForm(true);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(reports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
        XLSX.writeFile(workbook, "service_reports.xlsx");
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Service Reports</h2>
                <div className="flex items-center justify-center gap-3 mb-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {showForm ? "Close Form" : "Add Report"}
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Export to Excel
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md w-full">
                <table className="min-w-full text-sm table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border border-gray-300 px-4 py-1">Service Date</th>
                            <th className="border border-gray-300 px-4 py-1">Service Title</th>
                            <th className="border border-gray-300 px-4 py-1">Men</th>
                            <th className="border border-gray-300 px-4 py-1">Women</th>
                            <th className="border border-gray-300 px-4 py-1">Children</th>
                            <th className="border border-gray-300 px-4 py-1">Total Attendance</th>
                            <th className="border border-gray-300 px-4 py-1">Offerings</th>
                            <th className="border border-gray-300 px-4 py-1">Tithes</th>
                            <th className="border border-gray-300 px-4 py-1">Total Amount</th>
                            <th className="border border-gray-300 px-4 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) =>(
                            <tr key={report.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-4 py-1">{report.serviceDate}</td>
                                <td className="border border-gray-300 px-4 py-1">{report.serviceTitle}</td>
                                <td className="border border-gray-300 px-4 py-1">{report.men}</td>
                                <td className="border border-gray-300 px-4 py-1">{report.women}</td>
                                <td className="border border-gray-300 px-4 py-1">{report.children}</td>
                                <td className="border border-gray-300 px-4 py-1">{report.totalAttendance}</td>
                                <td className="border border-gray-300 px-4 py-1">₦{report.offerings}</td>
                                <td className="border border-gray-300 px-4 py-1">₦{report.tithes}</td>
                                <td className="border border-gray-300 px-4 py-1">₦{report.totalAmount}</td>
                                <td className="border border-gray-300 px-4 py-1 bg-orange-400 ">
                                    <button
                                        onClick={() => handleEdit(report.id)}
                                        className="text-white hover:underline"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {Object.values(errors).map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 bg-gray-100 p-6 rounded shadow-lg text-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-bold">Service Date</label>
                            <input
                                type="date"
                                name="serviceDate"
                                value={newReport.serviceDate}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Service Title</label>
                            <select name="serviceTitle" id="st" className=" p-2 border w-full" onChange={handleChange}>
                                {
                                    ['overflow service','royalty service', 'special service'].map(serv=>(
                                        <option key={serv} value={serv}>{serv}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Number of Men</label>
                            <input
                                type="number"
                                name="men"
                                value={newReport.men}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Number of Women</label>
                            <input
                                type="number"
                                name="women"
                                value={newReport.women}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Number of Children</label>
                            <input
                                type="number"
                                name="children"
                                value={newReport.children}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Offerings</label>
                            <input
                                type="number"
                                name="offerings"
                                value={newReport.offerings}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-bold">Tithes</label>
                            <input
                                type="number"
                                name="tithes"
                                value={newReport.tithes}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {editingId ? "Update Report" : "Add Report"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ServiceReportPage;
