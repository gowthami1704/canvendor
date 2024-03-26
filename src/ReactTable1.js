import React, { useState } from 'react';
import {
	useTable,
	useFilters,
	useGlobalFilter,
	useAsyncDebounce,
	usePagination,
	useRowSelect,
} from 'react-table';
import {
	Button,
	Row,
	Col,
	Badge,
	Input,
	Label,
	Table,
	UncontrolledTooltip,
	Card,
	Container,
	CardBody,
} from 'reactstrap';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

const IndeterminateCheckbox = React.forwardRef(
	({ indeterminate, ...rest }, ref) => {
		const defaultRef = React.useRef();
		const resolvedRef = ref || defaultRef;

		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate;
		}, [resolvedRef, indeterminate]);

		return (
			<>
				<input type="checkbox" ref={resolvedRef} {...rest} />
			</>
		);
	}
);
// Define a default UI for filtering
function GlobalFilter({
	preGlobalFilteredRows,
	globalFilter,
	setGlobalFilter,
}) {
	const count = preGlobalFilteredRows.length;
	const [value, setValue] = React.useState(globalFilter);
	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value || undefined);
	}, 200);

	return (
		<span>
			<i className="bx bx-search-alt search-icon"></i>
			<input
				className="form-control"
				value={value || ''}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder={`Search From ${count} records...`}
			/>
		</span>
	);
}

function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
}) {
	const count = preFilteredRows.length;

	return (
		<input
			className="form-control"
			value={filterValue || ''}
			onChange={(e) => {
				setFilter(e.target.value || undefined);
			}}
			placeholder={`Search ${count} records...`}
		/>
	);
}

