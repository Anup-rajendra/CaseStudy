import React from "react";
const Address=(addressArray)=>{
    console.log(addressArray)
return(<div>
    <div>{addressArray.addressArray.map((addr, index) => (
        <div key={index}>
          {addr.Address}
        </div>
      ))}
      </div>
</div>);
}
export default Address;