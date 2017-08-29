import React from 'react';
import {Bond} from 'oo7';
import {Rspan} from 'oo7-react';
import {InputBond, HashBond, BButton, TransactionProgressLabel, TransactButton} from 'parity-reactive-ui';
import {bonds, formatBlockNumber, formatBalance, isNullData} from 'oo7-parity'; 

export class App extends React.Component {
	constructor() {
		super();
		this.bond = new Bond();
		this.name = new Bond;
		this.recipient = bonds.registry.lookupAddress(this.name, 'A');
	}
	
	render() {
		return (<div>
			{/*<InputBond bond={this.bond} placeholder="Go ahead and type some text"/>
			<Rspan>{this.bond}</Rspan>
			<br/><br/>*/}
			Default account:&nbsp;
				<Rspan>{bonds.me}</Rspan>
			<br/><br/>
			My balance: <Rspan>
			{bonds.balance(bonds.me).map(formatBalance)}
			</Rspan>
			<br/><br/>
			Current block is:&nbsp;
				<Rspan style={{fontWeight: 'bold'}}>
					{bonds.height.map(formatBlockNumber)}
				</Rspan>

			<div>
				Current block author's balance is:&nbsp;
				<Rspan style={{fontWeight: 'bold'}}>
					{bonds.balance(bonds.head.author).map(formatBalance)}
				</Rspan>
			</div>

			Address of <InputBond bond={this.bond} placeholder='Lookup a name' /> is:<br/>
				<Rspan>{bonds.registry.lookupAddress(this.bond, 'A')}</Rspan>
				, it's balance is <Rspan>
					{bonds.balance(bonds.registry.lookupAddress(this.bond, 'A')).map(formatBalance)}
				</Rspan>
				<br/><br/>
				<div>
		  <InputBond bond={this.name} placeholder='Name of recipient' />
			<TransactButton
				content={this.name.map(n => `Give ${n} 1 Finney`)}
					disabled={this.recipient.map(isNullData)}
					tx={{
						to: this.recipient,
						value: 1 * 1e15
					}}
			/>
			</div>

		</div>);
	}
}
