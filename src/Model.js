import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FormGroup, Label, Input, Row, Col } from 'reactstrap';

function Model(props) {
	const [modal, setModal] = useState(false);

	const toggle = () => setModal(!modal);

	const externalCloseBtn = (
		<button
			type="button"
			className="close"
			style={{ position: 'absolute', top: '15px', right: '15px' }}
			onClick={toggle}
		>
			&times;
		</button>
	);
	return (
		<div>
			<Modal isOpen={modal} toggle={toggle} external={externalCloseBtn}>
				<ModalHeader className={'titleContainer'}>Product Details</ModalHeader>

				{/* <ModalBody>
					{' '}
					<div>
						<Row>
							<Col>
								<FormGroup row>
									<Col>
										<div className={'inputContainer'}>
											<input value={props.title} className={'inputBox'} />
										</div>
										<br />
										<div className={'inputContainer'}>
											<input value={props.password} className={'inputBox'} />
										</div>
									</Col>
								</FormGroup>
							</Col>
						</Row>
					</div>
				</ModalBody> */}
				<ModalFooter>
					<Button color="primary" onClick={toggle}>
						Next
					</Button>{' '}
					<Button color="secondary" onClick={toggle}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default Model;
