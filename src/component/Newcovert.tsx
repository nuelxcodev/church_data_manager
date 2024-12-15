import React, { useState, ChangeEvent, FormEvent } from "react";
import * as XLSX from "xlsx";
import { useDataContext } from "../../utils/dataContext";
import { FaUpload, FaUser } from "react-icons/fa";

interface Convert {
    id: number,
    name: string,
    address: string,
    contact: string,
    gender: string;
    prayerrequest: string
}

const NewConvert: React.FC = () => {
    const { state, dispatch } = useDataContext();
    const { covert = [] } = state


    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("all");


    const [newMember, setNewMember] = useState<Omit<Convert, "id">>({
        name: '',
        address: '',
        contact: '',
        gender: '',
        prayerrequest: ""

    });

    const [active, setactive] = useState<string>('new convert')

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMember((prev) => ({ ...prev, [name]: name !== "gender" ? value.toUpperCase() : value }));
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingId !== null) {
            // Dispatch edit action
            dispatch({
                type: "UPDATE_CONVERT",
                payload: { id: editingId, ...newMember },
            });
            setEditingId(null);
        } else {
            // Dispatch add action
            dispatch({
                type: "ADD_CONVERT",
                payload: {
                    ...newMember
                },
            });
        }
        setNewMember({
            name: '',
            address: '',
            contact: '',
            gender: '',
            prayerrequest: ""

        });
        setShowForm(false);
    }
    const handleEdit = (id: number) => {
        const memberToEdit = covert.find((conv) => conv.id === id);
        if (memberToEdit) {
            setNewMember({
                name: memberToEdit.name,
                address: memberToEdit.address,
                contact: memberToEdit.contact,
                gender: memberToEdit.gender,
                prayerrequest: memberToEdit.prayerrequest

            });
            setEditingId(id);
            setShowForm(true);
        }
    };

    function establishnewmeber(id: number) {
        dispatch({
            type: "ADD_MEMBER",
            payload: {
                hub: 'Excellence',
                name: covert.find(x => x.id === id)?.name || "",
                contact: covert.find(x => x.id === id)?.contact || "",
                address: covert.find(x => x.id === id)?.address || '',
                gender: covert.find(x => x.id === id)?.gender || ''
            },
        });
        dispatch({ type: "REMOVE_CONVERT", payload: id })
    }




  const exportToExcel = () => {
    // Create a new workbook
    let workbook = XLSX.utils.book_new();

    // Create worksheet data: Combine headers and data rows
    let worksheetData = [
        ['S/N', 'NAME', 'ADDRESS', 'PHONE', 'SEX', 'PRAYER REQUEST'], // Headers
        ...covert.map((member) => 
            [member.id, member.name, member.address, member.contact, member.gender, member.prayerrequest]
        )
    ];

    // Convert the data to a worksheet
    let worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Converts");

    // Write the workbook to a file
    XLSX.writeFile(workbook, "new_covert_list.xlsx");
};


    const filteredMembers = gender === "all" ? covert.filter((member) =>
        `${member.name} ${member.contact} ${member.address}`
            .toLowerCase()
            .includes(search.toLowerCase())
    ) : gender !== "all" ?
        covert.filter((m) => m.gender === gender) : covert





    return (
        <div className="p-1">
            <div className=" flex justify-center">
                {
                    ['new convert', 'new birth'].map(n => <button key={n} className={` text-white px-3 py-2 mx-2 rounded ${active === n ? "bg-neutral-600" : "bg-neutral-300"}`}
                        onClick={() => setactive(n)}>{n}</button>)
                }


            </div>

            <h2 className="text-2xl font-bold mb-4">{active}</h2>

            <button
                onClick={() => setShowForm(!showForm)}
                className={` text-white px-4 py-2 rounded ${editingId !== null ? 'hidden' : "bg-black"}`}
            >
                {showForm ? "Close Form" : "Add member"}
            </button>

            <div className="flex justify-between items-center gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Name, Contact, or Address"
                    className="border p-2 rounded w-full"
                />
                <select className="p-2" onChange={(e) => setGender(e.target.value)}>
                    <option value="all">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <p className=" text-neutral-500 text-center mb-4">double click on the member row to start editing</p>
            <table className="min-w-full table-auto border-collapse border border-gray-300 cursor-pointer text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border border-gray-300 px-4 py-2">S/N</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Address</th>
                        <th className="border border-gray-300 px-4 py-2">Contact</th>
                        <th className="border border-gray-300 px-4 py-2">Gender</th>

                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {filteredMembers.map((member, i) => (
                        <tr key={member.id} className={editingId === member.id ? "bg-yellow-500"
                            : editingId === null ? "bg-white hover:bg-gray-100"
                                : 'hidden'}
                            onDoubleClick={() => handleEdit(member.id)}>
                            <td className="border border-gray-300 px-4 py-1">{i + 1}</td>
                            <td className="border border-gray-300 px-4 py-1 ">{member.name}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.address}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.contact}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.gender}</td>
                            <td className="border border-gray-300 px-4 py-1 text-center">

                                <button
                                    onClick={() => {
                                        editingId ?
                                            dispatch({ type: "REMOVE_CONVERT", payload: member.id }) :
                                            establishnewmeber(member.id)
                                        setEditingId(null)
                                        setShowForm(false)
                                    }}
                                    className={` text-white px-2 py-[1px] rounded ${editingId ? "bg-red-600" : "bg-green-500"}`}
                                >
                                    {
                                        editingId ? "delect" : 'establish'
                                    }
                                </button>
                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

            <div>
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 bg-gray-100 p-6 rounded shadow-lg text-sm"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-bold">member's name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newMember.name}
                                    onChange={handleChange}
                                    className="border border-neutral-300 p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">member's address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newMember.address}
                                    onChange={handleChange}
                                    className="border border-neutral-300 p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">Convert's contact</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={newMember.contact}
                                    onChange={handleChange}
                                    className="border border-neutral-300 p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">prayer request</label>
                                <input
                                    type="tel"
                                    name="prayerrequest"
                                    value={newMember.prayerrequest}
                                    onChange={handleChange}
                                    className="border border-neutral-300 p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">Sex:</label>
                                <select name="gender" id="gender" value={newMember.gender} onChange={handleChange}>
                                    <option value="select_gender">select gender</option>
                                    <option value="Male">male</option>
                                    <option value="Female">female</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                <div className=" flex items-center gap-2">
                                    {editingId ? "update membership data" : "Add member"}
                                    {editingId ? <FaUpload /> : <FaUser />}</div>

                            </button>
                            <button className=" bg-red-700 ml-3 px-4 py-2 rounded text-white"
                                onClick={() => {
                                    editingId ?
                                        setEditingId((editingId) => editingId ? editingId : null)
                                        : setShowForm(false)
                                }}>
                                {editingId ? "cancel edit" : "cancel"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <button
                onClick={exportToExcel}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Export to Excel
            </button>


        </div>
    );
};

export default NewConvert;
