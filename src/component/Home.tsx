import img from '../../public/image_fx_ (1).jpg'


function Homepage() {
   
    return (
        <div className=' w-full h-full relative overflow-hidden'>
            {/* <video src={vid} loop autoPlay muted></video> */}
            <img src={img} alt="brand" />
            <div className=' flex justify-center items-center absolute  h-full w-full inset-0' style={{ backdropFilter: 'blur(20px)' }}>

                <div className=' border border-white shadow-xl rounded-md bg-white bg-opacity-50 h-1/2 w-1/2 flex flex-col justify-center items-center p-6 text-center'>
                    <h1 className=' font-bold text-lg mb-3'> welcome Admin</h1>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero maiores illo aliquid atque dignissimos
                        ullam saepe inventore exercitationem nobis aspernatur debitis deserunt voluptatem quaerat ratione vero nisi, sit accusantium ducimus.</p>
                    <button className=' bg-blue-600 text-white p-2 my-3 rounded-md'>get started</button>
                </div>
            </div>
        </div>
    )
}

export default Homepage