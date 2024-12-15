import React, { useState, ChangeEvent, FormEvent } from "react";
import * as XLSX from "xlsx";
import { useDataContext } from "../../utils/dataContext";
import { FaUpload, FaUser } from "react-icons/fa";

interface Member {
    id: number;
    name: string;
    address: string;
    contact: string;
    gender: any;
    hub: any;
}

const MemberShipData: React.FC = () => {
    const { state, dispatch } = useDataContext();
    const members = state.members as Member[]


    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("all");
    const [hub, setHub] = useState("all");

    const [newMember, setNewMember] = useState<Omit<Member, "id">>({
        name: '',
        address: '',
        contact: '',
        gender: '',
        hub: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMember((prev) => ({ ...prev, [name]: name !== "gender" && name !== 'hub' ? value.toUpperCase() : value }));
    };


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingId !== null) {
            // Dispatch edit action
            dispatch({
                type: "UPDATE_MEMBER",
                payload: { id: editingId, ...newMember },
            });
            setEditingId(null);
        } else {
            // Dispatch add action 
            dispatch({
                type: "ADD_MEMBER",
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
            hub: ''
        });
        setShowForm(false);
    }
    const handleEdit = (id: number) => {
        const memberToEdit = members.find((member) => member.id === id);
        if (memberToEdit) {
            setNewMember({
                name: memberToEdit.name,
                address: memberToEdit.address,
                contact: memberToEdit.contact,
                gender: memberToEdit.gender,
                hub: memberToEdit.hub
            });
            setEditingId(id);
            setShowForm(true);
        }
    };




    const exportToExcel = () => {
        let workbook = XLSX.utils.book_new();
        let worksheet = XLSX.utils.aoa_to_sheet([
            ['S/N', 'NAME', 'ADDRESS', 'PHONE', 'SEX', 'HUB'],
            ...members.map((member, i) => (
                [i + 1, member.name, member.address, member.contact, member.gender, member.hub]))
        ])
                XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
        XLSX.writeFile(workbook, "church_members.xlsx");
    };


    const filteredMembers = gender === "all" && hub === "all" ? members.filter((member) =>
        `${member.name} ${member.contact} ${member.address}`
            .toLowerCase()
            .includes(search.toLowerCase())
    ) : gender !== "all" && hub === "all" ?
        members.filter((m) => m.gender === gender)
        : gender !== "all" && hub !== "all" ?
            members.filter((m) => m.gender === gender && m.hub === hub)
            : members.filter((m) => m.hub === hub);


    return (
        <div className="p-1">
            
            <h2 className="text-2xl font-bold mb-4">Church Members</h2>

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
                <select className="p-2" onChange={(e) => setHub(e.target.value)}>
                    <option value="all">All</option>
                    <option value="excellence">Excellence</option>
                    <option value="reformers">Reformers</option>
                    <option value="joy">Joy</option>
                    <option value="happiness">Happiness</option>
                </select>
            </div>

            <p className=" text-neutral-500 text-center mb-4">double click on the member row to start editing</p>

            <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border border-gray-300 px-4 py-2">S/N</th>
                        <th className="border border-gray-300 px-4 py-2">Name</th>
                        <th className="border border-gray-300 px-4 py-2">Address</th>
                        <th className="border border-gray-300 px-4 py-2">Contact</th>
                        <th className="border border-gray-300 px-4 py-2">Gender</th>
                        <th className="border border-gray-300 px-4 py-2">Hub</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMembers.map((member, i) => (
                        <tr key={member.id} className={editingId === member.id ? "bg-yellow-500" : editingId === null ? "bg-white hover:bg-gray-100" : 'hidden'}
                        onDoubleClick={() => handleEdit(member.id)}>
                            <td className="border border-gray-300 px-4 py-1">{i + 1}</td>
                            <td className="border border-gray-300 px-4 py-1 ">{member.name}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.address}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.contact}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.gender}</td>
                            <td className="border border-gray-300 px-4 py-1">{member.hub}</td>
                            <td className="border border-gray-300 px-4 py-1 text-center">
                                
                                <button
                                    onClick={() => {
                                        dispatch({ type: 'REMOVE_MEMBER', payload: member.id })
                                        setEditingId(null)
                                        setShowForm(false)
                                    }}
                                    className="bg-red-600 text-white px-2 py-[1px] rounded"
                                >
                                    delete
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
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">member's address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newMember.address}
                                    onChange={handleChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">Member's contact</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={newMember.contact}
                                    onChange={handleChange}
                                    className="border p-2 rounded w-full"
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
                            <div>
                                <label className="block mb-1 font-bold">hub:</label>
                                <select name="hub" id="hub" value={newMember.hub} onChange={handleChange}>
                                    <option value="select_hub">select hub</option>
                                    <option value="Excellence">Excellence</option>
                                    <option value="Reformers">Refomers</option>
                                    <option value="Joy">Joy</option>
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

export default MemberShipData;
