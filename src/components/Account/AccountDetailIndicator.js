import React from 'react';
// Colors
import {
	STATUS_COLOR_MODIFIED
} from '../../globals/colors';

export default function AccountDetailIndicator({ title="", value, max }) {

	if (max === -1) max = value;

	return (
		<div style={{flex:"4 1",display:"flex",flexDirection:"column",justifyContent:"space-between",alignContent:"stretch",alignItems:"stretch",padding:0,margin:0}}>
			<span style={{height:"10px",backgroundColor:"#212121",borderRadius:"5px",overflow:"hidden",margin:10,padding:0}}>
				<span style={{width:`${(value/max)*100}%`,height:"10px",display:"block",backgroundColor:STATUS_COLOR_MODIFIED,borderRadius:"5px",margin:0,padding:0}}></span>
			</span>
			<span style={{margin:"0px 12px",alignSelf:"center"}}>{title}</span>
		</div>
	)
}