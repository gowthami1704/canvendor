import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { connect } from 'react-redux';
import Model from './Model';
/* import * as actions from '../../store/actions'; */
/* import Lead from '../../components/Master/Lead/Modal'; */
/* import { DeleteModal } from '../../components/Common/DeleteModal'; */
import ReactTable from './ReactTable';
import { Button, UncontrolledTooltip, Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

const Productlist = (props) => {
	const [modal, setModal] = useState(false);
	const [LeadID, setLeadID] = useState(0);
	const [isDelete, setisDelete] = useState(false);
	const [deletedItemName, setdeletedItemName] = useState();
	const [buttonAction, setbuttonAction] = useState();
	const [product, setProducts] = useState([
		{
			id: 1,
			title: 'iPhone 9',
			description: 'An apple mobile which is nothing like apple',
			price: 549,
			discountPercentage: 12.96,
			rating: 4.69,
			stock: 94,
			brand: 'Apple',
			category: 'smartphones',
			thumbnail: '...',
		},
		{
			id: 1,
			title: 'iPhone 9',
			description: 'An apple mobile which is nothing like apple',
			price: 549,
			discountPercentage: 12.96,
			rating: 4.69,
			stock: 94,
			brand: 'Apple',
			category: 'smartphones',
			thumbnail: '...',
		},
	]);

	console.log(product);
	/* useEffect(() => {
		fetch('https://dummyjson.com/products')
			.then((res) => res.json())
			.then((res) => console.log(res.products));
		//.then((res) => setProducts[res.products]);
	}, []); */

	const togglemodal = () => {
		setModal(!modal);
	};
	const viewLead = (leadID) => {
		setbuttonAction('VIEW');
		props.onViewLead(leadID);
		togglemodal();
	};
	const addLead = () => {
		setLeadID(0);
		setbuttonAction('ADD');
		togglemodal();
	};
	const editLead = (leadID) => {
		setLeadID(leadID);
		props.onEditLead(leadID);
		setbuttonAction('EDIT');
		togglemodal();
	};
	const deleteLead = (leadID, leadName) => {
		setLeadID(leadID);
		setisDelete(!isDelete);
		setdeletedItemName(leadName);
	};

	const submitHandler = (data) => {
		console.log('Data from Form' + JSON.stringify(data));
		const customerName = data.customername.label;
		const customerID = data.customername.value;

		delete data.customername;
		const postJsonData = {
			...data,
			customerName: customerName,
			CustomerID: customerID,
		};

		if (LeadID > 0) {
			props.onUpdateLead({
				...postJsonData,
				leadID: LeadID,
			});
			togglemodal();
		} else {
			props.onAddLead({
				...postJsonData,
				leadID: null,
			});
			togglemodal();
		}
	};

	toastr.options = {
		closeButton: true,
		debug: false,
		newestOnTop: true,
		progressBar: true,
		positionClass: 'toast-top-right',
		preventDuplicates: true,
		onclick: null,
		showDuration: 300,
		hideDuration: 1000,
		timeOut: 5000,
		extendedTimeOut: 1000,
		showEasing: 'swing',
		hideEasing: 'linear',
		showMethod: 'fadeIn',
		hideMethod: 'fadeOut',
	};
	if (props.toastType === 'info') {
		toastr.info(props.toastmessage, 'LEAD');
		setTimeout(() => props.onClearTostar(), 5001);
	} else if (props.toastType === 'warning') {
		toastr.warning(props.toastmessage, 'LEAD');
		setTimeout(() => props.onClearTostar(), 5001);
	} else if (props.toastType === 'error') {
		toastr.error(props.toastmessage, 'LEAD');
		setTimeout(() => props.onClearTostar(), 5001);
	} else if (props.toastType === 'success') {
		toastr.success(props.toastmessage, 'LEAD');
		setTimeout(() => props.onClearTostar(), 5001);
	} else toastr.clear();

	const csvHeaders = [
		{ label: 'Customer Name', key: 'customerName' },
		{ label: 'LeadName', key: 'leadName' },
		{ label: 'Designation', key: 'designation' },
		{ label: 'ContactNo', key: 'contactNo' },
		{ label: 'EmailID', key: 'emailID' },
	];

	const columns = React.useMemo(
		() => [
			{ Header: 'Id', accessor: 'id' },
			{ Header: 'Title', accessor: 'title' },
			{ Header: 'Price', accessor: 'price' },
			{ Header: 'Brand', accessor: 'brand' },
			{
				Header: 'View Details',
				Cell: ({ cell }) => {
					return (
						<Button
							type="button"
							color="primary"
							className="btn-sm btn-rounded"
							//onClick={() => viewLead(cell.row.values.leadID)}
						>
							View Details
						</Button>
					);
				},
			},

			{
				Header: 'Actions',
				Cell: ({ cell }) => {
					return (
						<React.Fragment>
							<Link to="#" className="mr-3 text-primary">
								<i
									className="mdi mdi-pencil font-size-18 mr-3"
									id="edittooltip"
									//onClick={() => editLead(cell.row.values.leadID)}
								></i>
								<UncontrolledTooltip placement="top" target="edittooltip">
									Edit
								</UncontrolledTooltip>
							</Link>
							<Link to="#" className="text-danger">
								<i
									className="mdi mdi-close font-size-18 mr-3"
									id="deletetooltip"
									/* onClick={() =>
										deleteLead(cell.row.values.leadID, cell.row.values.leadName)
									} */
								></i>
								<UncontrolledTooltip placement="top" target="deletetooltip">
									Delete
								</UncontrolledTooltip>
							</Link>
						</React.Fragment>
					);
				},
			},
		],
		[]
	);

	return (
		<React.Fragment>
			<div className="page-content">
				<Container fluid>
					{/* <Breadcrumbs title="Leads" breadcrumbItem="Master" /> */}
					<Row>
						<Col>
							<ReactTable
								columns={columns}
								data={product}
								addClick={addLead}
								pagetitle="Lead"
								pagebreadCrum="Master"
								isloading="false"
								hiddenColumns={['leadID']}
								csvHeader={csvHeaders}
								csvData={props.leads}
							></ReactTable>
						</Col>
					</Row>
				</Container>
				{modal ? (
					<Model
						isOpen={modal}
						inputValues={buttonAction === 'ADD' ? '' : props.lead}
						customers={props.customers}
						togglemodal={togglemodal}
						submit={submitHandler}
						buttonAction={buttonAction}
					/>
				) : null}{' '}
				}
			</div>

			{/* <DeleteModal
				isDelete={isDelete}
				setisDelete={setisDelete}
				itemName={deletedItemName}
				onDelete={() =>
					props.onDeleteLead({
						leadID: LeadID,
					})
				}
			></DeleteModal> */}
		</React.Fragment>
	);
};
const mapStateToProps = (state) => ({
	leads: state.leadReducer.leads,
	lead: state.leadReducer.lead,
	customers: state.enquiryReducer.customers,
	isloading: state.leadReducer.isloading,
	toastmessage: state.leadReducer.message,
	toastType: state.leadReducer.toastType,
	error: state.leadReducer.error,
});

const mapDispatchToProps = (dispatch) => ({
	/* onGetAllLead: () => dispatch(actions.loadAllLead()),
	onGetAllCustomerDropDown: () => dispatch(actions.loadCustomerDropDown()),
	onViewLead: (leadID) => dispatch(actions.loadLead(leadID)),
	onEditLead: (leadID) => dispatch(actions.loadLead(leadID)),
	onAddLead: (data) => dispatch(actions.addLead(data)),
	onUpdateLead: (data) => dispatch(actions.updateLead(data)),
	onDeleteLead: (data) => dispatch(actions.deleteLead(data)),
	onClearTostar: (data) => dispatch(actions.clearLeadToast(data)), */
});

export default Productlist;
