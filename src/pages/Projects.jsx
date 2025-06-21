import React, { useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCurrentScreen } from "../store/uiSlice";

const projects = [
	{
		title: "Modern SaaS Dashboard",
		desc: "Complete redesign of enterprise dashboard with modern UI patterns",
		company: "TechCorp Inc.",
		date: "Dec 5, 2024",
		status: "Published",
	},
	{
		title: "E-commerce Mobile App",
		desc: "Native mobile app for seamless shopping experience",
		company: "ShopEasy",
		date: "Apr 28, 2024",
		status: "Published",
	},
];

export default function Projects() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setCurrentScreen("projects"));
	}, [dispatch]);

	return (
		<div className="p-12">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold">Projects</h1>
					<p className="text-gray-500 text-sm">
						Manage your portfolio projects
					</p>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="text"
						placeholder="Search projects..."
						className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
						<FaFilter className="text-gray-600" />
					</button>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full text-sm text-left">
					<thead className="bg-gray-50 text-gray-700 font-semibold">
						<tr>
							<th className="px-6 py-4">Title</th>
							<th className="px-6 py-4">Description</th>
							<th className="px-6 py-4">Company</th>
							<th className="px-6 py-4">Date</th>
							<th className="px-6 py-4">Status</th>
							<th className="px-6 py-4 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project, index) => (
							<tr
								key={index}
								className="border-t border-gray-100 hover:bg-gray-50 transition"
							>
								<td className="px-6 py-4 font-medium text-gray-900">
									{project.title}
								</td>
								<td className="px-6 py-4 text-gray-600">
									{project.desc}
								</td>
								<td className="px-6 py-4 text-gray-600">
									{project.company}
								</td>
								<td className="px-6 py-4 text-gray-600">
									{project.date}
								</td>
								<td className="px-6 py-4">
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											project.status === "Published"
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										{project.status}
									</span>
								</td>
								<td className="px-6 py-4 text-right text-sm text-blue-600 font-medium cursor-pointer">
									Edit
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
