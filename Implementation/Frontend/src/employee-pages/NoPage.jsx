import React, { useEffect, useState } from 'react';
import RingLoader from "react-spinners/RingLoader";

function NoPage() {
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoading(prevLoading => !prevLoading);
        }, 99999);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);
    return (
        <div className='No'>
            {
                loading ?
                    <RingLoader color={'#D0031B'} loading={loading} size={200} />
                    :
                    <p>Wait</p>
            }
            {/* <br /> */}
            <div>
                <p>Sorry!!, Something Came Up And We are Trying To Fix It... </p>
            </div>
        </div>
    );
}

export default NoPage;