function ReactTable({
	columns,
	data,
	pagetitle,
	pagebreadCrum,
	isloading,
	csvHeader,
	csvData,
	addClick,
	onFYClick,
	onArchiveClick,
	hiddenColumns,
}) {
	// Use the state and functions returned from useTable to build your UI
	const defaultColumn = React.useMemo(
		() => ({
			// Default Filter UI
			Filter: DefaultColumnFilter,
		}),
		[]
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		preGlobalFilteredRows,
		setGlobalFilter,
		selectedFlatRows,
		state: { pageIndex, pageSize, globalFilter, selectedRowIds },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState: {
				pageIndex: 0,
				pageSize: 10,
				hiddenColumns: hiddenColumns,
			},
		},
		useFilters,
		useGlobalFilter,
		usePagination,
		useRowSelect,
		(hooks) => {
			hooks.visibleColumns.push((columns) => [
				// Let's make a column for selection
				{
					id: 'selection',
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox
					Header: ({ getToggleAllRowsSelectedProps }) => (
						<div>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</div>
					),
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
					Cell: ({ row }) => (
						<div>
							<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
						</div>
					),
				},
				...columns,
			]);
		}
	);

	// Render the UI for your table
	return (
		<div>
			<Card>
				<CardBody>
					<Row className="mb-2">
						<Col sm="5">
							<div className="search-box mr-2 mb-2 d-inline-block">
								<div className="position-relative">
									<GlobalFilter
										preGlobalFilteredRows={preGlobalFilteredRows}
										globalFilter={globalFilter}
										setGlobalFilter={setGlobalFilter}
									/>
								</div>
							</div>
						</Col>
						{/* <Col sm="2">
							{isloading ? (
								<Loader type="Oval" color="#2BAD60" height="30" width="30" />
							) : null}
						</Col> */}

						<Col sm="5">
							<div className="text-sm-right">
								{(pagetitle !== 'Projects') &
								(pagetitle !== 'Service Enquiry Report') &
								(pagetitle !== 'Sales Enquiry Report') ? (
									<Button
										type="button"
										color="success"
										className="btn-rounded waves-effect waves-light mb-2 mr-2"
										onClick={addClick}
									>
										<i className="mdi mdi-plus mr-1"></i> Add New
									</Button>
								) : null}
								<Button
									type="button"
									color="warning"
									className="btn-rounded waves-effect waves-light mb-2 mr-2"
								>
									<CSVLink
										style={{ color: 'white' }}
										data={csvData}
										headers={csvHeader}
										filename={pagetitle + '.csv'}
										target="_blank"
									>
										Export CSV
									</CSVLink>
								</Button>
							</div>
						</Col>
					</Row>
					<div className="table-responsive">
						<table
							className="table table-centered table-nowrap"
							// apply the table props
							{...getTableProps()}
						>
							<thead className="thead-light">
								{headerGroups.map((headerGroup) => (
									// Loop over the header rows
									<tr {...headerGroup.getHeaderGroupProps()}>
										{
											// Loop over the headers in each row
											headerGroup.headers.map((column) => (
												// Apply the header cell props
												<th {...column.getHeaderProps()}>
													{
														// Render the header
														column.render('Header')
													}
												</th>
											))
										}
									</tr>
								))}
							</thead>
							{/* Apply the table body props */}
							<tbody {...getTableBodyProps()}>
								{
									// Loop over the table rows
									page.map((row, i) => {
										// Prepare the row for display
										prepareRow(row);
										return (
											// Apply the row props
											<tr {...row.getRowProps()}>
												{
													// Loop over the page cells
													row.cells.map((cell) => {
														// Apply the cell props
														return (
															<td {...cell.getCellProps()}>
																{
																	// Render the cell contents
																	cell.render('Cell')
																}
															</td>
														);
													})
												}
											</tr>
										);
									})
								}
							</tbody>
						</table>
					</div>
				</CardBody>
				<div
					className="pagination"
					style={{
						display: 'flex',
					}}
				>
					<div
						style={{
							display: 'flex',
							flex: 1,
							justifyContent: 'flex-start',
						}}
					>
						<span>
							Page{' '}
							<strong>
								{pageIndex + 1} of {pageOptions.length}
							</strong>{' '}
						</span>
						<select
							className="form-control"
							value={pageSize}
							onChange={(e) => {
								setPageSize(Number(e.target.value));
							}}
							style={{
								width: '100px',
								height: '38px',
								marginLeft: '10px',
								marginTop: '-10px',
								border: '0px',
							}}
						>
							{[5, 10, 20, 30, 40, 50].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</select>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
						}}
					>
						<ul className="pagination">
							<li
								style={{
									color: '#292961',
									padding: 10,
									cursor: 'pointer',
								}}
								className="fa fa-angle-double-left"
								onClick={() => gotoPage(0)}
								disabled={!canPreviousPage}
							></li>
							<li
								style={{
									color: '#292961',
									padding: 10,
									cursor: 'pointer',
								}}
								className="fa fa-angle-left"
								onClick={() => previousPage()}
								disabled={!canPreviousPage}
							></li>
							{createPageIndex(pageIndex)}
							<li
								style={{
									color: '#292961',
									padding: 10,
									cursor: 'pointer',
								}}
								className="fa fa-angle-right"
								onClick={() => nextPage()}
								disabled={!canNextPage}
							></li>
							<li
								style={{
									color: '#292961',
									padding: 10,
									cursor: 'pointer',
								}}
								className="fa fa-angle-double-right"
								onClick={() => gotoPage(pageCount - 1)}
								disabled={!canNextPage}
							></li>
						</ul>
					</div>
				</div>
			</Card>
			{/* (
				<Row>
					<Col xs="12">
						<Card>
							<CardBody
								style={{
									display: 'grid',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Row>
									<Label style={{ color: 'Red' }}>{' No Records Found'}</Label>
								</Row>
								<br></br>
								<Row>
									<Button type="button" size="lg" color="success" onClick={addClick}>
										<i className="mdi mdi-account-plus"></i> Add New
									</Button>
								</Row>
							</CardBody>
						</Card>
					</Col>
				</Row>
				) */}
		</div>
	);

	function createPageIndex(pageIndex) {
		let startPage, endPage;

		if (pageCount <= 10) {
			// less than 10 total pages so show all

			startPage = 0;

			endPage = pageCount;
		} else {
			// more than 10 total pages so calculate start and end pages
			if (pageIndex <= 6) {
				startPage = 0;

				endPage = 10;
				//alert('1startPage' + startPage + 'endPage' + endPage);
			} else if (pageIndex + 4 >= pageCount) {
				startPage = pageCount - 9;

				endPage = pageCount;
				//alert('2startPage' + startPage + 'endPage' + endPage);
			} else {
				startPage = pageIndex - 5;

				endPage = pageIndex + 4;
				//alert('3startPage' + startPage + 'endPage' + endPage);
			}
		}

		let pageIndexs = [];
		for (let i = startPage; i < endPage; i++) {
			pageIndexs.push(
				<div
					key={i}
					style={{
						display: 'flex',
						color: pageIndex === i ? 'orange' : '#292961',
						padding: 10,
						cursor: 'pointer',
						backgroundColor: pageIndex === i ? '#556EE6' : '#556EE633',
						borderRadius: 20,
						width: 30,
						margin: 5,
						height: 30,
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onClick={() => {
						gotoPage(i);
					}}
				>
					<span>{i + 1}</span>
				</div>
			);
		}
		return pageIndexs;
	}
}

export default ReactTable;
