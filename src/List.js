import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import { useState, useEffect } from 'react';
import Model from './Model';
import axios from 'axios';
import {
	Button,
	UncontrolledTooltip,
	Row,
	Col,
	Container,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	FormGroup,
} from 'reactstrap';

const List = () => {
	const [loading, setisLoading] = useState(true);
	const [product, setProducts] = useState(null);
	const [formvalue, setFormvalues] = useState();

	const [modal, setModal] = useState(false);

	const toggle = () => setModal(!modal);
	const setValue = (props) => setFormvalues(props);
	React.useEffect(() => {
		axios.get('https://dummyjson.com/products').then((response) => {
			setProducts(response.data.products);
			setisLoading(false);
		});
	}, []);

	const Onview = (props) => {
		console.log(props.row);
		setValue(props.row);
		toggle();
	};
	const onEdit = (props) => {
		console.log(props.row);
		setValue(props.row);
		toggle();
	};
	const onDelete = (props) => {
		console.log(props.row);
		setValue(props.row);
		toggle();
	};

	const columns = React.useMemo(
		() => [
			{ Header: 'Id', accessor: 'id' },
			{ Header: 'Title', accessor: 'title' },
			{ Header: 'Price', accessor: 'price' },
			{ Header: 'Brand', accessor: 'brand' },

			{
				Header: 'View',
				Cell: (props) => (
					<button
						className="mdi mdi-pencil font-size-18 mr-3"
						onClick={() => Onview(props)}
					>
						View
					</button>
				),
			},
			{
				Header: 'Edit',
				Cell: (props) => (
					<button className="btn1" onClick={() => onEdit(props)}>
						Edit
					</button>
				),
			},
			{
				Header: 'Delete',
				Cell: (props) => (
					<button className="btn1" onClick={() => onDelete(props)}>
						Delete
					</button>
				),
			},
		],
		[]
	);

	return (
		<React.Fragment>
			{!loading ? (
				<ReactTable
					data={product}
					columns={columns}
					defaultPageSize={10}
					pageSizeOptions={[10, 20, 30]}
				/>
			) : (
				<></>
			)}
			{modal ? (
				<div>
					<Modal isOpen={true} toggle={toggle} external={toggle}>
						<ModalHeader className={'titleContainer'}>Product Details</ModalHeader>
						<ModalBody>
							<div>
								<Row>
									<Col>
										<FormGroup row>
											<Col>
												<div className={'inputContainer'}>
													<input value={formvalue.title} className={'inputBox'} />
												</div>
												<br />
												<div className={'inputContainer'}>
													<input value={formvalue.price} className={'inputBox'} />
												</div>
												<div className={'inputContainer'}>
													<input value={formvalue.title} className={'inputBox'} />
												</div>
												<div className={'inputContainer'}>
													<input value={formvalue.brand} className={'inputBox'} />
												</div>
											</Col>
										</FormGroup>
									</Col>
								</Row>
							</div>
						</ModalBody>
						<ModalFooter>
							<div>
								<Button
									style={{
										padding: '12px 24px',
										margin: '8px',
										'font-size': '12px',
										'border-radius': '8px',
									}}
									type="button"
									onClick={toggle}
								>
									Next
								</Button>
							</div>
							<div>
								<Button
									style={{
										padding: '12px 24px',
										margin: '8px',
										'font-size': '12px',
										'border-radius': '8px',
									}}
									type="button"
									onClick={toggle}
								>
									Cancel
								</Button>{' '}
							</div>
						</ModalFooter>
					</Modal>
				</div>
			) : (
				<></>
			)}
		</React.Fragment>
	);
};
export default List;
