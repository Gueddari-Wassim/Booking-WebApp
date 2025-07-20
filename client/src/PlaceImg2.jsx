import React from 'react'

export default function PlaceImg2({place,index=0,className=null}) {

    if(!place.photos?.length){
        return '';
    }

    if(!className){
        className='object-cover rounded-xl mx-3 my-4';
    }

  return (
    <img className={className} src={'http://localhost:4000/uploads/'+place.photos[index]} alt=""/>
  );
}
