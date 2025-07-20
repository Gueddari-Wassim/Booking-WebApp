import Perks from "../PerksLabels";
import { useEffect, useState } from "react";
import axios from 'axios';
import AccountNavigation from "../AccountNavigation";
import { Navigate, useParams } from "react-router-dom";


export default function PlacesFormPage(){
        const{id}=useParams();
        console.log(id)
        const [title,setTitle]=useState('');
        const [address,setAddress]=useState('');
        const [addedPhotos,setAddedPhotos]=useState([]);
        const [photoLink,setPhotoLink]=useState('');
        const [description,setDescription]=useState('');
        const [perks,setPerks]=useState([]);
        const [extraInfo,setExtraInfo]=useState('');
        const [checkIn,setCheckIn]=useState('');
        const [checkOut,setCheckOut]=useState('');
        const [maxGuests,setMaxGuests]=useState(1);
        const [redirect,setRedirect]=useState(false);
        const [price,setPrice]=useState(100);
       useEffect(() => {
        if (!id) {
        return;
    }
        axios.get('/places/' + id).then(response => {
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
    });
}, [id]);

    
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>

        )
    }


    function preInput(header,description){
        return(
            <>
            {inputHeader(header)}
            {inputDescription(description)}
            </>
        )
    }


    async function addPhotoByLink(ev){
        ev.preventDefault();
        const{data:filename}=await axios.post('/upload-by-link',{link:photoLink});
        setAddedPhotos(prev=>{
            return[...prev,filename];
        });
        setPhotoLink('');
    }

    function uploadPhoto(ev){
        const files=ev.target.files;
        const data=new FormData();
        for(let i=0;i<files.length;i++){
            data.append('photos',files[i]);
        }
        data.append('photos',files);
        axios.post('/upload',data,{
            headers:{"Content-Type":'multipart/form-data'}
        }).then(response=>{
            const{data:filenames}=response;
             setAddedPhotos(prev=>{
            return[...prev,...filenames];
        });
      })
    }


    async function savePlace(ev){
        ev.preventDefault();
        const placeData={ title,address,addedPhotos,description,
            perks,extraInfo,checkIn,checkOut,maxGuests,price
        };
        
        if(id){
            //update
            await axios.put('/places',{
            id,...placeData 
        });
        setRedirect(true);

        }else{
            //new place
            await axios.post('/places',placeData);
        setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/account/places'}/>
    }


    function removePhoto(ev,filename){
        ev.preventDefault();
        setAddedPhotos([...addedPhotos.filter(photo => photo!==filename)]);
    }

    function selectAsMainPhoto(ev,filename){
        ev.preventDefault();

        setAddedPhotos([filename,...addedPhotos.filter(photo => photo!==filename)]);
    }

    return (
      <div>
        <AccountNavigation/>
                <form onSubmit={savePlace}>
                    {preInput('Title','Title for your place,should be short and catchy as in advertisement')}
                    <input type="text" value={title} onChange={ev=>setTitle(ev.target.value)} name="" id="" placeholder="Title" />
                    {preInput('Address','Address to this place')}
                    <input type="text" value={address} onChange={ev=>setAddress(ev.target.value)} placeholder="Address"/>
                    {preInput('Photos','More = Better')}
                    <div className="flex gap-2">
                        <input value={photoLink}
                                onChange={ev=>setPhotoLink(ev.target.value)}
                                type="text"
                                placeholder={'Add using a link...jpg'}/>

                        <button name="photobtn"onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                    </div>
                    <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {addedPhotos.length >0 && addedPhotos.map(link=>(
                            <div className="h-32 flex relative" key={link}>
                                <img className='rounded-2xl w-full object-cover'src={'http://localhost:4000/uploads/'+link} alt=""/>
                                <button onClick={ev=>removePhoto(ev,link)} name="trashbtn" className="cursor-pointer absolute bottom-1 right-1 text-white bg-black/50 rounded-xl py-2 px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>

                                <button onClick={ev=>selectAsMainPhoto(ev,link)} name="starIcon" className="cursor-pointer absolute bottom-1 left-1 text-white bg-black/50 rounded-xl py-2 px-3">
                                    {link ===addedPhotos[0]&&(
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {link!== addedPhotos[0]&&(
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                        <label className="h-32 cursor-pointer flex items-center gap-2 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                            </svg>
                            Upload
                        </label>
                    </div>
                    {preInput('Description','description of the place')}
                 <textarea value={description} onChange={ev=>setDescription(ev.target.value)} />
                 {preInput('Perks','Select all the perks of your place')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks}/>
                </div>
                {preInput('Extra Info','House Rules,etc')}
                <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)}/>
                {preInput('Check in&out Times','Add check in and check out times,remember to have some time window cleaning the room between guests')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type="text" value={checkIn} 
                        onChange={ev=>setCheckIn(ev.target.value)} 
                        placeholder="14"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input type="text" value={checkOut} 
                        onChange={ev=>setCheckOut(ev.target.value)}
                        placeholder="16"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max Number of guests</h3>
                        <input type="number" value={maxGuests} 
                        onChange={ev=>setMaxGuests(ev.target.value)}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price} 
                        onChange={ev=>setPrice(ev.target.value)}/>
                    </div>
                </div>
                <div className="text-center">
                    <button name="savebtn" className="bg-[#F5385D] w-100 rounded-full pt-2 pb-2 mt-4 text-white">Save</button>
                </div>
                </form>
             </div>
    );
}